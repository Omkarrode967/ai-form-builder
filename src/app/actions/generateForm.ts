"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saveForm } from "./mutateForm";
import { v4 as uuidv4 } from "uuid";
import { CohereClient } from "cohere-ai";

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "",
});

// Add debug logging
console.log("Environment variables check:");
console.log("COHERE_API_KEY exists:", !!process.env.COHERE_API_KEY);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Using API endpoint:", process.env.GOOGLE_API_ENDPOINT || "https://generativelanguage.googleapis.com/v1");

export async function generateForm(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  console.log("Starting form generation process...");
  
  // Debug environment variables
  console.log("Environment Variables Debug:");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("All env keys:", Object.keys(process.env));
  console.log("COHERE_API_KEY exists:", !!process.env.COHERE_API_KEY);
  
  const schema = z.object({
    description: z.string().min(1),
  });
  const parse = schema.safeParse({
    description: formData.get("description"),
  });

  if (!parse.success) {
    console.log("Schema validation failed:", parse.error);
    return {
      message: "Failed to parse data",
    };
  }

  const data = parse.data;
  console.log("Form description:", data.description);

  try {
    console.log("Checking environment variables...");
    console.log("COHERE_API_KEY exists:", !!process.env.COHERE_API_KEY);
    
    if (!process.env.COHERE_API_KEY) {
      throw new Error("Cohere API key is not set");
    }

    console.log("Generating form with AI...");
    const prompt = `Create a form based on this description: "${data.description}"
    
    Generate a JSON object with these fields:
    1. name: A short, descriptive name for the form
    2. description: A brief description of the form's purpose
    3. questions: An array of questions, where each question has:
       - text: The question text
       - fieldType: One of: RadioGroup, Select, Input, Textarea, Switch
       - fieldOptions: For RadioGroup and Select types, an array of {text, value} pairs. For other types, an empty array.
    
    Important: Return ONLY the JSON object, without any additional text or markdown formatting.
    
    Example format:
    {
      "name": "Customer Feedback",
      "description": "Collect feedback about our service",
      "questions": [
        {
          "text": "How satisfied are you with our service?",
          "fieldType": "RadioGroup",
          "fieldOptions": [
            {"text": "Very Satisfied", "value": "very_satisfied"},
            {"text": "Satisfied", "value": "satisfied"},
            {"text": "Neutral", "value": "neutral"},
            {"text": "Dissatisfied", "value": "dissatisfied"}
          ]
        },
        {
          "text": "Any additional comments?",
          "fieldType": "Textarea",
          "fieldOptions": []
        }
      ]
    }`;
    
    console.log("Sending request to Cohere...");
    try {
      console.log("Initializing Cohere request...");
      
      // Generate content using Cohere
      const response = await cohere.chat({
        model: 'command-xlarge-nightly',
        message: prompt,
        temperature: 0.7,
        k: 0,
        p: 0.9
      });
      
      const text = response.text;
      console.log("Raw response:", text);
      
      // Estimate token usage (rough estimate: 1 token ≈ 4 characters)
      const estimatedPromptTokens = Math.ceil(prompt.length / 4);
      const estimatedResponseTokens = Math.ceil(text.length / 4);
      const estimatedTotalTokens = estimatedPromptTokens + estimatedResponseTokens;
      
      console.log("Estimated Token Usage:", {
        promptTokens: estimatedPromptTokens,
        responseTokens: estimatedResponseTokens,
        totalTokens: estimatedTotalTokens,
        remainingTokens: 5000 - estimatedTotalTokens // Approximate remaining tokens
      });

      // Process the response
      return processResponse(text, data.description);
    } catch (error: unknown) {
      console.error("Error generating form:", error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error("Invalid API key. Please check your Cohere API key");
        }
        if (error.message.includes('quota')) {
          throw new Error("API quota exceeded. Please try again later.");
        }
      }
      
      throw error;
    }
  } catch (err) {
    console.error("Error generating form:", err);
    return {
      message: "Failed to create form",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// Helper function to process the response
async function processResponse(text: string, description: string) {
  try {
    // Clean up the response text to ensure it's valid JSON
    let jsonString = text.trim();
    
    // Remove any markdown code block indicators
    jsonString = jsonString.replace(/```json\n?|\n?```/g, '');
    
    // Remove any leading/trailing text that's not part of the JSON
    const jsonStart = jsonString.indexOf('{');
    const jsonEnd = jsonString.lastIndexOf('}') + 1;
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      jsonString = jsonString.substring(jsonStart, jsonEnd);
    }
    
    if (jsonString.startsWith('{') && jsonString.endsWith('}')) {
      // Try to parse the JSON
      const responseObject = JSON.parse(jsonString);
      console.log("Parsed response object:", responseObject);

      // Validate the response object
      if (!responseObject.name || !responseObject.description || !Array.isArray(responseObject.questions)) {
        throw new Error("Invalid response format from AI");
      }

      // Validate field types
      const validFieldTypes = ["RadioGroup", "Select", "Input", "Textarea", "Switch"];
      for (const question of responseObject.questions) {
        if (!validFieldTypes.includes(question.fieldType)) {
          question.fieldType = "Input"; // Default to Input if invalid type
        }
      }

      console.log("Saving form to database...");
      const dbFormId = await saveForm({
        user_prompt: description,
        name: responseObject.name,
        description: responseObject.description,
        questions: responseObject.questions,
      });

      console.log("Form saved with ID:", dbFormId);

      revalidatePath("/");
      return {
        message: "success",
        data: { formId: dbFormId },
      };
    } else {
      throw new Error("Response is not in JSON format");
    }
  } catch (jsonError) {
    console.error("Error parsing AI response:", jsonError);
    throw new Error("Failed to parse AI response as JSON");
  }
}

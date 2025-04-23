"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saveForm } from "./mutateForm";
import { v4 as uuidv4 } from "uuid";
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function generateForm(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const schema = z.object({
    description: z.string().min(1),
  });
  const parse = schema.safeParse({
    description: formData.get("description"),
  });

  if (!parse.success) {
    console.log(parse.error);
    return {
      message: "Failed to parse data",
    };
  }

  const data = parse.data;
  console.log("Form description:", data.description);

  try {
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error("Hugging Face API key is not set");
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
    
    console.log("Sending request to Hugging Face...");
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false
      }
    }).catch(error => {
      if (error.message.includes("Pro subscription")) {
        throw new Error("This model requires a Hugging Face Pro subscription. Please upgrade your account at hf.co/pricing");
      }
      throw error;
    });

    console.log("Received response from Hugging Face");
    const text = response.generated_text;
    console.log("Raw response:", text);

    // Try to extract JSON from the response
    let jsonString = text;
    try {
      // First try to extract JSON from code blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1];
      } else {
        // If no code blocks, try to find JSON between curly braces
        const jsonBetweenBraces = text.match(/\{[\s\S]*\}/);
        if (jsonBetweenBraces) {
          jsonString = jsonBetweenBraces[0];
        }
      }
      
      // Clean up the JSON string
      jsonString = jsonString.trim();
      // Remove any markdown formatting or explanatory text
      jsonString = jsonString.replace(/^.*?\{/, '{').replace(/\}.*?$/, '}');
      
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
          user_prompt: data.description,
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
  } catch (err) {
    console.error("Error generating form:", err);
    return {
      message: "Failed to create form",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

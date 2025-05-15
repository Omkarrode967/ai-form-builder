"use server";

import { db } from "@/db";
import { forms, questions as dbQuestions, fieldOptions } from "@/db/schema";
import { auth } from "@/auth";
import { InferInsertModel, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { getCurrentForm } from "./getUserForms";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

type Form = InferInsertModel<typeof forms>;
type Question = InferInsertModel<typeof dbQuestions>;
type FieldOption = InferInsertModel<typeof fieldOptions>;

interface SaveFormData extends Form {
  questions: Array<Question & { fieldOptions?: FieldOption[] }>;
  user_prompt: string;
}

export async function saveForm(data: SaveFormData) {
  const { name, description, questions, user_prompt } = data;
  const session = await auth();
  const userId = session?.user?.id;

  const newForm = await db
    .insert(forms)
    .values({
      formID: uuidv4(),
      name,
      description,
      userId,
      user_prompt,
      published: false,
    })
    .returning({ insertedId: forms.id, newFormCreated: forms.formID });
  const formId = newForm[0].insertedId;
  // console.log("formId created", formId);
  // console.log("formId created", newForm[0].newFormCreated);

  const newQuestions = data.questions.map((question) => {
    return {
      text: question.text,
      fieldType: question.fieldType,
      fieldOptions: question.fieldOptions,
      formId,
    };
  });

  await db.transaction(async (tx) => {
    for (const question of newQuestions) {
      const [{ questionId }] = await tx
        .insert(dbQuestions)
        .values(question)
        .returning({ questionId: dbQuestions.id });
      if (question.fieldOptions && question.fieldOptions.length > 0) {
        await tx.insert(fieldOptions).values(
          question.fieldOptions.map((option) => ({
            text: option.text,
            value: option.value,
            questionId,
          }))
        );
      }
    }
  });

  return newForm[0].newFormCreated;
}

export async function publishForm(formId: string) {
  await db
    .update(forms)
    .set({ published: true })
    .where(eq(forms.formID, formId));
}

export async function deleteForm(formId: string) {
  await db.delete(forms).where(eq(forms.formID, formId));
}

export async function addMoreQuestion(
  prompt: string,
  id: number,
  formID: string,
  allQuestions: string
) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not set");
    }

    console.log("Adding more questions with prompt:", prompt);
    console.log("Current form ID:", id);
    console.log("Current form UUID:", formID);
    console.log("Existing questions:", allQuestions);

    console.log("Sending request to Gemini...");
    try {
      console.log("Initializing Gemini request...");
      
      // Get the generative model with proper configuration
      const model = genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
        },
      });

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Raw response:", text);

      // Try to extract JSON from the response
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
        const responseObject = JSON.parse(jsonString);
        console.log("Parsed response object:", responseObject);

        // Validate the response object
        if (!Array.isArray(responseObject.questions)) {
          throw new Error("Invalid response format from AI");
        }

        // Validate field types
        const validFieldTypes = ["RadioGroup", "Select", "Input", "Textarea", "Switch"];
        for (const question of responseObject.questions) {
          if (!validFieldTypes.includes(question.fieldType)) {
            question.fieldType = "Input"; // Default to Input if invalid type
          }
        }

        // Save the new questions to the database
        const newQuestions = responseObject.questions;
        for (const question of newQuestions) {
          const [{ questionId }] = await db
            .insert(dbQuestions)
            .values({
              formId: id,
              text: question.text,
              fieldType: question.fieldType,
            })
            .returning({
              questionId: dbQuestions.id,
            });

          if (question.fieldOptions && question.fieldOptions.length > 0) {
            for (const option of question.fieldOptions) {
              await db.insert(fieldOptions).values({
                questionId,
                text: option.text,
                value: option.value,
              });
            }
          }
        }

        return {
          message: "success",
          questions: newQuestions,
        };
      } else {
        throw new Error("Response is not in JSON format");
      }
    } catch (error) {
      console.error("Error adding more questions:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error adding more questions:", error);
    throw error;
  }
}

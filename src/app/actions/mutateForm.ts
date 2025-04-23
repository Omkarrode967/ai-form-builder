"use server";

import { db } from "@/db";
import { forms, questions as dbQuestions, fieldOptions } from "@/db/schema";
import { auth } from "@/auth";
import { InferInsertModel, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { getCurrentForm } from "./getUserForms";
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

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
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error("Hugging Face API key is not set");
    }

    console.log("Generating additional questions...");
    const user_prompt = `Create 2 more form questions based on this description: "${prompt}"
    
    The questions should NOT include any of these existing questions: ${allQuestions}
    
    Generate a JSON object with a "questions" array containing 2 questions, where each question has:
    - text: The question text
    - fieldType: One of: RadioGroup, Select, Input, Textarea, Switch
    - fieldOptions: For RadioGroup and Select types, an array of {text, value} pairs. For other types, an empty array.
    
    Example format:
    {
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
      model: 'meta-llama/Llama-2-70b-chat-hf',
      inputs: user_prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false
      }
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
      }
      
      // Clean up the JSON string
      jsonString = jsonString.trim();
      if (jsonString.startsWith('{') && jsonString.endsWith('}')) {
        // Try to parse the JSON
        const responseObject = JSON.parse(jsonString);
        console.log("Parsed response object:", responseObject);

        // Validate the response object
        if (!Array.isArray(responseObject.questions)) {
          throw new Error("Invalid response format from AI");
        }

        const currentForm = await getCurrentForm(formID || "");

        const newQuestions = responseObject.questions.map((question: any) => {
          return {
            text: question.text,
            fieldType: question.fieldType,
            fieldOptions: question.fieldOptions,
            formId: id,
          };
        });

        const updatedQuestions = [
          ...(currentForm?.questions || []),
          ...newQuestions,
        ];

        console.log("Saving new questions to database...");
        await db.transaction(async (tx) => {
          for (const question of newQuestions) {
            console.log("Saving question:", question);
            const [{ questionId }] = await tx
              .insert(dbQuestions)
              .values(question)
              .returning({ questionId: dbQuestions.id });
            if (question.fieldOptions && question.fieldOptions.length > 0) {
              await tx.insert(fieldOptions).values(
                question.fieldOptions.map((option: any) => ({
                  text: option.text,
                  value: option.value,
                  questionId,
                }))
              );
            }
          }
        });

        console.log("Questions saved successfully");
        return updatedQuestions;
      } else {
        throw new Error("Response is not in JSON format");
      }
    } catch (jsonError) {
      console.error("Error parsing AI response:", jsonError);
      throw new Error("Failed to parse AI response as JSON");
    }
  } catch (err) {
    console.error("Error generating additional questions:", err);
    throw err;
  }
}

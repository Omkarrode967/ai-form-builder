"use server";

import { CohereClient } from "cohere-ai";

export async function testCohereAPI() {
  try {
    // Validate API key
    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey) {
      return { 
        success: false, 
        error: "API key is missing. Please add COHERE_API_KEY to your .env file" 
      };
    }

    // Initialize Cohere client
    const cohere = new CohereClient({
      token: apiKey,
    });
    
    // Simple test prompt
    const prompt = "Hello, this is a test message.";

    console.log("Testing Cohere API with prompt:", prompt);

    // Generate content with proper error handling
    try {
      const response = await cohere.chat({
        model: 'command-xlarge-nightly',
        message: prompt,
        temperature: 0.7,
        k: 0,
        p: 0.9,
        stream: false
      });
      
      const text = response.text;
      console.log("API Response:", text);
      return { success: true, response: text };
    } catch (apiError: unknown) {
      console.error("API Error Details:", {
        name: apiError instanceof Error ? apiError.name : 'Unknown',
        message: apiError instanceof Error ? apiError.message : String(apiError),
        stack: apiError instanceof Error ? apiError.stack : undefined
      });

      if (apiError instanceof Error) {
        if (apiError.message.includes('API key')) {
          return { 
            success: false, 
            error: "Invalid API key. Please check your Cohere API key" 
          };
        }
        if (apiError.message.includes('quota')) {
          return { 
            success: false, 
            error: "API quota exceeded. Please check your quota or upgrade your plan." 
          };
        }
      }
      return { 
        success: false, 
        error: apiError instanceof Error ? apiError.message : "Unknown API error" 
      };
    }
  } catch (error) {
    console.error("Error testing Cohere API:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
} 
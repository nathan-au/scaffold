"use server"

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateQuiz(prompt: string) {
    try {
        console.log("Generating quiz message sent to AI...");
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview", // Using the latest recommended model
            contents: `Generate a short quiz based on the following prompt: "${prompt}". 
          
          Example format:
          [
            {
              "id": 1,
              "prompt": "Which one is a living thing?",
              "choices": ["rock", "tree", "chair", "ball"],
              "answer": "tree"
            }
          ]

          Each question object MUST have the following structure:
          {
            "id": number,
            "prompt": "string",
            "choices": ["string", "string", "string", "string"],
            "answer": "string (MUST be one of the choices)"
          }
          Return ONLY the raw JSON array, no markdown formatting, no explanation.`
        });

        const text = response.text;

        if (!text) {
            console.error("AI response returned empty text");
            throw new Error("No response from AI");
        }

        // Strip markdown if AI included it
        const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            return JSON.parse(cleanJson);
        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", text);
            throw new Error("AI returned invalid JSON format.");
        }
    } catch (error: any) {
        console.error("Detailed Error in generateQuiz server action:", error);
        // Extract more info if possible
        const errorMessage = error.message || "Unknown error";
        throw new Error(`AI Generation Failed: ${errorMessage}`);
    }
}

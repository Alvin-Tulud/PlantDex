import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function identifyPlant(imagePath) {
  const imageBytes = fs.readFileSync(imagePath);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBytes.toString("base64"),
            },
          },
          {
            text: `
Identify this plant and respond ONLY in JSON.

{
  "commonName": "",
  "scientificName": "",
  "nativeTo": ""
}
`
          }
        ],
      },
    ],
  });

  const text = response.text;

  // clean markdown if Gemini wraps it
  const cleaned = text.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned);
}

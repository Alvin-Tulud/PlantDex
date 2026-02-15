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
            Identify this plant and respond ONLY in this JSON format:

            {
            "commonName": "",
            "scientificName": "",
            "Edible": "",
            "Description": "", // character limit of 512
            "nativeTo(Lat,long)": ""  // Use "lat,long" format, multiple coordinates separated by semicolon
            }
            `
          }
        ],
      },
    ],
  });

    const text = response.text.replace(/```json|```/g, "").trim();

  // Parse JSON safely
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse Gemini response:", text, err);
    return {
      commonName: "Unknown Plant",
      scientificName: "Unknown",
      "nativeTo(Lat,long)": ""
    };
}
}
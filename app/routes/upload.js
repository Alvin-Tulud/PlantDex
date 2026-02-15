import express from "express";
const router = express.Router();
import path from "path";
import upload from "../middleware/photoUpload.js";

import { fileURLToPath } from "url";
import { identifyPlant } from "../services/geminiService.js";
import { updateTable } from "../services/db.js";
import { guardrail } from "../middleware/loginFunctions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// home route

router.post("/", guardrail, upload.single("image"), async (req, res) => {
  try {
    // no file uploaded
    if (!req.file) {
      return res.status(413).json({
        error: "Please upload a JPEG/PNG image under 5MB"
      });
    }

    const imagePath = req.file.path;

    // Gemini AI
    const plantData = await identifyPlant(imagePath);
    console.log(plantData);

    // Insert into DB
    await updateTable(
      `INSERT INTO plant 
      (fk_user_id, common_name, scientific_name, description, edible, coordinates, addition_date, image) 
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE, ?)`,
      [
        req.session.user.user_id,
        plantData.commonName,
        plantData.scientificName,
        plantData.Description,
        plantData.Edible,
        plantData["nativeTo(Lat,long)"],
        req.file.filename
      ]
    );

    // Redirect after DB insert
    return res.redirect(303, "/");

  } catch (err) {
    console.error("Upload Route Error:", err);
    return res.status(500).send("Database error");
  }
});


export default router;

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

router.get("/",guardrail, async (req, res) => {
  res.render(path.join(__dirname, "../views/upload.ejs"));
});


router.post("/",guardrail, upload.single("image"), async (req, res) => {

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

        // Plant data has:
        // commonName, scientificName, Edible, 'nativeTo(Lat,long)'
        // then req.file.filename is the filename

        // To make a new entry I need
        // common_name, scientific_name, edible, coordinates, addition_date (CURRENT_DATE), image
        const result = await updateTable( "INSERT INTO plant (fk_user_id, common_name, scientific_name, description, edible, coordinates, addition_date, image) VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE, ?)", 
            [req.session.user.user_id, plantData.commonName, plantData.scientificName, plantData.Description, plantData.Edible, plantData["nativeTo(Lat,long)"], req.file.filename]);

        return res.redirect(303, "/");

    } catch (err) {
        console.error("Upload Route Error:", err);

        return res.redirect(303, "/upload");
    } 
});

export default router;

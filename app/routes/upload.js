import express from "express";
const router = express.Router();
import path from "path";
import upload from "../middleware/photoUpload.js";

import { fileURLToPath } from "url";
import { identifyPlant } from "../services/geminiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// home route

router.get("/", async (req, res) => {
  res.render(path.join(__dirname, "../views/upload.ejs"));
});


router.post("/", upload.single("image"), async (req, res) => {

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

        return res.status(200).json({
            success: true,
            plant: plantData,
            image: req.file.filename
        });

    } catch (err) {
        console.error("Upload Route Error:", err);

        return res.status(500).json({
            error: "AI failed to analyze plant"
        });
    }
});

export default router;

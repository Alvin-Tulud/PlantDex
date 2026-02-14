import express from "express";
const router = express.Router();
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// home route

router.get("/", async (req, res) => {
  res.render(path.join(__dirname, "../views/upload.ejs"));
});

export default router;

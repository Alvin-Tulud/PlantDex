import express from "express";
const router = express.Router();
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// home route

router.get("/", async (req, res) => {
  res.render(path.join(__dirname, "../views/home.ejs"));
});

/*
for req do a sql call for user after they have logged in check if logged in 
then render all their plants from their id
*/

export default router;

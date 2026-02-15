import express from "express";
const router = express.Router();
import path from "path";

import { fileURLToPath } from "url";
import { queryTable } from "../services/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// home route

router.get("/", async (req, res) => {
  
  const plants = await queryTable("SELECT * FROM plant WHERE fk_user_id = ? ORDER BY addition_date DESC", [1]);
  // debugging
  console.log(plants);
  res.render(path.join(__dirname, "../views/home.ejs"),
    {
      plants: plants
    }
  );
});

/*
for req do a sql call for user after they have logged in check if logged in 
then render all their plants from their id
*/

export default router;

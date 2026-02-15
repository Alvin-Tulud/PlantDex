import express from "express";
const router = express.Router();
import path from "path";

import { fileURLToPath } from "url";
import { queryTable } from "../services/db.js";
import { login, logout } from "../middleware/loginFunctions.js";
import { guardrail } from "../middleware/loginFunctions.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// home route

router.get("/", async (req, res) => {
    console.log(req.session.user);
    res.render(path.join(__dirname, "../views/login.ejs"));
});

router.post("/", login, async (req, res) => {
    console.log(req.session.user);
    res.redirect("/");
});

router.get("/logout",guardrail,logout,async (req, res) => {
    console.log(req.session.user);
    res.redirect("/");
});
/*
for req do a sql call for user after they have logged in check if logged in 
then render all their plants from their id
*/

export default router;

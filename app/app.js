import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;


import dotenv from "dotenv";
dotenv.config();

app.set("view engine", "ejs");
app.use(express.static('public'));


// Index route
import indexRouter from "./routes/index.js";
app.use("/", indexRouter);

// upload route
import uploadRouter from "./routes/upload.js";
app.use("/upload", uploadRouter);

// social route
import socialRouter from "./routes/social.js";
app.use("/social", socialRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

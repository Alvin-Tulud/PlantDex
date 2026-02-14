import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

// Index route
import indexRouter from "./routes/index.js";
app.use("/", indexRouter);

// upload route
import uploadRouter from "./routes/upload.js";
app.use("/upload", uploadRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

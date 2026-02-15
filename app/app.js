import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

import dotenv from "dotenv";
dotenv.config();

app.set("view engine", "ejs");
import session from "express-session";
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
  secret: process.env.SESSION_SECRET || 'dYW4okFnebQRG5heT3diOdv2fSS4Icp8',
  resave: false,
  saveUninitialized: false,
  cookie: {},
 })
);

// this just saves the session from page to page passing it
app.use((req, res, next) => {
  res.locals.user = req.session ? req.session.user : null;
  res.locals.session = req.session || null;
  next();
});

// Index route
import indexRouter from "./routes/index.js";
app.use("/", indexRouter);
import loginRouter from "./routes/login.js";
app.use("/login", loginRouter);

// upload route
import uploadRouter from "./routes/upload.js";
app.use("/upload", uploadRouter);

// social route
import socialRouter from "./routes/social.js";
app.use("/social", socialRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

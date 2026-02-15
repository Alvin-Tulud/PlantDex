import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Use memory storage for processing with Sharp ---
const storageConfig = multer.memoryStorage();

const fileFilterConfig = function(req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Increase file size limit to 50 MB
const upload = multer({
  storage: storageConfig,
  limits: { fileSize: 1024 * 1024 * 50 }, // 50 MB
  fileFilter: fileFilterConfig,
});

// Middleware: resize & convert image to JPEG, save to disk
export const processImage = async (req, res, next) => {
  if (!req.file) return next();

  const uploadsDir = path.join(__dirname, "../public/uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Unique filename to avoid collisions
  const timestamp = Date.now();
  const safeName = req.file.originalname
    .replace(/\s+/g, "_") // replace spaces with underscores
    .replace(/\.[^/.]+$/, ""); // remove extension

  const outputFilename = `${timestamp}-${safeName}.jpg`;
  const outputPath = path.join(uploadsDir, outputFilename);

  try {
    // Resize and convert to JPEG
    await sharp(req.file.buffer)
      .resize(1028, 1028, { fit: "cover" }) // force square
      .jpeg({ quality: 90 })                 // convert to JPEG
      .toFile(outputPath);

    // Update req.file for route
    req.file.path = outputPath;
    req.file.filename = outputFilename;
    req.file.mimetype = "image/jpeg";

    next();
  } catch (err) {
    console.error("Error processing image:", err);
    next(err);
  }
};

export default upload;

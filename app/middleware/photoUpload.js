import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage in memory for processing before saving
const storageConfig = multer.memoryStorage(); 

const fileFilterConfig = function(req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storageConfig,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilterConfig,
});

// Middleware to resize & convert image to JPEG
export const processImage = async (req, res, next) => {
  if (!req.file) return next();

  const uploadsDir = path.join(__dirname, "../public/uploads");

  // Ensure uploads folder exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Generate output file name
  const timestamp = Date.now();
  const outputFilename = `${timestamp}-${req.file.originalname.split('.')[0]}.jpg`;
  const outputPath = path.join(uploadsDir, outputFilename);

  try {
    // Resize and convert
    await sharp(req.file.buffer)
      .resize(1028, 1028, { fit: "cover" }) // force 1028x1028 with cropping
      .jpeg({ quality: 90 }) // convert to JPEG
      .toFile(outputPath);

    // Replace req.file info so routes know the file path
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

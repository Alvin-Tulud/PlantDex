
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// recreate __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storageConfig = multer.diskStorage({
	// destinations is uploads folder 
	// under the project directory
	destination: path.join(__dirname, "../public/uploads"),

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
// file filter for filtering only images
const fileFilterConfig = function(req, file, cb) {
	if (file.mimetype === "image/jpeg"
		|| file.mimetype === "image/png") {
		// calling callback with true
		// as mimetype of file is image
		cb(null, true);
	} else {
		// false to indicate not to store the file
		cb(null, false);
	}
};
const upload = multer({
	// applying storage and file filter
	storage: storageConfig,
	limits: {
		// limits file size to 5 MB
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilterConfig,
});

export default upload;

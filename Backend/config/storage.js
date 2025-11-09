import multer from "multer";
import path from "path";
import fs from "fs";

// Always use local disk storage to the public folder
const uploadDir =
  process.env.UPLOAD_DIR || path.resolve(process.cwd(), "public");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

export default storage;

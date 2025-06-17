import multer from "multer";
import path from "path";
import fs from "fs";

// Configuration for document upload
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const REQUIRED_DOCUMENTS = [
  "identityProof",
  "degreeCertificate",
  "registrationProof",
  "practiceProof",
];

// Configure disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(
      process.cwd(),
      "uploads",
      "temp",
      "expert-documents"
    );

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename using timestamp and original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Multer configuration for document uploads
export const documentUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      cb(
        new Error(
          "Invalid file type. Only PDF and images (JPEG, PNG) are allowed"
        )
      );
      return;
    }

    // Validate fieldname
    if (!REQUIRED_DOCUMENTS.includes(file.fieldname)) {
      cb(
        new Error(
          `Invalid field name. Must be one of: ${REQUIRED_DOCUMENTS.join(", ")}`
        )
      );
      return;
    }

    cb(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 4, // All 4 documents are required
  },
}).fields([
  { name: "identityProof", maxCount: 1 },
  { name: "degreeCertificate", maxCount: 1 },
  { name: "registrationProof", maxCount: 1 },
  { name: "practiceProof", maxCount: 1 },
]);

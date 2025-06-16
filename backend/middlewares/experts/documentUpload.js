import multer from "multer";
import ExpressError from "../../utils/expressError.js";

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

// Multer configuration for document uploads
export const documentUpload = multer({
  storage: multer.memoryStorage(),
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

// Middleware to validate required documents
export const validateDocuments = (req, res, next) => {
  const files = req.files;

  if (!files) {
    throw new ExpressError(400, "No documents uploaded");
  }

  // Check for required documents
  const missingDocuments = [
    "identityProof",
    "degreeCertificate",
    "registrationProof",
  ].filter((docType) => !files[docType]);

  if (missingDocuments.length > 0) {
    throw new ExpressError(
      400,
      `Missing required documents: ${missingDocuments.join(", ")}`
    );
  }

  next();
};

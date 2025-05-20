import express from "express";
import { validatePrakrathi } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import wrapAsync from "../utils/wrapAsync.js";
import { checkUserLogin } from "../middlewares/users/auth.js";
import prakrithiAnalysisController from "../controllers/prakrithi.js";
import multer from "multer";
// Configure multer for single PDF upload
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Allow only one file
  },
});

// const memoryUpload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  "/",
  checkUserLogin,
  validatePrakrathi,
  wrapAsync(prakrithiAnalysisController.findPrakrithi)
);

router.get(
  "/similar_users",
  wrapAsync(prakrithiAnalysisController.findSimilarPrakrithiUsers)
);

router.post(
  "/email/pdf",
  checkUserLogin,
  memoryUpload.single("pdf"),
  wrapAsync(prakrithiAnalysisController.sendPkPdfToMail)
);

export default router;

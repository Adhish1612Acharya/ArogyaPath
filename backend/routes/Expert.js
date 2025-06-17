import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  isLoggedIn,
  profileAlreadyCompleted,
} from "../middlewares/commonAuth.js";
import { checkExpertLogin } from "../middlewares/experts/auth.js";
import { validateExpertCompleteProfile } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import * as expertProfileController from "../controllers/expert.js";
import handleExpertDocumentUpload from "../middlewares/cloudinary/handleExpertDocumentUpload.js";
import { handleCloudinaryDiskUpload } from "../middlewares/cloudinary/handleCloudinaryDiskUpload.js";
import { validateExpertDocuments } from "../middlewares/experts/validateExpertDocument.js";
import { parseFormdata } from "../middlewares/cloudinaryMiddleware.js";

const router = express.Router();

// ========== ACTIVE ROUTES ==========

// PATCH: Complete doctor profile
router.patch(
  "/complete-profile",
  checkExpertLogin,
  profileAlreadyCompleted,
  // Handle file uploads with multer
  handleCloudinaryDiskUpload,
  // Validate required documents are present
  validateExpertDocuments,
  parseFormdata,
  // Validate the request body
  validateExpertCompleteProfile,
  // Upload documents to Cloudinary
  wrapAsync(handleExpertDocumentUpload),
  // Complete the profile
  wrapAsync(expertProfileController.completeProfile)
);

// GET: Search doctors
router.get(
  "/search/doctors",
  isLoggedIn,
  wrapAsync(expertProfileController.searchDoctors)
);

// GET: Get expert by ID
router.get("/:id", wrapAsync(expertProfileController.getExpertById));

// PUT: Edit expert basic info
router.put("/edit/:id", wrapAsync(expertProfileController.editExpert));

// ========== COMMENTED ROUTES (AS-IS) ==========

// // Get all experts
// router.get(
//   "/",
//   wrapAsync(async (req, res) => {
//     const experts = await Expert.find().populate("posts");
//     res.status(200).json(experts);
//   })
// );

// // Create a new expert
// router.post(
//   "/",
//   // validateExpert,
//   wrapAsync(async (req, res) => {
//     const expert = new Expert(req.body);
//     await expert.save();
//     res.status(201).json({ message: "Expert created", expert });
//   })
// );

// // Get an expert by ID
// router.get(
//   "/:id",
//   wrapAsync(async (req, res) => {
//     const expert = await Expert.findById(req.params.id);
//     if (!expert) return res.status(404).json({ error: "Expert not found" });

//     res.status(200).json(expert);
//   })
// );

// // Delete an expert by ID
// router.delete(
//   "/:id",
//   wrapAsync(async (req, res) => {
//     const expert = await Expert.findByIdAndDelete(req.params.id);
//     if (!expert) return res.status(404).json({ error: "Expert not found" });

//     res.status(200).json({ message: "Expert deleted" });
//   })
// );

// // Update an expert by ID
// router.put(
//   "/:id",
//   // validateExpert,
//   wrapAsync(async (req, res) => {
//     const updatedExpert = await Expert.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updatedExpert)
//       return res.status(404).json({ error: "Expert not found" });

//     res.status(200).json({ message: "Expert updated", expert: updatedExpert });
//   })
// );

export default router;

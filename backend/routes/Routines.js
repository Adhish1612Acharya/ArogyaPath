import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine,
} from "../controllers/routine.js";
import { validateRoutine } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import { checkExpertLogin } from "../middlewares/experts/auth.js";
import { storage } from "../cloudConfig.js";
import multer from "multer";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import {
  cloudinaryErrorHandler,
  parseFormdata,
} from "../middlewares/cloudinaryMiddleware.js";
import { verifyPostData } from "../middlewares/verifyPostMiddleware.js";
import { handleCloudinaryUpload } from "../middlewares/cloudinary/handleCloudinaryUpload.js";
const memoryUpload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  "/",
  checkExpertLogin,
  memoryUpload.array("media", 1),
  parseFormdata,
  validateRoutine,
  wrapAsync(verifyPostData),
  wrapAsync(handleCloudinaryUpload),
  cloudinaryErrorHandler,
  wrapAsync(createRoutine)
);

router.get("/", isLoggedIn, wrapAsync(getAllRoutines));

router.get("/:id", isLoggedIn, wrapAsync(getRoutineById));

router.put("/:id", checkExpertLogin, validateRoutine, wrapAsync(updateRoutine));

router.delete("/:id", checkExpertLogin, wrapAsync(deleteRoutine));

export default router;

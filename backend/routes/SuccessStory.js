import express from "express";
import successStoryControllers from "../controllers/successStory.js";
import { checkUserLogin } from "../middlewares/users/auth.js";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import wrapAsync from "../utils/wrapAsync.js";
import { checkExpertLogin } from "../middlewares/experts/auth.js";
import { validateSuccessStory } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import multer from "multer";
import {
  cloudinaryErrorHandler,
  parseFormdata,
} from "../middlewares/cloudinaryMiddleware.js";
import { checkIsTaggedAndVerified } from "../middlewares/experts/postTagged.js";
import { handleCloudinaryUpload } from "../middlewares/cloudinary/handleCloudinaryUpload.js";
import { verifyPostData } from "../middlewares/verifyPostMiddleware.js";
const memoryUpload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  "/",
  checkUserLogin,
  memoryUpload.array("media", 5),
  parseFormdata,
  validateSuccessStory,
  wrapAsync(verifyPostData),
  wrapAsync(handleCloudinaryUpload),
  cloudinaryErrorHandler,
  wrapAsync(successStoryControllers.createSuccessStory)
);

router.get(
  "/",
  isLoggedIn,
  wrapAsync(successStoryControllers.getAllSuccessStories)
);

router.get(
  "/filter",
  isLoggedIn,
  wrapAsync(successStoryControllers.filterSuccessStories)
);

router.get(
  "/:id",
  isLoggedIn,
  wrapAsync(successStoryControllers.getSingleSuccessStory)
);

router.put(
  "/:id",
  checkUserLogin,
  validateSuccessStory,
  wrapAsync(successStoryControllers.updateSuccessStory)
);

router.delete(
  "/:id",
  checkUserLogin,
  wrapAsync(successStoryControllers.deleteSuccessStory)
);

router.put(
  "/:id/verify",
  checkExpertLogin,
  wrapAsync(checkIsTaggedAndVerified),
  wrapAsync(successStoryControllers.verifySuccessStory)
);

export default router;

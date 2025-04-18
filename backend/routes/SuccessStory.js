import express from "express";
import {
  createSuccessStory,
  getAllSuccessStories,
  getSingleSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  verifySuccessStory,
} from "../controllers/successStory.js";
import { checkUserLogin } from "../middlewares/users/auth.js";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import wrapAsync from "../utils/wrapAsync.js";
import { checkExpertLogin } from "../middlewares/experts/auth.js";
import { validateSuccessStory } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import multer from "multer";
import { storage } from "../cloudConfig.js";
import {
  cloudinaryErrorHandler,
  parseFormdata,
} from "../middlewares/cloudinaryMiddleware.js";
import { checkIsTaggedAndVerified } from "../middlewares/experts/postTagged.js";
const upload = multer({ storage });

const router = express.Router();

router.post(
  "/",
  checkUserLogin,
  upload.array("media", 5),
  cloudinaryErrorHandler,
  parseFormdata,
  validateSuccessStory,
  wrapAsync(createSuccessStory)
);

router.get("/", isLoggedIn, wrapAsync(getAllSuccessStories));

router.get(
  "/:id",
  isLoggedIn,
  checkUserLogin,
  wrapAsync(getSingleSuccessStory)
);

router.put(
  "/:id",
  checkUserLogin,
  upload.array("media", 5),
  cloudinaryErrorHandler,
  parseFormdata,
  validateSuccessStory,
  wrapAsync(updateSuccessStory)
);

router.delete("/:id", checkUserLogin, wrapAsync(deleteSuccessStory));

router.put(
  "/:id/verify",
  checkExpertLogin,
  checkIsTaggedAndVerified,
  wrapAsync(verifySuccessStory)
);

export default router;

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

const router = express.Router();

router.post("/", checkUserLogin,wrapAsync(createSuccessStory));

router.get("/", isLoggedIn ,wrapAsync(getAllSuccessStories));

router.get("/:id", isLoggedIn ,checkUserLogin,wrapAsync(getSingleSuccessStory));

router.put("/:id",  checkUserLogin,wrapAsync(updateSuccessStory));

router.delete("/:id",  checkUserLogin,wrapAsync(deleteSuccessStory));

router.post("/:id/verify", checkExpertLogin,wrapAsync(verifySuccessStory));

export default router;

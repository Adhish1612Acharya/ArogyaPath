import express from "express";
import { validatePost } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import wrapAsync from "../utils/wrapAsync.js";
import postController from "../controllers/post.js";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import { checkExpertLogin } from "../middlewares/experts/auth.js";
import multer from "multer";
// import { storage } from "../cloudConfig.js";
import {
  cloudinaryErrorHandler,
  parseFormdata,
} from "../middlewares/cloudinaryMiddleware.js";
import { handleCloudinaryUpload } from "../middlewares/cloudinary/handleCloudinaryUpload.js";
import { verifyPostData } from "../middlewares/verifyPostMiddleware.js";
const memoryUpload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/", isLoggedIn, wrapAsync(postController.getAllPosts));

router.post(
  "/",
  checkExpertLogin,
  memoryUpload.array("media", 5),
  parseFormdata,
  validatePost,
  wrapAsync(verifyPostData),
  wrapAsync(handleCloudinaryUpload),
  cloudinaryErrorHandler,
  wrapAsync(postController.createPost)
);

router.get("/filter", isLoggedIn, wrapAsync(postController.filterPosts));

router.get("/:postId", isLoggedIn, wrapAsync(postController.getPostById));

router.delete(
  "/:postId",
  checkExpertLogin,
  wrapAsync(postController.deletePost)
);

router.put(
  "/:postId",
  checkExpertLogin,
  validatePost,
  wrapAsync(postController.updatePost)
);

router.post(
  "/verify/:id",
  checkExpertLogin,
  wrapAsync(postController.verifyPost)
);

export default router;

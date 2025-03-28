import express from "express";
import Post from "../models/Post/Post.js";
import { validatePost } from "../middlewares/routemiddlewares.js";
import wrapAsync from "../utils/wrapAsync.js";
import postController from "../controllers/post.js";
import {isLoggedIn} from "../middlewares/commonAuth.js"
import {checkExpertLogin} from "../middlewares/experts/auth.js"

const router = express.Router();

router.get("/", wrapAsync(postController.getAllPosts));
router.post("/", isLoggedIn,validatePost, wrapAsync(postController.createPost));

router.get("/:postId",isLoggedIn, wrapAsync(postController.getPostById));

router.delete("/:postId",isLoggedIn,wrapAsync(postController.deletePost));

router.put("/:postId",isLoggedIn, validatePost, wrapAsync(postController.updatePost));

router.get("/filter",isLoggedIn, wrapAsync(postController.filterPosts));

router.post("/verify/:id",checkExpertLogin,wrapAsync(postController.verifyPost) );//include the middleware adhish

export default router;



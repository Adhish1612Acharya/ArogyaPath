import express from "express";
import Post from "../models/Post/Post.js";
import { validatePost } from "../middlewares/routemiddlewares.js";
import wrapAsync from "../utils/wrapAsync.js";
import generateCategories from "../utils/geminiAI.js";
import postController from "../controllers/post.js";
import { postSchemaZod } from "../middlewares/validationmiddleware.js";
import {verifyPost} from "../controllers/post.js"
const router = express.Router();

router.get("/", wrapAsync(postController.getAllPosts));
router.post("/", validatePost, wrapAsync(postController.createPost));

router.get("/:postId", wrapAsync(postController.getPostById));

router.delete("/:postId", wrapAsync(postController.deletePost));

router.put("/:postId", validatePost, wrapAsync(postController.updatePost));

router.get("/filter", wrapAsync(postController.filterPosts));

router.post("/verify/:id",wrapAsync(postController.verifyPost) );//include the middleware adhish

export default router;



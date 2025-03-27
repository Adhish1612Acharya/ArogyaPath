import express from "express";
import Comment from "../models/Comment/Comment.js";
import { validateComment } from "../middleware/routemiddlewares.js";

const router = express.Router();

router.get("/", wrapAsync(async (req, res) => {
    const comments = await Comment.find().populate("owner").populate("post");
    res.status(200).json(comments);
  }));

  router.post("/", validateComment, wrapAsync(async (req, res) => {
    const newComment = await Comment.create(req.validatedData);
    res.status(201).json({ message: "Comment created", comment: newComment });
  }));
  
  router.put("/:id", validateComment, wrapAsync(async (req, res) => {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.validatedData, { new: true });
    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(200).json({ message: "Comment updated", comment: updatedComment });
  }));
  router.delete("/:id", wrapAsync(async (req, res) => {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted" });
  }));
  
  export default router;
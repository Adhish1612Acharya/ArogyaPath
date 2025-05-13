import express from "express";
import User from "../models/User/User.js";
import { validateUserCompleteProfile } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import completeUserProfileController from "../controllers/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import { checkUserLogin } from "../middlewares/users/auth.js";
const router = express.Router();

// // Get user details
// router.get(
//   "/:userId",
//   wrapAsync(async (req, res) => {
//     const user = await User.findById(req.params.userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json(user);
//   })
// );

// // Update user details
// router.put(
//   "/:userId",
//   validateUser,
//   wrapAsync(async (req, res) => {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.userId,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser)
//       return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ message: "Profile updated", user: updatedUser });
//   })
// );

// // Delete user
// router.delete(
//   "/:userId",
//   wrapAsync(async (req, res) => {
//     const deletedUser = await User.findByIdAndDelete(req.params.userId);
//     if (!deletedUser)
//       return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ message: "Profile deleted" });
//   })
// );
// router.post(
//   "/bookmark/:postId",
//   wrapAsync(async (req, res) => {
//     const { userId, postId } = req.params;

//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const post = await Post.findById(postId);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     if (user.bookmarks.includes(postId)) {
//       return res.status(400).json({ message: "Post already bookmarked" });
//     }

//     user.bookmarks.push(postId);
//     await user.save();

//     res
//       .status(200)
//       .json({ message: "Post bookmarked", bookmarks: user.bookmarks });
//   })
// );

// const express = require("express");
// const User = require("../models/User");
// const Post = require("../models/Post");
// const wrapAsync = require("../utils/wrapAsync");

// // Remove bookmark
// router.delete(
//   "/bookmark/:postId",
//   wrapAsync(async (req, res) => {
//     const { postId } = req.params;

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { $pull: { bookmarks: postId } }, // ✅ Using $pull operator
//       { new: true }
//     );

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res
//       .status(200)
//       .json({
//         message: "Post removed from bookmarks",
//         bookmarks: user.bookmarks,
//       });
//   })
// );

// Create a new user
router.post(
  "/complete-profile",
  checkUserLogin,
  validateUserCompleteProfile,
  wrapAsync(completeUserProfileController.completeProfile)
);

// Get user details
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  })
);

// Update user details
router.put(
  "/edit/:id",
  wrapAsync(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  })
);

export default router;

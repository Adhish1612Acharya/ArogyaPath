import express from "express";
import Post from "../models/Post/Post.js";
import generateCategories from "../utils/geminiAI.js";


// Handler functions
const getAllPosts = async (req, res) => {
  const posts = await Post.find();
  res.status(200).json({ message: "All posts retrieved", posts });
};

const createPost = async (req, res) => {
    const { title, description, media,successStory, ownerType,tags } = req.body;

    // Generate categories using ONLY the description
    const categories = await generateCategories(description);

    // Add categories to request body
    const post = new Post({ title, description, media, category: categories,category:categories,successStory,ownerType,tags,owner:req.user._id });

    await post.save();
    res.status(201).json({ message: "Post created", post });
  }

const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ message: "Post retrieved", post });
};

const deletePost = async (req, res) => {
  const deletedPost = await Post.findByIdAndDelete(req.params.postId);
  if (!deletedPost) return res.status(404).json({ message: "Post not found" });
  res.json({ message: "Post deleted" });
};

const updatePost = async (req, res) => {
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.postId,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedPost) return res.status(404).json({ message: "Post not found" });
  res.json({ message: "Post updated", post: updatedPost });
};

const filterPosts = async (req, res) => {
  const { categories } = req.query;
  if (!categories) return res.status(400).json({ message: "Provide categories" });
  const categoryArray = categories.split(",").map((cat) => cat.trim());
  const posts = await Post.find({ category: { $in: categoryArray } });
  res.json({ message: "Filtered posts", posts });
};

export default {
    getAllPosts,
    createPost,
    getPostById,
    deletePost,
    updatePost,
    filterPosts,
}
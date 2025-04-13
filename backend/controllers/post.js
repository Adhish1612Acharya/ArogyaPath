import express from "express";
import Post from "../models/Post/Post.js";
import generateCategories from "../utils/geminiAI.js";
import Expert from "../models/Expert/Expert.js";
import User from "../models/User/User.js";
<<<<<<< HEAD
const axios = require('axios');

// Handler functions
const getAllPosts = async (req, res) => {
    const posts = await Post.find().populate("owner").populate("tags").populate("verified"); 
=======

// Handler functions
const getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("owner")
    .populate("tags")
    .populate("verified");
>>>>>>> a8ad4e2fbaf6af729645405c16f879505685dbc0
  posts = await Post.populate(posts, {
    path: "verified",
    match: { $ne: null }, // Only populate if 'verified' is not null
  });

  res.status(200).json({ message: "All posts retrieved", posts });
};

const createPost = async (req, res) => {
<<<<<<< HEAD
  const { title, description, media, successStory, ownerType, tags } = req.body;

  // Call the external API for content verification
  const response = await axios.post('https://content-verification-aakrithi.onrender.com/predict', { text:description });
  console.log(response.data);

  // Check if the description category is "Ayurveda"
  if (response.data.description === "Ayurveda") {
    // Generate categories using ONLY the description
    const categories = await generateCategories(description);

    // Create a new post with the categories and other details
    const post = new Post({
      title,
      description,
      media,
      category: categories,
      successStory,
      ownerType,
      tags,
      owner: req.user._id,
    });

    // Add the post to the user's or expert's posts array
    if (req.user.role === "user") {
      await User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });
    } else {
      await Expert.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });
    }

    // Save the post to the database
    await post.save();

    // Return success message with created post
    return res.status(201).json({ message: "Post created", post });
  } else {
    // If the description is not "Ayurveda", return an error response
    return res.status(400).json({ message: "Invalid description. Only 'Ayurveda' content is allowed." });
=======
  console.log(req.body);
  const {
    title,
    description,
    media,
    successStory,
    category,
    ownerType,
    tags,
    verified,
  } = req.body;

  // Generate categories using ONLY the description
  // const categories = await generateCategories(description);

  // Add categories to request body
  const post = new Post({
    title,
    description,
    media,
    category,
    ownerType,
    verified,
    owner: req.user._id,
  });

  if (req.user.role === "user") {
    await User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });
  } else {
    await Expert.findByIdAndUpdate(req.user._id, {
      $push: { posts: post._id },
    });
>>>>>>> a8ad4e2fbaf6af729645405c16f879505685dbc0
  }
};


  await post.save();
  res.status(201).json({ message: "Post created", post });
};

const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post)
    return res
      .status(404)
      .json({ message: "Post not found" })
      .populate("owner")
      .populate("tags")
      .populate("verified");
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
  if (!categories)
    return res
      .status(400)
      .json({ message: "Provide categories" })
      .populate("owner")
      .populate("tags")
      .populate("verified");
  const categoryArray = categories.split(",").map((cat) => cat.trim());
  const posts = await Post.find({ category: { $in: categoryArray } });
  res.json({ message: "Filtered posts", posts });
};
const verifyPost = async (req, res) => {
  const { id } = req.params; // Post ID
  const doctorId = req.user._id; // Doctor's (Expert's) ID from the authenticated user
  if (!doctorId) {
    return res.status(400).json({ error: "Appropriate Doctor ID is required" });
  }
  const doctor = await Expert.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  }
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  if (post.verified.includes(doctorId)) {
    return res
      .status(400)
      .json({ error: "Doctor has already verified this post" });
  }
  post.verified.push(doctorId);
  await post.save();
  const updatedPost = await Post.findById(id).populate("verified", "username");
  res.json({ message: " Post verified successfully", post: updatedPost });
};
export default {
  getAllPosts,
  createPost,
  getPostById,
  deletePost,
  updatePost,
  filterPosts,
  verifyPost,
};

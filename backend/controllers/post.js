import Post from "../models/Post/Post.js";
import generateCategories from "../utils/geminiAI.js";
import Expert from "../models/Expert/Expert.js";
import User from "../models/User/User.js";
import axios from "axios";

// Handler functions
const getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("owner")
    .populate("tags")
    .populate("verified");
  posts = await Post.populate(posts, {
    path: "verified",
    match: { $ne: null }, // Only populate if 'verified' is not null
  });

  res.status(200).json({ message: "All posts retrieved", posts });
};

const createPost = async (req, res) => {
  const { title, description,filters } = req.body;
  const mediaFiles = req.files; // Cast for type hint
  console.log("req.body", req.body);
  console.log("Media Files:", mediaFiles);

const media = {
  images: [],
  video: null ,
  document: null ,
};

// Cloudinary stores file URLs in `path`
mediaFiles.forEach((file) => {
  const mimeType = file.mimetype;

  if (mimeType.startsWith("image/")) {
    media.images.push(file.path); // Cloudinary gives the URL in `path`
  } else if (mimeType.startsWith("video/")) {
    media.video = file.path;
  } else if (mimeType === "application/pdf") {
    media.document = file.path;
  }
});

console.log("Processed media:", media);

console.log("NewPost", {
  title,
  description,
  media:media,
  filters: filters,
  owner: req.user._id,
});


    //Generate categories using ONLY the description
    // const categories = await generateCategories(description);

    //Create a new post with the categories and other details
    const post =await Post.create({
      title,
      description,
      media:media,
      filters: filters,
      owner: req.user._id,
    });

      await Expert.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });

    // Return success message with created post
    return res.status(200).json({ message: "Post created",success:true, postId: post._id,userId: req.user._id });
   
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

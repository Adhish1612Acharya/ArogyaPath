import Post from "../models/Post/Post.js";
import Expert from "../models/Expert/Expert.js";
import calculateReadTime from "../utils/calculateReadTime.js";
import transformPost from "../utils/transformPost.js";
import generateFilters from "../utils/geminiApiCalls/generateFilters.js";

// Handler functions
const getAllPosts = async (req, res) => {
  const rawPosts = await Post.find()
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage");

  const transformedPosts = rawPosts.map((post) => transformPost(post));

  res.status(200).json({
    message: "All posts retrieved",
    success: true,
    posts: transformedPosts,
  });
};

const getPostById = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId)
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage");

  if (!post) {
    return res.status(404).json({ message: "Post not found", success: false });
  }

  const transformedPost = transformPost(post);

  res.status(200).json({
    message: "Post retrieved",
    success: true,
    post: transformedPost,
  });
};

const createPost = async (req, res) => {
  const { title, description } = req.body;

  const mediaFiles = req.cloudinaryFiles;
  console.log("req.body", req.body);
  console.log("Media Files:", mediaFiles);

  const media = {
    images: [],
    video: null,
    document: null,
  };

  //Cloudinary stores file URLs in `path`
  mediaFiles.forEach((file) => {
    // Determine file type from Cloudinary response
    if (file.resource_type === "image") {
      media.images.push(file.secure_url);
    } else if (file.resource_type === "video") {
      media.video = file.secure_url;
    } else if (file.format === "pdf") {
      media.document = file.secure_url;
    }
  });

  const readTime = calculateReadTime({ title, description, routines: [] });

  console.log("Processed media:", media);

  //Generate categories using ONLY the description
  const filters = await generateFilters(title, description, []);

  console.log("NewPost", {
    title,
    description,
    media: media,
    filters: filters,
    owner: req.user._id,
    readTime,
  });

  //Create a new post with the categories and other details
  const post = await Post.create({
    title,
    description,
    media: media,
    filters: filters,
    readTime,
    owner: req.user._id,
  });

  await Expert.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });

  // Return success message with created post
  return res.status(200).json({
    message: "Post created",
    success: true,
    postId: " post._id",
    userId: req.user._id,
  });
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
  if (!categories) {
    return res.status(400).json({ message: "Provide categories" });
  }

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

const express = require("express");
const Post = require("../models/Post/Post");
const validatePost = require("../middlewares/routemiddlewares");
const wrapAsync = require("../utils/wrapAsync");
const { generateCategories } = require("../utils/geminiAI");
const axios = require("axios");

const router = express.Router();


router.get(
  "/",
  wrapAsync(async (req, res) => {
    const posts = await Post.find();
    res.json({ message: "All posts retrieved", posts });
  })
);
router.post(
  "/",
  wrapAsync(async (req, res) => {
    const { title, description, media } = req.body;

    // const data={
    //   text:description
    // }
    
    // const response = await axios.post("https://content-verification-aakrithi.onrender.com/predict",data);
    // res.json(response.data.description);

    // console.log(response.data.description);

    // Generate categories using ONLY the description
    const categories = await generateCategories(description);

    // Add categories to request body
    const post = new Post({ title, description, media, category: categories });

    await post.save();
    res.status(201).json({ message: "Post created", post });
  })
);


router.get(

  "/:postId",
  wrapAsync(async (req, res) => {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ message: "Post retrieved", post });
  })
);

router.delete(
  "/:postId",
  wrapAsync(async (req, res) => {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    if (!deletedPost) return res.status(404).json({ message: "Post not found" });

    res.json({ message: "Post deleted" });
  })
);


router.put(
  "/:postId",
  validatePost,
  wrapAsync(async (req, res) => {
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) return res.status(404).json({ message: "Post not found" });

    res.json({ message: "Post updated", post: updatedPost });
  })
);


router.get(
  "/filter",
  wrapAsync(async (req, res) => {
    const { categories } = req.query;
    if (!categories) return res.status(400).json({ message: "Provide categories" });

    const categoryArray = categories.split(",").map((cat) => cat.trim());
    const posts = await Post.find({ category: { $in: categoryArray } });

    res.json({ message: "Filtered posts", posts });
  })
);

module.exports = router;

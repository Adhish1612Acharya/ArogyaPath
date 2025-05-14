import axios from "axios";
import Post from "../models/Post/Post.js";
import Routine from "../models/Routines/Routines.js";
import SuccessStory from "../models/SuccessStory/SuccessStory.js";
import { normalizePostForAI } from "../utils/normalizePostForAI.js";

export const aiQuerySearch = async (req, res) => {
  const { prompt } = req.query;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({
      success: false,
      message: "Prompt is required and must be a string.",
    });
  }

  // Fetch all post types
  const [posts, routines, successStories] = await Promise.all([
    Post.find({}),
    Routine.find({}),
    SuccessStory.find({}),
  ]);

  // Normalize all posts
  const formattedPosts = posts.map((post) => normalizePostForAI(post, "post"));
  const formattedRoutines = routines.map((routine) =>
    normalizePostForAI(routine, "routine")
  );
  const formattedStories = successStories.map((story) =>
    normalizePostForAI(story, "successStory")
  );

  const allPosts = [
    ...formattedPosts,
    ...formattedRoutines,
    ...formattedStories,
  ];

  const aiBody = {
    ApiKey: !req.user?.premiumUser
      ? process.env.AI_QUERY_PREMIUM_API_KEY
      : process.env.AI_QUERY_FREE_API_KEY,
    prompt,
    posts: allPosts,
  };

  // AI search API call
  const aiResponse = await axios.post(process.env.AI_QUERY_MODEL, aiBody);
  console.log("AI Model Response:", aiResponse.data);

  const results = [];

  for (const { postId, type } of aiResponse.data.results) {
    let data;

    switch (type) {
      case "successStory":
        data = await SuccessStory.findById(postId)
          .select("-updatedAt")
          .populate("owner", "_id profile.fullName profile.profileImage")
          .populate(
            "tagged",
            "_id profile.fullName profile.profileImage profile.expertType"
          )
          .populate(
            "verified",
            "_id profile.fullName profile.profileImage profile.expertType"
          );
        break;
      case "routine":
        data = await Routine.findById(postId)
          .select("-updatedAt")
          .populate("owner", "_id profile.fullName profile.profileImage");
        break;
      case "post":
        data = await Post.findById(postId)
          .select("-updatedAt")
          .populate("owner", "_id profile.fullName profile.profileImage");
        break;
      default:
        continue; // Skip unknown types
    }

    if (data) {
      results.push({ type, data });
    }
  }

  res.status(200).json({
    success: true,
    message: "AI search successful",
    posts: results, // assuming the external API returns a `data` field
  });
};

export default {
  aiQuerySearch,
};

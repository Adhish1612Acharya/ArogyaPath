import User from "../models/User/User.js";

export const searchUsers = async (req, res) => {
  const { q: searchQuery } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  const users = await User.find({
    username: new RegExp(searchQuery, "i"),
  }).select("_id username profile.profileImage");

  res.status(200).json({
    message: "Search results",
    success: true,
    users: users,
    userId: req.user._id,
  });
};

export const completeProfile = async (req, res) => {
  const profileData = req.body;

  const updates = {};
  for (const key in profileData) {
    updates[`profile.${key}`] = profileData[key];
  }

  updates.completeProfile = true;

  await User.findByIdAndUpdate(req.user?._id, {
    $set: updates,
  });
  res.status(200).json({
    success: true,
    message: "profileComplete",
  });
};

export default {
  searchUsers,
  completeProfile,
};

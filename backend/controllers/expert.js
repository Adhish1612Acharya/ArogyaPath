import Expert from "../models/Expert/Expert.js";

export const searchDoctors = async (req, res) => {
  const { q: searchQuery } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  const doctors = await Expert.find({
    username: new RegExp(searchQuery, "i"),
    "profile.expertType": { $in: ["ayurvedic", "naturopathy"] },
  }).select("_id username profile.expertType profile.profileImage");

  res.status(200).json({
    message: "Search results",
    success: true,
    doctors: doctors,
    userId: req.user._id,
  });
};

export const completeProfile = async (req, res) => {
  const profileData = req.body;

  await Expert.findByIdAndUpdate(req.user?._id, {
    profile: profileData,
    completeProfile: true,
  });

  res.status(200).json({
    success: true,
    message: "profileComplete",
  });
};

export default {
  searchDoctors,
  completeProfile,
};

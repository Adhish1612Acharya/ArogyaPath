import Expert from "../models/Expert/Expert.js";

export const searchDoctors = async (req, res) => {
  const { q: searchQuery } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  const doctors = await Expert.find({
    username: new RegExp(searchQuery, "i"),
    // "profile.expertType": { $in: ["ayurvedic", "naturopathy"] },

  }).select("_id username profile.expertType profile.profileImage");

  console.log("Doctors : ", doctors);

  res.status(200).json({
    message: "Search results",
    success: true,
    doctors: doctors,
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

  await Expert.findByIdAndUpdate(req.user?._id, {
    $set: updates,
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

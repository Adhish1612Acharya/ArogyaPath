import Expert from "../models/Expert/Expert.js";
import ExpressError from "../utils/expressError.js";

// PATCH /experts/complete-profile
export const completeProfile = async (req, res) => {
  const expertId = req.user._id;
  const { profile, verificationDetails } = req.body;
  const documentUrls = req.documentUrls;

  const expert = await Expert.findById(expertId);
  if (!expert) throw new ExpressError("Expert not found", 404);

  // Update profile
  expert.profile = {
    ...expert.profile,
    ...profile,
  };

  // Update verificationDetails with document URLs
  expert.verificationDetails = {
    ...verificationDetails,
    documents: {
      identityProof: documentUrls.identityProof,
      degreeCertificate: documentUrls.degreeCertificate,
      registrationProof: documentUrls.registrationProof,
      practiceProof: documentUrls.practiceProof, // Required
    },
  };

  // Update verification status
  expert.verifications.completeProfile = true;
  expert.verifications.isDoctor = true;

  await expert.save();

  res
    .status(200)
    .json({ success: true, message: "Profile completed successfully", expert });
};

// GET /experts/search/doctors

export const searchDoctors = async (req, res) => {
  const { q: searchQuery } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  const doctors = await Expert.find({
    username: new RegExp(searchQuery, "i"),
    "verifications.isDoctor": true,
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

// GET /experts/:id
const getExpertById = async (req, res) => {
  const expert = await Expert.findById(req.params.id);
  if (!expert) throw new ExpressError("Expert not found", 404);

  res.json(expert);
};

// PUT /experts/edit/:id
const editExpert = async (req, res) => {
  const { username, email, role, profile } = req.body;

  const updatedExpert = await Expert.findByIdAndUpdate(
    req.params.id,
    { username, email, role, profile },
    { new: true, runValidators: true }
  );

  if (!updatedExpert) throw new ExpressError("Expert not found", 404);
  res.json(updatedExpert);
};

export default {
  completeProfile,
  searchDoctors,
  getExpertById,
  editExpert,
};

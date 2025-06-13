import Expert from "../models/Expert/Expert.js";
import ExpressError from "../utils/expressError.js";

// PATCH /experts/complete-profile
const completeProfile = async (req, res) => {
  const expertId = req.user._id;
  const { profile, completeProfileDetails } = req.body;

  const expert = await Expert.findById(expertId);
  if (!expert) throw new ExpressError("Expert not found", 404);

  // Update profile first
  expert.profile = {
    ...expert.profile,
    ...profile,
  };
  
  // Update completeProfileDetails
  expert.completeProfileDetails = {
    ...expert.completeProfileDetails,
    ...completeProfileDetails,
  };
  
  expert.verifications.completeProfile = true;
  expert.verifications.isDoctor = true;

  await expert.save();

  res.status(200).json({ message: "Profile completed successfully", expert });
};

// GET /experts/search/doctors
const searchDoctors = async (req, res) => {
  const doctors = await Expert.find({ "verifications.isDoctor": true }).select(
    "profile.fullName profile.profileImage profile.expertType"
  );
  res.status(200).json({ doctors });
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


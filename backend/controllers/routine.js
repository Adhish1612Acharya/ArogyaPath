import Expert from "../models/Expert/Expert.js";
import Routines from "../models/Routines/Routines.js";
import calculateReadTime from "../utils/calculateReadTime.js";
import ExpressError from "../utils/expressError.js";
import generateFilters from "../utils/geminiApiCalls/generateFilters.js";

// ------------------------ Create Routine ------------------------
export const createRoutine = async (req, res) => {
  const { title, description, routines } = req.body;
  const mediaFiles = req.thumbnail;
  console.log("req.body", req.body);
  console.log("Media Files:", mediaFiles);

  const thumbnail =
    mediaFiles?.[0]?.resource_type === "image" ? mediaFiles[0].url : null;

  const readTime = calculateReadTime({ title, description, routines });

  //Generate categories using ONLY the description
  const filters = await generateFilters(title, description, routines || []);

  const newRoutine = new Routines({
    title,
    description,
    routines,
    thumbnail,
    owner: req.user._id,
    readTime,
    filters: filters,
  });

  await newRoutine.save();

  // Add the routine ID to the owner's list of routines
  await Expert.findByIdAndUpdate(req.user._id, {
    $push: { routines: newRoutine._id },
  });

  return res.status(200).json({
    message: "Routine created successfully",
    success: true,
    postId: newRoutine._id,
    userId: req.user._id,
  });
};

// ------------------------ Get All Routines ------------------------
export const getAllRoutines = async (req, res) => {
  const routines = await Routines.find()
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage");

  return res.status(200).json({
    message: "Routines fetched successfully",
    success: true,
    routines: routines,
    userId: req.user._id,
  });
};

// ------------------------ Get Routine By ID ------------------------
export const getRoutineById = async (req, res) => {
  const { id } = req.params;
  const routine = await Routines.findById(id)
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage");

  if (!routine) {
    throw new ExpressError(404, "Routine not found");
  }

  return res.status(200).json({
    message: "Routine fetched successfully",
    success: true,
    routine: routine,
    userId: req.user._id,
  });
};

// ------------------------ Update Routine ------------------------
export const updateRoutine = async (req, res) => {
  const { id } = req.params;

  const updatedRoutine = await Routines.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedRoutine) {
    throw new ExpressError(404, "Routine not found");
  }

  return res.status(200).json({
    message: "Routine updated successfully",
    data: updatedRoutine,
  });
};

// ------------------------ Delete Routine ------------------------
export const deleteRoutine = async (req, res) => {
  const { id } = req.params;

  const deletedRoutine = await Routines.findByIdAndDelete(id);

  if (!deletedRoutine) {
    throw new ExpressError(404, "Routine not found");
  }

  return res.status(200).json({
    success: true,
    message: "Routine deleted successfully",
  });
};

const filterRoutines = async (req, res) => {
  const { filters } = req.query;
  if (!filters) {
    throw new ExpressError(400, "Filters not provided");
  }

  const categoryArray = filters
    .split(",")
    .map((cat) => cat.toLowerCase().trim());

  const routines = await Routines.find({ filters: { $in: categoryArray } })
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage");

  res.json({ success: true, message: "Filtered routines", routines });
};

export default {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine,
  filterRoutines,
};

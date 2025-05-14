import Expert from "../models/Expert/Expert.js";
import Routines from "../models/Routines/Routines.js";
import calculateReadTime from "../utils/calculateReadTime.js";
import transformRoutine from "../utils/transformRoutinePost.js";

// ------------------------ Create Routine ------------------------
export const createRoutine = async (req, res) => {
  const { title, description, routines } = req.body;
  const mediaFiles = req.cloudinaryFiles;
  console.log("req.body", req.body);
  console.log("Media Files:", mediaFiles);

  const thumbnail =
    mediaFiles[0]?.resource_type === "image" ? mediaFiles[0].secure_url : null;

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

  const transformedRoutinePosts = routines.map(transformRoutine);

  return res.status(200).json({
    message: "Routines fetched successfully",
    success: true,
    routines: transformedRoutinePosts,
  });
};

// ------------------------ Get Routine By ID ------------------------
export const getRoutineById = async (req, res) => {
  const { id } = req.params;
  const routine = await Routines.findById(id)
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage");

  if (!routine) {
    return res.status(404).json({ message: "Routine not found" });
  }

  const transformedRoutinePost = transformRoutine(routine);

  return res.status(200).json({
    message: "Routine fetched successfully",
    success: true,
    routine: transformedRoutinePost,
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
    return res.status(404).json({ message: "Routine not found" });
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
    return res.status(404).json({ message: "Routine not found" });
  }

  return res.status(200).json({
    message: "Routine deleted successfully",
  });
};

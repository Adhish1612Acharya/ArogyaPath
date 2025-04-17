import Expert from "../models/Expert/Expert.js";
import Routines from "../models/Routines/Routines.js";

// ------------------------ Create Routine ------------------------
export const createRoutine = async (req, res) => {
  const { title, description, routines, filters } = req.body;
  const thumbnail = req.file ? req.file.path : null;

  const newRoutine = new Routines({
    title,
    description,
    routines,
    thumbnail,
    owner: req.user._id,
    filters: filters, // Optional: Populate dynamically
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
  const routines = await Routines.find();
  return res.status(200).json({
    message: "Routines fetched successfully",
    data: routines,
  });
};

// ------------------------ Get Routine By ID ------------------------
export const getRoutineById = async (req, res) => {
  const { id } = req.params;
  const routine = await Routines.findById(id);

  if (!routine) {
    return res.status(404).json({ message: "Routine not found" });
  }

  return res.status(200).json({
    message: "Routine fetched successfully",
    data: routine,
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

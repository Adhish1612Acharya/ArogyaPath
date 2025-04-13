import express from 'express';
import wrapAsync  from '../utils/wrapAsync';  // Assuming you have a utility for async error handling
import Routines from '../models/Routines/Routines';  // Path to your Routines model

const router = express.Router();

// ------------------------ Create Routine ------------------------
router.post('/routines', wrapAsync(async (req, res) => {
    const { title, description, routines } = req.body;
  
    if (!title || !description || !routines) {
      return res.status(400).json({ message: 'Title, description, and routines are required.' });
    }
  
    const newRoutine = new Routines({
      title,
      description,
      routines,
      owner: req.user._id,
      ownerType: req.user.constructor.modelName, // 'User' or 'Expert'
      filters: [] // You can dynamically add based on tags or logic later
    });
  
    await newRoutine.save();
  
    return res.status(201).json({
      message: 'Routine created successfully',
      data: newRoutine
    });
  }));
  
// ------------------------ Get All Routines ------------------------
router.get('/routines', wrapAsync(async (req, res) => {
  const routines = await Routines.find();
  return res.status(200).json({
    message: 'Routines fetched successfully',
    data: routines
  });
}));

// ------------------------ Get Routine By ID ------------------------
router.get('/routines/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const routine = await Routines.findById(id);

  if (!routine) {
    return res.status(404).json({ message: 'Routine not found' });
  }

  return res.status(200).json({
    message: 'Routine fetched successfully',
    data: routine
  });
}));

// ------------------------ Update Routine ------------------------
router.put('/routines/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;

  const updatedRoutine = await Routines.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true  // Ensure validation runs when updating
  });

  if (!updatedRoutine) {
    return res.status(404).json({ message: 'Routine not found' });
  }

  return res.status(200).json({
    message: 'Routine updated successfully',
    data: updatedRoutine
  });
}));

// ------------------------ Delete Routine ------------------------
router.delete('/routines/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;

  const deletedRoutine = await Routines.findByIdAndDelete(id);

  if (!deletedRoutine) {
    return res.status(404).json({ message: 'Routine not found' });
  }

  return res.status(200).json({
    message: 'Routine deleted successfully'
  });
}));

// ------------------------ Export the Router ------------------------
export default router;

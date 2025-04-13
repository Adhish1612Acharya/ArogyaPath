import express from 'express';
import wrapAsync  from '../utils/wrapAsync';
import SuccessStory from '../models/SuccessStory'; // Import the SuccessStory model

const router = express.Router();

// -------------------- 1. Create SuccessStory --------------------
router.post('/successstory', wrapAsync(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  const newSuccessStory = new SuccessStory({
    title,
    description,
    owner: req.user._id,
    ownerType: req.user.constructor.modelName, // 'User' or 'Expert'
  });

  await newSuccessStory.save();

  return res.status(201).json({
    message: 'Success story created successfully',
    data: newSuccessStory
  });
}));

// -------------------- 2. Get All SuccessStories --------------------
router.get('/successstories', wrapAsync(async (req, res) => {
  const successStories = await SuccessStory.find(); // Fetch all success stories
  return res.status(200).json({
    message: 'Success stories retrieved successfully',
    data: successStories,
  });
}));

// -------------------- 3. Get a Single SuccessStory --------------------
router.get('/successstory/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const successStory = await SuccessStory.findById(id);
  
  if (!successStory) {
    return res.status(404).json({ message: 'Success story not found' });
  }

  return res.status(200).json({
    message: 'Success story retrieved successfully',
    data: successStory,
  });
}));

// -------------------- 4. Update SuccessStory --------------------
router.put('/successstory/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updatedSuccessStory = await SuccessStory.findByIdAndUpdate(id, req.body, {
    runValidators:true,
    new: true, // Return the updated document
  }); // Use runValidators to ensure validation on update

  if (!updatedSuccessStory) {
    return res.status(404).json({ message: 'Success story not found' });
  }

  return res.status(200).json({
    message: 'Success story updated successfully',
    data: updatedSuccessStory,
  });
}));

// -------------------- 5. Delete SuccessStory --------------------
router.delete('/successstory/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const deletedSuccessStory = await SuccessStory.findByIdAndDelete(id);

  if (!deletedSuccessStory) {
    return res.status(404).json({ message: 'Success story not found' });
  }

  return res.status(200).json({
    message: 'Success story deleted successfully',
    data: deletedSuccessStory,
  });
}));

// -------------------- 6. Verify SuccessStory (Add Verification) --------------------
router.post('/successstory/:id/verify', wrapAsync(async (req, res) => {
    const { id } = req.params;
  
    // Check if the authenticated user is an instance of the Expert model
    if (req.user.constructor.modelName !== "Expert") {
      return res.status(403).json({ message: 'Only experts can verify success stories' });
    }
  
    // Get the expert's ID from the authenticated user
    const expertId = req.user._id;
  
    // Find the success story by ID
    const successStory = await SuccessStory.findById(id);
  
    if (!successStory) {
      return res.status(404).json({ message: 'Success story not found' });
    }
  
    // Check if the success story already has less than 5 verifications
    if (successStory.verification.length < 5) {
      // Add the expert's ID to the verification array
      successStory.verification.push(expertId);
      await successStory.save();
  
      return res.status(200).json({
        message: 'Success story verified successfully',
        data: successStory,
      });
    } else {
      return res.status(400).json({ message: 'Cannot exceed 5 verifications' });
    }
  }));
  
export default router;

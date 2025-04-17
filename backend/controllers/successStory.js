import SuccessStory from "../models/SuccessStory/SuccessStory.js";

// 1. Create a Success Story
export const createSuccessStory = async (req, res) => {
  const { title, description,filters,routines, } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required." });
  }

  const newSuccessStory = new SuccessStory({
    title,
    description,
    owner: req.user._id,
    ownerType: req.user.constructor.modelName,
  });

  await newSuccessStory.save();

  return res.status(201).json({
    message: "Success story created successfully",
    data: newSuccessStory,
  });
};

// 2. Get All Success Stories
export const getAllSuccessStories = async (req, res) => {
  const successStories = await SuccessStory.find();
  return res.status(200).json({
    message: "Success stories retrieved successfully",
    data: successStories,
  });
};

// 3. Get a Single Success Story
export const getSingleSuccessStory = async (req, res) => {
  const { id } = req.params;
  const successStory = await SuccessStory.findById(id);

  if (!successStory) {
    return res.status(404).json({ message: "Success story not found" });
  }

  return res.status(200).json({
    message: "Success story retrieved successfully",
    data: successStory,
  });
};

// 4. Update Success Story
export const updateSuccessStory = async (req, res) => {
  const { id } = req.params;
  const updatedSuccessStory = await SuccessStory.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!updatedSuccessStory) {
    return res.status(404).json({ message: "Success story not found" });
  }

  return res.status(200).json({
    message: "Success story updated successfully",
    data: updatedSuccessStory,
  });
};

// 5. Delete Success Story
export const deleteSuccessStory = async (req, res) => {
  const { id } = req.params;
  const deletedSuccessStory = await SuccessStory.findByIdAndDelete(id);

  if (!deletedSuccessStory) {
    return res.status(404).json({ message: "Success story not found" });
  }

  return res.status(200).json({
    message: "Success story deleted successfully",
    data: deletedSuccessStory,
  });
};

// 6. Verify Success Story
export const verifySuccessStory = async (req, res) => {
  const { id } = req.params;

  if (req.user.constructor.modelName !== "Expert") {
    return res.status(403).json({ message: "Only experts can verify success stories" });
  }

  const expertId = req.user._id;
  const successStory = await SuccessStory.findById(id);

  if (!successStory) {
    return res.status(404).json({ message: "Success story not found" });
  }

  if (successStory.verification.length < 5) {
    successStory.verification.push(expertId);
    await successStory.save();

    return res.status(200).json({
      message: "Success story verified successfully",
      data: successStory,
    });
  } else {
    return res.status(400).json({ message: "Cannot exceed 5 verifications" });
  }
};

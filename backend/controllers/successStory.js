import Expert from "../models/Expert/Expert.js";
import SuccessStory from "../models/SuccessStory/SuccessStory.js";
import User from "../models/User/User.js";

// 1. Create a Success Story
export const createSuccessStory = async (req, res) => {
  const { title, description, filters, routines, tagged } = req.body;

  const mediaFiles = req.files; // Cast for type hint

  console.log("req.body", req.body);
  console.log("Media Files:", mediaFiles);

  const media = {
    images: [],
    video: null,
    document: null,
  };

  // Cloudinary stores file URLs in `path`
  mediaFiles.forEach((file) => {
    const mimeType = file.mimetype;

    if (mimeType.startsWith("image/")) {
      media.images.push(file.path); // Cloudinary gives the URL in `path`
    } else if (mimeType.startsWith("video/")) {
      media.video = file.path;
    } else if (mimeType === "application/pdf") {
      media.document = file.path;
    }
  });

  console.log("Processed media:", media);

  console.log("NewPost", {
    title,
    description,
    media: media,
    filters: filters,
    tagged: tagged,
    routines: routines,
    owner: req.user._id,
  });

  const newSuccessStory = await SuccessStory.create({
    title,
    description,
    media: media,
    filters: filters,
    tagged: tagged,
    routines: routines,
    owner: req.user._id,
  });

  if (tagged.length > 0) {
    await Expert.updateMany(
      { _id: { $in: tagged } },
      { $push: { taggedPosts: newSuccessStory._id } }
    );
  }

  await User.findByIdAndUpdate(req.user._id, {
    $push: { taggedPosts: newSuccessStory._id },
  });

  // Return success message with created post
  return res.status(200).json({
    message: "Post created",
    success: true,
    postId: newSuccessStory._id,
    userId: req.user._id,
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
  const updatedSuccessStory = await SuccessStory.findByIdAndUpdate(
    id,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

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
    return res
      .status(403)
      .json({ message: "Only experts can verify success stories" });
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

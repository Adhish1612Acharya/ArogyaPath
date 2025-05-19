import Expert from "../models/Expert/Expert.js";
import SuccessStory from "../models/SuccessStory/SuccessStory.js";
import User from "../models/User/User.js";
import calculateReadTime from "../utils/calculateReadTime.js";
import transformSuccessStory from "../utils/transformSuccessStory.js";
import generateFilters from "../utils/geminiApiCalls/generateFilters.js";
import { sendEmail } from "../utils/sendEmail.js";
import ExpressError from "../utils/expressError.js";

// 1. Create a Success Story
export const createSuccessStory = async (req, res) => {
  const { title, description, routines, tagged } = req.body;
  const mediaFiles = req.cloudinaryFiles;
  const readTime = calculateReadTime({ title, description, routines });

  const media = {
    images: [],
    video: null,
    document: null,
  };

  //Cloudinary stores file URLs in `path`
  mediaFiles?.forEach((file) => {
    // Determine file type from Cloudinary response
    if (file.resource_type === "image") {
      media.images.push(file.secure_url);
    } else if (file.resource_type === "video") {
      media.video = file.secure_url;
    } else if (file.format === "pdf") {
      media.document = file.secure_url;
    }
  });

  //Generate categories using ONLY the description
  const filters = await generateFilters(title, description, routines);

  const newSuccessStory = await SuccessStory.create({
    title,
    description,
    media,
    filters,
    tagged,
    routines,
    readTime,
    owner: req.user._id,
  });

  // Update experts if tagged
  if (tagged.length > 0) {
    await Expert.updateMany(
      { _id: { $in: tagged } },
      { $push: { taggedPosts: newSuccessStory._id } }
    );
  }

  // Update current user
  await User.findByIdAndUpdate(req.user._id, {
    $push: { successStories: newSuccessStory._id },
  });

  // Notify each expert via email
  const expertsData = await Expert.find({ _id: { $in: tagged } });

  for (const [index, eachExpert] of expertsData.entries()) {
    const emailSubject = "You've Been Tagged - Please Verify a Success Story";

    const emailContent = `
  <h3>Hello Dr. ${eachExpert.profile?.fullName || eachExpert.username},</h3>
  <p>
    You've been <strong>tagged</strong> in a user's success story on <strong>ArogyaPath</strong>.
  </p>
  <p>
    We value your expertise and kindly request you to <strong>review and verify</strong> the story by visiting the link below:
  </p>
  <p>
    <a href="${process.env.VITE_API_URL}/success-stories/${
      newSuccessStory._id
    }" target="_blank">
      View and Verify the Story
    </a>
  </p>
  <p>
    If you believe this was an error or do not wish to be tagged, you may ignore this email.
  </p>
  <br />
  <p>Thank you,<br/>ArogyaPath Team</p>
`;

    await sendEmail(eachExpert.email, emailSubject, emailContent);
  }

  // Success response
  return res.status(200).json({
    message: "Post created",
    success: true,
    postId: newSuccessStory._id,
    userId: req.user._id,
  });
};

// 2. Get All Success Stories
export const getAllSuccessStories = async (req, res) => {
  const stories = await SuccessStory.find()
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage")
    .populate(
      "tagged",
      "_id profile.fullName profile.profileImage profile.expertType"
    )
    .populate(
      "verified",
      "_id profile.fullName profile.profileImage profile.expertType"
    );
  const userId = req.user._id.toString();

  const transformedSuccessStories = stories.map((story) => {
    const isTagged = story.tagged.some(
      (expert) => expert._id.toString() === userId
    );
    const alreadyVerified = story.verified.some(
      (expert) => expert._id.toString() === userId
    );

    const verifyAuthorization =
      (req.user.role === "expert" &&
        story.tagged.length === 0 &&
        !alreadyVerified &&
        story.verified.length < 5) ||
      (req.user.role === "expert" && isTagged && !alreadyVerified);

    return {
      ...story.toObject(),
      verifyAuthorization,
      alreadyVerified,
    };
  });

  return res.status(200).json({
    message: "Success stories retrieved successfully",
    success: true,
    successStories: transformedSuccessStories,
    userId: req.user._id,
  });
};

// 3. Get a Single Success Story
export const getSingleSuccessStory = async (req, res) => {
  const { id } = req.params;

  const successStory = await SuccessStory.findById(id)
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage")
    .populate(
      "tagged",
      "_id profile.fullName profile.profileImage profile.expertType"
    )
    .populate(
      "verified",
      "_id profile.fullName profile.profileImage profile.expertType"
    );

  if (!successStory) {
    return res.status(404).json({ message: "Success story not found" });
  }

  const userId = req.user._id.toString();

  const isTagged = successStory.tagged.some(
    (expert) => expert._id.toString() === userId
  );

  const alreadyVerified = successStory.verified.some(
    (expert) => expert._id.toString() === userId
  );

  const verifyAuthorization =
    (successStory.tagged.length === 0 &&
      successStory.verified.length < 5 &&
      !alreadyVerified) ||
    (isTagged && !alreadyVerified);

  const transformedSuccessStory = {
    ...successStory.toObject(),
    verifyAuthorization,
    alreadyVerified,
  };

  return res.status(200).json({
    message: "Success story retrieved successfully",
    success: true,
    successStory: transformedSuccessStory,
    userId: req.user._id,
    userRole: req.user.role,
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
  const expertId = req.user._id;

  const successStory = await SuccessStory.findByIdAndUpdate(
    id,
    {
      $addToSet: { verified: expertId },
    },
    { new: true } // So we get the updated doc with the new `verified` list
  );

  if (!successStory) {
    return res.status(404).json({
      success: false,
      message: "Success story not found",
    });
  }

  // Update Expert - push to verifiedPosts, remove from taggedPosts
  const expertDetails = await Expert.findByIdAndUpdate(
    expertId,
    {
      $addToSet: { verifiedPosts: id },
      $pull: { taggedPosts: id },
    },
    { new: true }
  ).select("_id profile.fullName profile.profileImage profile.expertType");

  return res.status(200).json({
    success: true,
    message: "Success story verified successfully",
    data: {
      id: successStory._id,
      verifiedCount: successStory.verified.length,
      expertDetails: expertDetails,
    },
  });
};

const filterSuccessStories = async (req, res) => {
  const { filters } = req.query;
  if (!filters) {
    throw new ExpressError(400, "Filters not provided");
  }

  const categoryArray = filters
    .split(",")
    .map((cat) => cat.toLowerCase().trim());

  console.log("Ctegory array : ", categoryArray);
  const successStories = await SuccessStory.find({
    filters: { $in: categoryArray },
  })
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage")
    .populate(
      "tagged",
      "_id profile.fullName profile.profileImage profile.expertType"
    )
    .populate(
      "verified",
      "_id profile.fullName profile.profileImage profile.expertType"
    );

  res.json({ success: true, message: "Filtered posts", successStories });
};

export default {
  createSuccessStory,
  getAllSuccessStories,
  getSingleSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  verifySuccessStory,
  filterSuccessStories,
};

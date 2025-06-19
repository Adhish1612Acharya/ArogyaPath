// middleware/handlePostCloudinaryUpload.js
import { cloudinaryUploadFilesWithCleanup } from "../../../utils/cloudinary/cloudinaryUploadFilesWithCleanup.js";
import ExpressError from "../../../utils/expressError.js";

export const handlePostCloudinaryUpload = async (req, res, next) => {
  if (!req.files || !req.files.media) return next();

  try {
    const uploaded = await cloudinaryUploadFilesWithCleanup(req.files, {
      folder: `arogyaPath_DEV/post_images/${req.user._id}`,
      tags: ["post_images"],
      context: {
        user_id: req.user._id,
        post_id: req.body.postId || "new",
      },
    });

    // Attach URLs to request
    req.cloudinaryUrls = req.files.media.map((_, i) => uploaded.media[i]?.url);
    next();
  } catch (error) {
    throw new ExpressError(
      500,
      "Error uploading post images: " + error.message
    );
  }
};

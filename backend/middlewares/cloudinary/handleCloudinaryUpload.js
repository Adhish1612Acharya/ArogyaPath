// middlewares/cloudinaryMiddleware.js
import { uploadToCloudinary } from "./cloudinaryUploadUtil.js";

export const handleCloudinaryUpload = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next();

    console.log("Files to upload:", req.files);

    const uploads = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );


    req.cloudinaryFiles = uploads; 
    next();
  } catch (err) {
    console.error("Cloudinary Upload Failed:", err);
    return res.status(500).json({ error: "Media upload failed" });
  }
};

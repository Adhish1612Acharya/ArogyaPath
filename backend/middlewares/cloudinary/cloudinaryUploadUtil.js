import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import ExpressError from "../../utils/expressError.js";

// Make sure cloudinary is already configured somewhere globally, or configure it here if needed
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary using a stream.
 * @param {Buffer} buffer - File buffer (from multer.memoryStorage)
 * @param {String} folder - Optional folder to upload to (default: "arogyaPath_DEV")
 * @returns {Promise<Object>} Cloudinary upload result (includes secure_url)
 */
export const uploadToCloudinary = (buffer, folder = "arogyaPath_DEV") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto", // Auto-detect image/video/pdf
      },
      (error, result) => {
        if (error) {
          // Throw an ExpressError instead of rejecting the promise
          reject(new ExpressError(500, "Cloudinary upload failed"));
        } else {
          resolve(result); // Contains secure_url, public_id, etc.
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { getCloudinaryResourceType } from "../../utils/getCloudinaryResourceType.js";
import ExpressError from "../../utils/expressError.js";

/**
 * Handles the upload of expert verification documents to Cloudinary.
 *
 * This middleware function processes uploaded files, stores them in Cloudinary,
 * and adds the resulting URLs to the request object for further processing.
 * It also manages error handling and cleanup of both Cloudinary and local temporary files.
 *
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.files - Uploaded files from multer middleware
 * @param {Object} req.user - User object from authentication middleware
 * @param {Object} req.user.profile - User profile information
 * @param {string} req.user.profile.fullName - Full name of the expert
 * @param {string} req.user._id - User ID
 * @param {Object} res - Express response object
 * @param {function} next - Express next middleware function
 * @throws {ExpressError} Throws a custom error if document upload fails
 * @returns {void}
 */
const handleExpertDocumentUpload = async (req, res, next) => {
  const tempFiles = [];
  try {
    const files = req.files;
    const uploadedUrls = {};

    const expertFolder = req.user.profile.fullName.replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );

    // Process each file type
    for (const [fieldName, fileArray] of Object.entries(files)) {
      const file = fileArray[0]; // Each field has only one file as per multer config
      tempFiles.push(file.path); // Keep track of temp files for cleanup

      // Get the appropriate resource type based on mimetype
      const resourceType = getCloudinaryResourceType(file.mimetype);

      // Upload to Cloudinary with specific folder structure
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `arogyaPath_DEV/expert_documents/${expertFolder}`,
        resource_type: resourceType,
        // Add tags for better organization
        tags: ["expert_verification", fieldName],
        // Add context metadata
        context: {
          user_id: req.user._id,
          document_type: fieldName,
        },
      });

      uploadedUrls[fieldName] = result.secure_url;
    }

    // Add uploaded URLs to request object for next middleware
    req.documentUrls = uploadedUrls;
    next();
  } catch (error) {
    // Clean up any uploaded files from Cloudinary if there's an error
    if (req.documentUrls) {
      for (const url of Object.values(req.documentUrls)) {
        try {
          const publicId = url.split("/").slice(-1)[0].split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (cleanupError) {
          console.error("Error cleaning up Cloudinary file:", cleanupError);
        }
      }
    }

    next(new ExpressError(500, "Error uploading documents: " + error.message));
  } finally {
    // Clean up temporary files from disk
    for (const filePath of tempFiles) {
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.error("Error cleaning up temporary file:", cleanupError);
      }
    }
  }
};

export default handleExpertDocumentUpload;

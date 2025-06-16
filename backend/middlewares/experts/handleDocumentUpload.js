import { v2 as cloudinary } from "cloudinary";
import ExpressError from "../../utils/expressError.js";
import { getCloudinaryResourceType } from "../../utils/getCloudinaryResourceType.js";

/**
 * Uploads expert verification documents to Cloudinary
 * Each document is uploaded to a specific folder based on its type
 */
export const handleDocumentUpload = async (req, res, next) => {
  try {
    const files = req.files;
    const uploadedUrls = {};

    // Process each file type
    for (const [fieldName, fileArray] of Object.entries(files)) {
      const file = fileArray[0]; // Each field has only one file as per multer config

      // Get the appropriate resource type based on mimetype
      const resourceType = getCloudinaryResourceType(file.mimetype);

      // Upload to Cloudinary with specific folder structure
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: `arogyaPath_DEV/expert_documents/${fieldName}`,
          resource_type: resourceType,
          // Add tags for better organization
          tags: ["expert_verification", fieldName],
          // Add context metadata
          context: {
            user_id: req.user._id,
            document_type: fieldName,
          },
        }
      );

      uploadedUrls[fieldName] = result.secure_url;
    }

    // Add uploaded URLs to request object for next middleware
    req.documentUrls = uploadedUrls;
    next();
  } catch (error) {
    // Clean up any uploaded files if there's an error
    if (req.documentUrls) {
      for (const url of Object.values(req.documentUrls)) {
        try {
          const publicId = url.split("/").slice(-1)[0].split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (cleanupError) {
          console.error("Error cleaning up uploaded file:", cleanupError);
        }
      }
    }

    next(new ExpressError(500, "Error uploading documents: " + error.message));
  }
};

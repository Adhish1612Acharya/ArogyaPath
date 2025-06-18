import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { getCloudinaryResourceType } from "../getCloudinaryResourceType.js";

/**
 * Upload multiple files to Cloudinary and clean up on error.
 * @param {Object} files - Multer files object (fieldName: [file, ...])
 * @param {Object} options
 * @param {string} options.folder - Cloudinary folder path
 * @param {Array|string} [options.tags] - Tags to add to each upload
 * @param {Object} [options.context] - Context metadata
 * @returns {Promise<Object>} - Resolves to { fieldName: { url, public_id, ... } }
 * @throws Error if upload fails (with cleanup)
 */
export async function cloudinaryUploadFilesWithCleanup(files, options = {}) {
  const { folder, tags = [], context = {} } = options;
  const uploaded = {};
  const tempFiles = [];
  const uploadedCloudinary = []; // Track { public_id, resource_type }

  try {
    for (const [fieldName, fileArray] of Object.entries(files)) {
      const file = fileArray[0];
      tempFiles.push(file.path);

      const resourceType = getCloudinaryResourceType(file.mimetype);

      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: resourceType,
        tags: Array.isArray(tags) ? tags : [tags],
        context: { ...context, document_type: fieldName },
      });

      uploaded[fieldName] = {
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
        original_filename: result.original_filename,
      };

      uploadedCloudinary.push({
        public_id: result.public_id,
        resource_type: result.resource_type,
      });
    }
    return uploaded;
  } catch (error) {
    // Cleanup: delete any uploaded files from Cloudinary
    for (const { public_id, resource_type } of uploadedCloudinary) {
      try {
        await cloudinary.uploader.destroy(public_id, {
          resource_type,
          invalidate: true,
        });
      } catch (cleanupErr) {
        console.error("Error cleaning up Cloudinary file:", cleanupErr);
      }
    }
    throw error;
  } finally {
    // Cleanup local temp files
    for (const filePath of tempFiles) {
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.error("Error cleaning up temporary file:", cleanupError);
      }
    }
  }
}

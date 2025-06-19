import multer from "multer";
import ExpressError from "../../../utils/expressError.js";
import { postImageUpload } from "../../../utils/cloudinary/postImageUploadConfig.js";

export const handlePostImageDiskUpload = (req, res, next) =>
  postImageUpload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            throw new ExpressError(
              400,
              "File size too large. Maximum 10MB per file"
            );
          case "LIMIT_FILE_COUNT":
            throw new ExpressError(
              400,
              "Too many files. Maximum 5 images allowed"
            );
          case "LIMIT_UNEXPECTED_FILE":
            throw new ExpressError(
              400,
              "Invalid field name. Use 'media' for uploads"
            );
          default:
            throw new ExpressError(400, "File upload error: " + err.message);
        }
      } else if (err) {
        throw new ExpressError(400, err.message);
      }
    }
    next();
  });

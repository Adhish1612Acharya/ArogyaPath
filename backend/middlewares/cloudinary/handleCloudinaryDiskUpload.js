import { documentUpload } from "./expertDocumentUploadConfig.js";
import multer from "multer";

export const handleCloudinaryDiskUpload = (req, res, next) =>
  documentUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        throw new ExpressError(400, "File size too large. Maximum size is 5MB");
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        throw new ExpressError(400, "Too many files. Maximum is 4 documents");
      }
      throw new ExpressError(400, err.message);
    } else if (err) {
      throw new ExpressError(400, err.message);
    }
    next();
  });

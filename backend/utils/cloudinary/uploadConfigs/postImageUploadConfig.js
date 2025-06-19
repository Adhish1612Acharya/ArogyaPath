import createMulterUploader from "../multerConfig.js";


export const postImageUpload = createMulterUploader({
  uploadDir: "uploads/temp/post-images",
  allowedFileTypes: [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "video/mp4",
    "application/pdf",
  ],
  maxFileSize: 5 * 1024 * 1024, //5MB
  fields: [{ name: "media", maxCount: 3 }],
});

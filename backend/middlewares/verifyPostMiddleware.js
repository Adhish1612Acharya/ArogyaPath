import axios from "axios";
import ExpressError from "../utils/expressError.js";
import { verifyMediaContent } from "../utils/geminiApiCalls/verifyMediaContent.js";
import { verifyTextContent } from "../utils/geminiApiCalls/verifyTextContent.js";
import FormData from "form-data";
import mime from "mime-types";
import fs from "fs/promises";

/**
 * Middleware to verify uploaded media and text using AI models.
 */
export const verifyPostData = async (req, res, next) => {
  const files = req.files.media || [];
  const { title = "", description = "", routines = [] } = req.body;

  // Combine all textual content including routines and potential PDF text
  let combinedText = `${title}\n${description}\n${routines.join(", ")}`;



  // Validate each uploaded file
  for (const file of files) {
    let { buffer, mimetype } = file;
    if (!buffer && file.path) {
      buffer = await fs.readFile(file.path);
    }
    if (!buffer) {
      throw new ExpressError(400, "File buffer missing. Check multer config.");
    }

    if (!mimetype && file.path) {
      mimetype = mime.lookup(file.path) || "application/octet-stream";
    }

    if (!mimetype) {
      throw new ExpressError(
        400,
        "File mimeType missing. Check multer config."
      );
    }

    // Handle images and videos using Gemini's media content verifier
    if (mimetype.startsWith("image/") || mimetype.startsWith("video/")) {
      const base64Content = buffer.toString("base64");
      const isValidMedia = await verifyMediaContent(base64Content, mimetype);
      if (!isValidMedia) {
        throw new ExpressError(
          400,
          `The uploaded ${
            mimetype.split("/")[0]
          } file failed content verification.`
        );
      }
    }

    // Handle PDFs by extracting text and verifying it
    else if (mimetype === "application/pdf") {
      // const text = await extractPdfText(buffer);
      const formData = new FormData();
      formData.append("file", file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
      const response = await axios.post(
        "https://pranavpai0309-pdf-parser.hf.space/PDF_Parser",
        formData,
        {
          headers: formData.getHeaders(), // Important for setting correct Content-Type boundary
        }
      );
      const isValidPdfText = await verifyTextContent(
        response.data.extracted_text
      );

      console.log("IsValid Pdf : ", isValidPdfText);

      if (!isValidPdfText) {
        throw new ExpressError(
          400,
          "The uploaded PDF contains invalid or harmful content."
        );
      }
    }

    // Reject unsupported media types
    else {
      throw new ExpressError(400, `Unsupported media type: ${mimetype}`);
    }
  }

  const isPostTextValid = await verifyTextContent(combinedText);
  if (!isPostTextValid) {
    throw new ExpressError(
      400,
      "Post content failed AI verification. Please revise your text."
    );
  }

  // All validations passed
  next();
};

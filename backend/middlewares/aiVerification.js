import PdfParse from "pdf-parse";
import { verifyMediaContent } from "../utils/geminiApiCalls/verifyMediaContent.js";
import { verifyTextContent } from "../utils/geminiApiCalls/verifyTextContent.js";

const parsePdfText = async (buffer) => {
  try {
    const { text } = await PdfParse(buffer);
    return text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("PDF parsing failed");
  }
};

/**
 * Middleware to verify uploaded media and text using AI models.
 */
export const verifyPostData = async (req, res, next) => {
  try {
    const files = req.files || [];
    const { title = "", description = "", routines = [] } = req.body;

    // Combine all textual content including routines and potential PDF text
    let combinedText = `${title}\n${description}\n${routines.join(", ")}`;

    // Validate each uploaded file
    for (const file of files) {
      const { buffer, mimetype } = file;

      // Handle images and videos using Gemini's media content verifier
      if (mimetype.startsWith("image/") || mimetype.startsWith("video/")) {
        const isValidMedia = await verifyMediaContent(buffer, mimetype);
        if (!isValidMedia) {
          return res.status(400).json({
            success: false,
            message: `The uploaded ${
              mimetype.split("/")[0]
            } file failed content verification.`,
          });
        }
      }

      // Handle PDFs by extracting text and verifying it
      else if (mimetype === "application/pdf") {
        try {
          const text = await parsePdfText(buffer);
          const isValidPdfText = await verifyTextContent(text);

          if (!isValidPdfText) {
            return res.status(400).json({
              success: false,
              message: "The uploaded PDF contains invalid or harmful content.",
            });
          }
        } catch (err) {
          console.error("PDF parsing failed:", err);
          return res.status(500).json({
            success: false,
            message: "Failed to process uploaded PDF file.",
          });
        }
      }

      // Reject unsupported media types
      else {
        return res.status(400).json({
          success: false,
          message: `Unsupported media type: ${mimetype}.`,
        });
      }
    }

    // Final check: validate the combined written content
    const isPostTextValid = await verifyTextContent(combinedText);
    if (!isPostTextValid) {
      return res.status(400).json({
        success: false,
        message:
          "Post content failed AI verification. Please revise your text.",
      });
    }

    // All validations passed
    next();
  } catch (error) {
    console.error("AI verification middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during post verification.",
    });
  }
};

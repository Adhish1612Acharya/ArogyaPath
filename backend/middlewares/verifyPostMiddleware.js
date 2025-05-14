import ExpressError from "../utils/expressError.js";
import extractPdfText from "../utils/extractTextFromPdf.js";
import { verifyMediaContent } from "../utils/geminiApiCalls/verifyMediaContent.js";
import { verifyTextContent } from "../utils/geminiApiCalls/verifyTextContent.js";

/**
 * Middleware to verify uploaded media and text using AI models.
 */
export const verifyPostData = async (req, res, next) => {
  const files = req.files || [];
  const { title = "", description = "", routines = [] } = req.body;

  // Combine all textual content including routines and potential PDF text
  let combinedText = `${title}\n${description}\n${routines.join(", ")}`;

  // Validate each uploaded file
  for (const file of files) {
    const { buffer, mimetype } = file;

 
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
        const text = await extractPdfText(buffer);
        console.log("Text : ", text);
        const isValidPdfText = await verifyTextContent(text);

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

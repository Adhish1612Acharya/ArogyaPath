import ExpressError from "../utils/expressError.js";

export const parseFormdata = (req, res, next) => {
  const arrayFields = ["filters", "routines", "tagged"];
  const objectFields = ["profile", "verificationDetails"];

  try {
    for (const field of arrayFields) {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          throw new ExpressError(`${field} must be a valid JSON array`, 400);
        }
      }
    }

    for (const field of objectFields) {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          throw new ExpressError(`${field} must be a valid JSON object`, 400);
        }
      }
    }

    console.log("Parsed FormData:", req.body);
    next();
  } catch (err) {
    next(err); // Pass to the central error handler
  }
};

// Custom error middleware for Cloudinary-related errors
export const cloudinaryErrorHandler = (err, req, res, next) => {
  if (err.name === "CloudinaryError" || err.message?.includes("Cloudinary")) {
    console.error("Cloudinary Error:", err);

    return res.status(500).json({
      success: false,
      message: "Cloudinary Error: Something went wrong with media upload.",
      details: err.message,
    });
  }

  // Pass to next error handler if not a Cloudinary error
  next(err);
};

export default { parseFormdata, cloudinaryErrorHandler };

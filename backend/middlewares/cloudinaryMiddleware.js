export const parseFormdata = (req, res, next) => {
  const fieldsToParse = ["filters", "routines", "tagged"]; // Add all array fields here

  for (const field of fieldsToParse) {
    if (req.body[field] && typeof req.body[field] === "string") {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        return res.status(400).json({
          error: `${field} must be a valid JSON array`,
        });
      }
    }
  }

  next();
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

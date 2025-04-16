export const parseFormdata = (req, res, next) => {
  // Parse filters string to actual array
  if (typeof req.body.filters === "string") {
    try {
      req.body.filters = JSON.parse(req.body.filters);
    } catch (err) {
      return res.status(400).json({ error: "Invalid filters format" });
    }
  }

  if (req.body.routines && typeof req.body.routines === "string") {
    try {
      req.body.routines = JSON.parse(req.body.routines);
    } catch (err) {
      return res.status(400).json({ error: "Invalid routines format" });
    }
  }
  // Parse other form data if needed
  if (req.body.data) {
    req.body = JSON.parse(req.body);
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

// export const parseFormdata = (req, res, next) => {
//   // Parse filters string to actual array
//   if (typeof req.body.filters === "string") {
//     try {
//       req.body.filters = JSON.parse(req.body.filters);
//     } catch (err) {
//       return res.status(400).json({ error: "Invalid filters format" });
//     }
//   }

//   if (req.body.routines && typeof req.body.routines === "string") {
//     try {
//       req.body.routines = JSON.parse(req.body.routines);
//     } catch (err) {
//       return res.status(400).json({ error: "Invalid routines format" });
//     }
//   }

//   if (req.body.tagged && typeof req.body.tagged === "string") {
//     try {
//       req.body.tagged = JSON.parse(req.body.tagged);
//     } catch (err) {
//       return res.status(400).json({ error: "Invalid routines format" });
//     }
//   }
//   // Parse other form data if needed
//   if (req.body.data) {
//     req.body = JSON.parse(req.body);
//   }

//   console.log("Parsed body:", req.body); // Debugging line to check parsed body
//   next();
// };

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

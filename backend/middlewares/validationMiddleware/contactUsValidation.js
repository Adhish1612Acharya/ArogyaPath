import { z } from "zod";

const contactUsSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function validateContactUs(req, res, next) {
  try {
    contactUsSchema.parse(req.body);
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: err.errors?.[0]?.message || "Invalid input" });
  }
}

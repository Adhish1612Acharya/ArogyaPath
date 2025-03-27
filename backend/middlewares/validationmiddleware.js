const { z } = require("zod");

// User Schema
const userSchemaZod = z.object({
  fullname: z.string().min(1, "Full name is required").max(50),
  email: z.string().email("Invalid email format"),
  age: z.number().int().min(1, "Age must be at least 1").max(120, "Age cannot exceed 120"),
  contact: z.string().regex(/^[0-9]{10}$/, "Contact must be exactly 10 digits"),
  username: z.string().min(3).max(20).optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional()
});

// Expert Schema
const expertSchemaZod = z.object({
  fullname: z.string().min(1, "Full name is required").max(50),
  email: z.string().email("Invalid email format"),
  contact: z.string().regex(/^[0-9]{10}$/, "Contact must be exactly 10 digits"),
  profile: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    experience: z.number().min(0, "Experience cannot be negative"),
    qualification: z.string().min(1, "Qualification is required"),
    specialization: z.string().min(1, "Specialization is required")
  }),
  isVerified: z.boolean().optional()
});

// Post Schema
const postSchemaZod = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  media: z.object({
    images: z.array(z.string().url("Invalid image URL")).max(5, "Maximum 5 images allowed").optional(),
    videos: z.array(z.string().url("Invalid video URL")).max(2, "Maximum 2 videos allowed").optional(),
    documents: z.array(z.string().url("Invalid document URL")).max(3, "Maximum 3 documents allowed").optional()
  }).optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").optional(),
  isPublished: z.boolean().optional()
});

module.exports = { userSchemaZod, expertSchemaZod, postSchemaZod };

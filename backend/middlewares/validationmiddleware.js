import { z } from "zod";

// User Schema
export const userSchemaZod = z.object({
  fullname: z.string().min(1, "Full name is required").max(50),
  email: z.string().email("Invalid email format"),
  age: z
    .number()
    .int()
    .min(1, "Age must be at least 1")
    .max(120, "Age cannot exceed 120"),
  contact: z.string().regex(/^[0-9]{10}$/, "Contact must be exactly 10 digits"),
  username: z.string().min(3).max(20).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

// Expert Schema
export const expertSchemaZod = z.object({
  fullname: z.string().min(1, "Full name is required").max(50),
  email: z.string().email("Invalid email format"),
  contact: z.string().regex(/^[0-9]{10}$/, "Contact must be exactly 10 digits"),
  profile: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    experience: z.number().min(0, "Experience cannot be negative"),
    qualification: z.string().min(1, "Qualification is required"),
    specialization: z.string().min(1, "Specialization is required"),
  }),
  isVerified: z.boolean().optional(),
});

// Post Schema
export const postSchemaZod = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  media: z.object({
    image: z.array(z.string()).default([]),
    video: z.array(z.string()).default([]),
    document: z.array(z.string()).default([]),
  }),
  category: z.array(z.string()).min(1, "At least one category is required"),
  successStory: z.boolean(),
  ownerType: z.enum(["User", "Expert"]),
  owner: z.string().min(1, "Owner ID is required"), // Assuming ObjectId is a string
  tags: z.array(z.string()).default([]), // Assuming ObjectId is a string
});


export default { userSchemaZod, expertSchemaZod, postSchemaZod };

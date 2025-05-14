import { z } from "zod";

// Utility for MongoDB ObjectId
const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");

// -------------------- User Schema --------------------
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

// -------------------- Expert Schema --------------------
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

// -------------------- Post Schema --------------------
export const postSchemaZod = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export const routineSchemaZod = z.object({
  title: z.string(),
  description: z.string(),
  routines: z.array(
    z.object({
      time: z.string().min(1, "Time is required"),
      content: z.string().min(1, "Content is required"),
    })
  ).min(1, "At least one routine is required"),
});

// -------------------- SuccessStory Schema --------------------
export const successStorySchemaZod = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tagged: z.array(objectIdSchema).max(5, "Cannot exceed 5 tagged experts"),
  routines: z.array(
    z.object({
      time: z.string().min(1, "Time is required"),
      content: z.string().min(1, "Content is required"),
    })
  ),
});

// -------------------- Comment Schema --------------------
export const commentSchemaZod = z.object({
  owner: objectIdSchema,
  content: z.string().min(1, "Content cannot be empty"),
  post: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid post ID")
    .optional(),
});

export const prakrithiSchema = z.object({
  Name: z.string(),
  Age: z.number().int().min(0),
  Gender: z.string(), // You can use z.enum(["Male", "Female", "Other"]) if values are limited
  Height: z.number().min(0),
  Weight: z.number().min(0),
  Body_Type: z.string(),
  Skin_Type: z.string(),
  Hair_Type: z.string(),
  Facial_Structure: z.string(),
  Complexion: z.string(),
  Eyes: z.string(),
  Food_Preference: z.string(),
  Bowel_Movement: z.string(),
  Thirst_Level: z.string(),
  Sleep_Duration: z.number().min(0).max(24),
  Sleep_Quality: z.string(),
  Energy_Levels: z.string(),
  Daily_Activity_Level: z.string(),
  Exercise_Routine: z.string(),
  Food_Habit: z.string(),
  Water_Intake: z.string(),
  Health_Issues: z.string(),
  Hormonal_Imbalance: z.string(),
  Skin_Hair_Problems: z.string(),
  Ayurvedic_Treatment: z.string(), // use z.enum(["Yes", "No"]) if values are limited
});

// -------------------- forgot Password Schema --------------------
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  role: z.enum(["user", "expert"]),
});

// -------------------- reset password Schema --------------------
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "expert"]),
});

// -------------------- expertProfileSchema --------------------
export const expertProfileSchema = z.object({
  contactNo: z
    .number()
    .min(1000000000, "Contact number must be at least 10 digits")
    .max(9999999999, "Contact number must be at most 10 digits"),
  // expertType: z.enum(["ayurvedic", "naturopathy"]),
  // profileImage: z.string().url().optional().or(z.literal("")),
  experience: z.number().min(0, "Experience must be a non-negative number"),
  // qualification: z.string().optional().or(z.literal("")),
  clinicAdress: z.string().optional().or(z.literal("")),
  specialization: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
});

// -------------------- userProfileSchema --------------------
export const userProfileSchema = z.object({
  contactNo: z
    .number()
    .min(1000000000, "Contact number must be at least 10 digits")
    .max(9999999999, "Contact number must be at most 10 digits"),
  // profileImage: z.string().url().optional().or(z.literal("")),
  age: z
    .number()
    .int()
    .min(1, "Age must be at least 1")
    .max(120, "Age cannot exceed 120"),
  healthGoal: z.string().optional().or(z.literal("")),
  // bio: z.string().optional().or(z.literal("")),
});

export default {
  userSchemaZod,
  expertSchemaZod,
  postSchemaZod,
  prakrithiSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  expertProfileSchema,
  userProfileSchema,
};

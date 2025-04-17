import { z } from "zod";

// Utility for MongoDB ObjectId
const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");

// -------------------- User Schema --------------------
export const userSchemaZod = z.object({
  fullname: z.string().min(1, "Full name is required").max(50),
  email: z.string().email("Invalid email format"),
  age: z.number().int().min(1, "Age must be at least 1").max(120, "Age cannot exceed 120"),
  contact: z.string().regex(/^[0-9]{10}$/, "Contact must be exactly 10 digits"),
  username: z.string().min(3).max(20).optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
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
  media: z.object({
    image: z.array(z.string()).max(5, "Cannot exceed 5 images").default([]),
    video: z.array(z.string()).max(5, "Cannot exceed 5 videos").default([]),
    document: z.array(z.string()).max(5, "Cannot exceed 5 documents").default([]),
  }),
  category: z.array(z.string()).min(1, "At least one category is required"),
  successStory: z.boolean(),
  ownerType: z.enum(["User", "Expert"]),
  owner: objectIdSchema,
});

// -------------------- Routine Schema --------------------
const fileSchema = z.object({
  path: z.string().optional(),
  filename: z.string().optional(),
});

export const routineSchemaZod = z.object({
  title: z.string(),
  description: z.string(),
  media: z.object({
    images: z.array(fileSchema).max(5, "Cannot exceed 5 images").optional(),
    videos: z.array(fileSchema).max(5, "Cannot exceed 5 videos").optional(),
    documents: z.array(fileSchema).max(5, "Cannot exceed 5 documents").optional()
  }).optional(),
  owner: objectIdSchema,
  ownerType: z.enum(["User", "Expert"]),
  filters: z.array(z.string()),
  routines: z.array(z.object({
    time: z.string(),
    content: z.string()
  }))
});

// -------------------- SuccessStory Schema --------------------
export const successStorySchemaZod = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  media: z.object({
    images: z.array(fileSchema).max(5, "Cannot exceed 5 images").optional(),
    videos: z.array(fileSchema).max(5, "Cannot exceed 5 videos").optional(),
    documents: z.array(fileSchema).max(5, "Cannot exceed 5 documents").optional()
  }).optional(),
  owner: objectIdSchema,
  ownerType: z.enum(["User", "Expert"]),
  filters: z.array(z.string()).min(1, "At least one filter is required"),
  tagged: z.array(objectIdSchema).max(5, "Cannot exceed 5 tagged experts").optional(),
  verification: z.array(objectIdSchema).max(5, "Cannot exceed 5 verifications").optional(),
}, { timestamps: true });

// -------------------- Comment Schema --------------------
export const commentSchemaZod = z.object({
  content: z.string().min(1, "Content cannot be empty"),
});


// -------------------- Export All --------------------
export default {
  userSchemaZod,
  expertSchemaZod,
  postSchemaZod,
  routineSchemaZod,
  successStorySchemaZod,
  commentSchemaZod,
  likeSchemaZod
};

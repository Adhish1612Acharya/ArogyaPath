<<<<<<< HEAD
import { userSchemaZod, expertSchemaZod, postSchemaZod,prakrathiSchema } from "./validationmiddleware.js"

export const validateUser = (req, res, next) => {
  const result = userSchemaZod.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.format() });
  req.validatedData = result.data;
  next();
};

export  const validateExpert = (req, res, next) => {
  const result = expertSchemaZod.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.format() });
  req.validatedData = result.data;
  next();
};

export  const validatePost = (req, res, next) => {
  console.log(req.body)
  const result = postSchemaZod.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.format() });
  next();
};
export const validateComment = (req, res, next) => {
  const result = commentSchemaZod.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.errors.map(err => err.message),
    });
  }
  req.validatedData = result.data; 
  next();
};

 function validatePrakrathi(req, res,next) {
  const result = prakrathiSchema.safeParse(req.body);

  if (!result.success) return res.status(400).json({ errors: result.error.format() });
  next();
}

export default { validateUser, validateExpert, validatePost, validateComment,validatePrakrathi};
=======
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
  filters: z.array(z.string()).min(1, "At least one filter is required"),
});

// -------------------- Routine Schema --------------------
const fileSchema = z.object({
  path: z.string().optional(),
  filename: z.string().optional(),
});

export const routineSchemaZod = z.object({
  title: z.string(),
  description: z.string(),
  filters: z.array(z.string()),
  routines: z.array(z.object({
    time: z.string().min(1, "Time is required"),
    content: z.string().min(1, "Content is required"),
  }))
});

// -------------------- SuccessStory Schema --------------------
export const successStorySchemaZod = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  filters: z.array(z.string()).min(1, "At least one filter is required"),
  tagged: z.array(objectIdSchema).max(5, "Cannot exceed 5 tagged experts"),
  routines: z.array(z.object({
    time: z.string().min(1, "Time is required"),
    content: z.string().min(1, "Content is required"),
  })),
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

export default { userSchemaZod, expertSchemaZod, postSchemaZod };
>>>>>>> 2dd9d80d970fa5242884bf336f035f4f84347d40

import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;
const objectIdSchema = z
  .string()
  .regex(objectIdRegex, "Invalid MongoDB ObjectId");

// -------------------- Auth Schemas --------------------
export const userSignupSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(50),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
  // ),
});

export const expertSignupSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(50),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{3,}$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
  // )
  expertType: z.enum(["ayurvedic", "naturopathy"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password is required"),
});

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
  routines: z
    .array(
      z.object({
        time: z.string().min(1, "Time is required"),
        content: z.string().min(1, "Content is required"),
      })
    )
    .min(1, "At least one routine is required"),
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

// Validation Schema for "POST /experts/complete-profile"

// Expert profile validation schema
export const expertProfileSchema = z.object({
  profile: z.object({
    contactNo: z
      .number()
      .min(1000000000, "Contact number must be a 10-digits number.")
      .max(9999999999, "Contact number must be a 10-digits number."),
    expertType: z.enum(["ayurvedic", "naturopathy"]),
    experience: z
      .number()
      .min(0, "Experience must be non-negative.")
      .default(0),
    qualifications: z.array(
      z.object({
        degree: z.string().min(1, "Degree is required"),
        college: z.string().min(1, "College/Institution name is required"),
        year: z.string().min(1, "Year of completion is required"),
      })
    ),
    address: z.object({
      country: z.string().default("Bharat"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6-digits"),
      clinicAddress: z.string().default(""),
    }),
    specialization: z.array(z.string()).default([]),
    bio: z.string().default(""),
    languagesSpoken: z.array(z.string()).default([]),
  }),

  verificationDetails: z.object({
    dateOfBirth: z.string().datetime("Invalid ISO datetime"),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Gender is required",
    }),
    registrationDetails: z.object({
      registrationNumber: z.string().min(1, "Registration number is required"),
      registrationCouncil: z
        .string()
        .min(1, "Registration council is required"),
      yearOfRegistration: z
        .number()
        .min(1900, "Year must be valid")
        .max(new Date().getFullYear(), "Year must be <= current year"),
    }),
  }),
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

export const chatRequestSchemaZod = z
  .object({
    chatType: z.enum(["private", "group"]),
    groupName: z.string().optional(),
    users: z.array(
      z.object({
        user: objectIdSchema,
        userType: z.enum(["User", "Expert"]),
      })
    ),
    chatReason: z.object({
      similarPrakrithi: z.boolean(),
      otherReason: z.string().nullable().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    // Check for duplicate user IDs
    const userIds = data.users?.map((u) => u.user?.toString());
    const duplicates = userIds?.filter(
      (id, index) => userIds.indexOf(id) !== index
    );

    if (duplicates && duplicates.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate user IDs are not allowed.",
        path: ["users"],
      });
    }

    // Check for valid MongoDB ObjectIds
    const invalidUserIds = userIds?.filter((id) => !objectIdRegex.test(id));
    if (invalidUserIds && invalidUserIds.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid user ID(s): ${invalidUserIds.join(", ")}`,
        path: ["users"],
      });
    }

    if (data.chatType === "group") {
      if (!data.users || data.users.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Group chat must have at least 2 users.",
          path: ["users"],
        });
      }
      if (!data.groupName || data.groupName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Group name is required for group chat.",
          path: ["groupName"],
        });
      }
    } else if (data.chatType === "private") {
      if (!data.users || data.users.length !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Private chat must have exactly 1 user.",
          path: ["users"],
        });
      }
      if (data.groupName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Group name should not be present for private chat.",
          path: ["groupName"],
        });
      }
    }
  });

export const usersIdsSchema = z
  .object({
    participants: z
      .array(
        z.object({
          userType: z.enum(["User", "Expert"]),
          user: z.string().regex(objectIdRegex, "Invalid ObjectId format"),
        })
      )
      .nonempty("Participants array must contain at least one valid ObjectId"),
  })
  .refine(
    (data) => {
      const userIds = data.participants.map((p) => p.user);
      const uniqueUserIds = new Set(userIds);
      return userIds.length === uniqueUserIds.size;
    },
    {
      path: ["participants"],
      message: "Duplicate users are not allowed in participants array",
    }
  );

export default {
  userSchemaZod,
  expertSchemaZod,
  postSchemaZod,
  prakrithiSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  expertProfileSchema,
  userProfileSchema,
  usersIdsSchema,
  chatRequestSchemaZod,
};

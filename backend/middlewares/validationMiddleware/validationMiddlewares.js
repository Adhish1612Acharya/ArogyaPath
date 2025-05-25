import ExpressError from "../../utils/expressError.js";
import {
  userSchemaZod,
  expertSchemaZod,
  postSchemaZod,
  routineSchemaZod,
  successStorySchemaZod,
  forgotPasswordSchema,
  resetPasswordSchema,
  expertProfileSchema,
  userProfileSchema,
  commentSchemaZod,
  prakrithiSchema,
  usersIdsSchema,
} from "./validationSchema.js";

export const validateUser = (req, res, next) => {
  const result = userSchemaZod.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, result.error.format());
  req.validatedData = result.data;
  next();
};

export const validateExpert = (req, res, next) => {
  const result = expertSchemaZod.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, result.error.format());
  req.validatedData = result.data;
  next();
};

export const validatePost = (req, res, next) => {
  const result = postSchemaZod.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, result.error.format());
  next();
};

export const validateRoutine = (req, res, next) => {
  console.log(req.body);
  const result = routineSchemaZod.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, result.error.format());
  next();
};

export const validateSuccessStory = (req, res, next) => {
  const result = successStorySchemaZod.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, result.error.format());
  next();
};

export const validateComment = (req, res, next) => {
  const result = commentSchemaZod.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.errors.map((err) => err.message),
    });
  }
  req.validatedData = result.data;
  next();
};

export const validatePrakrathi = (req, res, next) => {
  const result = prakrithiSchema.safeParse(req.body);

  if (!result.success) throw new ExpressError(400, result.error.format());
  next();
};

export const validateForgotPassword = (req, res, next) => {
  const result = forgotPasswordSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, result.error.format());
  next();
};

export const validateResetPassword = (req, res, next) => {
  const result = resetPasswordSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, result.error.format());
  next();
};

export const validateExpertCompleteProfile = (req, res, next) => {
  const result = expertProfileSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, result.error.format());
  next();
};

export const validateUserCompleteProfile = (req, res, next) => {
  console.log("User Profile body : ", req.body);
  const result = userProfileSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, result.error.format());
  next();
};

export const validateChatUsersIds = (req, res, next) => {
  const result = usersIdsSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, result.error.format());
  next();
};

export default {
  validateUser,
  validateExpert,
  validatePost,
  validateComment,
  validatePrakrathi,
  validateForgotPassword,
  validateResetPassword,
  validateExpertCompleteProfile,
  validateUserCompleteProfile,
  validateChatUsersIds,
};

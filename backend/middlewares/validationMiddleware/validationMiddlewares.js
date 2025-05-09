import {
  userSchemaZod,
  expertSchemaZod,
  postSchemaZod,
  routineSchemaZod,
  successStorySchemaZod,
} from "./validationSchema.js";

export const validateUser = (req, res, next) => {
  const result = userSchemaZod.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.format() });
  req.validatedData = result.data;
  next();
};

export const validateExpert = (req, res, next) => {
  const result = expertSchemaZod.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.format() });
  req.validatedData = result.data;
  next();
};

export const validatePost = (req, res, next) => {
  const result = postSchemaZod.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.format() });
  next();
};

export const validateRoutine = (req, res, next) => {
  console.log(req.body);
  const result = routineSchemaZod.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.format() });
  next();
};

export const validateSuccessStory = (req, res, next) => {
  const result = successStorySchemaZod.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.format() });
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



// export default { validateUser, validateExpert, validatePost, validateComment };

// <<<<<<< HEAD
// import { userSchemaZod, expertSchemaZod, postSchemaZod,prakrathiSchema } from "./validationmiddleware.js"

// export const validateUser = (req, res, next) => {
//   const result = userSchemaZod.safeParse(req.body);
//   if (!result.success) return res.status(400).json({ errors: result.error.format() });
//   req.validatedData = result.data;
//   next();
// };

// export  const validateExpert = (req, res, next) => {
//   const result = expertSchemaZod.safeParse(req.body);
//   if (!result.success) return res.status(400).json({ errors: result.error.format() });
//   req.validatedData = result.data;
//   next();
// };

// export  const validatePost = (req, res, next) => {
//   console.log(req.body)
//   const result = postSchemaZod.safeParse(req.body);
//   if (!result.success) return res.status(400).json({ errors: result.error.format() });
//   next();
// };
// export const validateComment = (req, res, next) => {
//   const result = commentSchemaZod.safeParse(req.body);

//   if (!result.success) {
//     return res.status(400).json({
//       error: result.error.errors.map(err => err.message),
//     });
//   }
//   req.validatedData = result.data; 
//   next();
// };

 function validatePrakrathi(req, res,next) {
  const result = prakrathiSchema.safeParse(req.body);

  if (!result.success) return res.status(400).json({ errors: result.error.format() });
  next();
}

export default { validateUser, validateExpert, validatePost, validateComment,validatePrakrathi};

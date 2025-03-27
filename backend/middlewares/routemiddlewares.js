const { userSchemaZod, expertSchemaZod, postSchemaZod } = require("./validationmiddlewares");

const validateUser = (req, res, next) => {
  const result = userSchemaZod.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.format() });
  req.validatedData = result.data;
  next();
};

const validateExpert = (req, res, next) => {
  const result = expertSchemaZod.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.format() });
  req.validatedData = result.data;
  next();
};

const validatePost = (req, res, next) => {
  const result = postSchemaZod.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.format() });
  req.validatedData = result.data;
  next();
};

module.exports = { validateUser, validateExpert, validatePost };

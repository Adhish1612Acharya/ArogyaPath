import express from "express";
import sendContactUsEmail from "../controllers/contactUsController.js";
import validateContactUs from "../middlewares/validationMiddleware/contactUsValidation.js";

const router = express.Router();

// POST /api/contact
router.post("/", validateContactUs, sendContactUsEmail);

export default router;

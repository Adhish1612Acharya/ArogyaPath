import express from "express";
import axios from "axios";

import Prakrithi from "../models/Prakrathi/Prakrathi.js";
import { validatePrakrathi } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import wrapAsync from "../utils/wrapAsync.js";
import { checkUserLogin } from "../middlewares/users/auth.js";
import prakrithiAnalysisController from "../controllers/prakrithi.js";

const router = express.Router();

router.post(
  "/",
  checkUserLogin,
  validatePrakrathi,
  wrapAsync(prakrithiAnalysisController.findPrakrithi)
);

router.get(
  "/similar_users",
  wrapAsync(prakrithiAnalysisController.findSimilarPrakrithiUsers)
);

export default router;

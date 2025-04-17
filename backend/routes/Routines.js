import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine,
} from "../controllers/routine.js";
import { validateRoutine } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import { checkExpertLogin } from "../middlewares/experts/auth.js";
import { storage } from "../cloudConfig.js";
import multer from "multer";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import { parseFormdata } from "../middlewares/cloudinaryMiddleware.js";
const upload = multer({ storage });

const router = express.Router();

router.post(
  "/",
  checkExpertLogin,
  upload.single("thumbnail"),
  parseFormdata,
  validateRoutine,
  wrapAsync(createRoutine)
);

router.get("/", isLoggedIn, wrapAsync(getAllRoutines));

router.get("/:id", isLoggedIn, wrapAsync(getRoutineById));

router.put(
  "/:id",
  checkExpertLogin,
  upload.single("thumbnail"),
  parseFormdata,
  validateRoutine,
  wrapAsync(updateRoutine)
);
router.delete("/:id", checkExpertLogin, wrapAsync(deleteRoutine));

export default router;

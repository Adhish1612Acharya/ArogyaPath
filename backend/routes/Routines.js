import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine,
} from "../controllers/routine.js";

const router = express.Router();

router.post("/", wrapAsync(createRoutine));
router.get("/", wrapAsync(getAllRoutines));
router.get("/:id", wrapAsync(getRoutineById));
router.put("/:id", wrapAsync(updateRoutine));
router.delete("/:id", wrapAsync(deleteRoutine));

export default router;

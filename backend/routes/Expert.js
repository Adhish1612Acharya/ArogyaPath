const express = require("express");
const Expert = require("../models/Expert/Expert");
const validateExpert = require("../middlewares/routemiddlewares");
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

// Get all experts
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const experts = await Expert.find();
    res.status(200).json(experts);
  })
);

// Create a new expert
router.post(
  "/",
  validateExpert,
  wrapAsync(async (req, res) => {
    const expert = new Expert(req.body);
    await expert.save();
    res.status(201).json({ message: "Expert created", expert });
  })
);

// Get an expert by ID
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ error: "Expert not found" });

    res.status(200).json(expert);
  })
);

// Delete an expert by ID
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) return res.status(404).json({ error: "Expert not found" });

    res.status(200).json({ message: "Expert deleted" });
  })
);

// Update an expert by ID
router.put(
  "/:id",
  validateExpert,
  wrapAsync(async (req, res) => {
    const updatedExpert = await Expert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedExpert) return res.status(404).json({ error: "Expert not found" });

    res.status(200).json({ message: "Expert updated", expert: updatedExpert });
  })
);

module.exports = router;

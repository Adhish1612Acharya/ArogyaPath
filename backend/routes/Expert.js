import express from "express";
import Expert from "../models/Expert/Expert.js";

import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import { searchDoctors } from "../controllers/expert.js";

// //search doctors
// router.get("/search/doctors", isLoggedIn, wrapAsync(searchDoctors));

// // Get all experts
// router.get(
//   "/",
//   wrapAsync(async (req, res) => {
//     const experts = await Expert.find().populate("posts");
//     res.status(200).json(experts);
//   })
// );

// // Create a new expert
// router.post(
//   "/",
//   // validateExpert,
//   wrapAsync(async (req, res) => {
//     const expert = new Expert(req.body);
//     await expert.save();
//     res.status(201).json({ message: "Expert created", expert });
//   })
// );

// // Get an expert by ID
// router.get(
//   "/:id",
//   wrapAsync(async (req, res) => {
//     const expert = await Expert.findById(req.params.id);
//     if (!expert) return res.status(404).json({ error: "Expert not found" });

//     res.status(200).json(expert);
//   })
// );

// // Delete an expert by ID
// router.delete(
//   "/:id",
//   wrapAsync(async (req, res) => {
//     const expert = await Expert.findByIdAndDelete(req.params.id);
//     if (!expert) return res.status(404).json({ error: "Expert not found" });

//     res.status(200).json({ message: "Expert deleted" });
//   })
// );

// // Update an expert by ID
// router.put(
//   "/:id",
//   // validateExpert,
//   wrapAsync(async (req, res) => {
//     const updatedExpert = await Expert.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updatedExpert)
//       return res.status(404).json({ error: "Expert not found" });

//     res.status(200).json({ message: "Expert updated", expert: updatedExpert });
//   })
// );

// export default router;

const router = express.Router();

router.get(
  "/expert/:id",
  wrapAsync(async (req, res) => {
    // const expert = await Expert.findById(req.params.id)
    //   .select("-posts -routinePosts -taggedPosts -verifiedPosts -salt -hash");//specifies the feild that needs to be sent

    const expert= await Expert.findById(req.params._id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.json(expert);
  })
);

router.put(
  "/expert/edit/:id",
  wrapAsync(async (req, res) => {
    const { username, email, role, profile } = req.body;

    const updatedExpert = await Expert.findByIdAndUpdate(
      req.params.id,
      {
        username: username,
        email: email,
        role: role,
        profile: profile, 
      },
      { new: true, runValidators: true } 
    );

    if (!updatedExpert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.json(updatedExpert);
  })
);

router.post(
  "/expert/:id",
  wrapAsync(async (req, res) => {
    const { username, email, role, profile } = req.body;

    // Create the expert with completeProfile set to true
    const newExpert = new Expert({
      username: username,
      email: email,
      role: role || "expert", 
      profile: profile,
      completeProfile: true, 
    });

    await newExpert.save();

    res.json(newExpert);
  })
);

export default router;
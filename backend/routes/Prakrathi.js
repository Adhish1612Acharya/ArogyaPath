import express from 'express';
import axios from 'axios';
import Prakrathi from '../models/Prakrathi/Prakrathi.js';
import { validatePrakrathi } from '../middlewares/validationMiddleware/validationSchema.js'; // adjust path if needed
import wrapAsync from '../utils/wrapAsync.js'; // your async wrapper utility

const router = express.Router();

router.post(
  '/prakrathi',
  validatePrakrathi,
  wrapAsync(async (req, res) => {
    const userId = req.user._id;

    // Send validated data to external API
    const { data: result } = await axios.post(
      'https://prakritianalysis.onrender.com/generate_pdf',
      req.body
    );

    // Save response to DB
    const newEntry = new Prakrathi({
      user: userId,
      Name: req.body.Name,
      Age: req.body.Age,
      Gender: req.body.Gender,
      Dominant_Prakrithi: result.Dominant_Prakrithi,
      Body_Constituents: result.Body_Constituents,
      Recommendations: result.Recommendations,
      Potential_Health_Concerns: result.Potential_Health_Concerns
    });

    await newEntry.save();

    res.status(201).json({ success: true, data: newEntry });
  })
);

router.get(
    '/prakrathi/similar_users',
    wrapAsync(async (req, res) => {
      const userId = req.user._id;
  
      // Get current user's prakrithi
      const currentUserEntry = await Prakrathi.findOne({ user: userId });
  
      if (!currentUserEntry) {
        return res.status(404).json({ success: false, message: 'Prakrathi data not found for this user.' });
      }
  
      const dominant = currentUserEntry.Dominant_Prakrithi;
  
      // Find users with the same dominant prakrithi, excluding current user
      const similarUsers = await Prakrathi.find({
        Dominant_Prakrithi: dominant,
        user: { $ne: userId }   
      });
  
      res.json({ success: true, similarUsers });
    })
  );
  


export default router;

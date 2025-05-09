import express from 'express';
import axios from 'axios';
import Prakrathi from '../models/UserProfile.js';
import { validatePrakrathi } from '../middlewares/validatePrakrathi.js';
import { wrapAsync } from '../utils/wrapAsync.js';

const router = express.Router();

router.post(
  "/prakrithi",validatePrakrathi,
  wrapAsync(async (req, res) => {
    const inputData = req.body;
    const { data: result } = await axios.post(
      "https://prakritianalysis.onrender.com/generate_pdf",
      inputData
    );

    // Combine user input and model response
    const prakrithiData = {
      ...inputData, // Spread user input
      Dominant_Prakrithi: result.Dominant_Prakrithi,
      Body_Constituents: result.Body_Constituents,
      Recommendations: result.Recommendations,
      Potential_Health_Concerns: result.Potential_Health_Concerns,
    };

    // Save the combined data
    const newEntry = await Prakrithi.create(prakrithiData);

    // Send success response
    res.status(201).json({ success: true, data: newEntry });
  })
);




// router.get(
//     '/prakrathi/similar_users',
//     wrapAsync(async (req, res) => {
//       const userId = req.user._id;
  
//       // Get current user's prakrithi
//       const currentUserEntry = await Prakrathi.findOne({ user: userId });
  
//       if (!currentUserEntry) {
//         return res.status(404).json({ success: false, message: 'Prakrathi data not found for this user.' });
//       }
  
//       const dominant = currentUserEntry.Dominant_Prakrithi;
  
//       // Find users with the same dominant prakrithi, excluding current user
//       const similarUsers = await Prakrathi.find({
//         Dominant_Prakrithi: dominant,
//         user: { $ne: userId }   
//       });
  
//       res.json({ success: true, similarUsers });
//     })
//   );
  
  router.get(
    "/prakrathi/similar_users",
    wrapAsync(async (req, res) => {
      const userId = req.user._id;
  
      // 1. Get the current user's Prakrithi data from the database
      const currentUserEntry = await Prakrithi.findOne({ user: userId });
  
      // If no Prakrithi data is found for the user, return a 404 error
      if (!currentUserEntry) {
        return res.status(404).json({ success: false, message: "Prakrithi data not found for this user." });
      }
  
      // 2. Define the list of fields to compare between users
      const fieldsToCompare = [
        "Body_Type",
        "Skin_Type",
        "Hair_Type",
        "Facial_Structure",
        "Complexion",
        "Eyes",
        "Food_Preference",
        "Bowel_Movement",
        "Thirst_Level",
        "Sleep_Quality",
        "Energy_Levels",
        "Daily_Activity_Level",
        "Exercise_Routine",
        "Food_Habit",
        "Water_Intake",
        "Health_Issues",
        "Hormonal_Imbalance",
        "Skin_Hair_Problems",
        "Ayurvedic_Treatment",
      ];
  
      // 3. Get all other users' Prakrithi data from the database (excluding the current user)
      const otherUsers = await Prakrithi.find({ user: { $ne: userId } });
  
      // 4. Compare each other user's Prakrithi data with the current user's data and calculate similarity
      const similarUsers = otherUsers
        .map((user) => {
          let matches = 0;
  
          // For each field, check if it matches between the current user and the other user
          fieldsToCompare.forEach((field) => {
            if (currentUserEntry[field] === user[field]) {
              matches++;  // Increment match count if values are the same
            }
          });
  
          // Calculate the similarity percentage based on the number of matching fields
          const similarityPercentage = (matches / fieldsToCompare.length) * 100;
  
          return { user, similarityPercentage };
        })
        // Filter users to include only those with a similarity of at least 70%
        .filter(({ similarityPercentage }) => similarityPercentage >= 70)
        // Sort the users by similarity percentage in descending order
        .sort((a, b) => b.similarityPercentage - a.similarityPercentage); 
  
      // 5. Return the list of similar users (excluding similarity percentage in the response)
      res.json({ success: true, similarUsers: similarUsers.map(({ user }) => user) });
    })
  );
  

export default router;

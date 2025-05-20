import axios from "axios";
import Prakrithi from "../models/Prakrathi/Prakrathi.js";
import ExpressError from "../utils/expressError.js";
import { sendPdfReport } from "../utils/sendPdfReport.js";

const findPrakrithi = async (req, res) => {
  const inputData = req.body;

  const { data: result } = await axios.post(process.env.PRAKRITHI_MODEL, {
    ApiKey: req.user?.premiumUser
      ? process.env.PRAKRITHI_PREMIUM_API_KEY
      : process.env.PRAKRITHI_FREE_API_KEY,
    ...inputData,
  });

  console.log("Prakrithi Model Response:", result);
  // Combine user input and model response
  const prakrithiData = {
    ...inputData,
    Dominant_Prakrithi: result.Dominant_Prakrithi,
    Body_Constituents: result.Body_Constituents,
    Recommendations: result.Recommendations,
    Potential_Health_Concerns: result.Potential_Health_Concerns,
    user: req.user._id,
  };

  // Save the combined data
  const newEntry = await Prakrithi.create(prakrithiData);

  // Send success response
  res.status(201).json({ success: true, data: newEntry });
};

const findSimilarPrakrithiUsers = async (req, res) => {
  const userId = req.user._id;

  // 1. Get the current user's Prakrithi data from the database
  const currentUserEntry = await Prakrithi.findOne({ user: userId });

  // If no Prakrithi data is found for the user, return a 404 error
  if (!currentUserEntry) {
    return res.status(404).json({
      success: false,
      message: "Prakrithi data not found for this user.",
    });
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
  const otherUsers = await Prakrithi.find({
    user: { $ne: userId },
    Dominant_Prakrithi: currentUserEntry.Dominant_Prakrithi,
  });

  // 4. Compare each other user's Prakrithi data with the current user's data and calculate similarity
  const similarUsers = otherUsers
    .map((user) => {
      let matches = 0;

      // For each field, check if it matches between the current user and the other user
      fieldsToCompare.forEach((field) => {
        if (currentUserEntry[field] === user[field]) {
          matches++; // Increment match count if values are the same
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
  res.status(200).json({
    success: true,
    message: "Similar users data",
    similarUsers: similarUsers.map(({ user }) => user),
  });
};

const sendPkPdfToMail = async (req, res) => {
  if (!req.file) {
    throw new ExpressError("PDF file is required", 400);
  }

  // Get the uploaded PDF buffer
  const pdfBuffer = req.file.buffer;

  // Send the PDF via email
  await sendPdfReport(req.user?.email, pdfBuffer, req.user?.profile.fullName);

  res.status(200).json({
    success: true,
    message: "PDF sent and analysis completed",
  });
};

export default {
  findPrakrithi,
  findSimilarPrakrithiUsers,
  sendPkPdfToMail,
};

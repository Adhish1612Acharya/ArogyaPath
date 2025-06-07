import axios from "axios";
import Prakrithi from "../models/Prakrathi/Prakrathi.js";
import ExpressError from "../utils/expressError.js";
import { sendPdfReport } from "../utils/sendPdfReport.js";
import { calculateSimilarPrakrithiUsers } from "../utils/similarPkUsers.js";

const findPrakrithi = async (req, res) => {
  const inputData = req.body;
  const userId = req.user?._id;

  const { data: result } = await axios.post(process.env.PRAKRITHI_MODEL, {
    ApiKey: !req.user?.premiumUser
      ? process.env.PRAKRITHI_PREMIUM_API_KEY
      : process.env.PRAKRITHI_FREE_API_KEY,
    ...inputData,
  });

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
  const userPkAlreadyExists = await Prakrithi.find({ user: userId });
  let newEntry = null;

  if (userPkAlreadyExists.length > 0) {
    newEntry = await Prakrithi.findOneAndUpdate(
      { user: userId }, // Correct filter - finds doc where user field matches userId
      prakrithiData,
      { new: true }
    );
  } else {
    await Prakrithi.create(prakrithiData);
  }

  console.log("New Entry : ", newEntry);

  // Send success response
  res.status(201).json({ success: true, data: newEntry || prakrithiData });
};

const findSimilarPrakrithiUsers = async (req, res) => {
  const userId = req.user._id;
  const currentUserEntry = await Prakrithi.findOne({ user: userId }).populate(
    "user"
  );
  if (!currentUserEntry) {
    throw new ExpressError(404, "Prakrithi data not found for this user.");
  }
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

  const otherUsers = await Prakrithi.find({
    user: { $ne: userId },
    Dominant_Prakrithi: currentUserEntry.Dominant_Prakrithi,
  }).populate("user");
  const similarUsers = calculateSimilarPrakrithiUsers(
    currentUserEntry,
    otherUsers,
    fieldsToCompare
  );
  res.status(200).json({
    success: true,
    message: "Similar users data",
    similarUsers,
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

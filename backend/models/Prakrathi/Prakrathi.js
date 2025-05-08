const mongoose = require("mongoose");

const prakrithiSchema = new mongoose.Schema({
  // User Inputs
  Name: { type: String, required: true },
  Age: { type: Number, required: true, min: 0 },
  Gender: { type: String, required: true },
  Height: { type: Number, required: true, min: 0 },
  Weight: { type: Number, required: true, min: 0 },
  Body_Type: { type: String, required: true },
  Skin_Type: { type: String, required: true },
  Hair_Type: { type: String, required: true },
  Facial_Structure: { type: String, required: true },
  Complexion: { type: String, required: true },
  Eyes: { type: String, required: true },
  Food_Preference: { type: String, required: true },
  Bowel_Movement: { type: String, required: true },
  Thirst_Level: { type: String, required: true },
  Sleep_Duration: { type: Number, required: true, min: 0, max: 24 },
  Sleep_Quality: { type: String, required: true },
  Energy_Levels: { type: String, required: true },
  Daily_Activity_Level: { type: String, required: true },
  Exercise_Routine: { type: String, required: true },
  Food_Habit: { type: String, required: true },
  Water_Intake: { type: String, required: true },
  Health_Issues: { type: String, required: true },
  Hormonal_Imbalance: { type: String, required: true },
  Skin_Hair_Problems: { type: String, required: true },
  Ayurvedic_Treatment: { type: String, required: true },

  // ML Model Response
  Dominant_Prakrithi: { type: String, required: true },
  Body_Constituents: {
    Body_Type: { type: String, required: true },
    Skin_Type: { type: String, required: true },
    Hair_Type: { type: String, required: true },
    Thirst_Level: { type: String, required: true },
    Sleep_Pattern: { type: String, required: true },
  },
  Recommendations: {
    Dietary_Guidelines: { type: [String], required: true },
    Lifestyle_Suggestions: { type: [String], required: true },
    Ayurvedic_Herbs_Remedies: { type: [String], required: true },
  },
  Potential_Health_Concerns: { type: [String], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Prakrithi", prakrithiSchema);

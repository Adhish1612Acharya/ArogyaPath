// models/UserProfile.js
import mongoose from 'mongoose';

const BodyConstituentsSchema = new mongoose.Schema({
  Body_Type: { type: String },
  Skin_Type: { type: String },
  Hair_Type: { type: String },
  Thirst_Level: { type: String },
  Sleep_Pattern: { type: String }
}, { _id: false });

const RecommendationsSchema = new mongoose.Schema({
  Dietary_Guidelines: [{ type: String }],
  Lifestyle_Suggestions: [{ type: String }],
  Ayurvedic_Herbs_Remedies: [{ type: String }]
}, { _id: false });

const prakrathiSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  Name: { type: String, required: true },
  Age: { type: Number, required: true },
  Gender: { type: String, required: true },
  Dominant_Prakrithi: { type: String, enum: ['Vata', 'Pitta', 'Kapha'], required: true },
  Body_Constituents: { type: BodyConstituentsSchema, required: true },
  Recommendations: { type: RecommendationsSchema },
  Potential_Health_Concerns: [{ type: String }]
});

const Prakarthi = mongoose.model('Prakrathi', prakrathiSchema);
export default Prakarthi;

import mongoose, { Schema, Document } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

// Define the schema
const ExpertSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profile: {
    fullname: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    qualification: { type: String, default: "" },
    expertType: { type: String, required: true },
    contact: { type: Number, default: 0 },
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] }],
  routinePosts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Routine", default: [] },
  ],
  verifiedPosts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "SuccessStory", default: [] },
  ],
  completeProfile: { type: Boolean, default: false },
  role: { type: String, enum: ["expert"], default: "expert" },
});

// Attach Passport-Local Mongoose Plugin
ExpertSchema.plugin(passportLocalMongoose);

// Export the model
const Expert = mongoose.model("Expert", ExpertSchema);
export default Expert;

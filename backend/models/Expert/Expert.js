import mongoose, { Schema, Document } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

// Define the schema
const ExpertSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    profile: {
      fullName: { type: String, default: "" },
      contactNo: { type: Number, default: 0 },
      expertType: {
        type: String,
        enum: ["ayurvedic", "naturopathy"],
        default: "ayurvedic",
      },
      profileImage: { type: String, default: "" },
      experience: { type: Number, default: 0 },
      qualification: { type: String, default: "" },
      clinicAdress: { type: String, default: "" },
      specialization: { type: String, default: "" },
      bio: { type: String, default: "" },
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] }],
    routinePosts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Routine", default: [] },
    ],
    taggedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "SuccessStory",
        default: [],
      },
    ],
    verifiedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SuccessStory",
        default: [],
      },
    ],
    completeProfile: { type: Boolean, default: false },
    role: { type: String, enum: ["expert"], default: "expert" },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    sentChatRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "ChatRequest",
      },
    ],
    receivedChatRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "ChatRequest",
      },
    ],
  },
  { timestamps: true }
);

// Attach Passport-Local Mongoose Plugin
ExpertSchema.plugin(passportLocalMongoose, { usernameField: "email" });

// Export the model
const Expert = mongoose.model("Expert", ExpertSchema);
export default Expert;

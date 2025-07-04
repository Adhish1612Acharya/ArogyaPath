import mongoose, { Schema, Document } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

// Define the schema
const ExpertSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    googleId: {
      type: String,
      default: null,
    },
    profile: {
      fullName: { type: String, default: "" },
      contactNo: { type: Number, default: 0 },
      expertType: {
        type: String,
        enum: ["ayurvedic", "naturopathy"],
        // No default, field can be undefined
      },
      profileImage: { type: String, default: "" },
      experience: { type: Number, default: 0 },
      qualifications: [
        {
          degree: { type: String },
          college: { type: String },
          year: { type: String },
        },
      ],
      address: {
        country: {
          type: String,
          default: "Bharat",
        },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        clinicAddress: { type: String, default: "" },
      },
      specialization: [{ type: String }],
      bio: { type: String, default: "" },
      languagesSpoken: [{ type: String }],
    },
    verificationDetails: {
      dateOfBirth: { type: Date },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },

      registrationDetails: {
        registrationNumber: { type: String },
        registrationCouncil: { type: String },
        yearOfRegistration: { type: Number },
      },

      documents: {
        identityProof: { type: String },
        degreeCertificate: { type: String }, // URL/path to file
        registrationProof: { type: String }, // URL/path to file
        practiceProof: { type: String }, // Optional
      },
    },

    verifications: {
      email: {
        type: Boolean,
        default: false,
      },
      contactNo: {
        type: Boolean,
        default: true,
      },
      completeProfile: {
        type: Boolean,
        default: false,
      },
      isDoctor: {
        type: Boolean,
        default: true,
      },
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

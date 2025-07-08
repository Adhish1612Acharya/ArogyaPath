import mongoose, { Schema, Document, Model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    googleId: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    profile: {
      fullName: { type: String, default: "" },
      profileImage: { type: String, default: "" },
      age: { type: Number, default: null },
      contactNo: { type: String, default: 0 },
      healthGoal: { type: String, default: "" },
      bio: { type: String, default: "" },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: null,
        required: false,
      },
    },
    successStories: [
      { type: Schema.Types.ObjectId, ref: "SuccessStory", default: [] },
    ],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],

    verifications: {
      email: {
        type: Boolean,
        default: false,
      },
      // phoneNumber: {
      //   type: Boolean,
      //   default: true,
      // },
      completeProfile: {
        type: Boolean,
        default: true,
      },
      contactNo: {
        type: Boolean,
        default: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    premiumUser: {
      type: Boolean,
      default: false,
    },
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

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

// Define the model with TypeScript type
const User = mongoose.model("User", userSchema);

export default User;

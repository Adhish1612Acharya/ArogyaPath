import mongoose, { Schema, Document, Model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    googleId: { type: String, unique: true, sparse: true, default: null },
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
      },
    },
    successStories: [
      { type: Schema.Types.ObjectId, ref: "SuccessStory", default: [] },
    ],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
    completeProfile: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },

  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

// Define the model with TypeScript type
const User = mongoose.model("User", userSchema);

export default User;

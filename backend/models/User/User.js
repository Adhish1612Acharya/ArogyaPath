import mongoose, { Schema, Document, Model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    profile: {
      profileImage: { type: String, default: "" },
      fullname: { type: String, default: "" },
      age: { type: Number, min: 1, max: 120, default: 1 },
      contact: { type: String, default: 0 },
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
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

// Define the model with TypeScript type
const User = mongoose.model("User", userSchema);

export default User;

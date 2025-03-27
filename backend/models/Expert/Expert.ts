import mongoose, { model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { IDoctor } from "./Expert.types";

const Schema = mongoose.Schema;

const doctorSchema = new Schema<IDoctor>(
  {
    username: { type: String, unique: true, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /^(?!\.)(?!.*\.\.)([a-zA-Z0-9._%+-]+)@(?!\.)([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/,
    },

    completeProfile: {
      type: Boolean,
      default: false,
    },

    // Profile Data (Nested Object)
    profile: {
      fullname: { type: String, required: true, default: "" },
      profileImage: { type: String, required: true, default: "" },
      experience: { type: Number, required: true, min: 0, default: 0 },
      qualification: { type: String, required: true, default: "" },
      expertType: { type: String, required: true, default: "" },
      contact: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/,
        default: 0,
      },
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
    role: { type: String, default: "expert" },
    googleId: { type: Number, default: 0 },
  },
  { timestamps: true }
);

doctorSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const Expert = model<IDoctor>("Expert", doctorSchema);

export default Expert;

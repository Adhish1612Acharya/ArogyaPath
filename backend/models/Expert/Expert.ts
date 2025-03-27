import mongoose, { model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { IExperts } from "./Expert.types";

const Schema = mongoose.Schema;

const expertSchema = new Schema<IExperts>(
  {
    fullname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /^(?!\.)(?!.*\.\.)([a-zA-Z0-9._%+-]+)@(?!\.)([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/,
    },
    contact: { type: String, required: true, match: /^[0-9]{10}$/ },

    // Profile Data (Nested Object)
    profile: {
      username: { type: String, unique: true, required: true },
      experience: { type: Number, required: true, min: 0 },
      qualification: { type: String, required: true },
    },
  },
  { timestamps: true }
);

expertSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const Expert = model<IExperts>("Expert", expertSchema);

export default Expert;

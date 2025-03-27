// import mongoose,  from "mongoose";
// import passportLocalMongoose from "passport-local-mongoose";
// import { IExpert } from "./Expert.types";

// const Schema = mongoose.Schema;

// const doctorSchema = new Schema<IExpert>(
//   {
//     username: { type: String, unique: true, required: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       match:
//         /^(?!\.)(?!.*\.\.)([a-zA-Z0-9._%+-]+)@(?!\.)([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/,
//     },

//     completeProfile: {
//       type: Boolean,
//       default: false,
//     },

//     // Profile Data (Nested Object)
//     profile: {
//       fullname: { type: String, default: "" },
//       profileImage: { type: String,  default: "" },
//       experience: { type: Number, min: 0, default: 0 },
//       qualification: { type: String, default: "" },
//       expertType: { type: String, default: "" },
//       contact: {
//         type: String,
//         match: /^[0-9]{10}$/,
//         default: 0,
//       },
//     },
//     posts: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
//     role: { type: String, default: "expert" },
//     googleId: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// doctorSchema.plugin(passportLocalMongoose, { usernameField: "email" });

// const Expert =  mongoose.model<IExpert>("Expert",doctorSchema);

// export default Expert;


import mongoose, { Schema, Document } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

interface IProfile {
  fullname: string;
  experience: number;
  qualification: string;
  expertType: string;
  contact: number;
}

export interface IExpert extends Document {
  username: string;
  email: string;
  contact: string;
  profile: IProfile;
  posts: mongoose.Types.ObjectId[];
  completeProfile: boolean;
  role: "expert";
}

// Define the schema
const ExpertSchema = new Schema<IExpert>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  profile: {
    fullname: { type: String, required: true },
    experience: { type: Number, required: true },
    qualification: { type: String, required: true },
    expertType: { type: String, required: true },
    contact: { type: Number, required: true },
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  completeProfile: { type: Boolean, default: false },
  role: { type: String, enum: ["expert"], required: true },
});

// Attach Passport-Local Mongoose Plugin
ExpertSchema.plugin(passportLocalMongoose, { usernameField: "email" });

// Export the model
const Expert = mongoose.model<IExpert>("Expert", ExpertSchema);
export default Expert;

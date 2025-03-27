import mongoose, { Schema, Document } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";


// Define the schema
const ExpertSchema = new Schema({
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
const Expert = mongoose.model("Expert", ExpertSchema);
export default Expert;

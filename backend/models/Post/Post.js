import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    media: {
      image: [String],
      video: [String],
      document: [String],
    },
    category: { type: [String], required: true },
    successStory: { type: Boolean, required: true },
    ownerType: {
      type: String,
      enum: ["User", "Expert"], // Restrict values to "User" or "Expert"
      required: true,
    },
    routine: [
      {
        id:{type:Date,required:true},
        time: { type: Date, required: true },
        activity: { type: String, required: true },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "ownerType",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expert",
        default: [],
      },
    ],
    verified: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expert",
        default: null,
        required: true,
      },
    ],
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);
export default Post;

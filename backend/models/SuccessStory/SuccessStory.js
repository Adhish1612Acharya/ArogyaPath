import { Schema, model } from "mongoose";

const SuccessStorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    media: {
      images: [{ type: String }],
      videos: [{ path: { type: String }, filename: { type: String } }],
      documents: [{ path: { type: String }, filename: { type: String } }],
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    filters: {
      type: [String],
      required: true,
    },
    tagged: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expert",
      },
    ],
    routines: [
      {
        time: {
          type: String,
        },
        content: {
          type: String,
        },
      },
    ],
    readTime: {
      type: String,
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    verified: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expert",
      },
    ],
  },
  { timestamps: true }
);

const SuccessStory = model("SuccessStory", SuccessStorySchema);
export default SuccessStory;

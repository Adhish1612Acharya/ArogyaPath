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
      images: {
        type: [String],
        validate: [
          {
            validator: function (val) {
              return val.length <= 3;
            },
            message: "You can upload a maximum of 3 images.",
          },
        ],
      },
      video: { type: String, default: null },
      document: { type: String, default: null },
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    filters: {
      type: [String],
      required: true,
      min: 1,
    },
    tagged: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expert",
        default: [],
      },
    ],
    verified: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expert",
        default: [],
        required: true,
      },
    ],
    routines: {
      type: [
        {
          time: {
            type: String,
            required: [true, "Time is required"],
            minlength: [1, "Time must be at least 2 characters"],
          },
          content: {
            type: String,
            required: [true, "Content is required"],
            minlength: [1, "Content must be at least 2 characters"],
          },
        },
      ],
      default: [],
      required: true,
    },
  },
  { timestamps: true }
);

const SuccessStory = model("SuccessStory", SuccessStorySchema);
export default SuccessStory;

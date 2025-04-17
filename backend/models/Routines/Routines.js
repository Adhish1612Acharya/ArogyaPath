import mongoose from "mongoose";

const { Schema, model } = mongoose;

const RoutineSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Expert",
    },
    filters: {
      type: [String],
      required: true,
    },
    // routines: [
    //   {
    //     time: {
    //       type: String,
    //       required: true,
    //     },
    //     content: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],
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
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one routine is required.",
      },
      required: true,
    },
  },
  { timestamps: true }
);

const Routine = model("Routines", RoutineSchema);
export default Routine;

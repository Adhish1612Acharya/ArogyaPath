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
    routines: [
      {
        time: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Routine = model("Routines", RoutineSchema);
export default Routine;

const mongoose = require("mongoose");

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
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", postSchema);
 
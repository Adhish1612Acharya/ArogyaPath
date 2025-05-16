import mongoose, { Schema } from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    postType: {
      type: String,
      enum: ["Post", "SuccessStory", "Routine"],
    },
    post: {
      type: Schema.Types.ObjectId,
      refPath: postType,
    },
    repliedTo:{
      type:Schema.Types.ObjectId,
      ref:"Comment"
    }
  },

  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

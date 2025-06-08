import mongoose, { Schema } from "mongoose";

const chatRequestSchema = new Schema({
  ownerType: {
    type: String,
    required: true,
    enum: ["User", "Expert"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "ownerType",
  },
  users: [
    {
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "users.userType",
      },
      userType: {
        type: String,
        required: true,
        enum: ["User", "Expert"],
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      similarPrakrithiPercenatge: {
        type: Number,
        default: null,
      },
    },
  ],
  chatType: {
    type: String,
    required: true,
    enum: ["private", "group"],
  },
  groupName: {
    type: String,
    default: null,
  },
  chatReason: {
    similarPrakrithi: {
      type: Number,
      default: null,
    },
    otherReason: {
      type: String,
      default: null,
    },
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    default: null,
  },
});

const ChatRequest = mongoose.model("ChatRequest", chatRequestSchema);

export default ChatRequest;
// routes/chat.js
import express from "express";
import Chat from "../models/Chat/Chat.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = express.Router();

// Get all chat messages between the current user and a specific receiver
router.get("/:id/chat", wrapAsync(async (req, res) => {
  const receiverId = req.params.id;
  const senderId = req.user._id;

  // Fetch all messages between the two users
  const messages = await Chat.find({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  })
    .sort({ timestamp: 1 })
    .populate("sender", "name")
    .populate("receiver", "name");

  res.json(messages);
}));

export default router;

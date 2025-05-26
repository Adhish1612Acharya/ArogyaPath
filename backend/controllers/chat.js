import Chat from "../models/Chat/Chat.js";
import Message from "../models/Message/Message.js";

export const getChatMessages = async (req, res) => {
  const chatId = req.params.id;
  const chat = req.chat;

  // Fetch all messages between the two users
  const messages = await Message.find({ chat: chatId })
    .select("-chat -senderType")
    .sort({ createdAt: 1 })
    .populate("sender", "_id profile.fullName profile.profilePicture");

  res.status(200).json({
    success: true,
    messages,
    chatInfo: chat,
  });
};

export const createChat = async (req, res) => {
  const { participants } = req.body;

  participants = participants.push({
    user: req.user._id,
    userType: req.user.role === "expert" ? "Expert" : "User",
  });

  const chat = await Chat.create({ participants });
  res.status(201).json({ success: true, chat });
};

export default {
  getChatMessages,
  createChat,
};

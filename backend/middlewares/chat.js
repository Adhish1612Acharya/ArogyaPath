import Chat from "../models/Chat/Chat.js";
import User from "../models/User/User.js";
import ExpressError from "../utils/expressError.js";
import mongoose from "mongoose";
import ChatRequest from "../models/ChatRequest/ChatRequest.js";

export const checkChatOwnership = async (req, res, next) => {
  const chatId = req.params.id;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new ExpressError(400, "Invalid chat id");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    participants: { $elemMatch: { user: userId } },
  }).populate("participants.user", "_id profile.fullName profile.profileImage");

  if (!chat) {
    throw new ExpressError(403, "Chat not found or unauthorized access");
  }

  chat.participants = chat.participants.filter(
    (participant) => participant.user._id.toString() !== req.user._id.toString()
  );

  // Attach chat to request
  req.chat = chat;

  next();
};

export const checkIncludesCurrChatUser = (req, res, next) => {
  const { participants } = req.body;

  const userIds = participants?.map((eachParticipant) => eachParticipant.user);
  const currUserId = req.user?._id;

  if (userIds.includes(currUserId)) {
    throw new ExpressError(400, "You cannot chat with yourself");
  }
  next();
};

export const checkChatUsersExists = async (req, res, next) => {
  const { users } = req.body;

  const userIds = users?.map((eachParticipant) => eachParticipant.user);

  await Promise.all(
    userIds.map(async (userId) => {
      const foundUser = await User.findById(userId);

      if (!foundUser) {
        throw new ExpressError(404, `User with ID ${userId} does not exist`);
      }
    })
  );
  next();
};

export const checkUserInChatRequest = async (req, res, next) => {
  const chatRequestId = req.params.id;
  const currUserId = req.user._id.toString();
  const chatRequest = await ChatRequest.findById(chatRequestId);
  if (!chatRequest) {
    throw new ExpressError(404, "Chat request not found");
  }
  const isUserInRequest = chatRequest.users.some(
    (u) => u.user.toString() === currUserId
  );
  if (!isUserInRequest) {
    throw new ExpressError(
      403,
      "You are not a participant in this chat request"
    );
  }
  next();
};

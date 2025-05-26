import Chat from "../models/Chat/Chat.js";
import User from "../models/User/User.js";
import ExpressError from "../utils/expressError.js";

export const checkChatOwnership = async (req, res, next) => {
  const chatId = req.params.id;
  const userId = req.user?._id;

  const chat = await Chat.findOne({
    _id: chatId,
    participants: { $elemMatch: { user: userId } },
  }).populate("participants.user", "_id profile.fullName profile.profileImage");

  if (!chat) {
    throw new ExpressError("Chat not found or unauthorized access", 403);
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
    throw new ExpressError("You cannot chat with yourself", 400);
  }
  next();
};

export const checkChatUsersExists = async (req, res, next) => {
  const { participants } = req.body;

  const userIds = participants?.map((eachParticipant) => eachParticipant.user);

  await Promise.all(
    userIds.map(async (userId) => {
      const foundUser = await User.findById(userId);

      if (!foundUser) {
        throw new ExpressError(`User with ID ${userId} does not exist`, 404);
      }
    })
  );
  next();
};

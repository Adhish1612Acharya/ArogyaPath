import Chat from "../models/Chat/Chat.js";
import Message from "../models/Message/Message.js";
import ExpressError from "../utils/expressError.js";
import User from "../models/User/User.js";
import Expert from "../models/Expert/Expert.js";
import calculateSimilarPrakrithiUsers from "../utils/similarPkUsers.js";
import Prakrithi from "../models/Prakrathi/Prakrathi.js";
import ChatRequest from "../models/ChatRequest/ChatRequest.js";

export const getChatMessages = async (req, res) => {
  const chatId = req.params.id;
  const chat = req.chat;

  // Fetch all messages between the two users
  const messages = await Message.find({ chat: chatId })
    .select("-chat")
    .sort({ createdAt: 1 })
    .populate("sender", "_id profile.fullName profile.profilePicture");

  const currUser = {
    _id: req.user._id,
    profile: {
      fullName: req.user.profile.fullName,
      profileImage: req.user.profile.profileImage,
    },
  };

  console.log("messages fetched : ", messages);

  res.status(200).json({
    success: true,
    messages,
    chatInfo: chat,
    currUser,
  });
};

// export const createChat = async (req, res) => {
//   let { participants } = req.body;

//   participants.push({
//     user: req.user._id,
//     userType: req.user.role === "expert" ? "Expert" : "User",
//   });

//   console.log("Participants:", participants);

//   const chat = await Chat.create({ participants });
//   res.status(201).json({ success: true, chat });
// };

// 1. Create a chat request
export const createChatRequest = async (req, res) => {
  const { chatType, groupName, users, chatReason } = req.body;
  const ownerId = req.user._id;
  const ownerType = req.user.role === "expert" ? "Expert" : "User";

  // Fetch Prakrithi data for all users (including owner)
  const allUserIds = [ownerId, ...users.map((u) => u.user)];
  const prakrithiDocs = await Prakrithi.find({
    user: { $in: allUserIds },
  }).populate("user");
  const prakrithiMap = {};
  prakrithiDocs.forEach((doc) => {
    prakrithiMap[doc.user._id.toString()] = doc;
  });

  const currUserPk = prakrithiMap[ownerId.toString()];

  // Prepare users array with similarity calculation if needed
  const preparedUsers = users.map((u) => {
    let similarPrakrithiPercenatge = null;
    if (chatReason && chatReason.similarPrakrithi) {
      const otherUserPk = prakrithiMap[u.user.toString()];
      if (currUserPk && otherUserPk) {
        const fieldsToCompare = [
          "Body_Type",
          "Skin_Type",
          "Hair_Type",
          "Facial_Structure",
          "Complexion",
          "Eyes",
          "Food_Preference",
          "Bowel_Movement",
          "Thirst_Level",
          "Sleep_Quality",
          "Energy_Levels",
          "Daily_Activity_Level",
          "Exercise_Routine",
          "Food_Habit",
          "Water_Intake",
          "Health_Issues",
          "Hormonal_Imbalance",
          "Skin_Hair_Problems",
          "Ayurvedic_Treatment",
        ];
        const result = calculateSimilarPrakrithiUsers(
          currUserPk,
          [otherUserPk],
          fieldsToCompare
        );
        similarPrakrithiPercenatge = result[0]?.similarityPercentage ?? null;
      }
    }
    return {
      ...u,
      status: "pending",
      similarPrakrithiPercenatge,
    };
  });

  // Create the ChatRequest document
  const chatRequest = await ChatRequest.create({
    ownerType,
    owner: ownerId,
    users: preparedUsers,
    chatType,
    groupName: chatType === "group" ? groupName : null,
    chatReason: chatReason || {},
  });

  // Reference this ChatRequest in each user's sent/receivedChatRequests
  for (const u of preparedUsers) {
    const Model = u.userType === "Expert" ? Expert : User;
    // Add to receivedChatRequests for each participant
    await Model.findByIdAndUpdate(u.user, {
      $push: { receivedChatRequests: chatRequest._id },
    });
  }
  // Add to owner's sentChatRequests
  const OwnerModel = ownerType === "Expert" ? Expert : User;
  await OwnerModel.findByIdAndUpdate(ownerId, {
    $push: { sentChatRequests: chatRequest._id },
  });

  res.status(201).json({ success: true, chatRequest });
};

// 2. Accept chat request
export const acceptChatRequest = async (req, res) => {
  const chatRequestId = req.params.id;
  const receiverId = req.user._id;
  const receiverType = req.user.role === "expert" ? "Expert" : "User";

  // Find the chat request
  const chatRequest = await ChatRequest.findById(chatRequestId);
  if (!chatRequest) {
    throw new ExpressError(404, "Chat request not found");
  }

  // Update status for this user in the chatRequest users array
  chatRequest.users = chatRequest.users.map((u) =>
    u.user.toString() === receiverId.toString()
      ? { ...u.toObject(), status: "accepted" }
      : u
  );
  await chatRequest.save();

  // Check if a chat already exists for this chatRequest (by groupName or participants)
  let chat = null;
  if (chatRequest.chatType === "group") {
    const acceptedUsers = chatRequest.users.filter(
      (u) => u.status === "accepted"
    );
    if (acceptedUsers.length === 2) {
      const participants = acceptedUsers.map((u) => ({
        user: u.user,
        userType: u.userType,
      }));
      chat = await Chat.create({
        participants,
        groupChat: true,
        groupChatName: chatRequest.groupName || "",
      });
      chatRequest.chat = chat._id;
      await chatRequest.save();
      // Push chat id to each user's chats field
      for (const u of acceptedUsers) {
        const Model = u.userType === "Expert" ? Expert : User;
        await Model.findByIdAndUpdate(u.user, {
          $addToSet: { chats: chat._id },
        });
      }
    } else if (acceptedUsers.length > 2) {
      // Find the chat using chatRequest.chat
      chat = await Chat.findById(chatRequest.chat);
      if (chat) {
        const alreadyInChat = chat.participants.some(
          (p) => p.user.toString() === receiverId.toString()
        );
        if (!alreadyInChat) {
          chat.participants.push({ user: receiverId, userType: receiverType });
          await chat.save();
        }
        // Push chat id to this user's chats field
        const Model = receiverType === "Expert" ? Expert : User;
        await Model.findByIdAndUpdate(receiverId, {
          $addToSet: { chats: chat._id },
        });
      } else {
        // If for some reason the chat doesn't exist, create it with all accepted users
        const participants = acceptedUsers.map((u) => ({
          user: u.user,
          userType: u.userType,
        }));
        chat = await Chat.create({
          participants,
          groupChat: true,
          groupChatName: chatRequest.groupName || "",
        });
        chatRequest.chat = chat._id;
        await chatRequest.save();
        for (const u of acceptedUsers) {
          const Model = u.userType === "Expert" ? Expert : User;
          await Model.findByIdAndUpdate(u.user, {
            $addToSet: { chats: chat._id },
          });
        }
      }
    }
    // If only one user has accepted, do not create the chat yet
  } else {
    // Private chat: create chat when both have accepted
    const acceptedUsers = chatRequest.users.filter(
      (u) => u.status === "accepted"
    );
    if (acceptedUsers.length === 2) {
      const participants = acceptedUsers.map((u) => ({
        user: u.user,
        userType: u.userType,
      }));
      chat = await Chat.create({
        participants,
        groupChat: false,
        groupChatName: "",
      });
      chatRequest.chat = chat._id;
      await chatRequest.save();
      for (const u of acceptedUsers) {
        const Model = u.userType === "Expert" ? Expert : User;
        await Model.findByIdAndUpdate(u.user, {
          $addToSet: { chats: chat._id },
        });
      }
    }
  }

  res.status(201).json({
    success: true,
    message:
      "Chat request accepted" +
      (chat ? ", chat created/updated" : ", waiting for more users to accept"),
    chat: chat || null,
  });
};

// 3. Reject chat request
export const rejectChatRequest = async (req, res) => {
  const chatRequestId = req.params.id;
  const receiverId = req.user._id;

  // Find the chat request
  const chatRequest = await ChatRequest.findById(chatRequestId);
  if (!chatRequest) {
    throw new ExpressError(404, "Chat request not found");
  }

  // Update status for this user in the chatRequest users array
  chatRequest.users = chatRequest.users.map((u) =>
    u.user.toString() === receiverId.toString()
      ? { ...u.toObject(), status: "rejected" }
      : u
  );
  await chatRequest.save();

  res.status(200).json({ success: true, message: "Chat request rejected" });
};

export default {
  getChatMessages,
  createChat,
  createChatRequest,
  acceptChatRequest,
  rejectChatRequest,
};

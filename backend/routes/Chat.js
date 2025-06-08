import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import {
  checkChatOwnership,
  checkChatUsersExists,
  checkIncludesCurrChatUser,
  checkUserInChatRequest,
} from "../middlewares/chat.js";
import chatController from "../controllers/chat.js";
import {
  validateChatUsersIds,
  validateChatRequest,
  checkChatRequestDoesNotContainCurrentUser,
} from "../middlewares/validationMiddleware/validationMiddlewares.js";

const router = express.Router();

// Get all chat messages between the current user and a specific receiver
router.get(
  "/:id",
  isLoggedIn,
  wrapAsync(checkChatOwnership),
  wrapAsync(chatController.getChatMessages)
);

// Create a new chat
// router.post(
//   "/",
//   isLoggedIn,
//   validateChatUsersIds,
//   checkIncludesCurrChatUser,
//   wrapAsync(checkChatUsersExists),
//   wrapAsync(chatController.createChat)
// );

// Create a chat request
router.post(
  "/request",
  isLoggedIn,
  validateChatRequest,
  checkChatRequestDoesNotContainCurrentUser,
  wrapAsync(checkChatUsersExists),
  wrapAsync(chatController.createChatRequest)
);

// Accept a chat request
router.post(
  "/request/:id/accept",
  isLoggedIn,
  wrapAsync(checkUserInChatRequest),
  wrapAsync(chatController.acceptChatRequest)
);

// Reject a chat request
router.post(
  "/request/:id/reject",
  isLoggedIn,
  wrapAsync(checkUserInChatRequest),
  wrapAsync(chatController.rejectChatRequest)
);

export default router;

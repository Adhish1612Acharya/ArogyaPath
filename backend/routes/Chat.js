import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import {
  checkChatOwnership,
  checkChatUsersExists,
  checkIncludesCurrChatUser,
} from "../middlewares/chat.js";
import chatController from "../controllers/chat.js";
import { validateChatUsersIds } from "../middlewares/validationMiddleware/validationMiddlewares.js";

const router = express.Router();

// Get all chat messages between the current user and a specific receiver
router.get(
  "/:id",
  isLoggedIn,
  checkChatOwnership,
  wrapAsync(chatController.getChatMessages)
);

router.post(
  "/",
  isLoggedIn,
  validateChatUsersIds,
  checkIncludesCurrChatUser,
  wrapAsync(checkChatUsersExists),
  wrapAsync(chatController.createChat)
);

export default router;

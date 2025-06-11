import React from "react";
import { Box } from "@mui/material";
import ChatMessage from "../ChatMessage/ChatMessage";
import ChatContainerProps from "./ChatContainer.types";

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  currUser,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
      key={"conatiner"}
    >
      {messages.map((message) => (
        <ChatMessage key={message._id} currUser={currUser} message={message} />
      ))}
    </Box>
  );
};

export default ChatContainer;

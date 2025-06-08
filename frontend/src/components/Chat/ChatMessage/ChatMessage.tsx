import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { format } from "date-fns";
import { ChatMessageProps } from "./ChatMessage.types";

const ChatMessage: React.FC<ChatMessageProps> = ({ message, currUser }) => {
  const isUser = message.sender._id === currUser._id;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
        width: "100%",
      }}
      key={message._id}
    >
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: "70%",
          backgroundColor: isUser ? "primary.main" : "background.paper",
          color: isUser ? "primary.contrastText" : "text.primary",
          borderRadius: 2,
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            opacity: 0.7,
          }}
        >
          {format(message.createdAt, "HH:mm")}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage;

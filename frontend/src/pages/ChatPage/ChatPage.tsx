import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Avatar,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  Search as SearchIcon,
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
  Mood as MoodIcon,
  Send as SendIcon,
} from "@mui/icons-material";

import ChatContainer from "@/components/Chat/ChatContainer/ChatContainer";
import ChatLayout from "@/components/Chat/ChatLayout/ChatLayout";
import useChat from "@/hooks/useChat/useChat";
import useSocket from "@/hooks/useSocket/useSocket";
import { UserOrExpertDetailsType } from "@/types";
import { Message } from "@/types/Message.types";

const ChatPage = () => {
  const { id } = useParams();
  const { fetchChatMessages } = useChat();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [chatUsers, setChatUsers] = useState<UserOrExpertDetailsType[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currUser, setCurrUser] = useState<UserOrExpertDetailsType | null>(
    null
  );
  const [groupName, setGroupName] = useState<string>("");
  const [inputMessage, setInputMessage] = useState("");
  const { socketConnected, onNewMessage, sendMessage } = useSocket(
    id || "",
    currUser
  );

  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (!id) {
          toast.error("Chat ID is missing");
          navigate("/u/chats");
          return;
        }

        const response = await fetchChatMessages(id);
     

        const participants = response.chatInfo.participants.filter(
          (participant: any) => participant.user._id !== response.currUser._id
        );
        const chatUsers = participants.map((participant: any) => ({
          _id: participant.user._id,
          profile: {
            fullName: participant.user.profile.fullName,
            profileImage: participant.user.profile.profileImage,
          },
        }));

        setGroupName(response.chatInfo.groupChatName || "");
        setChatUsers(chatUsers);
        setMessages(response.messages);
        setCurrUser(response.currUser);
      } catch (error: any) {
        if (error.status === 401) navigate("/auth");
        else if (error.status === 404) navigate("/");
        else toast.error("Failed to load chat");
      }
    };

    initializeChat();
  }, [id]);

  useEffect(() => {
    const removeListener = onNewMessage((newMessage: Message) => {

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      removeListener();
    };
  }, [onNewMessage]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && id && currUser) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Wrap the main content in a Box with full width and padding
  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        px: { xs: 1, sm: 3, md: 6 }, // responsive horizontal padding
        bgcolor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatLayout>
        {/* Enhanced Chat Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
            borderBottom: `1px solid ${theme.palette.divider}`,
            p: isMobile ? 1 : 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/u/chats")}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <ArrowBackIcon />
            </IconButton>

            {chatUsers.length > 0 && (
              <Avatar
                src={chatUsers[0]?.profile.profileImage}
                alt={chatUsers[0]?.profile.fullName}
                sx={{ width: 40, height: 40 }}
              />
            )}

            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {groupName || chatUsers[0]?.profile.fullName || "Chat"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {socketConnected ? "online" : "offline"}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Tooltip title="Search">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chat info">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="More options">
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Chat Container with Enhanced UI */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: isMobile ? 1 : 3,
            backgroundImage:
              theme.palette.mode === "dark"
                ? "radial-gradient(circle at center, #2a2a2a, #1e1e1e)"
                : "radial-gradient(circle at center, #f5f5f5, #e0e0e0)",
            backgroundAttachment: "fixed",
          }}
        >
          <ChatContainer messages={messages} currUser={currUser} />
        </Box>

        {/* Enhanced Input Area */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            bgcolor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
            p: isMobile ? 1 : 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              maxWidth: 800,
              mx: "auto",
            }}
          >
            <Tooltip title="Attach file">
              <IconButton>
                <AttachFileIcon />
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                flex: 1,
                bgcolor: theme.palette.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
                borderRadius: 4,
                p: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Tooltip title="Emoji">
                <IconButton sx={{ mr: 1 }}>
                  <MoodIcon />
                </IconButton>
              </Tooltip>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="message-input"
              />

              {inputMessage ? (
                <Tooltip title="Send">
                  <IconButton
                    onClick={handleSendMessage}
                    sx={{
                      color: theme.palette.primary.main,
                      "&:hover": {
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Voice message">
                  <IconButton>
                    <MicIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>
      </ChatLayout>
    </Box>
  );
};

export default ChatPage;

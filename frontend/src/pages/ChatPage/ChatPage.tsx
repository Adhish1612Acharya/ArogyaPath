import ChatContainer from "@/components/Chat/ChatContainer/ChatContainer";
import { ChatHeader } from "@/components/Chat/ChatHeader/ChatHeader";
import { ChatInput } from "@/components/Chat/ChatInput/ChatInput";
import ChatLayout from "@/components/Chat/ChatLayout/ChatLayout";
import { useAuth } from "@/context/AuthContext";
import { Message } from "@/types/Message.types";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";

export var socket: any;

const ChatPage = () => {
  const { id } = useParams();
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [chatUsers, setChatUsers] = useState([]);

  const [messages, setMessages] = useState([]);

  const [currUser, setCurrUser] = useState([]);

  //   useEffect(() => {
  //     setIsLoggedIn(undefined);
  //     if (!id) {
  //       toast.error("Chat ID is missing");
  //       return;
  //     }

  //     // Function to fetch messages and set up socket
  //     const initializeChat = async () => {
  //       try {
  //         const response = await dispatch(fetchChatMessages(id));
  //         const { type, payload }: any = response;

  //         if (type === "/fetchChatMessages/fulfilled") {
  //           // Initialize socket
  //           if (!socket) {
  //             socket = io(ENDPOINT);
  //             socket.on("connect", () => {
  //               console.log("Socket connected");
  //               dispatch(setSocketConnected(true));
  //             });

  //             // Emit socket events
  //             socket.emit("setup", payload.loggedInUser);
  //             socket.emit("join chat", id);
  //           }
  //         } else {
  //           navigate("/u/buddy-request/created/view");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching messages:", error);
  //         toast.error("Failed to load chat messages");
  //       }
  //     };

  //     initializeChat();

  //     // // Cleanup on unmount
  //     return () => {
  //       if (socket) {
  //         socket.off(); // Remove all listeners
  //         socket.disconnect();
  //         console.log("Socket disconnected");
  //       }
  //     };
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [id,  navigate]);

  //   useEffect(() => {
  //     if (socket) {
  //       console.log("Setting up socket listener for received messages");

  //       // Add listener
  //       socket.on("received", (newMessage: Message) => {
  //         console.log("Received message:", newMessage);
  //         dispatch(addMessage(newMessage));
  //       });

  //       // Cleanup listener on unmount
  //       return () => {
  //         socket.off("received");
  //         console.log("Removed socket listener for received messages");
  //       };
  //     }
  //   }, [socket]);

  return (
    <ChatLayout>
      <ChatHeader users={chatUsers} />
      <ChatContainer messages={messages} currUser={currUser} />
      <Box sx={{ p: 2, bgcolor: "background.paper" }}>
        <ChatInput chatId={id || ""} />
      </Box>
    </ChatLayout>
  );
};

export default ChatPage;

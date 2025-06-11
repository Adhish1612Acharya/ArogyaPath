// pages/ChatPage.tsx
import ChatContainer from "@/components/Chat/ChatContainer/ChatContainer";
import { ChatHeader } from "@/components/Chat/ChatHeader/ChatHeader";
import { ChatInput } from "@/components/Chat/ChatInput/ChatInput";
import ChatLayout from "@/components/Chat/ChatLayout/ChatLayout";
import { useAuth } from "@/context/AuthContext";
import useChat from "@/hooks/useChat/useChat";
import useSocket from "@/hooks/useSocket/useSocket";

import { UserOrExpertDetailsType } from "@/types";
import { Message } from "@/types/Message.types";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ChatPage = () => {
  const { id } = useParams();
  const { fetchChatMessages } = useChat();
  const navigate = useNavigate();

  const [chatUsers, setChatUsers] = useState<UserOrExpertDetailsType[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currUser, setCurrUser] = useState<UserOrExpertDetailsType | null>(
    null
  );
  const [groupName, setGroupName] = useState<string>("");
  const [chatOwner, setChatOwner] = useState<UserOrExpertDetailsType | null>(
    null
  );

  const { socket, socketConnected, onNewMessage, sendMessage } = useSocket(
    id || "",
    currUser
  );

  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (!id) {
          toast.error("Chat ID is missing");
          return;
        }

        const response = await fetchChatMessages(id);
        console.log("Chat response:", response);

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
        setChatOwner(response.chatInfo.owner);
        console.log("Response success");
        setChatUsers(chatUsers);
        setMessages(response.messages);
        setCurrUser(response.currUser);
        console.log("Re renders done :");
      } catch (error: any) {
        if (error.status === 401) navigate("/auth");
        else if (error.status === 404) navigate("/");
      }
    };

    initializeChat();
  }, [id, navigate]);

  useEffect(() => {
    const removeListener = onNewMessage((newMessage: Message) => {
      console.log("Received message:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      removeListener();
    };
  }, [onNewMessage]);

  return (
    <ChatLayout>
      <ChatHeader users={chatUsers} groupName={groupName} owner={chatOwner} />
      <ChatContainer messages={messages} currUser={currUser} />
      <Box sx={{ p: 2, bgcolor: "background.paper" }}>
        <ChatInput
          chatId={id || ""}
          sendMessage={sendMessage}
          socket={socket}
          currUser={currUser}
        />
      </Box>
    </ChatLayout>
  );
};

export default ChatPage;

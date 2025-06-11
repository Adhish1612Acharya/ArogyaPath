import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useChat from "@/hooks/useChat/useChat";
import GroupChatMembersDialog from "@/components/GroupChatMembersDialog/GroupChatMembersDialog";
import PrivateChatCard from "@/components/PrivateChatCard/PrivateChatCard";
import GroupChatCard from "@/components/GroupChatCard/GroupChatCard";
import { ReceivedChatRequest } from "../ReceivedChatRequest/ReceivedChatRequest.types";
import { IChat } from "./YourChats.types";

const YourChats: React.FC = () => {
  const { getMyChats } = useChat();
  const [chats, setChats] = useState<IChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroupRequest, setSelectedGroupRequest] =
    useState<ReceivedChatRequest | null>(null);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [currUser, setCurrUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const res = await getMyChats();
      setChats(res?.chats || []);
      setCurrUser(res?.currUser || null);
      setLoading(false);
    };
    fetchChats();
    // eslint-disable-next-line
  }, []);

  const handleViewMembers = (chatRequest: ReceivedChatRequest) => {
    setSelectedGroupRequest(chatRequest);
    setGroupDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setGroupDialogOpen(false);
    setSelectedGroupRequest(null);
  };

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        p: isMobile ? 1 : 3,
        width: "100%",
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={3} textAlign="center">
        Your Chats
      </Typography>
      {loading ? (
        <Stack spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={100} />
          ))}
        </Stack>
      ) : chats.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          No chats found.
        </Typography>
      ) : (
        <Box>
          {chats.map((chat) =>
            chat.groupChat ? (
              <GroupChatCard
                key={chat._id}
                chat={chat}
                isMobile={isMobile}
                onViewMembers={handleViewMembers}
              />
            ) : (
              currUser && (
                <PrivateChatCard
                  key={chat._id}
                  chat={chat}
                  currUser={currUser}
                  isMobile={isMobile}
                />
              )
            )
          )}
        </Box>
      )}
      <GroupChatMembersDialog
        open={groupDialogOpen}
        onClose={handleCloseDialog}
        request={selectedGroupRequest as any}
      />
    </Box>
  );
};

export default YourChats;

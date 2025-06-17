import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  Avatar,
  Button,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import { Group, Person, Schedule } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ReceivedChatRequestCardProps } from "./ReceivedChatRequestCard.types";

const ReceivedChatRequestCard: React.FC<ReceivedChatRequestCardProps> = ({
  request,
  myStatus,
  formatTimestamp,
  handleAccept,
  handleReject,
  handleProfileClick,
  setGroupDialogOpen,
}) => {
  const [loadingAction, setLoadingAction] = useState<
    "accept" | "reject" | null
  >(null);
  const [localStatus, setLocalStatus] = useState<
    "pending" | "accepted" | "rejected"
  >(myStatus);
  const [chatId, setChatId] = useState<string | null>(request.chat || null);
  const navigate = useNavigate();

  // Accept handler with loader
  const onAccept = async () => {
    setLoadingAction("accept");
    try {
      const result: { chat?: string } = (await handleAccept(request._id)) || {};
  
      if (result.chat && result.chat) {
        setChatId(result.chat);
        setLocalStatus("accepted");
      } else if (request.chatType === "group") {
        setLocalStatus("accepted");
      } else {
        setLocalStatus("accepted");
      }
    } finally {
      setLoadingAction(null);
    }
  };

  // Reject handler with loader
  const onReject = async () => {
    setLoadingAction("reject");
    try {
      await handleReject(request._id);
      setLocalStatus("rejected");
    } finally {
      setLoadingAction(null);
    }
  };

  // UI logic for showing buttons
  const showAcceptReject = localStatus === "pending";
  const showGoToChat = localStatus === "accepted" && chatId;
  const showWaiting =
    localStatus === "accepted" && !chatId && request.chatType === "group";

  return (
    <Card
      sx={{
        height: "100%",
        opacity: localStatus !== "pending" ? 0.6 : 1,
        position: "relative",
      }}
    >
      {localStatus !== "pending" && (
        <Chip
          label={localStatus.toUpperCase()}
          color={localStatus === "accepted" ? "success" : "error"}
          size="small"
        />
      )}
      <CardContent sx={{ pb: 1 }}>
        {/* Request Type Badge */}
        <Chip
          icon={request.chatType === "group" ? <Group /> : <Person />}
          label={
            request.chatType === "group" ? "Group Request" : "Private Request"
          }
          color={request.chatType === "group" ? "primary" : "secondary"}
          size="small"
          sx={{ mb: 2 }}
        />
        {/* Group Request Layout */}
        {request.chatType === "group" && (
          <>
            <Typography variant="h6" gutterBottom>
              {request.groupName}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Avatar
                src={request.owner?.profile?.profileImage || ""}
                sx={{ width: 32, height: 32 }}
              />
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {request.owner?.profile?.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Group Head • {request.users?.length || 0} members
                </Typography>
              </Box>
            </Box>
            {/* Request Reason */}
            <Typography variant="body2" color="text.secondary" paragraph>
              {request.chatReason?.otherReason ||
                (request.chatReason?.similarPrakrithi &&
                  `Similar Prakrithi Match`)}
            </Typography>
          </>
        )}
        {/* Private Request Layout */}
        {request.chatType === "private" &&
          (() => {
            return (
              <>
                {/* User Info */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar
                    src={request.owner?.profile?.profileImage || ""}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box flex={1}>
                    <Typography variant="h6" gutterBottom>
                      {request.owner?.profile?.fullName}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleProfileClick(request.owner?._id || "")}
                  >
                    View Profile
                  </Button>
                </Box>
                {/* Request Reason */}
                <Typography variant="body2" color="text.secondary" paragraph>
                  {request.chatReason?.otherReason ||
                    (request.chatReason?.similarPrakrithi
                      ? `Similar Prakrithi Match: ${request.users[0].similarPrakrithiPercenatge}%`
                      : "")}
                </Typography>
              </>
            );
          })()}
        {/* Timestamp */}
        <Box display="flex" alignItems="center" gap={1} mt={2}>
          <Schedule fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {formatTimestamp(request.createdAt)}
          </Typography>
        </Box>
      </CardContent>
      {/* Actions */}
      <Divider />
      <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
        <Stack direction="row" spacing={1}>
          {showAcceptReject && (
            <>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={onAccept}
                disabled={loadingAction === "reject"}
              >
                {loadingAction === "accept" ? (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <span className="loader" style={{ marginRight: 6 }} />
                    Accepting...
                  </span>
                ) : (
                  "Accept"
                )}
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={onReject}
                disabled={loadingAction === "accept"}
              >
                {loadingAction === "reject" ? (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <span className="loader" style={{ marginRight: 6 }} />
                    Rejecting...
                  </span>
                ) : (
                  "Reject"
                )}
              </Button>
            </>
          )}
          {showGoToChat && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => navigate(`/chats/${chatId}`)}
            >
              Go to Chat
            </Button>
          )}
          {showWaiting && (
            <Typography variant="body2" color="text.secondary">
              Waiting for others to join the group chat...
            </Typography>
          )}
          {request.chatType === "group" && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setGroupDialogOpen(true, request)}
              sx={{ ml: 1 }}
            >
              View Members
            </Button>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
};

export default ReceivedChatRequestCard;

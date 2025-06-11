import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Stack,
  Button,
  Chip,
  Divider,
  Box,
} from "@mui/material";
import { Group, Person, Schedule } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ReceivedChatRequestCardProps } from "../ReceivedChatRequestCard/ReceivedChatRequestCard.types";

interface SentChatRequestCardProps extends ReceivedChatRequestCardProps {
  setGroupDialogOpen: (open: boolean, request: any) => void;
}

const SentChatRequestCard: React.FC<SentChatRequestCardProps> = ({
  request,
  formatTimestamp,
  setGroupDialogOpen,
}) => {
  const navigate = useNavigate();

  // Helper to get status for each user (for group requests)
  const getUserStatus = (userObj: any) => {
    if (!userObj || !userObj.status) return "pending";
    return userObj.status;
  };
  const statusColor = (status: string) =>
    status === "accepted"
      ? "success"
      : status === "rejected"
      ? "error"
      : "warning";

  return (
    <Card
      sx={{
        height: "100%",
        opacity: request.users?.some((u: any) => u.status !== "pending")
          ? 0.6
          : 1,
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Type Badge */}
        <Chip
          icon={request.chatType === "group" ? <Group /> : <Person />}
          label={
            request.chatType === "group" ? "Group Request" : "Private Request"
          }
          color={request.chatType === "group" ? "primary" : "secondary"}
          size="small"
          sx={{ mb: 2 }}
        />

        {/* Status Badge(s) */}
        {request.chatType === "private" && (
          <Chip
            label={getUserStatus(request.users?.[0]).toUpperCase()}
            color={statusColor(getUserStatus(request.users?.[0]))}
            size="small"
            sx={{ mb: 2 }}
          />
        )}
        {request.chatType === "group" && (
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
            {request.users?.map((u: any) => (
              <Chip
                key={u.user._id}
                label={`${
                  u.user.profile?.fullName || "Member"
                }: ${getUserStatus(u).toUpperCase()}`}
                color={statusColor(getUserStatus(u))}
                size="small"
              />
            ))}
          </Stack>
        )}

        {/* Private Request */}
        {request.chatType === "private" && (
          <>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Sent to:
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar
                src={request.users?.[0].user.profile?.profileImage || ""}
                sx={{ width: 40, height: 40 }}
              />
              <Typography variant="body1">
                {request.users?.[0].user.profile?.fullName}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              {request.chatReason?.otherReason ||
                (request.chatReason?.similarPrakrithi
                  ? `Similar Prakrithi Match: ${request.users?.[0].similarPrakrithiPercenatge}%`
                  : "")}
            </Typography>
          </>
        )}

        {/* Group Request */}
        {request.chatType === "group" && (
          <>
            <Typography variant="h6" gutterBottom>
              {request.groupName}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {request.chatReason?.otherReason ||
                (request.chatReason?.similarPrakrithi &&
                  `Similar Prakrithi Match`)}
            </Typography>
          </>
        )}

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
        {request.chatType === "group" && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setGroupDialogOpen(true, request)}
          >
            View Members
          </Button>
        )}
        {((request.chatType === "private" &&
          request.users?.[0]?.status === "accepted" &&
          request.chat) ||
          (request.chatType === "group" &&
            request.users?.some((u: any) => u.status === "accepted") &&
            request.chat)) && (
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/chats/${request.chat}`)}
          >
            Go to Chat
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default SentChatRequestCard;

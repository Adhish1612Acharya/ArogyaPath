import React from "react";
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
import { ChatRequestCardProps } from "./ChatRequestCard.types";

const ChatRequestCard: React.FC<ChatRequestCardProps> = ({
  request,
  myStatus,
  currUser,
  formatTimestamp,
  handleAccept,
  handleReject,
  handleProfileClick,
}) => {
  return (
    <Card
      sx={{
        height: "100%",
        opacity: myStatus !== "pending" ? 0.6 : 1,
        position: "relative",
      }}
    >
      {myStatus !== "pending" && (
        <Chip
          label={myStatus.toUpperCase()}
          color={myStatus === "accepted" ? "success" : "error"}
          size="small"
          sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
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
          </>
        )}
        {/* Private Request Layout */}
        {request.chatType === "private" && (
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            {(() => {
              // Find the other user (not the current user)
              const otherUser = request.users.find(
                (u: any) => u.user && u.user._id !== currUser
              );
              return otherUser ? (
                <>
                  <Avatar
                    src={otherUser.user.profile?.profileImage || ""}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box flex={1}>
                    <Typography variant="h6" gutterBottom>
                      {otherUser.user.profile?.fullName}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleProfileClick(otherUser.user._id)}
                  >
                    View Profile
                  </Button>
                </>
              ) : null;
            })()}
          </Box>
        )}
        {/* Request Reason */}
        <Typography variant="body2" color="text.secondary" paragraph>
          {request.chatReason?.otherReason ||
            (request.chatReason?.similarPrakrithi
              ? "Similar Prakrithi Match"
              : "")}
        </Typography>
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
          {myStatus === "pending" && (
            <>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleAccept(request._id)}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleReject(request._id)}
              >
                Reject
              </Button>
            </>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
};

export default ChatRequestCard;

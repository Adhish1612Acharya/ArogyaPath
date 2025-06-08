import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import { X as Close, MessageCircle as Chat, Loader2 } from "lucide-react";
import { SimilarPkUserDialogProps } from "./SimilarPkUserDialog.types";

const SimilarPkUserDialog: React.FC<SimilarPkUserDialogProps> = ({
  open,
  onClose,
  similarPkUsers,
  createNewChat,
  createChatLoad,
}) => {
  const [groupMode, setGroupMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupError, setGroupError] = useState("");

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendGroupChatRequest = () => {
    if (!groupName.trim()) {
      setGroupError("Group name is required");
      return;
    }
    setGroupError("");
    createNewChat(selectedUsers, groupName);
    setSelectedUsers([]);
    setGroupName("");
    setGroupMode(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="flex justify-between items-center">
        <span>People with Similar Prakriti</span>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className="flex justify-end mb-2">
          <Button
            variant={groupMode ? "contained" : "outlined"}
            color="primary"
            onClick={() => {
              setGroupMode((prev) => !prev);
              setSelectedUsers([]);
              setGroupName("");
              setGroupError("");
            }}
            size="small"
          >
            {groupMode ? "Cancel Group" : "Group"}
          </Button>
        </div>
        {similarPkUsers.length > 0 && (
          <>
            <Typography variant="body1" className="mb-4 text-center">
              <span className="font-bold text-teal-600">
                {similarPkUsers.length}
              </span>{" "}
              of people share similar Prakriti with you
            </Typography>
            <div className="space-y-4">
              {similarPkUsers.map((eachPkUser) => (
                <div
                  key={eachPkUser.user._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {groupMode && (
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(eachPkUser.user._id)}
                        onChange={() => handleUserSelect(eachPkUser.user._id)}
                        className="mr-2"
                      />
                    )}
                    <Avatar
                      src={eachPkUser.user.profile.profileImage}
                      alt={eachPkUser.user.profile.fullName}
                    />
                    <div>
                      <Typography variant="subtitle1">
                        {eachPkUser.user.profile.fullName}
                      </Typography>
                      <Typography variant="body2" className="text-gray-500">
                        {eachPkUser.similarityPercentage}%
                      </Typography>
                    </div>
                  </div>
                  {!groupMode && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Chat />}
                      onClick={() => createNewChat(eachPkUser.user._id)}
                      size="small"
                      disabled={createChatLoad}
                    >
                      {createChatLoad ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Chat"
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {groupMode && (
              <div className="mt-6 space-y-2">
                <input
                  type="text"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                {groupError && (
                  <Typography color="error" variant="body2">
                    {groupError}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={createChatLoad || selectedUsers.length < 2}
                  onClick={handleSendGroupChatRequest}
                  startIcon={<Chat />}
                >
                  {createChatLoad ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Send Chat Request"
                  )}
                </Button>
                <Typography variant="caption" color="textSecondary">
                  (Select at least 2 users for a group chat)
                </Typography>
              </div>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimilarPkUserDialog;

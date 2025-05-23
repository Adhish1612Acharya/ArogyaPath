import React from "react";
import { Avatar, Box, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserInfoProps } from "./ChatHeaderUserInfo.types";

const ChatHeaderUserInfo: React.FC<UserInfoProps> = ({ users }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <ArrowBackIcon onClick={() => window.history.back()} />
      {users.length === 1 ? (
        <>
          <Avatar
            src={users[0].profileImage}
            alt={"S"}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography variant="subtitle1" component="div">
              {users[0].username}
            </Typography>
            {/* <Typography variant="caption" color="text.secondary">
          {user.status === 'online' ? 'Online' : 'Offline'}
        </Typography> */}
          </Box>
        </>
      ) : (
        <Typography>Group Chat</Typography>
      )}
    </Box>
  );
};

export default ChatHeaderUserInfo;

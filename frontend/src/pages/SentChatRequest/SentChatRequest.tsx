import { useEffect, useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Badge,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Skeleton,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  AvatarGroup,
  Divider,
} from "@mui/material";
import {
  Notifications,
  FilterList,
  Group,
  Person,
  Message,
  Search,
  Refresh,
  ArrowForward,
  CheckCircle,
  Cancel,
  Pending,
} from "@mui/icons-material";
import useChat from "@/hooks/useChat/useChat";
import GroupChatMembersDialog from "@/components/GroupChatMembersDialog/GroupChatMembersDialog";
import { ReceivedChatRequest } from "../ReceivedChatRequest/ReceivedChatRequest.types";
import formatTimestamp from "@/utils/formatTimeStamp";
import countGroupRequests from "@/utils/countGroupRequests";
import countPrivateRequests from "@/utils/countPrivateRequests";
import countPendingRequests from "@/utils/countPendingRequests";

const SentChatRequest = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getSentChatRequests } = useChat();
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Group, 2: Private
  const [requests, setRequests] = useState<ReceivedChatRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupDialogRequest, setGroupDialogRequest] =
    useState<ReceivedChatRequest | null>(null);

  const [pendingCount, setPendingCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [privateCount, setPrivateCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchRequests = async () => {
      setLoading(true);
      try {
        let response;
        if (activeTab === 0) {
          response = await getSentChatRequests();
        } else if (activeTab === 1) {
          response = await getSentChatRequests("group");
        } else if (activeTab === 2) {
          response = await getSentChatRequests("private");
        }
        if (isMounted && response?.sentChatRequests) {
          setRequests(response.sentChatRequests);
        }
      } finally {
        if (isMounted) setLoading(false);
        if (isMounted) setRefreshing(false);
      }
    };
    fetchRequests();
    return () => {
      isMounted = false;
    };
  }, [activeTab, refreshing]);

  useEffect(() => {
    if (requests.length === 0) return;

    if (activeTab === 0) {
      setPendingCount(countPendingRequests(requests));
      setGroupCount(countGroupRequests(requests));
      setPrivateCount(countPrivateRequests(requests));
    } else if (activeTab === 1) {
      setGroupCount(countGroupRequests(requests));
    } else if (activeTab === 2) {
      setPrivateCount(countPrivateRequests(requests));
    }
  }, [requests, activeTab]);

  const handleGroupDialogOpen = (
    open: boolean,
    request?: ReceivedChatRequest
  ) => {
    setGroupDialogOpen(open);
    setGroupDialogRequest(open && request ? request : null);
  };

  const handleRefresh = () => {
    setRefreshing(true);
  };

  const filteredRequests = requests.filter((request) =>
    request.receiver.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StatusChip = ({ status }: { status: string }) => {
    switch (status) {
      case "accepted":
        return (
          <Chip
            icon={<CheckCircle fontSize="small" />}
            label="Accepted"
            color="success"
            size="small"
            variant="outlined"
          />
        );
      case "rejected":
        return (
          <Chip
            icon={<Cancel fontSize="small" />}
            label="Rejected"
            color="error"
            size="small"
            variant="outlined"
          />
        );
      default:
        return (
          <Chip
            icon={<Pending fontSize="small" />}
            label="Pending"
            color="warning"
            size="small"
            variant="outlined"
          />
        );
    }
  };

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', px: { xs: 1, sm: 3, md: 6 }, mx: 0, overflowX: 'hidden', bgcolor: theme.palette.background.default }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          mb: 3,
          borderRadius: 3,
          background: theme.palette.primary.main,
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
          color: "white",
          boxShadow: theme.shadows[4],
          maxWidth: "100vw",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={3}
        >
          <Box textAlign={{ xs: "center", sm: "left" }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.8rem", sm: "2.2rem" },
              }}
            >
              Sent Chat Requests
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ opacity: 0.9, maxWidth: "600px" }}
            >
              Track the status of your outgoing chat invitations and manage your
              connections
            </Typography>
          </Box>
          <Badge
            badgeContent={requests.length}
            color="secondary"
            overlap="circular"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "1rem",
                width: 30,
                height: 30,
                borderRadius: "50%",
              },
            }}
          >
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(5px)",
              }}
            >
              <Notifications sx={{ fontSize: 32 }} />
            </Avatar>
          </Badge>
        </Box>
      </Paper>

      {/* Controls Section */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          boxShadow: theme.shadows[1],
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={1} width="100%">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search requests..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3 },
                }}
                sx={{
                  maxWidth: 400,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            <Box
              display="flex"
              alignItems="center"
              gap={1}
              flexShrink={0}
              flexWrap="wrap"
            >
              <IconButton
                onClick={handleRefresh}
                color="primary"
                sx={{
                  borderRadius: 2,
                  bgcolor: refreshing
                    ? theme.palette.action.selected
                    : "transparent",
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
                disabled={refreshing}
              >
                <Refresh
                  sx={{
                    transition: "transform 0.5s ease",
                    transform: refreshing ? "rotate(360deg)" : "rotate(0deg)",
                  }}
                />
              </IconButton>

              <Tabs
                value={activeTab}
                onChange={(_e, newValue) => setActiveTab(newValue)}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{
                  "& .MuiTabs-indicator": {
                    height: 3,
                    borderRadius: 3,
                  },
                }}
              >
                <Tab
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2">All</Typography>
                      <Chip
                        label={pendingCount}
                        size="small"
                        color="primary"
                        sx={{ borderRadius: 1, height: 20 }}
                      />
                    </Box>
                  }
                  sx={{ minHeight: 48 }}
                />
                <Tab
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Group fontSize="small" />
                      <Typography variant="body2">Groups</Typography>
                      <Chip
                        label={groupCount}
                        size="small"
                        color="primary"
                        sx={{ borderRadius: 1, height: 20 }}
                      />
                    </Box>
                  }
                  sx={{ minHeight: 48 }}
                />
                <Tab
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person fontSize="small" />
                      <Typography variant="body2">Private</Typography>
                      <Chip
                        label={privateCount}
                        size="small"
                        color="primary"
                        sx={{ borderRadius: 1, height: 20 }}
                      />
                    </Box>
                  }
                  sx={{ minHeight: 48 }}
                />
              </Tabs>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Bar */}
      <Box
        display="flex"
        gap={2}
        mb={4}
        flexWrap="wrap"
        justifyContent={{ xs: "center", sm: "flex-start" }}
      >
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            minWidth: 120,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
          }}
        >
          <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Sent
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {requests.length}
            </Typography>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            minWidth: 120,
            borderLeft: `4px solid ${theme.palette.success.main}`,
          }}
        >
          <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Typography variant="subtitle2" color="text.secondary">
              Accepted
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {requests.filter((r) => r.status === "accepted").length}
            </Typography>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            minWidth: 120,
            borderLeft: `4px solid ${theme.palette.warning.main}`,
          }}
        >
          <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Typography variant="subtitle2" color="text.secondary">
              Pending
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {requests.filter((r) => r.status === "pending").length}
            </Typography>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            minWidth: 120,
            borderLeft: `4px solid ${theme.palette.error.main}`,
          }}
        >
          <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Typography variant="subtitle2" color="text.secondary">
              Rejected
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {requests.filter((r) => r.status === "rejected").length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Sent Chat Requests List */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <Box display="flex" gap={2} mb={2}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box flexGrow={1}>
                      <Skeleton width="60%" height={24} />
                      <Skeleton width="40%" height={20} />
                    </Box>
                  </Box>
                  <Skeleton variant="rectangular" width="100%" height={100} />
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Skeleton width="40%" height={36} />
                    <Skeleton width="20%" height={36} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : filteredRequests.length === 0 ? (
        <Card
          sx={{
            textAlign: "center",
            p: 6,
            borderRadius: 3,
            boxShadow: "none",
            border: `1px dashed ${theme.palette.divider}`,
          }}
        >
          <Message
            sx={{
              fontSize: 64,
              color: "text.secondary",
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography variant="h5" gutterBottom>
            {searchQuery ? "No matching requests found" : "No sent requests yet"}
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth="500px" mx="auto">
            {searchQuery
              ? "Try adjusting your search query"
              : "When you send chat invitations, they'll appear here for tracking"}
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredRequests.map((request: any) => (
            <Grid item xs={12} sm={6} md={4} key={request._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={request.receiver.profilePicture}
                        sx={{ width: 48, height: 48 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          noWrap
                          maxWidth="150px"
                        >
                          {request.receiver.username}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontSize="0.75rem"
                        >
                          {formatTimestamp(request.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    <StatusChip status={request.status} />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {request.message || "No message provided"}
                  </Typography>

                  {request.chatType === "group" && (
                    <Box mb={2}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mb={1}
                      >
                        Group members:
                      </Typography>
                      <AvatarGroup max={4} sx={{ justifyContent: "flex-start" }}>
                        {request.groupMembers?.map((member: any) => (
                          <Avatar
                            key={member._id}
                            src={member.profilePicture}
                            sx={{ width: 32, height: 32 }}
                          />
                        ))}
                      </AvatarGroup>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Chip
                      label={
                        request.chatType === "group" ? "Group Chat" : "Private"
                      }
                      size="small"
                      color={request.chatType === "group" ? "primary" : "secondary"}
                      variant="outlined"
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleGroupDialogOpen(true, request)}
                      sx={{
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <ArrowForward fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <GroupChatMembersDialog
        open={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        request={groupDialogRequest as ReceivedChatRequest}
      />
    </Box>
  );
};

export default SentChatRequest;
import useChat from "../../hooks/useChat/useChat";
import { useState, useEffect, useMemo } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Badge,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  Notifications,
  Search,
  FilterList,
  Group,
  Person,
  Message,
} from "@mui/icons-material";
import {
  differenceInDays,
  differenceInHours,
  isValid,
  parseISO,
} from "date-fns";
import { ChatRequest } from "./ChatRequest.types";
import ChatRequestCard from "../../components/ChatRequestCard/ChatRequestCard";
import ChatRequestCardSkeleton from "../../components/ChatRequestCardSkeleton/ChatRequestCardSkeleton";

const ChatRequestsPage = () => {
  const { getReceivedChatRequests, acceptChatRequest, rejectChatRequest } =
    useChat();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Group, 2: Private
  const [requests, setRequests] = useState<ChatRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currUser, setCurrUser] = useState<string>(""); // Assuming you have a way to get the current user

  // Fetch chat requests on mount and when tab changes
  useEffect(() => {
    let isMounted = true;
    const fetchRequests = async () => {
      setLoading(true);
      try {
        let response;
        if (activeTab === 0) {
          response = await getReceivedChatRequests();
        } else if (activeTab === 1) {
          response = await getReceivedChatRequests("group");
        } else if (activeTab === 2) {
          response = await getReceivedChatRequests("private");
        }
        if (isMounted && response?.receivedChatRequests) {
          setRequests(response.receivedChatRequests);
        }
        setCurrUser(response?.currentUser); // Set current user ID
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRequests();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // Filter requests based on search and tab
  const filteredRequests = useMemo(() => {
    let filtered = requests;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((req) => {
        if (req.chatType === "group") {
          return (
            req.groupName?.toLowerCase().includes(searchLower) ||
            req.owner?.profile?.fullName?.toLowerCase().includes(searchLower) ||
            req.chatReason?.otherReason?.toLowerCase().includes(searchLower)
          );
        } else {
          // private
          // Find the other user (not the current user)
          const otherUser = req.users?.find(
            (u: any) => u.user && u.user._id !== req.owner?._id
          );
          return (
            otherUser?.user?.profile?.fullName
              ?.toLowerCase()
              .includes(searchLower) ||
            req.chatReason?.otherReason?.toLowerCase().includes(searchLower)
          );
        }
      });
    }
    return filtered;
  }, [requests, searchTerm]);

  const formatTimestamp = (timestamp: string | Date) => {
    if (!timestamp) return "";

    // Parse string timestamps to Date
    const date =
      typeof timestamp === "string" ? parseISO(timestamp) : timestamp;
    if (!isValid(date)) return "";

    const now = new Date();
    const diffHours = differenceInHours(now, date);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = differenceInDays(now, date);
    return `${diffDays}d ago`;
  };

  // Accept chat request
  const handleAccept = async (requestId: string) => {
    try {
      await acceptChatRequest(requestId);
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId
            ? {
                ...req,
                users: req.users.map((u: any) =>
                  u.user._id === currUser ? { ...u, status: "accepted" } : u
                ),
              }
            : req
        )
      );
    } catch {
      // Optionally show error feedback
      console.log("Failed to accept chat request");
    }
  };

  // Reject chat request
  const handleReject = async (requestId: string) => {
    try {
      await rejectChatRequest(requestId);
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId
            ? {
                ...req,
                users: req.users.map((u: any) =>
                  u.user._id === currUser ? { ...u, status: "rejected" } : u
                ),
              }
            : req
        )
      );
    } catch {
      // Optionally show error feedback
    }
  };

  const handleProfileClick = (userId: string) => {
    // Navigate to profile page
    console.log(`Navigate to profile: ${userId}`);
    // In real app: navigate(`/profile/${userId}`);
  };

  // Count logic (pending, group, private)
  const pendingCount = requests.filter((req) =>
    req.users?.some(
      (u: any) => u.user._id === currUser && u.status === "pending"
    )
  ).length;
  const groupCount = requests.filter(
    (req) =>
      req.chatType === "group" &&
      req.users?.some(
        (u: any) => u.user._id === currUser && u.status === "pending"
      )
  ).length;
  const privateCount = requests.filter(
    (req) =>
      req.chatType === "private" &&
      req.users?.some(
        (u: any) => u.user._id === currUser && u.status === "pending"
      )
  ).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Chat Requests
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Manage your incoming chat requests and connect with your community
            </Typography>
          </Box>
          <Badge badgeContent={pendingCount} color="error">
            <Notifications sx={{ fontSize: 40 }} />
          </Badge>
        </Box>
      </Paper>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
            alignItems="center"
          >
            <TextField
              fullWidth
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: { md: 400 } }}
            />
            <Box display="flex" alignItems="center" gap={1}>
              <FilterList />
              <Tabs
                value={activeTab}
                onChange={(_e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab
                  label={
                    <Badge badgeContent={pendingCount} color="primary">
                      All Requests
                    </Badge>
                  }
                />
                <Tab
                  label={
                    <Badge badgeContent={groupCount} color="primary">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Group fontSize="small" />
                        Groups
                      </Box>
                    </Badge>
                  }
                />
                <Tab
                  label={
                    <Badge badgeContent={privateCount} color="primary">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Person fontSize="small" />
                        Private
                      </Box>
                    </Badge>
                  }
                />
              </Tabs>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Chat Requests List */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <ChatRequestCardSkeleton key={idx} />
          ))
        ) : filteredRequests.length === 0 ? (
          <Grid>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <Message
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  No chat requests found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "You have no pending chat requests"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredRequests.map((request: any) => {
            const myUserObj = request.users?.find(
              (u: any) => u.user && u.user._id === currUser
            );
            const myStatus = myUserObj?.status || "pending";
            return (
              <Grid key={request._id}>
                <ChatRequestCard
                  request={request}
                  myStatus={myStatus}
                  currUser={currUser}
                  formatTimestamp={(ts: string | Date) =>
                    formatTimestamp(ts || "")
                  }
                  handleAccept={handleAccept}
                  handleReject={handleReject}
                  handleProfileClick={handleProfileClick}
                />
              </Grid>
            );
          })
        )}
      </Grid>
    </Container>
  );
};

export default ChatRequestsPage;

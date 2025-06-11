import useChat from "../../hooks/useChat/useChat";
import { useState, useEffect } from "react";
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
  Grid,
} from "@mui/material";
import {
  Notifications,
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

import GroupChatMembersDialog from "../../components/GroupChatMembersDialog/GroupChatMembersDialog";
import { ReceivedChatRequest } from "./ReceivedChatRequest.types";
import ReceivedChatRequestCard from "@/components/ReceivedChatRequestCard/ReceivedChatRequestCard";
import ReceivedChatRequestCardSkeleton from "@/components/ReceivedChatRequestCardSkeleton/ReceivedChatRequestCardSkeleton ";
import countPendingRequests from "@/utils/countPendingRequests";
import countGroupRequests from "@/utils/countGroupRequests";
import countPrivateRequests from "@/utils/countPrivateRequests";

const ReceivedChatRequestPage = () => {
  const { getReceivedChatRequests, acceptChatRequest, rejectChatRequest } =
    useChat();

  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Group, 2: Private
  const [requests, setRequests] = useState<ReceivedChatRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currUser, setCurrUser] = useState<string>(""); // Assuming you have a way to get the current user
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupDialogRequest, setGroupDialogRequest] =
    useState<ReceivedChatRequest | null>(null);

  const [pendingCount, setPendingCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [privateCount, setPrivateCount] = useState(0);



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
          setCurrUser(response?.currUser); // Trigger counting in the other effect
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRequests();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  useEffect(() => {
    if (!currUser || requests.length === 0) return;

    if (activeTab === 0) {
      setPendingCount(countPendingRequests(requests, currUser));
      setGroupCount(countGroupRequests(requests, currUser));
      setPrivateCount(countPrivateRequests(requests, currUser));
    } else if (activeTab === 1) {
      setGroupCount(countGroupRequests(requests, currUser));
    } else if (activeTab === 2) {
      setPrivateCount(countPrivateRequests(requests, currUser));
    }
  }, [currUser, requests, activeTab]);

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
      const result = await acceptChatRequest(requestId);
      const chat: string = result?.chat || null;
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId
            ? {
                ...req,
                users: req.users.map((u: any) =>
                  u.user._id === currUser ? { ...u, status: "accepted" } : u
                ),
                chat: chat || null,
              }
            : req
        )
      );
      setPendingCount((prev) => prev - 1);
      return { chat };
    } catch {
      // Optionally show error feedback
      return {};
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
                chat: null,
              }
            : req
        )
      );
      setPendingCount((prev) => prev - 1);
      return { rejected: true };
    } catch (error) {
      // Optionally show error feedback
      console.log("Error rejecting request:", error);
      return { rejected: false };
    }
  };

  const handleProfileClick = (userId: string) => {
    // Navigate to profile page
    console.log(`Navigate to profile: ${userId}`);
    // In real app: navigate(`/profile/${userId}`);
  };

  const handleGroupDialogOpen = (
    open: boolean,
    request?: ReceivedChatRequest
  ) => {
    setGroupDialogOpen(open);
    setGroupDialogRequest(open && request ? request : null);
  };

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
              Received Chat Requests
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
            <ReceivedChatRequestCardSkeleton key={idx} />
          ))
        ) : requests.length === 0 ? (
          <Grid>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <Message
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  No chat requests found
                </Typography>
               
              </CardContent>
            </Card>
          </Grid>
        ) : (
          requests.map((request: any) => {
            const myUserObj = request.users?.find(
              (u: any) => u.user && u.user._id === currUser
            );
            const myStatus = myUserObj?.status || "pending";
            return (
              <Grid key={request._id}>
                <ReceivedChatRequestCard
                  request={request}
                  myStatus={myStatus}
                  formatTimestamp={(ts: string | Date) =>
                    formatTimestamp(ts || "")
                  }
                  handleAccept={handleAccept}
                  handleReject={handleReject}
                  handleProfileClick={handleProfileClick}
                  setGroupDialogOpen={handleGroupDialogOpen}
                />
              </Grid>
            );
          })
        )}
      </Grid>
      <GroupChatMembersDialog
        open={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        request={groupDialogRequest as ReceivedChatRequest}
      />
    </Container>
  );
};

export default ReceivedChatRequestPage;

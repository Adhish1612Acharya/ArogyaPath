import { useEffect, useState } from "react";
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
import useChat from "@/hooks/useChat/useChat";
import SentChatRequestCard from "@/components/SentChatRequestCard/SentChatRequestCard";
import GroupChatMembersDialog from "@/components/GroupChatMembersDialog/GroupChatMembersDialog";
import { ReceivedChatRequest } from "../ReceivedChatRequest/ReceivedChatRequest.types";
import ReceivedChatRequestCardSkeleton from "@/components/ReceivedChatRequestCardSkeleton/ReceivedChatRequestCardSkeleton ";
import formatTimestamp from "@/utils/formatTimeStamp";
import countGroupRequests from "@/utils/countGroupRequests";
import countPrivateRequests from "@/utils/countPrivateRequests";
import countPendingRequests from "@/utils/countPendingRequests";

const SentChatRequest = () => {
  const { getSentChatRequests } = useChat();
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Group, 2: Private
  const [requests, setRequests] = useState<ReceivedChatRequest[]>([]);
  const [loading, setLoading] = useState(true);
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
      }
    };
    fetchRequests();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

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
  }, [requests]);

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
          background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
          color: "white",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Sent Chat Requests
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              View and track the status of your sent chat requests
            </Typography>
          </Box>
          <Badge badgeContent={requests.length} color="primary">
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
                      All
                    </Badge>
                  }
                />
                <Tab
                  label={
                    <Badge badgeContent={groupCount} color="primary">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Group fontSize="small" /> Groups
                      </Box>
                    </Badge>
                  }
                />
                <Tab
                  label={
                    <Badge badgeContent={privateCount} color="primary">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Person fontSize="small" /> Private
                      </Box>
                    </Badge>
                  }
                />
              </Tabs>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Sent Chat Requests List */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Grid key={idx}>
              <ReceivedChatRequestCardSkeleton />
            </Grid>
          ))
        ) : requests.length === 0 ? (
          <Grid>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <Message
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  No sent chat requests found
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          requests.map((request: any) => (
            <Grid key={request._id}>
              <SentChatRequestCard
                request={request}
                formatTimestamp={(ts: string | Date) => formatTimestamp(ts)}
                setGroupDialogOpen={handleGroupDialogOpen}
                myStatus={"pending"}
                handleAccept={async () => ({})}
                handleReject={async () => ({ rejected: false })}
                handleProfileClick={() => {}}
              />
            </Grid>
          ))
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

export default SentChatRequest;

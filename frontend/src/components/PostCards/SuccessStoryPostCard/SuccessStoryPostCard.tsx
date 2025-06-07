import {
  Avatar,
  Card,
  CardContent,
  CardActions,
  Chip,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  CardHeader,
  Collapse,
  Box,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  Bookmark,
  BookmarkBorder,
  MenuBook,
  AccessTime,
  MoreVert,
  Visibility,
  Close,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef, FC } from "react";
import MediaPreview from "../../MediaPreview/MediaPreview";
import { MediaUpload } from "../../MediaPreview/MediaPreview.types";
import ShareMenu from "../../ShareMenu/ShareMenu";
import { SuccessStoryCardProps } from "./SuccessStoryPostCard.types";
import CommentSection from "../CommentSection/CommentSection";
import { Comment } from "@/types/Comment.types";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import React from "react";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  transition: "all 0.3s ease",
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.grey[200]}`,
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-4px)",
  },
}));

const PostTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.25rem",
  lineHeight: 1.4,
  color: theme.palette.grey[900],
  marginBottom: theme.spacing(1.5),
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const PostDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
  fontSize: "0.95rem",
  lineHeight: 1.6,
  marginBottom: theme.spacing(2),
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const RoutineItem = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  position: "relative",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.success.light,
  },
}));

const VerificationBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginRight: theme.spacing(1),
  '& svg': {
    marginRight: theme.spacing(0.5),
    fontSize: '1rem',
  }
}));

const VerifiedBadge = styled(VerificationBadge)(({ theme }) => ({
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.dark,
}));

const InvalidBadge = styled(VerificationBadge)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.dark,
}));

const UnverifiedBadge = styled(VerificationBadge)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.grey[600],
}));

const SuccessStoryPostCard: FC<SuccessStoryCardProps> = ({
  post,
  isLiked,
  isSaved,
  currentUserId,
  menuItems,
  onMediaClick,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [viewCount] = useState(Math.floor(Math.random() * 1000));
  const [verifiersDialogOpen, setVerifiersDialogOpen] = useState(false);
  const [invalidDialogOpen, setInvalidDialogOpen] = useState(false);
  const [invalidReason, setInvalidReason] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "verified" | "invalid" | "unverified"
  >(post.verified.length > 0 ? "verified" : post.invalid ? "invalid" : "unverified");
  const [showVerifyActions, setShowVerifyActions] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleCommentClick = () => {
    setCommentOpen(!commentOpen);
    if (!commentOpen && commentInputRef.current) {
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const toggleSave = () => {
    setSaved(!saved);
  };

  const handleVerifiersClick = () => {
    if (verificationStatus === "verified") {
      setVerifiersDialogOpen(true);
    }
  };

  const handleVerify = () => {
    setVerificationLoading(true);
    setTimeout(() => {
      setVerificationStatus("verified");
      setVerificationLoading(false);
      // In a real app, you would update the post.verified array here
    }, 1000);
  };

  const handleMarkInvalid = () => {
    setInvalidDialogOpen(true);
  };

  const confirmInvalid = () => {
    setVerificationLoading(true);
    setTimeout(() => {
      setVerificationStatus("invalid");
      setVerificationLoading(false);
      setInvalidDialogOpen(false);
      // In a real app, you would update the post.invalid object here
      // post.invalid = { reason: invalidReason, by: currentUserId }
    }, 1000);
  };

  // Helper: is current user a tagged doctor?
  const isTaggedDoctor = post.tagged.some((doctor) => doctor._id === currentUserId);
  const canVerifyOrInvalidate = isTaggedDoctor && verificationStatus === "unverified";

  const menuOpen = Boolean(menuAnchorEl);
  const shareOpen = Boolean(shareAnchorEl);

  // When verification status changes, hide verify actions
  React.useEffect(() => {
    setShowVerifyActions(false);
  }, [verificationStatus]);

  // Get verification status for each tagged doctor
  const getTaggedDoctorStatus = (doctorId: string) => {
    if (post.verified.some(d => d._id === doctorId)) return "verified";
    if (post.invalid && post.invalid.by === doctorId) return "invalid";
    return "unverified";
  };

  return (
    <StyledCard>
      {/* Author section */}
      <CardHeader
        avatar={
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  border: `2px solid ${theme.palette.background.paper}`,
                }}
              />
            }
          >
            <Avatar
              src={post.owner.profile.profileImage}
              sx={{
                width: 48,
                height: 48,
                border: "2px solid white",
                boxShadow: theme.shadows[1],
                "&:hover": {
                  transform: "scale(1.1)",
                  transition: "transform 0.3s",
                },
              }}
            >
              {post.owner.profile.fullName[0]}
            </Avatar>
          </Badge>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Verification badge logic for tagged doctor: show Not Verified as clickable if canVerifyOrInvalidate */}
            {canVerifyOrInvalidate ? (
              <Tooltip title="Not yet verified by medical professionals. Click to verify or mark invalid." arrow>
                <UnverifiedBadge
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setShowVerifyActions(!showVerifyActions)}
                >
                  <Warning fontSize="small" />
                  Unverified
                </UnverifiedBadge>
              </Tooltip>
            ) : (
              <>
                {verificationStatus === "verified" && (
                  <Tooltip title="Verified by medical professionals" arrow>
                    <VerifiedBadge 
                      onClick={handleVerifiersClick}
                      sx={{ cursor: 'pointer' }}
                    >
                      <CheckCircle fontSize="small" />
                      Verified
                    </VerifiedBadge>
                  </Tooltip>
                )}
                {verificationStatus === "invalid" && (
                  <Tooltip title={`Invalid post: ${post.invalid?.reason || "No reason provided"}`} arrow>
                    <InvalidBadge>
                      <Warning fontSize="small" />
                      Invalid
                    </InvalidBadge>
                  </Tooltip>
                )}
                {verificationStatus === "unverified" && (
                  <Tooltip title="Not yet verified by medical professionals" arrow>
                    <UnverifiedBadge>
                      <Warning fontSize="small" />
                      Unverified
                    </UnverifiedBadge>
                  </Tooltip>
                )}
              </>
            )}
            {/* Show verify/invalid actions inline if showVerifyActions is true */}
            {canVerifyOrInvalidate && showVerifyActions && (
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  startIcon={verificationLoading ? <Loader2 className="animate-spin" /> : <CheckCircle />}
                  onClick={handleVerify}
                  disabled={verificationLoading}
                >
                  Verify
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={verificationLoading ? <Loader2 className="animate-spin" /> : <Warning />}
                  onClick={handleMarkInvalid}
                  disabled={verificationLoading}
                >
                  Mark Invalid
                </Button>
              </Box>
            )}
            {/* Menu button */}
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ color: "grey.600" }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        }
        title={
          <Typography variant="subtitle1" fontWeight={600}>
            {post.owner.profile.fullName}
          </Typography>
        }
        subheader={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Tooltip title="Posted time" arrow>
              <Typography
                variant="caption"
                sx={{ display: "flex", alignItems: "center", color: "grey.600" }}
              >
                <AccessTime fontSize="inherit" sx={{ mr: 0.5 }} />
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </Typography>
            </Tooltip>
            <Typography variant="caption" sx={{ color: "grey.400" }}>
              •
            </Typography>
            <Tooltip title="Reading time" arrow>
              <Typography
                variant="caption"
                sx={{ display: "flex", alignItems: "center", color: "grey.600" }}
              >
                <MenuBook fontSize="inherit" sx={{ mr: 0.5 }} />
                {post.readTime}
              </Typography>
            </Tooltip>
          </Box>
        }
        sx={{
          pb: 1,
          "& .MuiCardHeader-action": {
            alignSelf: "center",
          },
        }}
      />

      {/* Tagged Doctors */}
      {post.tagged.length > 0 && (
        <Box sx={{ px: 2, pt: 0, pb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Tagged Doctors:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {post.tagged.map((doctor) => {
              const status = getTaggedDoctorStatus(doctor._id);
              return (
                <Chip
                  key={doctor._id}
                  avatar={<Avatar src={doctor.profile.profileImage} />}
                  label={`Dr. ${doctor.profile.fullName}`}
                  size="small"
                  onClick={() => navigate(`/doctors/profile/${doctor._id}`)}
                  sx={{
                    backgroundColor: 
                      status === "verified" ? "rgba(5, 150, 105, 0.1)" :
                      status === "invalid" ? "rgba(239, 68, 68, 0.1)" :
                      "rgba(156, 163, 175, 0.1)",
                    color: 
                      status === "verified" ? "rgb(5, 150, 105)" :
                      status === "invalid" ? "rgb(239, 68, 68)" :
                      "rgb(156, 163, 175)",
                    "&:hover": {
                      backgroundColor: 
                        status === "verified" ? "rgba(5, 150, 105, 0.2)" :
                        status === "invalid" ? "rgba(239, 68, 68, 0.2)" :
                        "rgba(156, 163, 175, 0.2)",
                    },
                    fontSize: "0.7rem",
                    height: "28px",
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}

      {/* Post content */}
      <CardContent sx={{ pt: 0, pb: 2 }}>
        <PostTitle>{post.title}</PostTitle>
        
        <PostDescription>
          {post.description}
        </PostDescription>

        {/* Media display */}
        {post.media && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: theme.spacing(2) }}
          >
            <MediaPreview
              media={post.media as MediaUpload}
              onMediaClick={onMediaClick}
            />
          </motion.div>
        )}

        {/* Routines */}
        <Box sx={{ mb: 2 }}>
          {post.routines.map((routine, index) => (
            <RoutineItem key={index}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  pt: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                  }}
                />
                {index < post.routines.length - 1 && (
                  <Box
                    sx={{
                      width: 2,
                      height: 24,
                      backgroundColor: theme.palette.grey[300],
                      my: 0.5,
                    }}
                  />
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="success.dark">
                  {routine.time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {routine.content}
                </Typography>
              </Box>
            </RoutineItem>
          ))}
        </Box>

        {/* Tags */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {post.filters.map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              size="small"
              sx={{
                backgroundColor: "rgba(5, 150, 105, 0.1)",
                color: "rgb(5, 150, 105)",
                "&:hover": {
                  backgroundColor: "rgba(5, 150, 105, 0.2)",
                },
                fontSize: "0.7rem",
                height: "24px",
              }}
            />
          ))}
        </Box>

        {/* Verification Status and buttons */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          {verificationStatus === "unverified" && (
            <Chip
              label="Not Verified"
              size="small"
              sx={{
                backgroundColor: theme.palette.grey[100],
                color: theme.palette.grey[600],
              }}
            />
          )}
          {/* Verification buttons for tagged doctors */}
          {canVerifyOrInvalidate && showVerifyActions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                color="success"
                startIcon={verificationLoading ? <Loader2 className="animate-spin" /> : <CheckCircle />}
                onClick={handleVerify}
                disabled={verificationLoading}
              >
                Verify
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={verificationLoading ? <Loader2 className="animate-spin" /> : <Warning />}
                onClick={handleMarkInvalid}
                disabled={verificationLoading}
              >
                Mark Invalid
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Stats and Actions */}
      <CardActions sx={{ 
        px: 2,
        py: 1,
        bgcolor: "grey.50",
        borderTop: `1px solid ${theme.palette.grey[200]}`,
      }}>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          width: "100%"
        }}>
          {/* Left side - Like, Comment, Share */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
            <Tooltip title={liked ? "Unlike" : "Like"} arrow>
              <ActionButton
                size="small"
                onClick={toggleLike}
                sx={{
                  color: liked ? "error.main" : "grey.600",
                }}
              >
                {liked ? <Favorite /> : <FavoriteBorder />}
                <Typography variant="body2" sx={{ ml: 0.5, minWidth: 20 }}>{likeCount}</Typography>
              </ActionButton>
            </Tooltip>

            <Tooltip title="Comments" arrow>
              <ActionButton
                size="small"
                onClick={handleCommentClick}
                sx={{
                  color: "grey.600",
                }}
              >
                <ChatBubbleOutline />
                <Typography variant="body2" sx={{ ml: 0.5, minWidth: 20 }}>{post.commentsCount}</Typography>
              </ActionButton>
            </Tooltip>

            <Tooltip title="Share" arrow>
              <ActionButton
                size="small"
                onClick={handleShareClick}
                sx={{
                  color: "grey.600",
                }}
              >
                <Share />
              </ActionButton>
            </Tooltip>
          </Box>
          
          {/* Right side - Bookmark and Views (only for author) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title={saved ? "Unsave" : "Save"} arrow>
              <ActionButton
                size="small"
                onClick={toggleSave}
                sx={{
                  color: saved ? "warning.main" : "grey.600",
                }}
              >
                {saved ? <Bookmark /> : <BookmarkBorder />}
              </ActionButton>
            </Tooltip>
            
            {post.owner._id === currentUserId && (
              <Tooltip title="Views" arrow>
                <Typography variant="caption" sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  color: "grey.600",
                  ml: 1,
                }}>
                  <Visibility fontSize="small" sx={{ mr: 0.5 }} />
                  {viewCount}
                </Typography>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardActions>

      {/* Comment Section */}
      <Collapse in={commentOpen} timeout="auto" unmountOnExit>
        <Divider />
        <CommentSection
          comments={comments}
          setComments={setComments}
          postId={post._id}
          currentUserId={currentUserId}
          inputRef={commentInputRef}
        />
      </Collapse>

      <ShareMenu
        anchorEl={shareAnchorEl}
        open={shareOpen}
        onClose={handleShareClose}
        postTitle={post.title}
      />

      {/* Post Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
          },
        }}
      >
        <MenuItem
          onClick={handleShareClick}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(5, 150, 105, 0.08)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "rgb(5, 150, 105)" }}>
            <Share fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Share" />
        </MenuItem>
        
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleMenuClose();
              item.action();
            }}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(5, 150, 105, 0.08)",
              },
              ...(item.label === "Delete" ? {
                "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.08)" }
              } : {})
            }}
          >
            <ListItemIcon sx={{ 
              color: item.label === "Delete" ? "error.main" : "rgb(5, 150, 105)" 
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              sx={item.label === "Delete" ? { color: "error.main" } : {}} 
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Verifiers Dialog */}
      <Dialog
        open={verifiersDialogOpen}
        onClose={() => setVerifiersDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Verified By</Typography>
            <IconButton onClick={() => setVerifiersDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {post.verified.map((doctor) => (
              <Box 
                key={doctor._id} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer'
                  }
                }}
                onClick={() => navigate(`/doctors/profile/${doctor._id}`)}
              >
                <Avatar 
                  src={doctor.profile.profileImage} 
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Typography variant="subtitle1">
                  Dr. {doctor.profile.fullName}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <CheckCircle color="success" />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifiersDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Mark Invalid Dialog */}
      <Dialog
        open={invalidDialogOpen}
        onClose={() => setInvalidDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Mark Post as Invalid</Typography>
            <IconButton onClick={() => setInvalidDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please provide a reason for marking this post as invalid:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={invalidReason}
            onChange={(e) => setInvalidReason(e.target.value)}
            placeholder="Enter reason (e.g., misleading information, inappropriate content, etc.)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvalidDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmInvalid} 
            color="error"
            variant="contained"
            disabled={!invalidReason.trim()}
          >
            Confirm Invalid
          </Button>
        </DialogActions>
      </Dialog>
    </StyledCard>
  );
};

export default SuccessStoryPostCard;
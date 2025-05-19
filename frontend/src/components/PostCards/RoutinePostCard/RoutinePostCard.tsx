import {
  Favorite,
  ChatBubbleOutline,
  Share,
  Bookmark,
  MenuBook,
  AccessTime,
  MoreVert,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef, FC } from "react";
import { styled } from "@mui/material/styles";
import ShareMenu from "../../ShareMenu/ShareMenu";
import MediaPreview from "../../MediaPreview/MediaPreview";
import { RoutinePostCardProps } from "./RoutinePostCard.types";
import CommentSection from "../CommentSection/CommentSection";
import { Comment } from "@/types/Comment.types";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: "800px",
  margin: "0 auto",
  overflow: "hidden",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
  transition: theme.transitions.create("box-shadow"),
}));

const ActivityDot = styled("div")(({ theme }) => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  "&:hover": {
    backgroundColor: theme.palette.success.dark,
  },
  transition: theme.transitions.create("background-color"),
}));

const ActivityLine = styled("div")(({ theme }) => ({
  width: 2,
  flex: 1,
  backgroundColor: theme.palette.success.light,
  "&:hover": {
    backgroundColor: theme.palette.success.main,
  },
  transition: theme.transitions.create("background-color"),
}));

const RoutinePostCard: FC<RoutinePostCardProps> = ({
  post,
  isLiked,
  isSaved,
  currentUserId,
  onMediaClick,
  menuItems,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const commentInputRef = useRef<HTMLInputElement>(null);

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
    // Api call for fetching all comments
    // const respons = {};
    // setComments(response.data);
    if (!commentOpen && commentInputRef.current) {
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  const toggleLike = () => {
    alert("Yet to implement");
    // setGeneralPosts((prevPosts) =>
    //   prevPosts.map((post) => {
    //     if (post._id === postId) {
    //       const isLiked = post.likedBy.includes(userId);
    //       return {
    //         ...post,
    //         likes: isLiked ? post.likes - 1 : post.likes + 1,
    //         likedBy: isLiked
    //           ? post.likedBy.filter((id) => id !== userId)
    //           : [...post.likedBy, userId],
    //       };
    //     }
    //     return post;
    //   })
    // );
  };

  const toggleSave = () => {
    alert("Yet to implement");
    // setSavedPosts((prev) => {
    //   const newSaved = new Set(prev);
    //   newSaved.has(postId) ? newSaved.delete(postId) : newSaved.add(postId);
    //   return newSaved;
    // });
  };

  const openMenu = Boolean(menuAnchorEl);
  const shareOpen = Boolean(shareAnchorEl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StyledCard>
        <CardHeader
          avatar={
            <Avatar
              src={post.owner.profile.profileImage}
              alt={post.owner.profile.fullName}
              sx={{
                width: 48,
                height: 48,
                border: "2px solid",
                borderColor: "success.light",
                cursor: "pointer",
              }}
            >
              {post.owner.profile.fullName[0]}
            </Avatar>
          }
          action={
            <>
              {menuItems.length > 0 && (
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MoreVert />
                </IconButton>
              )}
              <Menu
                anchorEl={menuAnchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      item.action();
                      handleMenuClose();
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText>{item.label}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>
            </>
          }
          title={post.owner.profile.fullName}
          subheader={
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Typography
                variant="caption"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <AccessTime fontSize="small" />
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                •
              </Typography>
              <Typography
                variant="caption"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <MenuBook fontSize="small" />
                {post.readTime}
              </Typography>
            </Box>
          }
          sx={{
            "& .MuiCardHeader-title": {
              fontWeight: "bold",
              "&:hover": {
                color: "success.main",
              },
              transition: "color 0.3s",
            },
            "& .MuiCardHeader-subheader": {
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            },
          }}
        />

        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              "&:hover": {
                color: "success.main",
                cursor: "pointer",
              },
              transition: "color 0.3s",
            }}
          >
            {post.title}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            whiteSpace="pre-line"
          >
            {post.description}
          </Typography>

          {/* Media display */}
          <MediaPreview
            media={{
              images: post.thumbnail ? [post.thumbnail] : [],
              video: "",
              document: "",
            }}
            onMediaClick={onMediaClick}
          />

          {/* Activities */}
          <Box mt={2}>
            {post.routines.map((routine, index) => (
              <Box key={index} display="flex" gap={2} position="relative">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  pt={0.5}
                >
                  <ActivityDot />
                  {index < post.routines.length - 1 && <ActivityLine />}
                </Box>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: 1,
                    "&:hover": {
                      bgcolor: "success.light",
                    },
                    transition: "background-color 0.3s",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" color="success.dark">
                    {routine.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {routine.content}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
            {post.filters.map((filter) => (
              <Chip
                key={filter}
                label={`#${filter}`}
                size="small"
                sx={{
                  bgcolor: "success.light",
                  color: "success.dark",
                  "&:hover": {
                    bgcolor: "success.main",
                    color: "white",
                  },
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
              />
            ))}
          </Box>
        </CardContent>

        <Divider />

        <CardActions
          sx={{ bgcolor: "grey.50", justifyContent: "space-between" }}
        >
          <Box display="flex" gap={1}>
            <Button
              size="small"
              startIcon={
                <Favorite
                  color={isLiked ? "error" : "inherit"}
                  sx={{ fill: isLiked ? "currentColor" : "none" }}
                />
              }
              onClick={toggleLike}
              sx={{
                color: isLiked ? "error.main" : "text.secondary",
                "&:hover": {
                  color: "error.main",
                },
              }}
            >
              {post.likesCount}
            </Button>
            <Button
              size="small"
              startIcon={<ChatBubbleOutline />}
              onClick={handleCommentClick}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {post.commentsCount}
            </Button>
            <Button
              size="small"
              startIcon={<Share />}
              onClick={handleShareClick}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "success.main",
                },
              }}
            >
              Share
            </Button>
          </Box>
          <IconButton
            onClick={toggleSave}
            sx={{
              color: isSaved ? "warning.main" : "text.secondary",
              "&:hover": {
                color: "warning.main",
              },
            }}
          >
            <Bookmark sx={{ fill: isSaved ? "currentColor" : "none" }} />
          </IconButton>
        </CardActions>

        <ShareMenu
          anchorEl={shareAnchorEl}
          open={shareOpen}
          onClose={handleShareClose}
          postTitle={post.title}
        />

        {/* Comment Section */}
        {commentOpen && (
          <>
            <Divider />
            <Box p={2}>
              <CommentSection
                comments={comments}
                setComments={setComments}
                postId={post._id}
                currentUserId={currentUserId}
                inputRef={commentInputRef}
              />
            </Box>
          </>
        )}
      </StyledCard>
    </motion.div>
  );
};

export default RoutinePostCard;

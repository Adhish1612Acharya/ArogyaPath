// src/components/PostCards/SuccessStoryCard.tsx
import {
  Favorite,
  ChatBubbleOutline,
  Share,
  Bookmark,
  MenuBook,
  AccessTime,
  MoreVert,
  Close,
  Verified,
  CheckCircle,
} from "@mui/icons-material";
import {
  Button,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Chip,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText as MuiListItemText,
  Paper,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef, FC } from "react";
import { SuccessStoryCardProps } from "./SuccessStoryPostCard.types";
import { Comment } from "@/types/Comment.types";
import MediaPreview from "@/components/MediaPreview/MediaPreview";
import { MediaUpload } from "@/components/MediaPreview/MediaPreview.types";
import CommentSection from "../CommentSection/CommentSection";
import ShareMenu from "@/components/ShareMenu/ShareMenu";
import useSuccessStory from "@/hooks/useSuccessStory/useSuccessStory";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const SuccessStoryPostCard: FC<SuccessStoryCardProps> = ({
  post,
  isLiked,
  isSaved,
  addVerifiedExpert,
  currentUserId,
  menuItems,
  onMediaClick,
}) => {
  const navigate = useNavigate();

  const { verifySuccessStory } = useSuccessStory();

  const [verifyPostLoad, setVerifyPostLoad] = useState<boolean>(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [verifiersDialogOpen, setVerifiersDialogOpen] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const [verifiedPost, setVerifiedPost] = useState<boolean>(
    post.verifyAuthorization && !post.alreadyVerified
  );

  const handleVerifiersClick = () => {
    setVerifiersDialogOpen(true);
  };
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

  const verifyPost = async () => {
    try {
      if (!post.verifyAuthorization) return;
      setVerifyPostLoad(true);
      const response = await verifySuccessStory(post._id);
      if (response?.success) {
        addVerifiedExpert(post._id, response.data.expertDetails);
        setVerifiedPost(false);
      }
    } catch (error: any) {
      console.error("Post failed:", error.message);
      if (error.status === 401) navigate("/auth");
      else if (error.status === 403) navigate("/");
    } finally {
      setVerifyPostLoad(false);
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
      <Card className="hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden max-w-2xl mx-auto">
        <CardContent className="p-4">
          {/* Author section */}
          <Box className="flex items-start space-x-4">
            {/* Author section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 w-80">
                <Avatar
                  className="h-12 w-12"
                  src={post.owner.profile.profileImage}
                >
                  {post.owner.profile.fullName[0]}
                </Avatar>
                <div className="space-y-1">
                  <Typography variant="subtitle1" className="font-semibold">
                    {post.owner.profile.fullName}
                  </Typography>

                  {/* Time and Read Time info right under full name */}
                  <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">
                      <AccessTime className="text-sm" />
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <MenuBook className="text-sm" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Box className="flex-1">
              <Box className="flex justify-between items-start">
                <Box>
                  {/* <Typography
                    variant="h6"
                    className="font-semibold hover:text-green-600 transition-colors"
                  >
                    {post.owner.profile.fullName}
                  </Typography> */}
                  <Box className="flex flex-wrap items-center gap-2 text-gray-500">
                    {/* <Typography
                      variant="caption"
                      className="flex items-center gap-1"
                    >
                      <AccessTime className="text-sm" />
                      {formatDistanceToNow(new Date(post.createdAt || ""), {
                        addSuffix: true,
                      })}
                    </Typography>
                    <Typography variant="caption" className="text-gray-300">
                      •
                    </Typography>
                    <Typography
                      variant="caption"
                      className="flex items-center gap-1"
                    >
                      <MenuBook className="text-sm" />
                      {post.readTime}
                    </Typography> */}
                    {/* <Typography variant="caption" className="text-gray-300">
                        •
                      </Typography> */}
                    {!post.verifyAuthorization && post.verified.length > 0 && (
                      <Typography
                        variant="caption"
                        className="flex items-center gap-1 text-green-600 cursor-pointer"
                        onClick={handleVerifiersClick}
                      >
                        <Verified className="text-sm" />
                        Verified
                      </Typography>
                    )}
                    {post.verified.length == 0 && !post.verifyAuthorization && (
                      <Typography
                        variant="caption"
                        className="flex items-center gap-1 text-red-600"
                      >
                        {/* <Verified className="text-sm" /> */}
                        Under Verification
                      </Typography>
                    )}

                    {verifiedPost && (
                      <Button
                        // variant="caption"
                        className="flex items-center gap-1 text-green-600 cursor-pointer"
                        onClick={verifyPost}
                        disabled={verifyPostLoad}
                      >
                        {/* <Verified className="text-sm" /> */}
                        {verifyPostLoad ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    )}
                  </Box>
                </Box>
                {menuItems.length > 0 && (
                  <IconButton
                    size="small"
                    onClick={handleMenuOpen}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <MoreVert />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>

          <Menu
            anchorEl={menuAnchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {menuItems.map((item, index) => (
              <MenuItem key={index} onClick={item.action}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.label}</ListItemText>
              </MenuItem>
            ))}
          </Menu>

          {/* Tags */}
          <Box className="flex flex-wrap gap-2 mb-4 mt-4">
            {post.tagged.map((tag, index) => (
              <Chip
                key={index}
                label={`Dr.${tag.profile.fullName}`}
                className="bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                size="small"
              />
            ))}
          </Box>

          {/* Post content */}
          <Typography
            variant="h5"
            className="my-3 font-semibold hover:text-green-600 transition-colors"
          >
            {post.title}
          </Typography>

          <Typography
            variant="body1"
            className="text-gray-600 mb-4 whitespace-pre-line"
          >
            {post.description}
          </Typography>

          {/* Media display */}
          <MediaPreview
            media={post.media as MediaUpload}
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
                  <FiberManualRecordIcon fontSize="small" color="primary" />
                  {index < post.routines.length - 1 && (
                    <div
                      style={{
                        width: 2,
                        height: 24,
                        backgroundColor: "#ccc",
                        margin: "4px 0",
                      }}
                    />
                  )}
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
          {/* Tags */}
          <Box className="flex flex-wrap gap-2 mb-4">
            {post.filters.map((filter, index) => (
              <Chip
                key={index}
                label={`#${filter}`}
                className="bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                size="small"
              />
            ))}
          </Box>
        </CardContent>

        {/* Actions */}
        <CardActions className="bg-gray-50 px-4 py-3 border-t">
          <Box className="flex justify-between items-center w-full">
            <Box className="flex space-x-4 sm:space-x-6">
              <Button
                size="small"
                onClick={toggleLike}
                className={`h-8 px-2 hover:text-red-500 ${
                  isLiked ? "text-red-500" : "text-gray-500"
                }`}
                startIcon={
                  <Favorite
                    className={isLiked ? "text-inherit" : "text-gray-500"}
                  />
                }
              >
                <Typography variant="caption">{post.likesCount}</Typography>
              </Button>
              <Button
                size="small"
                onClick={handleCommentClick}
                className="h-8 px-2 text-gray-500 hover:text-blue-500"
                startIcon={<ChatBubbleOutline />}
              >
                <Typography variant="caption">{post.commentsCount}</Typography>
              </Button>
              <Button
                size="small"
                onClick={handleShareClick}
                className="h-8 px-2 text-gray-500 hover:text-green-500"
                startIcon={<Share />}
              >
                <Typography variant="caption">Share</Typography>
              </Button>
            </Box>
            <IconButton
              size="small"
              onClick={toggleSave}
              className={`h-8 w-8 p-0 hover:text-yellow-500 ${
                isSaved ? "text-yellow-500" : "text-gray-500"
              }`}
            >
              <Bookmark
                className={isSaved ? "text-inherit" : "text-gray-500"}
              />
            </IconButton>
          </Box>
        </CardActions>

        <ShareMenu
          anchorEl={shareAnchorEl}
          open={shareOpen}
          onClose={handleShareClose}
          postTitle={post.title}
        />

        {/* Comment Section */}
        {commentOpen && (
          <Box className="border-t">
            <CommentSection
              comments={comments}
              setComments={setComments}
              postId={post._id}
              currentUserId={currentUserId}
              inputRef={commentInputRef}
            />
          </Box>
        )}
      </Card>

      {/* Verifiers Dialog */}
      <Dialog
        open={verifiersDialogOpen}
        onClose={() => setVerifiersDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Verified By</Typography>
            <IconButton onClick={() => setVerifiersDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {post.verified.map((doctor, index) => (
              <ListItem
                key={doctor._id}
                divider={index !== post.verified.length - 1}
              >
                <ListItemAvatar>
                  <Avatar
                    src={doctor.profile.profileImage}
                    alt={doctor.profile.fullName}
                  >
                    {doctor.profile.fullName[0]}
                  </Avatar>
                </ListItemAvatar>
                <MuiListItemText
                  primary={doctor.profile.fullName}
                  // secondary={doctor.profile.fullName}
                />
                <CheckCircle color="primary" />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifiersDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default SuccessStoryPostCard;

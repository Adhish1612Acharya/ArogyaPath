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
  Button,
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
} from "@mui/material";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef, FC } from "react";
import MediaPreview from "../../MediaPreview/MediaPreview";
import { MediaUpload } from "../../MediaPreview/MediaPreview.types";
import ShareMenu from "../../ShareMenu/ShareMenu";
import { GeneralPostCardProps } from "./GeneralPostCard.types";
import CommentSection from "../CommentSection/CommentSection";
import { Comment } from "@/types/Comment.types";

const GeneralPostCard: FC<GeneralPostCardProps> = ({
  post,
  isLiked,
  isSaved,
  currentUserId,
  menuItems,
  onMediaClick,
}: GeneralPostCardProps) => {
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);

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

  const menuOpen = Boolean(menuAnchorEl);
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

            {menuItems.length > 0 && (
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                className="text-gray-500 hover:text-gray-700"
              >
                <MoreVert />
              </IconButton>
            )}
          </div>

          <Menu
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {menuItems.map((item, index) => (
              <MenuItem key={index} onClick={item.action}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.label}</ListItemText>
              </MenuItem>
            ))}
          </Menu>

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

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.filters.map((tag: string) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                className="bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                size="small"
              />
            ))}
          </div>
        </CardContent>

        {/* Actions */}
        <CardActions className="bg-gray-50 px-4 py-3 border-t">
          <div className="flex justify-between items-center w-full">
            <div className="flex space-x-4 sm:space-x-6">
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
                <span className="text-xs sm:text-sm">{post.likesCount}</span>
              </Button>
              <Button
                size="small"
                onClick={handleCommentClick}
                className="h-8 px-2 text-gray-500 hover:text-blue-500"
                startIcon={<ChatBubbleOutline />}
              >
                <span className="text-xs sm:text-sm">{post.commentsCount}</span>
              </Button>
              <Button
                size="small"
                onClick={handleShareClick}
                className="h-8 px-2 text-gray-500 hover:text-green-500"
                startIcon={<Share />}
              >
                <span className="text-xs sm:text-sm">Share</span>
              </Button>
            </div>
            <Button
              size="small"
              onClick={toggleSave}
              className={`h-8 w-8 p-0 hover:text-yellow-500 ${
                isSaved ? "text-yellow-500" : "text-gray-500"
              }`}
            >
              <Bookmark
                className={isSaved ? "text-inherit" : "text-gray-500"}
              />
            </Button>
          </div>
        </CardActions>

        <ShareMenu
          anchorEl={shareAnchorEl}
          open={shareOpen}
          onClose={handleShareClose}
          postTitle={post.title}
        />

        {/* Comment Section */}
        {commentOpen && (
          <div className="border-t">
            <CommentSection
              comments={comments}
              setComments={setComments}
              postId={post._id}
              currentUserId={currentUserId}
              inputRef={commentInputRef}
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default GeneralPostCard;

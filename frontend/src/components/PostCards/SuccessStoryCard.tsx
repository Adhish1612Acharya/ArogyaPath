// src/components/PostCards/SuccessStoryCard.tsx
import {
  Favorite,
  ChatBubbleOutline,
  Share,
  Bookmark,
  MenuBook,
  AccessTime,
  MoreVert,
  PlayCircleOutline,
  InsertDriveFile,
  Close,
  Collections,
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
  Popover,
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
} from "@mui/material";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef } from "react";
import { CommentSection } from "@/components/PostCards/CommentSection/CommentSection";

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Doctor {
  id: string;
  name: string;
  avatar: string;
  credentials: string;
}

interface Comment {
  id: string;
  author: Author;
  text: string;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
}

export interface SuccessStoryType {
  id: string;
  author: Author;
  title: string;
  content: string;
  images?: string[];
  video?: string;
  document?: string;
  likes: number;
  likedBy: string[];
  comments: number;
  commentsList?: Comment[];
  readTime: string;
  tags: string[];
  verification: {
    verified: boolean;
    verifiedBy: Doctor[];
  };
  createdAt: Date;
}

interface SuccessStoryCardProps {
  post: SuccessStoryType;
  isLiked: boolean;
  isSaved: boolean;
  currentUserId: string;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
  onComment: (comment: string) => void;
  onReply: (commentId: string, reply: string) => void;
  onMediaClick: (media: string) => void;
  menuItems: Array<{
    label: string;
    icon: React.ReactNode;
    action: () => void;
  }>;
}

export function SuccessStoryCard({
  post,
  isLiked,
  isSaved,
  currentUserId,
  onLike,
  onSave,
  onShare,
  onComment,
  onReply,
  onMediaClick,
  menuItems,
}: SuccessStoryCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [verifiersDialogOpen, setVerifiersDialogOpen] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleCommentClick = () => {
    setCommentOpen(!commentOpen);
    if (!commentOpen && commentInputRef.current) {
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  const handleMediaClick = (index: number) => {
    setSelectedImageIndex(index);
    onMediaClick(post.images?.[index] || "");
    setMediaDialogOpen(true);
  };

  const handleNextImage = () => {
    if (post.images) {
      setSelectedImageIndex((prev) => (prev + 1) % post.images.length);
    }
  };

  const handlePrevImage = () => {
    if (post.images) {
      setSelectedImageIndex(
        (prev) => (prev - 1 + post.images.length) % post.images.length
      );
    }
  };

  const handleVerifiersClick = () => {
    setVerifiersDialogOpen(true);
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: <InsertDriveFile />,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        handleShareClose();
      },
    },
    {
      name: "Twitter",
      icon: <i className="fab fa-twitter" style={{ color: "#1DA1F2" }} />,
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            window.location.href
          )}&text=${encodeURIComponent(post.title)}`,
          "_blank"
        );
        handleShareClose();
      },
    },
    {
      name: "Facebook",
      icon: <i className="fab fa-facebook" style={{ color: "#1877F2" }} />,
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}`,
          "_blank"
        );
        handleShareClose();
      },
    },
    {
      name: "LinkedIn",
      icon: <i className="fab fa-linkedin" style={{ color: "#0077B5" }} />,
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            window.location.href
          )}`,
          "_blank"
        );
        handleShareClose();
      },
    },
    {
      name: "WhatsApp",
      icon: <i className="fab fa-whatsapp" style={{ color: "#25D366" }} />,
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            `${post.title} - ${window.location.href}`
          )}`,
          "_blank"
        );
        handleShareClose();
      },
    },
    {
      name: "Email",
      icon: <i className="fas fa-envelope" style={{ color: "#EA4335" }} />,
      action: () => {
        window.open(
          `mailto:?subject=${encodeURIComponent(
            post.title
          )}&body=${encodeURIComponent(window.location.href)}`,
          "_blank"
        );
        handleShareClose();
      },
    },
  ];

  const renderMediaContent = () => {
    if (post.images && post.images.length > 0) {
      return (
        <Box className="mb-4 rounded-lg overflow-hidden border border-gray-200">
          {post.images.length === 1 ? (
            <Box
              className="relative cursor-pointer group"
              onClick={() => handleMediaClick(0)}
            >
              <img
                src={post.images[0]}
                alt={post.title}
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Box className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                <Collections
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  fontSize="large"
                />
              </Box>
            </Box>
          ) : (
            <Box className="grid grid-cols-2 gap-1">
              {post.images.length === 2 ? (
                <>
                  <Box
                    className="relative h-80 cursor-pointer"
                    onClick={() => handleMediaClick(0)}
                  >
                    <img
                      src={post.images[0]}
                      alt={`${post.title} 1`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Box>
                  <Box
                    className="relative h-80 cursor-pointer"
                    onClick={() => handleMediaClick(1)}
                  >
                    <img
                      src={post.images[1]}
                      alt={`${post.title} 2`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Box>
                </>
              ) : post.images.length === 3 ? (
                <>
                  <Box
                    className="relative row-span-2 h-full cursor-pointer"
                    onClick={() => handleMediaClick(0)}
                  >
                    <img
                      src={post.images[0]}
                      alt={`${post.title} 1`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Box>
                  <Box
                    className="relative h-40 cursor-pointer"
                    onClick={() => handleMediaClick(1)}
                  >
                    <img
                      src={post.images[1]}
                      alt={`${post.title} 2`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Box>
                  <Box
                    className="relative h-40 cursor-pointer"
                    onClick={() => handleMediaClick(2)}
                  >
                    <img
                      src={post.images[2]}
                      alt={`${post.title} 3`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Box>
                </>
              ) : (
                <>
                  {post.images.slice(0, 4).map((img, index) => (
                    <Box
                      key={index}
                      className={`relative ${
                        index === 0 ? "row-span-2 col-span-1" : ""
                      } ${
                        index === 3 && post.images.length > 4 ? "bg-black" : ""
                      }`}
                      onClick={() => handleMediaClick(index)}
                    >
                      <img
                        src={img}
                        alt={`${post.title} ${index + 1}`}
                        className={`w-full h-full object-cover ${
                          index === 0 ? "h-full" : "h-40"
                        } transition-transform duration-300 hover:scale-105`}
                      />
                      {index === 3 && post.images.length > 4 && (
                        <Box className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white font-bold text-xl cursor-pointer">
                          +{post.images.length - 4}
                        </Box>
                      )}
                    </Box>
                  ))}
                </>
              )}
            </Box>
          )}
        </Box>
      );
    }

    if (post.video) {
      const videoId = post.video.includes("youtube.com")
        ? new URL(post.video).searchParams.get("v")
        : post.video.split("/").pop();

      return (
        <Box
          className="mb-4 relative rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
          onClick={() => onMediaClick(post.video || "")}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Video thumbnail"
            className="w-full h-80 object-cover"
          />
          <Box className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <PlayCircleOutline className="text-white text-6xl hover:text-green-400 transition-colors" />
          </Box>
          <Box className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <Typography variant="body2" className="text-white font-medium">
              Watch Video
            </Typography>
          </Box>
        </Box>
      );
    }

    if (post.document) {
      const fileName = post.document.split("/").pop() || "Document";
      const fileExtension = fileName.split(".").pop()?.toUpperCase();

      return (
        <Box
          className="mb-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-4"
          onClick={() => window.open(post.document, "_blank")}
        >
          <Box className="bg-gray-100 p-3 rounded-lg">
            <InsertDriveFile className="text-gray-600 text-3xl" />
          </Box>
          <Box className="flex-1">
            <Typography variant="subtitle1" className="font-medium">
              {fileName}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {fileExtension} Document
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            className="border-green-600 text-green-600 hover:border-green-700 hover:text-green-700"
          >
            Download
          </Button>
        </Box>
      );
    }

    return null;
  };

  const open = Boolean(anchorEl);
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
          <Box className="flex items-start space-x-4">
            <Box
              aria-owns={open ? "mouse-over-popover" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Avatar
                className="h-10 w-10 sm:h-12 sm:w-12 cursor-pointer border-2 border-green-100"
                src={post.author.avatar}
                alt={post.author.name}
              >
                {post.author.name[0]}
              </Avatar>
            </Box>

            <Popover
              id="mouse-over-popover"
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
              className="shadow-xl"
            >
              <Box className="p-4 flex space-x-4 w-80">
                <Avatar className="h-12 w-12" src={post.author.avatar}>
                  {post.author.name[0]}
                </Avatar>
                <Box className="space-y-1">
                  <Typography variant="subtitle1" className="font-semibold">
                    {post.author.name}
                  </Typography>
                </Box>
              </Box>
            </Popover>

            <Box className="flex-1">
              <Box className="flex justify-between items-start">
                <Box>
                  <Typography
                    variant="h6"
                    className="font-semibold hover:text-green-600 transition-colors"
                  >
                    {post.author.name}
                  </Typography>
                  <Box className="flex flex-wrap items-center gap-2 text-gray-500">
                    <Typography
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
                    </Typography>
                    {post.verification.verified && (
                      <>
                        <Typography variant="caption" className="text-gray-300">
                          •
                        </Typography>
                        <Typography
                          variant="caption"
                          className="flex items-center gap-1 text-green-600 cursor-pointer"
                          onClick={handleVerifiersClick}
                        >
                          <Verified className="text-sm" />
                          Verified
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Menu
            anchorEl={menuAnchorEl}
            open={menuOpen}
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
            {post.content}
          </Typography>

          {/* Media display */}
          {renderMediaContent()}

          {/* Tags */}
          <Box className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
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
                onClick={onLike}
                className={`h-8 px-2 hover:text-red-500 ${
                  isLiked ? "text-red-500" : "text-gray-500"
                }`}
                startIcon={
                  <Favorite
                    className={isLiked ? "text-inherit" : "text-gray-500"}
                  />
                }
              >
                <Typography variant="caption">{post.likes}</Typography>
              </Button>
              <Button
                size="small"
                onClick={handleCommentClick}
                className="h-8 px-2 text-gray-500 hover:text-blue-500"
                startIcon={<ChatBubbleOutline />}
              >
                <Typography variant="caption">{post.comments}</Typography>
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
              onClick={onSave}
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

        {/* Comment Section */}
        {commentOpen && (
          <Box className="border-t">
            <CommentSection
              comments={post.commentsList || []}
              currentUserId={currentUserId}
              onComment={onComment}
              onReply={onReply}
              inputRef={commentInputRef}
            />
          </Box>
        )}
      </Card>

      {/* Media Viewer Dialog */}
      {post.images && post.images.length > 0 && (
        <Dialog
          open={mediaDialogOpen}
          onClose={() => setMediaDialogOpen(false)}
          fullWidth
          maxWidth="md"
          className="relative"
        >
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                {selectedImageIndex + 1} / {post.images.length}
              </Typography>
              <IconButton onClick={() => setMediaDialogOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers className="relative">
            <Box className="relative h-96 flex items-center justify-center">
              <img
                src={post.images[selectedImageIndex]}
                alt={`${post.title} ${selectedImageIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />
              {post.images.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100"
                  >
                    <Close className="transform rotate-180" />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100"
                  >
                    <Close />
                  </IconButton>
                </>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      )}

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
            {post.verification.verifiedBy.map((doctor, index) => (
              <ListItem
                key={doctor.id}
                divider={index !== post.verification.verifiedBy.length - 1}
              >
                <ListItemAvatar>
                  <Avatar src={doctor.avatar} alt={doctor.name}>
                    {doctor.name[0]}
                  </Avatar>
                </ListItemAvatar>
                <MuiListItemText
                  primary={doctor.name}
                  secondary={doctor.credentials}
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

      {/* Share Menu */}
      <Menu
        anchorEl={shareAnchorEl}
        open={shareOpen}
        onClose={handleShareClose}
        onClick={handleShareClose}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {shareOptions.map((option, index) => (
          <MenuItem key={index} onClick={option.action}>
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>{option.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </motion.div>
  );
}

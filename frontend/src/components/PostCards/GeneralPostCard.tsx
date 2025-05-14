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
  Facebook,
  Twitter,
  LinkedIn,
  Link,
  Email,
  WhatsApp,
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
  Divider,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef } from "react";
import { CommentSection } from "@/components/PostCards/CommentSection";

interface GeneralPostCardProps {
  post: GeneralPostsType;
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

export function GeneralPostCard({
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
}: GeneralPostCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

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

  const handleMediaClick = (index: number) => {
    setSelectedImageIndex(index);
    onMediaClick(post.images?.[index] || '');
    setMediaDialogOpen(true);
  };

  const handleNextImage = () => {
    if (post.images) {
      setSelectedImageIndex((prev) => (prev + 1) % post.images.length);
    }
  };

  const handlePrevImage = () => {
    if (post.images) {
      setSelectedImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
    handleShareClose();
  };

  const shareOnSocialMedia = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=Check%20this%20out:%20${url}`;
        break;
      default:
        break;
    }
    
    window.open(shareUrl, '_blank');
    handleShareClose();
  };

  const renderMediaContent = () => {
    if (post.images && post.images.length > 0) {
      return (
        <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
          {post.images.length === 1 ? (
            <div 
              className="relative cursor-pointer group"
              onClick={() => handleMediaClick(0)}
            >
              <img
                src={post.images[0]}
                alt={post.title}
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                <Collections className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fontSize="large" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {post.images.slice(0, 4).map((img, index) => (
                <div 
                  key={index}
                  className={`relative ${index === 0 ? 'row-span-2' : ''} ${index === 3 && post.images.length > 4 ? 'bg-black' : ''}`}
                  onClick={() => handleMediaClick(index)}
                >
                  <img
                    src={img}
                    alt={`${post.title} ${index + 1}`}
                    className={`w-full h-full object-cover ${index === 0 ? 'h-full' : 'h-40'} transition-transform duration-300 hover:scale-105`}
                  />
                  {index === 3 && post.images.length > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white font-bold text-xl cursor-pointer">
                      +{post.images.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (post.video) {
      const videoId = post.video.includes('youtube.com') 
        ? new URL(post.video).searchParams.get('v') 
        : post.video.split('/').pop();
      
      return (
        <div 
          className="mb-4 relative rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
          onClick={() => onMediaClick(post.video || '')}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Video thumbnail"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <PlayCircleOutline className="text-white text-6xl hover:text-green-400 transition-colors" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <Typography variant="body2" className="text-white font-medium">
              Watch Video
            </Typography>
          </div>
        </div>
      );
    }

    if (post.document) {
      const fileName = post.document.split('/').pop() || 'Document';
      const fileExtension = fileName.split('.').pop()?.toUpperCase();
      
      return (
        <div 
          className="mb-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-4"
          onClick={() => window.open(post.document, '_blank')}
        >
          <div className="bg-gray-100 p-3 rounded-lg">
            <InsertDriveFile className="text-gray-600 text-3xl" />
          </div>
          <div className="flex-1">
            <Typography variant="subtitle1" className="font-medium">
              {fileName}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {fileExtension} Document
            </Typography>
          </div>
          <Button 
            variant="outlined" 
            size="small"
            className="border-green-600 text-green-600 hover:border-green-700 hover:text-green-700"
          >
            Download
          </Button>
        </div>
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
          <div className="flex items-start space-x-4">
            <div
              aria-owns={open ? 'mouse-over-popover' : undefined}
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
            </div>

            <Popover
              id="mouse-over-popover"
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
              className="shadow-xl"
            >
              <div className="p-4 flex space-x-4 w-80">
                <Avatar className="h-12 w-12" src={post.author.avatar}>
                  {post.author.name[0]}
                </Avatar>
                <div className="space-y-1">
                  <Typography variant="subtitle1" className="font-semibold">
                    {post.author.name}
                  </Typography>
                </div>
              </div>
            </Popover>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <Typography variant="h6" className="font-semibold hover:text-green-600 transition-colors">
                    {post.author.name}
                  </Typography>
                  <div className="flex flex-wrap items-center gap-2 text-gray-500">
                    <span className="flex items-center gap-1 text-sm">
                      <AccessTime className="text-sm" />
                      {formatDistanceToNow(new Date(post.createdAt || ""), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1 text-sm">
                      <MenuBook className="text-sm" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MoreVert />
                </IconButton>
              </div>
            </div>
          </div>

          <Menu
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
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
          <Typography variant="h5" className="my-3 font-semibold hover:text-green-600 transition-colors">
            {post.title}
          </Typography>

          <Typography variant="body1" className="text-gray-600 mb-4 whitespace-pre-line">
            {post.content}
          </Typography>

          {/* Media display */}
          {renderMediaContent()}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
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
                onClick={onLike}
                className={`h-8 px-2 hover:text-red-500 ${
                  isLiked ? "text-red-500" : "text-gray-500"
                }`}
                startIcon={
                  <Favorite className={isLiked ? "text-inherit" : "text-gray-500"} />
                }
              >
                <span className="text-xs sm:text-sm">
                  {post.likes}
                </span>
              </Button>
              <Button
                size="small"
                onClick={handleCommentClick}
                className="h-8 px-2 text-gray-500 hover:text-blue-500"
                startIcon={<ChatBubbleOutline />}
              >
                <span className="text-xs sm:text-sm">{post.comments}</span>
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
              onClick={onSave}
              className={`h-8 w-8 p-0 hover:text-yellow-500 ${
                isSaved ? "text-yellow-500" : "text-gray-500"
              }`}
            >
              <Bookmark className={isSaved ? "text-inherit" : "text-gray-500"} />
            </Button>
          </div>
        </CardActions>

        {/* Share Menu */}
        <Menu
          anchorEl={shareAnchorEl}
          open={shareOpen}
          onClose={handleShareClose}
          onClick={handleShareClose}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => shareOnSocialMedia('facebook')}>
            <ListItemIcon>
              <Facebook color="primary" />
            </ListItemIcon>
            <ListItemText>Share on Facebook</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => shareOnSocialMedia('twitter')}>
            <ListItemIcon>
              <Twitter color="info" />
            </ListItemIcon>
            <ListItemText>Share on Twitter</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => shareOnSocialMedia('linkedin')}>
            <ListItemIcon>
              <LinkedIn color="primary" />
            </ListItemIcon>
            <ListItemText>Share on LinkedIn</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => shareOnSocialMedia('whatsapp')}>
            <ListItemIcon>
              <WhatsApp color="success" />
            </ListItemIcon>
            <ListItemText>Share on WhatsApp</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => shareOnSocialMedia('email')}>
            <ListItemIcon>
              <Email color="action" />
            </ListItemIcon>
            <ListItemText>Share via Email</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={copyToClipboard}>
            <ListItemIcon>
              <Link color="action" />
            </ListItemIcon>
            <ListItemText>Copy Link</ListItemText>
          </MenuItem>
        </Menu>

        {/* Comment Section */}
        {commentOpen && (
          <div className="border-t">
            <CommentSection
              comments={post.commentsList || []}
              currentUserId={currentUserId}
              onComment={onComment}
              onReply={onReply}
              inputRef={commentInputRef}
            />
          </div>
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
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                {selectedImageIndex + 1} / {post.images.length}
              </Typography>
              <IconButton onClick={() => setMediaDialogOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers className="relative">
            <div className="relative h-96 flex items-center justify-center">
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
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Copy success notification */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </motion.div>
  );
}
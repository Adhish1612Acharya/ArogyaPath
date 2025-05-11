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
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Grid,
  Paper,
  Popover
} from "@mui/material";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef } from "react";
import { CommentSection } from "@/components/PostCards/CommentSection";
import { styled } from "@mui/material/styles";

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Activity {
  time: string;
  content: string;
}

interface Comment {
  id: string;
  author: Author;
  text: string;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
}

interface RoutinePostCardProps {
  post: {
    id: string;
    author: Author;
    title: string;
    content: string;
    thumbnail?: string;
    images?: string[];
    video?: string;
    document?: string;
    activities: Activity[];
    likes: number;
    likedBy: string[];
    comments: number;
    commentsList?: Comment[];
    readTime: string;
    tags: string[];
    createdAt: Date;
  };
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

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: '800px',
  margin: '0 auto',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
  transition: theme.transitions.create('box-shadow'),
}));

const ActivityDot = styled('div')(({ theme }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
  transition: theme.transitions.create('background-color'),
}));

const ActivityLine = styled('div')(({ theme }) => ({
  width: 2,
  flex: 1,
  backgroundColor: theme.palette.success.light,
  '&:hover': {
    backgroundColor: theme.palette.success.main,
  },
  transition: theme.transitions.create('background-color'),
}));

export function RoutinePostCard({
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
}: RoutinePostCardProps) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
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

  const renderMediaContent = () => {
    if (post.images && post.images.length > 0) {
      return (
        <Box mb={2} borderRadius={1} overflow="hidden" border="1px solid" borderColor="divider">
          {post.images.length === 1 ? (
            <Box 
              position="relative" 
              sx={{ cursor: 'pointer' }}
              onClick={() => handleMediaClick(0)}
            >
              <Box
                component="img"
                src={post.images[0]}
                alt={post.title}
                sx={{
                  width: '100%',
                  height: 320,
                  objectFit: 'cover',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bgcolor="rgba(0,0,0,0)"
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.1)',
                  },
                  transition: 'background-color 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Collections 
                  sx={{ 
                    color: 'white', 
                    opacity: 0,
                    '&:hover': {
                      opacity: 1,
                    },
                    transition: 'opacity 0.3s',
                    fontSize: 32,
                  }} 
                />
              </Box>
            </Box>
          ) : (
            <Grid container spacing={0.5}>
              {post.images.slice(0, 4).map((img, index) => (
                <Grid 
                  item 
                  key={index}
                  xs={index === 0 ? 12 : 6}
                  sx={{
                    position: 'relative',
                    height: index === 0 ? 320 : 160,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleMediaClick(index)}
                >
                  <Box
                    component="img"
                    src={img}
                    alt={`${post.title} ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  {index === 3 && post.images.length > 4 && (
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgcolor="rgba(0,0,0,0.4)"
                      color="white"
                      fontWeight="bold"
                      fontSize="1.25rem"
                    >
                      +{post.images.length - 4}
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      );
    }

    if (post.video) {
      const videoId = post.video.includes('youtube.com') 
        ? new URL(post.video).searchParams.get('v') 
        : post.video.split('/').pop();
      
      return (
        <Box 
          mb={2} 
          position="relative" 
          borderRadius={1} 
          overflow="hidden" 
          border="1px solid" 
          borderColor="divider"
          sx={{ cursor: 'pointer' }}
          onClick={() => onMediaClick(post.video || '')}
        >
          <Box
            component="img"
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Video thumbnail"
            sx={{
              width: '100%',
              height: 320,
              objectFit: 'cover',
            }}
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgcolor="rgba(0,0,0,0.2)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <PlayCircleOutline sx={{ color: 'white', fontSize: 64, '&:hover': { color: 'success.main' } }} />
          </Box>
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            bgcolor="linear-gradient(to top, #000000, transparent)"
            p={2}
          >
            <Typography variant="body2" color="white" fontWeight="medium">
              Watch Video
            </Typography>
          </Box>
        </Box>
      );
    }

    if (post.document) {
      const fileName = post.document.split('/').pop() || 'Document';
      const fileExtension = fileName.split('.').pop()?.toUpperCase();
      
      return (
        <Paper 
          elevation={0}
          variant="outlined"
          sx={{
            mb: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover',
            },
            transition: 'background-color 0.3s',
          }}
          onClick={() => window.open(post.document, '_blank')}
        >
          <Box
            bgcolor="grey.100"
            p={2}
            borderRadius={1}
          >
            <InsertDriveFile sx={{ color: 'grey.600', fontSize: 32 }} />
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight="medium">
              {fileName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {fileExtension} Document
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            size="small"
            color="success"
          >
            Download
          </Button>
        </Paper>
      );
    }

    return null;
  };

  const openPopover = Boolean(anchorEl);
  const openMenu = Boolean(menuAnchorEl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StyledCard>
        <CardHeader
          avatar={
            <div
              aria-owns={openPopover ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Avatar 
                src={post.author.avatar} 
                alt={post.author.name}
                sx={{ 
                  width: 48, 
                  height: 48,
                  border: '2px solid',
                  borderColor: 'success.light',
                  cursor: 'pointer',
                }}
              >
                {post.author.name[0]}
              </Avatar>
            </div>
          }
          action={
            <>
              <IconButton onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
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
          title={post.author.name}
          subheader={
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Typography variant="caption" display="flex" alignItems="center" gap={0.5}>
                <AccessTime fontSize="small" />
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary">•</Typography>
              <Typography variant="caption" display="flex" alignItems="center" gap={0.5}>
                <MenuBook fontSize="small" />
                {post.readTime}
              </Typography>
            </Box>
          }
          sx={{
            '& .MuiCardHeader-title': {
              fontWeight: 'bold',
              '&:hover': {
                color: 'success.main',
              },
              transition: 'color 0.3s',
            },
            '& .MuiCardHeader-subheader': {
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            },
          }}
        />

        <Popover
          id="mouse-over-popover"
          open={openPopover}
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
          sx={{
            boxShadow: 3,
          }}
        >
          <Box p={2} display="flex" gap={2} width={320}>
            <Avatar 
              src={post.author.avatar}
              sx={{ width: 48, height: 48 }}
            >
              {post.author.name[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {post.author.name}
              </Typography>
            </Box>
          </Box>
        </Popover>

        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ 
            fontWeight: 'bold',
            '&:hover': { 
              color: 'success.main',
              cursor: 'pointer'
            },
            transition: 'color 0.3s',
          }}>
            {post.title}
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph whiteSpace="pre-line">
            {post.content}
          </Typography>

          {/* Media display */}
          {renderMediaContent()}

          {/* Activities */}
          <Box mt={2}>
            {post.activities.map((activity, index) => (
              <Box key={index} display="flex" gap={2} position="relative">
                <Box display="flex" flexDirection="column" alignItems="center" pt={0.5}>
                  <ActivityDot />
                  {index < post.activities.length - 1 && <ActivityLine />}
                </Box>
                <Paper 
                  elevation={0} 
                  sx={{
                    p: 2,
                    flex: 1,
                    '&:hover': {
                      bgcolor: 'success.light',
                    },
                    transition: 'background-color 0.3s',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" color="success.dark">
                    {activity.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.content}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                sx={{
                  bgcolor: 'success.light',
                  color: 'success.dark',
                  '&:hover': {
                    bgcolor: 'success.main',
                    color: 'white',
                  },
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
        </CardContent>

        <Divider />

        <CardActions sx={{ bgcolor: 'grey.50', justifyContent: 'space-between' }}>
          <Box display="flex" gap={1}>
            <Button
              size="small"
              startIcon={
                <Favorite 
                  color={isLiked ? 'error' : 'inherit'} 
                  sx={{ fill: isLiked ? 'currentColor' : 'none' }} 
                />
              }
              onClick={onLike}
              sx={{
                color: isLiked ? 'error.main' : 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                },
              }}
            >
              {post.likes}
            </Button>
            <Button
              size="small"
              startIcon={<ChatBubbleOutline />}
              onClick={handleCommentClick}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {post.comments}
            </Button>
            <Button
              size="small"
              startIcon={<Share />}
              onClick={onShare}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'success.main',
                },
              }}
            >
              Share
            </Button>
          </Box>
          <IconButton
            onClick={onSave}
            sx={{
              color: isSaved ? 'warning.main' : 'text.secondary',
              '&:hover': {
                color: 'warning.main',
              },
            }}
          >
            <Bookmark sx={{ fill: isSaved ? 'currentColor' : 'none' }} />
          </IconButton>
        </CardActions>

        {/* Comment Section */}
        {commentOpen && (
          <>
            <Divider />
            <Box p={2}>
              <CommentSection
                comments={post.commentsList || []}
                currentUserId={currentUserId}
                onComment={onComment}
                onReply={onReply}
                inputRef={commentInputRef}
              />
            </Box>
          </>
        )}
      </StyledCard>

      {/* Media Viewer Dialog */}
      {post.images && post.images.length > 0 && (
        <Dialog 
          open={mediaDialogOpen} 
          onClose={() => setMediaDialogOpen(false)}
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              maxHeight: 'calc(100% - 64px)',
            },
          }}
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
          <DialogContent dividers>
            <Box 
              height="60vh" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              position="relative"
            >
              <Box
                component="img"
                src={post.images[selectedImageIndex]}
                alt={`${post.title} ${selectedImageIndex + 1}`}
                sx={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
              {post.images.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'background.default',
                      },
                      height: 48,
                      width: 48,
                    }}
                  >
                    <ChevronLeft fontSize="large" />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'background.default',
                      },
                      height: 48,
                      width: 48,
                    }}
                  >
                    <ChevronRight fontSize="large" />
                  </IconButton>
                </>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
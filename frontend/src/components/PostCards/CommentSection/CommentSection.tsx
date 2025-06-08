import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Stack,
  ListItem,
  ListItemAvatar,
  Collapse,
  Badge,
} from "@mui/material";
import { Send, Reply, Favorite, FavoriteBorder, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useState, FC } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { CommentSectionProps } from "./CommentSection.types";
import { styled } from "@mui/material/styles";

const CommentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.grey[50],
  borderTop: `1px solid ${theme.palette.grey[200]}`,
}));

const CommentForm = styled("form")(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const CommentTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    "& fieldset": {
      borderColor: theme.palette.grey[300],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const CommentItem = styled(ListItem)(({ theme }) => ({
  alignItems: "flex-start",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
  "&:hover": {
    boxShadow: theme.shadows[2],
  },
  transition: theme.transitions.create(['box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
}));

const ReplyItem = styled(ListItem)(({ theme }) => ({
  alignItems: "flex-start",
  padding: theme.spacing(1.5, 2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  marginLeft: theme.spacing(4),
  borderLeft: `3px solid ${theme.palette.grey[300]}`,
}));

const CommentContent = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
}));

const CommentActions = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

// Add types for comment and reply if not already present
interface CommentOwnerProfile {
  fullName: string;
  profileImage: string;
}
interface CommentOwner {
  _id: string;
  profile: CommentOwnerProfile;
}
interface ReplyType {
  _id: string;
  content: string;
  owner: CommentOwner;
  createdAt: string;
  repliedTo: { _id: string; ownerName: string };
  likes: number;
  likedBy: string[];
}
interface CommentType {
  _id: string;
  content: string;
  owner: CommentOwner;
  createdAt: string;
  replies: ReplyType[];
  repliesCount: number;
  likes: number;
  likedBy: string[];
}

const CommentSection: FC<CommentSectionProps> = ({
  comments,
  setComments,
  postId,
  currentUserId,
  inputRef,
}: {
  comments: CommentType[];
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
  postId: string;
  currentUserId: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    ownerName: string;
  } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const onComment = (text: string) => {
    if (!text.trim()) return;
    
    // Simulate API call
    const newCommentObj = {
      _id: `comment-${Date.now()}`,
      content: text,
      owner: {
        _id: currentUserId,
        profile: {
          fullName: "You",
          profileImage: `https://i.pravatar.cc/150?img=${currentUserId.slice(-2)}`,
        },
      },
      createdAt: new Date().toISOString(),
      replies: [],
      repliesCount: 0,
      likes: 0,
      likedBy: [],
    };
    
    setComments((prev) => [...prev, newCommentObj]);
    setNewComment("");
  };

  const onReply = (text: string, commentId: string) => {
    if (!text.trim()) return;
    
    const parentComment = comments.find(c => c._id === commentId);
    if (!parentComment) return;
    
    const newReply = {
      _id: `reply-${Date.now()}`,
      content: text,
      owner: {
        _id: currentUserId,
        profile: {
          fullName: "You",
          profileImage: `https://i.pravatar.cc/150?img=${currentUserId.slice(-2)}`,
        },
      },
      createdAt: new Date().toISOString(),
      repliedTo: {
        _id: parentComment._id,
        ownerName: parentComment.owner.profile.fullName,
      },
      likes: 0,
      likedBy: [],
    };
    
    setComments(prev => 
      prev.map(comment => 
        comment._id === commentId
          ? { 
              ...comment, 
              replies: [...comment.replies, newReply],
              repliesCount: comment.repliesCount + 1
            }
          : comment
      )
    );
    setReplyingTo(null);
    setNewComment("");
    
    // Expand replies if not already expanded
    if (!expandedReplies.has(commentId)) {
      setExpandedReplies(prev => new Set(prev).add(commentId));
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyingTo) {
      onReply(newComment, replyingTo.commentId);
    } else {
      onComment(newComment);
    }
  };

  const toggleReply = (commentId: string, ownerName: string) => {
    if (replyingTo?.commentId === commentId) {
      setReplyingTo(null);
    } else {
      setReplyingTo({ commentId, ownerName });
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 100);
    }
  };

  const toggleExpandReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      newSet.has(commentId) ? newSet.delete(commentId) : newSet.add(commentId);
      return newSet;
    });
  };

  const handleLikeComment = (commentId: string, isReply = false) => {
    setComments(prev =>
      prev.map(comment => {
        if (comment._id === commentId) {
          const isLiked = comment.likedBy.includes(currentUserId);
          return {
            ...comment,
            likedBy: isLiked
              ? comment.likedBy.filter(id => id !== currentUserId)
              : [...comment.likedBy, currentUserId],
            likes: isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        
        if (isReply) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply._id === commentId) {
              const isLiked = reply.likedBy.includes(currentUserId);
              return {
                ...reply,
                likedBy: isLiked
                  ? reply.likedBy.filter(id => id !== currentUserId)
                  : [...reply.likedBy, currentUserId],
                likes: isLiked ? reply.likes - 1 : reply.likes + 1,
              };
            }
            return reply;
          });
          
          return {
            ...comment,
            replies: updatedReplies,
          };
        }
        
        return comment;
      })
    );
  };

  const isCommentLiked = (comment: any) => {
    return comment.likedBy?.includes(currentUserId) || false;
  };

  return (
    <CommentContainer>
      {/* Comment input */}
      <CommentForm onSubmit={handleCommentSubmit}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar
            src={`https://i.pravatar.cc/150?img=${currentUserId.slice(-2)}`}
            sx={{ width: 40, height: 40 }}
          />
          <CommentTextField
            inputRef={inputRef}
            fullWidth
            variant="outlined"
            size="small"
            placeholder={
              replyingTo
                ? `Reply to ${replyingTo.ownerName}...`
                : "Add a comment..."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  type="submit"
                  disabled={!newComment.trim()}
                  color="primary"
                  sx={{ ml: 1 }}
                >
                  <Send />
                </IconButton>
              ),
            }}
            sx={{
              flexGrow: 1,
            }}
          />
        </Stack>
        {replyingTo && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              size="small"
              onClick={() => setReplyingTo(null)}
              sx={{ color: "text.secondary" }}
            >
              Cancel reply
            </Button>
          </Box>
        )}
      </CommentForm>

      {/* Comments list */}
      {comments.length === 0 ? (
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            py: 4,
          }}
        >
          No comments yet. Be the first to comment!
        </Typography>
      ) : (
        <Box sx={{ mt: 2 }}>
          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CommentItem>
                <ListItemAvatar>
                  <Avatar
                    src={comment.owner.profile.profileImage}
                    alt={comment.owner.profile.fullName}
                    sx={{ width: 40, height: 40 }}
                  />
                </ListItemAvatar>
                <CommentContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {comment.owner.profile.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                    {comment.content}
                  </Typography>
                  
                  <CommentActions>
                    <IconButton
                      size="small"
                      onClick={() => handleLikeComment(comment._id)}
                      sx={{
                        color: isCommentLiked(comment) ? "error.main" : "text.secondary",
                        p: 0.5,
                      }}
                    >
                      {isCommentLiked(comment) ? (
                        <Favorite fontSize="small" />
                      ) : (
                        <FavoriteBorder fontSize="small" />
                      )}
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {comment.likes}
                      </Typography>
                    </IconButton>
                    
                    <Button
                      size="small"
                      onClick={() => toggleReply(comment._id, comment.owner.profile.fullName)}
                      sx={{
                        color: "text.secondary",
                        minWidth: 0,
                        p: 0.5,
                      }}
                      startIcon={<Reply fontSize="small" />}
                    >
                      Reply
                    </Button>
                  </CommentActions>
                </CommentContent>
              </CommentItem>

              {/* Replies section */}
              {comment.repliesCount > 0 && (
                <Box sx={{ ml: 4 }}>
                  <Button
                    size="small"
                    onClick={() => toggleExpandReplies(comment._id)}
                    sx={{
                      color: "text.secondary",
                      mb: 1,
                    }}
                    startIcon={
                      expandedReplies.has(comment._id) ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    }
                  >
                    {expandedReplies.has(comment._id)
                      ? "Hide replies"
                      : `View ${comment.repliesCount} ${
                          comment.repliesCount === 1 ? "reply" : "replies"
                        }`}
                  </Button>

                  <Collapse in={expandedReplies.has(comment._id)}>
                    <Box sx={{ mt: 1 }}>
                      {comment.replies.map((reply) => (
                        <motion.div
                          key={reply._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ReplyItem>
                            <ListItemAvatar>
                              <Avatar
                                src={reply.owner.profile.profileImage}
                                alt={reply.owner.profile.fullName}
                                sx={{ width: 32, height: 32 }}
                              />
                            </ListItemAvatar>
                            <CommentContent>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight={600}>
                                    {reply.owner.profile.fullName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Replying to {reply.repliedTo.ownerName}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDistanceToNow(new Date(reply.createdAt), {
                                    addSuffix: true,
                                  })}
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                                {reply.content}
                              </Typography>
                              
                              <CommentActions>
                                <IconButton
                                  size="small"
                                  onClick={() => handleLikeComment(reply._id, true)}
                                  sx={{
                                    color: isCommentLiked(reply) ? "error.main" : "text.secondary",
                                    p: 0.5,
                                  }}
                                >
                                  {isCommentLiked(reply) ? (
                                    <Favorite fontSize="small" />
                                  ) : (
                                    <FavoriteBorder fontSize="small" />
                                  )}
                                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                                    {reply.likes}
                                  </Typography>
                                </IconButton>
                              </CommentActions>
                            </CommentContent>
                          </ReplyItem>
                        </motion.div>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              )}
            </motion.div>
          ))}
        </Box>
      )}
    </CommentContainer>
  );
};

export default CommentSection;
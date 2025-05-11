import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Send, Favorite, Reply, MoreVert } from "@mui/icons-material";
import { useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

export function CommentSection({
  comments,
  currentUserId,
  onComment,
  onReply,
  inputRef,
}) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState(new Set());

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (replyingTo) {
      onReply(replyingTo.commentId, newComment);
      setReplyingTo(null);
    } else {
      onComment(newComment);
    }
    setNewComment("");
  };

  const toggleReply = (commentId, authorName) => {
    if (replyingTo?.commentId === commentId) {
      setReplyingTo(null);
    } else {
      setReplyingTo({ commentId, authorName });
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 100);
    }
  };

  const toggleExpandReplies = (commentId) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      newSet.has(commentId) ? newSet.delete(commentId) : newSet.add(commentId);
      return newSet;
    });
  };

  const handleLikeComment = (commentId) => {
    console.log("Liked comment:", commentId);
  };

  const isCommentLiked = (comment) => {
    return comment.likedBy?.includes(currentUserId) || false;
  };

  return (
    <Box className="p-4 bg-gray-50">
      {/* Comment input */}
      <form onSubmit={handleCommentSubmit} className="mb-4">
        <Box className="flex gap-2">
          <Avatar
            className="h-10 w-10"
            src={`https://i.pravatar.cc/150?img=${currentUserId.slice(-2)}`}
          />
          <TextField
            inputRef={inputRef}
            fullWidth
            variant="outlined"
            size="small"
            placeholder={
              replyingTo
                ? `Reply to ${replyingTo.authorName}...`
                : "Add a comment..."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-white rounded-lg"
            InputProps={{
              endAdornment: (
                <IconButton
                  type="submit"
                  disabled={!newComment.trim()}
                  className="text-green-600"
                >
                  <Send />
                </IconButton>
              ),
            }}
          />
        </Box>
        {replyingTo && (
          <Box className="flex justify-end mt-1">
            <Button
              size="small"
              onClick={() => setReplyingTo(null)}
              className="text-gray-500"
            >
              Cancel reply
            </Button>
          </Box>
        )}
      </form>

      {/* Comments list */}
      <Box className="space-y-4">
        {comments.length === 0 ? (
          <Typography variant="body2" className="text-gray-500 text-center py-4">
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box className="flex gap-3">
                <Avatar
                  className="h-8 w-8 mt-1"
                  src={comment.author.avatar}
                  alt={comment.author.name}
                />
                <Box className="flex-1">
                  <Box className="bg-white p-3 rounded-lg shadow-sm">
                    <Box className="flex justify-between items-start">
                      <Typography
                        variant="subtitle2"
                        className="font-semibold"
                      >
                        {comment.author.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        className="text-gray-500"
                      >
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </Box>
                    <Typography variant="body2" className="mt-1">
                      {comment.text}
                    </Typography>
                  </Box>

                  <Box className="flex items-center gap-2 mt-1 ml-2">
                    <IconButton
                      size="small"
                      onClick={() => handleLikeComment(comment.id)}
                      className={`p-0 text-xs ${
                        isCommentLiked(comment) ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      <Favorite fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" className="text-gray-500">
                      {comment.likes + (isCommentLiked(comment) ? 1 : 0)}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() =>
                        toggleReply(comment.id, comment.author.name)
                      }
                      className="text-gray-500 text-xs"
                      startIcon={<Reply fontSize="small" />}
                    >
                      Reply
                    </Button>
                  </Box>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <Box className="mt-2 ml-4">
                      {!expandedReplies.has(comment.id) ? (
                        <Button
                          size="small"
                          onClick={() => toggleExpandReplies(comment.id)}
                          className="text-gray-500 text-xs"
                        >
                          {`View ${comment.replies.length} ${
                            comment.replies.length === 1 ? "reply" : "replies"
                          }`}
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="small"
                            onClick={() => toggleExpandReplies(comment.id)}
                            className="text-gray-500 text-xs"
                          >
                            Hide replies
                          </Button>
                          <Box className="space-y-3 mt-2">
                            {comment.replies.map((reply) => (
                              <motion.div
                                key={reply.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Box className="flex gap-2">
                                  <Avatar
                                    className="h-7 w-7 mt-1"
                                    src={reply.author.avatar}
                                    alt={reply.author.name}
                                  />
                                  <Box className="flex-1">
                                    <Box className="bg-white p-2 rounded-lg shadow-sm">
                                      <Box className="flex justify-between items-start">
                                        <Typography
                                          variant="subtitle2"
                                          className="font-semibold text-sm"
                                        >
                                          {reply.author.name}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          className="text-gray-500"
                                        >
                                          {formatDistanceToNow(
                                            new Date(reply.createdAt),
                                            { addSuffix: true }
                                          )}
                                        </Typography>
                                      </Box>
                                      <Typography
                                        variant="body2"
                                        className="mt-1 text-sm"
                                      >
                                        {reply.text}
                                      </Typography>
                                    </Box>
                                    <Box className="flex items-center gap-2 mt-1 ml-2">
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleLikeComment(reply.id)
                                        }
                                        className={`p-0 text-xs ${
                                          isCommentLiked(reply)
                                            ? "text-red-500"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        <Favorite fontSize="small" />
                                      </IconButton>
                                      <Typography
                                        variant="caption"
                                        className="text-gray-500"
                                      >
                                        {reply.likes +
                                          (isCommentLiked(reply) ? 1 : 0)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </motion.div>
                            ))}
                          </Box>
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
              <Divider className="my-3" />
            </motion.div>
          ))
        )}
      </Box>
    </Box>
  );
}

CommentSection.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      author: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      }).isRequired,
      text: PropTypes.string.isRequired,
      createdAt: PropTypes.instanceOf(Date).isRequired,
      likes: PropTypes.number.isRequired,
      likedBy: PropTypes.arrayOf(PropTypes.string),
      replies: PropTypes.array,
    })
  ).isRequired,
  currentUserId: PropTypes.string.isRequired,
  onComment: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
  inputRef: PropTypes.object,
};
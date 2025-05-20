import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Send, Reply} from "@mui/icons-material";
import { useState, FC } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { CommentSectionProps } from "./CommentSection.types";


const CommentSection: FC<CommentSectionProps> = ({
  comments,

  currentUserId,

  // onComment,
  // onReply,
  inputRef,
}) => {


  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    ownerName: string;
  } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState(new Set());

  const onComment = (_text: string) => {
    // Add comment api call
    // const response = {};//{success:true, message :"Comment Added" , data:{Comment},userId:id}
    // const newComment = response.data;
    // newComment.replies = [];
    // setComments((prev: Comment[]) => {
    //   return [ ...prev, newComment ];
    // });
  };

  const onReply = (_text: string, _commentId: string) => {
    // Add comment api call
    // const response = {};//{success:true, message :"Comment Added" , data:{Comment as Reply},userId:id}
    // const newReply = response.data;
    // newReply.replies = [];
    // setComments((prev: Comment[]) => {
    //prev.forEach((comment)=>{
    //  if(comment._id ===newReply.repliedTo._id )
    // {
    //  comment.replies.push(newReply);
    // comment.repliedCount+=1
    // }
    //})
    //   return [...prev];
    // });
  };

  const handleCommentSubmit = (e: any) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (replyingTo) {
      onReply(newComment, replyingTo.commentId);
      setReplyingTo(null);
    } else {
      onComment(newComment);
    }
    setNewComment("");
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
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      newSet.has(commentId) ? newSet.delete(commentId) : newSet.add(commentId);
      return newSet;
    });
  };

  // const handleLikeComment = (commentId) => {
  //   console.log("Liked comment:", commentId);
  // };

  // const isCommentLiked = (comment) => {
  //   return comment.likedBy?.includes(currentUserId) || false;
  // };

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
                ? `Reply to ${replyingTo.ownerName}...`
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
          <Typography
            variant="body2"
            className="text-gray-500 text-center py-4"
          >
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box className="flex gap-3">
                <Avatar
                  className="h-8 w-8 mt-1"
                  src={comment.owner.profile.profileImage}
                  alt={comment.owner.profile.fullName}
                />
                <Box className="flex-1">
                  <Box className="bg-white p-3 rounded-lg shadow-sm">
                    <Box className="flex justify-between items-start">
                      <Typography variant="subtitle2" className="font-semibold">
                        {comment.owner.profile.fullName}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </Box>
                    <Typography variant="body2" className="mt-1">
                      {comment.content}
                    </Typography>
                  </Box>

                  <Box className="flex items-center gap-2 mt-1 ml-2">
                    {/* <IconButton
                      size="small"
                      onClick={() => handleLikeComment(comment.id)}
                      className={`p-0 text-xs ${
                        isCommentLiked(comment)
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      <Favorite fontSize="small" />
                    </IconButton> */}
                    {/* <Typography variant="caption" className="text-gray-500">
                      {comment.likes + (isCommentLiked(comment) ? 1 : 0)}
                    </Typography> */}
                    <Button
                      size="small"
                      onClick={() =>
                        toggleReply(comment._id, comment.owner.profile.fullName)
                      }
                      className="text-gray-500 text-xs"
                      startIcon={<Reply fontSize="small" />}
                    >
                      Reply
                    </Button>
                  </Box>

                  {/* Replies */}
                  {comment.repliesCount > 0 && (
                    <Box className="mt-2 ml-4">
                      {!expandedReplies.has(comment._id) ? (
                        <Button
                          size="small"
                          onClick={() => toggleExpandReplies(comment._id)}
                          className="text-gray-500 text-xs"
                        >
                          {`View ${comment.repliesCount} ${
                            comment.repliesCount === 1 ? "reply" : "replies"
                          }`}
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="small"
                            onClick={() => toggleExpandReplies(comment._id)}
                            className="text-gray-500 text-xs"
                          >
                            Hide replies
                          </Button>
                          <Box className="space-y-3 mt-2">
                            {comment.replies.map((reply) => (
                              <motion.div
                                key={reply._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Box className="flex gap-2">
                                  <Avatar
                                    className="h-7 w-7 mt-1"
                                    src={reply.owner.profile.profileImage}
                                    alt={reply.owner.profile.fullName}
                                  />
                                  <Box className="flex-1">
                                    <Box className="bg-white p-2 rounded-lg shadow-sm">
                                      <Box className="flex justify-between items-start">
                                        <Typography
                                          variant="subtitle2"
                                          className="font-semibold text-sm"
                                        >
                                          {reply.owner.profile.fullName}
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
                                        {reply.content}
                                      </Typography>
                                    </Box>
                                    {/* <Box className="flex items-center gap-2 mt-1 ml-2"> */}
                                      {/* <IconButton
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
                                      </IconButton> */}
                                      {/* <Typography
                                        variant="caption"
                                        className="text-gray-500"
                                      >
                                        {reply.likes +
                                          (isCommentLiked(reply) ? 1 : 0)}
                                      </Typography> */}
                                   {/* </Box> */}
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
};

export default CommentSection;

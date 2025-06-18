import { Comment } from "@/types/Comment.types";
import React from "react";

export interface CommentSectionProps {
  comments: Comment[];
  setComments: (prev: Comment[]) => void | any;
  currentUserId: string;
  // postId: string;
  // onComment: (text: string) => void;
  // onReply: (commentId: string, text: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

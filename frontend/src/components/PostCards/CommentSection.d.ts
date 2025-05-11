declare module "@/components/PostCards/CommentSection" {
  import React from "react";

  interface Comment {
    id: string;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
    text: string;
    createdAt: Date;
    likes: number;
    likedBy?: string[];
    replies?: Comment[];
  }

  interface CommentSectionProps {
    comments: Comment[];
    currentUserId: string;
    onComment: (text: string) => void;
    onReply: (commentId: string, text: string) => void;
    inputRef?: React.RefObject<HTMLInputElement>;
  }

  export const CommentSection: React.FC<CommentSectionProps>;
}

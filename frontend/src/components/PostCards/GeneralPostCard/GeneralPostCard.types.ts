import { GeneralPostType } from "@/types/GeneralPost.types";

export interface GeneralPostCardProps {
  post: GeneralPostType;
  isLiked: boolean;
  isSaved: boolean;
  currentUserId: string;
  onLike: () => void;
  onSave: () => void;
  onComment: (comment: string) => void;
  onReply: (commentId: string, reply: string) => void;
  onMediaClick: (mediaIndex: number, images: string[]) => void;
  menuItems: Array<{
    label: string;
    icon: React.ReactNode;
    action: () => void;
  }>;
}

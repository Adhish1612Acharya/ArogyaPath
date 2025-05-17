import { SuccessStoryType } from "@/types/SuccessStory.types";

export interface SuccessStoryCardProps {
  post: SuccessStoryType;
  isLiked: boolean;
  isSaved: boolean;
  currentUserId: string;
  onLike: () => void;
  onSave: () => void;
  onMediaClick: (mediaIndex: number, images: string[]) => void;
  menuItems: Array<{
    label: string;
    icon: React.ReactNode;
    action: () => void;
  }>;
}

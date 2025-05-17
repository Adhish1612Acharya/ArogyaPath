import { RoutinePostType } from "@/types/RoutinesPost.types";

export interface RoutinePostCardProps {
  post: RoutinePostType;
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

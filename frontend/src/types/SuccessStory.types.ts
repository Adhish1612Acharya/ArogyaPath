import { MediaUploadsType, RoutineType, UserOrExpertDetailsType } from ".";

export interface SuccessStoryType {
  _id: string;
  title: string;
  description: string;
  media: MediaUploadsType;
  owner: UserOrExpertDetailsType; // Populated with full profile
  tagged: UserOrExpertDetailsType[]; // Experts with profile info
  verified: UserOrExpertDetailsType[]; // Experts with profile info
  rejections: {
    expert: UserOrExpertDetailsType; // Expert who rejected
    reason: string; // Reason for rejection
    date: Date | string; // When the rejection was made
  }[];
  filters: string[];
  routines: RoutineType[];
  readTime: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date | string;
  verifyAuthorization: boolean;
  alreadyVerified: boolean;
  alreadyRejected: boolean;
  invalid?: { by: string; reason?: string }; // Added for post invalidation
}

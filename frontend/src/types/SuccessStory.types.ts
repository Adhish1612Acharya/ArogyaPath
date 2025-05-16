import { MediaUploadsType, RoutineType, UserOrExpertDetailsType } from ".";

export interface SuccessStoryType {
  _id: string;
  title: string;
  description: string;
  media: MediaUploadsType;
  owner: UserOrExpertDetailsType; // Populated with full profile
  tagged: UserOrExpertDetailsType[]; // Experts with profile info
  verified: UserOrExpertDetailsType[]; // Experts with profile info
  filters: string[];
  routines: RoutineType[];
  readTime: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date | string;
}

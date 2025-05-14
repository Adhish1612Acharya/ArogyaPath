import { MediaUploads, Routine } from "@/types";

export interface SuccessStorySchema {
  title: string;
  description: string;
  media: MediaUploads;
  routines: Routine[];
  tagged: string[];
}

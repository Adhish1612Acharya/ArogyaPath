import { MediaUploads } from "@/types";

export interface PostFormSchema {
  title: string;
  description: string;
  media: MediaUploads;
}

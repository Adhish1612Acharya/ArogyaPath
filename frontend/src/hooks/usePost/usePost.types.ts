export interface MediaUploads {
  images: File[];
  video: File | null;
  document: File | null;
}

export interface PostFormSchema {
  title: string;
  description: string;
  media: MediaUploads;
}

export interface PostSubmissionData {
  title: string;
  description: string;
  filters: string[];
  media: {
    images: File[];
    video: File | null;
    document: File | null;
  };
}
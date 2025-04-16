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

export interface Routine {
  time: string;
  content: string;
}

export interface PostFormWithRoutineSchema {
  title: string;
  description: string;
  thumbnail: File | null;
  routines: Routine[];
  filters: string[];
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
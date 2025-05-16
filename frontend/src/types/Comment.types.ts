export interface Comment {
  _id: string;
  owner: {
    _id: string;
    profile: {
      fullName: string;
      profileImage: string;
    };
  };
  repliesCount: number;
  replies: Comment[];
  post: {
    _id: string;
  };
  repliedTo: {
    _id: string;
  } | null;
  createdAt: Date;
  content: string;
}

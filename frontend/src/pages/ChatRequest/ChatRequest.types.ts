export interface ChatRequestUser {
  user: {
    _id: string;
    profile: {
      fullName: string;
      profileImage: string;
    };
  };
  userType: "User" | "Expert";
  status: "pending" | "accepted" | "rejected";
  similarPrakrithiPercenatge?: number | null;
}

export interface ChatRequest {
  _id: string;
  ownerType: "User" | "Expert";
  owner: {
    _id: string;
    profile: {
      fullName: string;
      profileImage: string;
    };
  };
  users: ChatRequestUser[];
  chatType: "private" | "group";
  groupName?: string | null;
  chatReason?: {
    similarPrakrithi?: boolean;
    otherReason?: string | null;
  };
  chat: string | null;
  createdAt: string;
  updatedAt: string;
}

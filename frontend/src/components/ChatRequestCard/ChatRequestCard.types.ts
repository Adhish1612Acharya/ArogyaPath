import { ChatRequest } from "@/pages/ChatRequest/ChatRequest.types";

export interface ChatRequestCardProps {
  request: ChatRequest;
  myStatus: "pending" | "accepted" | "rejected";
  currUser: string;
  formatTimestamp: (timestamp: string | Date) => string;
  handleAccept: (id: string) => void;
  handleReject: (id: string) => void;
  handleProfileClick: (userId: string) => void;
}

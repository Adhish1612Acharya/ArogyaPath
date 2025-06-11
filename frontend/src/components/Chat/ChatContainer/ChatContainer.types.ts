import { UserOrExpertDetailsType } from "@/types";
import { Message } from "@/types/Message.types";

export default interface ChatContainerProps {
  messages: Message[];
  currUser: UserOrExpertDetailsType | null;
}

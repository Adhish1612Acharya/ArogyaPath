import { UserOrExpertDetailsType } from "@/types";

export interface ChatInputProps {
  chatId: string;
  currUser: UserOrExpertDetailsType | null;
}

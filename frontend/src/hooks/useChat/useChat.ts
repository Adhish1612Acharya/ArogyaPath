import React from "react";
import useApi from "../useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { ChatParticipants } from "./useChat.types";

const useChat = () => {
  const { get, post } = useApi();

  const fetchChatMessages = async (chatId: string) => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/chat/${chatId}`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const createChat = async (participants: ChatParticipants[]) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/chat`,
        { participants }
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  return {
    fetchChatMessages,
    createChat,
  };
};

export default useChat;

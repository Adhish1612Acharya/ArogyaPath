import useApi from "../useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";

const useSuccessStory = () => {
  const { get, post, put } = useApi();

  const submitSuccessStory = async (formData: FormData) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/success-stories`,
        formData
      );
      toast.success("Success story shared successfully!");
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const verifySuccessStory = async (id: string) => {
    try {
      const response = await put(
        `${import.meta.env.VITE_SERVER_URL}/api/success-stories/${id}/verify`,
        {}
      );

      if (response.data.success) {
        toast.success("Post Verified");
      } else {
        toast.error(
          response.data.message || "Something went wrong while verifying"
        );
      }
      return response.data;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const getAllSuccessStories = async () => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/success-stories`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const getSuccessStoryById = async (id: string) => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/success-stories/${id}`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  return {
    submitSuccessStory,
    verifySuccessStory,
    getAllSuccessStories,
    getSuccessStoryById,
  };
};

export default useSuccessStory;

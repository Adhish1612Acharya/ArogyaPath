import { toast } from "react-toastify";
import useApi from "../useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { PostFormSchema } from "./usePost.types";

const usePost = () => {
  const { post, get } = useApi();

  const getAllPosts = async () => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/posts`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const getPostById = async (id: string) => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/${id}`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const submitPost = async (formData: PostFormSchema) => {
    try {
      const postData = new FormData();
      postData.append("title", formData.title);
      postData.append("description", formData.description);
      if (formData.media.images.length > 0) {
        formData.media.images.forEach((image: File) => {
          postData.append("media", image);
        });
      } else if (formData.media.video) {
        postData.append("media", formData.media.video);
      } else if (formData.media.document) {
        postData.append("media", formData.media.document);
      }

      for (let [key, value] of postData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/posts`,
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Routine post created successfully");
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  return {
    submitPost,
    getAllPosts,
    getPostById,
  };
};

export default usePost;

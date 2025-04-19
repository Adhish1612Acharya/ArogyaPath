import React from "react";
import useApi from "../useApi/useApi";
import { toast } from "react-toastify";
import { normalizeAllPosts } from "@/utils/normalizeALLPosts";

const useGetPost = () => {
  const { get } = useApi();

  const getAllTypesOfPosts = async () => {
    try {
      const gposts = await get(`${import.meta.env.VITE_SERVER_URL}/api/posts`);

      const routines = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/routines`
      );

      const ss = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/success-stories`
      );
      const allPosts = {
        generalPosts: gposts.posts,
        routines: routines.routines,
        successStories: ss.successStories,
      };

      const unifiedPosts = normalizeAllPosts({
        gposts: allPosts.generalPosts,
        routines: allPosts.routines,
        successStories: allPosts.successStories,
      });

      return {
        allPosts,
        unifiedPosts,
      };
    } catch (error: any) {
      if (error.isAxiosError) {
        if (error.response?.status === 401) {
          toast.error("You are not authenticated. Please log in.");
        } else if (error.response?.status === 403) {
          toast.error("You are not authorized to verify this post.");
        } else if (error.response?.status === 404) {
          toast.error("Post not found");
        } else if (error.response?.status === 429) {
          toast.error("Too many requests - please slow down");
        } else {
          toast.error(error.response?.data?.message || error.message);
        }
      } else {
        toast.error(error.message || "Something went wrong");
      }

      throw error;
    }
  };
  return {
    getAllTypesOfPosts,
  };
};

export default useGetPost;

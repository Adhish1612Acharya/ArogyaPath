import useApi from "../useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";
import { RoutineSchema } from "./useRoutine.types";

const useRoutines = () => {
  const { get, post } = useApi();

  const getRoutinesPostById = async (id: string) => {
    try {
      const rposts = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/routines/${id}`
      );

      return rposts;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const getAllRoutinesPost = async () => {
    try {
      const rposts = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/routines`
      );

      return rposts;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const submitRoutinePost = async (formData: RoutineSchema) => {
    try {
      const routineData = new FormData();
      routineData.append("title", formData.title);
      routineData.append("description", formData.description);
      if (formData.thumbnail instanceof File) {
        console.log("Post Thumbnail : ", formData.thumbnail);
        routineData.append("thumbnail", formData.thumbnail);
      }
      routineData.append("routines", JSON.stringify(formData.routines));

      // for (let [key, value] of routineData.entries()) {
      //   console.log(`${key}:`, value);
      // }

      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/routines`,
        routineData,
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

  const filterSearch = async (query: string) => {
    try {
      console.log(query);
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/routines/filter`,
        {
          params: {
            filters: query,
          },
        }
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  return {
    getRoutinesPostById,
    getAllRoutinesPost,
    submitRoutinePost,
    filterSearch
  };
};

export default useRoutines;

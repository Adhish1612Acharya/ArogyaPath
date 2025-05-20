import useApi from "../useApi/useApi";
import { PrakrithiFormType } from "./usePrakrithi.types";
import { handleAxiosError } from "@/utils/handleAxiosError";

const usePrakrithi = () => {
  const { get, post } = useApi();

  const getSimilarPrakrithiUsers = async () => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/prakrithi/similar_users`
      );
      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const findPrakrithi = async (data: PrakrithiFormType) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/prakrithi`,
        data
      );
      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return {
    getSimilarPrakrithiUsers,
    findPrakrithi,
  };
};

export default usePrakrithi;

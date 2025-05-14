import useApi from "@/hooks/useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";
import {
  ExpertCompleteProfileData,
  ExpertRegisterFormData,
} from "./useExpertAuth.types";

const useExpertAuth = () => {
  const { post, get } = useApi();

  const expertLogin = async (email: string, password: string) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/expert/login`,
        {
          email,
          password,
        }
      );
      if (response.success) {
        toast.success("Logged in successfully");
      }
      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const expertSignUp = async (data: ExpertRegisterFormData) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/expert/signup`,
        data
      );
      if (response.success) {
        toast.success("Signed up successfully");
      }
      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const expertLogout = async () => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/expert/logout`
      );
      if (response.success) {
        toast.success("Logged out successfully");
      }
      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const expertCompleteProfile = async (
    profileData: ExpertCompleteProfileData
  ) => {
    try {
      profileData.contactNo = Number(profileData.contactNo);
      profileData.experience = Number(profileData.experience);
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/experts/complete-profile`,
        profileData
      );
      if (response.success) {
        toast.success("Profile completed successfully");
      }
      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return {
    expertLogin,
    expertLogout,
    expertSignUp,
    expertCompleteProfile,
  };
};

export default useExpertAuth;

import useApi from "@/hooks/useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";
import {
  UserCompleteProfileData,
  UserRegisterFormData,
} from "./useUserAuth.types";

const useUserAuth = () => {
  const { post, patch } = useApi();

  const userLogin = async (email: string, password: string) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/user/login`,
        {
          email,
          password,
          role: "User",
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

  const userSignUp = async (data: UserRegisterFormData) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/user/signup`,
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

  const userCompleteProfile = async (profileData: UserCompleteProfileData) => {
    try {
      profileData.contactNo = Number(profileData.contactNo);
      profileData.age = Number(profileData.age);
      const response = await patch(
        `${import.meta.env.VITE_SERVER_URL}/api/users/complete-profile`,
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
    userLogin,

    userSignUp,
    userCompleteProfile,
  };
};

export default useUserAuth;

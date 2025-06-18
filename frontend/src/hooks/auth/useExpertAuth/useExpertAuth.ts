import useApi from "@/hooks/useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";
import { ExpertRegisterFormData } from "./useExpertAuth.types";
import { ExpertFormData } from "@/pages/AfterRegisterPage/ExpertCompleteProfile/ExpertCompleteProfile.types";

const useExpertAuth = () => {
  const { post, patch } = useApi();

  const expertLogin = async (email: string, password: string) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/expert/login`,
        {
          email,
          password,
          role: "Expert",
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
  const expertCompleteProfile = async (formData: ExpertFormData) => {
    try {
      // Create FormData to handle file uploads
      const uploadData = new FormData();

      // Add document files
      if (formData.identityProof) {
        uploadData.append("identityProof", formData.identityProof);
      }
      if (formData.degreeCertificate) {
        uploadData.append("degreeCertificate", formData.degreeCertificate);
      }
      if (formData.registrationProof) {
        uploadData.append("registrationProof", formData.registrationProof);
      }
      if (formData.practiceProof) {
        uploadData.append("practiceProof", formData.practiceProof);
      }

      // Format the data according to the backend schema
      const profileData = {
        profile: {
          contactNo: parseInt(formData.mobileNumber),
          expertType: formData.expertType,
          experience: formData.yearsOfExperience,
          qualifications: formData.qualifications.map((q) => ({
            degree: q.degree,
            college: q.college,
            year: q.year,
          })),
          address: {
            country: "Bharat",
            city: formData.city,
            state: formData.state,
            pincode: formData.pinCode,
            clinicAddress: formData.street ?? "",
          },
          specialization: formData.specializations,
          bio: formData.bio ?? "",
          languagesSpoken: formData.languages,
        },
        verificationDetails: {
          dateOfBirth: formData.dateOfBirth.toISOString(),
          gender: formData.gender.toLowerCase() as "male" | "female" | "other",
          registrationDetails: {
            registrationNumber: formData.ayushRegistrationNumber,
            registrationCouncil: formData.registrationCouncil,
            yearOfRegistration: parseInt(formData.yearOfRegistration),
          },
        },
      };

      // Add profile data as JSON strings
      uploadData.append("profile", JSON.stringify(profileData.profile));
      uploadData.append(
        "verificationDetails",
        JSON.stringify(profileData.verificationDetails)
      );

      const response = await patch(
        `${import.meta.env.VITE_SERVER_URL}/api/experts/complete-profile`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.success) {
        toast.success("Profile completed successfully");
      }
      return response;
    } catch (err) {
      handleAxiosError(err);
    }
  };

  return {
    expertLogin,
    expertSignUp,
    expertCompleteProfile,
  };
};

export default useExpertAuth;

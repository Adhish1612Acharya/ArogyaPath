import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAuth = () => {
  const navigate = useNavigate();

  const logout = async () => {
    toast.success("Logged Out");
    window.location.href = "/";
  };

  const googleLogin = async () => {
    toast.info("Google Login is not implemented");
    navigate("/expert/register");
  };

  const googleSignUp = async (role: string) => {
    toast.info(`Sign up as ${role} is not implemented`);
    navigate("/gposts");
  };

  const signInWithEmailPassword = async (email: string, password: string) => {
    try {
      console.log("Sign IN with google");
      const response = await axios.post(
        "http://localhost:3000/api/auth/expert/login",
        {
          email,
          password,
        }
      );
      console.log("Response", response);
      if (response.status === 200) {
        toast.success("Logged in");
      }

      navigate("/posts");
    } catch (err: any) {
      if (err.response.status === 401) {
        console.log("Not logged in");
        throw new Error("You need to Login");
      } else if (err.response.status === 400) {
        console.log(err.response.data.message);
        throw new Error("Bad request : 400");
      } else {
        throw new Error(err.message || "Something went wrong");
      }
    }
  };

  const expertSignUp = async (data: any) => {
    const reponse = await axios.post(
      "http://localhost:3000/api/auth/expert/signUp",
      data,
      { withCredentials: true }
    );
    return reponse;
  };

  return {
    googleLogin,
    googleSignUp,
    logout,
    signInWithEmailPassword,
    expertSignUp,
  };
};

export default useAuth;

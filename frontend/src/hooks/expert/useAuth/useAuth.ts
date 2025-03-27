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

  const googleSignUp = async (role: string, profileData: any, address: string, phoneNumber: string) => {
    toast.info(`Sign up as ${role} is not implemented`);
    navigate("/posts");
  };

  const signInWithEmailPassword = async (email: string, password: string) => {
    toast.info("Sign-in with Email and Password is not implemented");
    navigate("/posts");
  };

  const expertSignUp = async (data: any) => {
    toast.info("Expert Sign-up is not implemented");
    navigate("/posts")
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
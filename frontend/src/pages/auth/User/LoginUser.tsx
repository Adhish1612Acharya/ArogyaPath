import AuthLayoutUser from "@/components/AuthLayoutUser/AuthLayoutUser";
import  UserLoginForm  from "@/components/Forms/User/UserLoginForm/UserLoginForm";

export function LoginUser() {
  return (
    <AuthLayoutUser
      title="Welcome Back, User"
      subtitle="Log in to your account to continue."
    >
      <UserLoginForm />
      <p className="text-center text-sm text-gray-600">
        Dont have an account?{" "}
        <a
          href="/User/RegisterUser"
          className="font-medium text-green-600 hover:text-green-500"
        >
          Register here
        </a>
      </p>
    </AuthLayoutUser>
  );
};

export default LoginUser;

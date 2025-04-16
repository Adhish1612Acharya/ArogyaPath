import AuthLayoutUser from "@/components/AuthLayoutUser/AuthLayoutUser";
import UserLoginForm from "@/components/Forms/User/UserLoginForm/UserLoginForm";

export function LoginUser() {
  return (
    <AuthLayoutUser
      title="Welcome Back"
      subtitle="Log in to access Ayurvedic wellness insights tailored for you."
    >
      <UserLoginForm />
      <p className="text-center text-sm text-muted-foreground mt-6">
        Don’t have an account?{" "}
        <a
          href="/User/RegisterUser"
          className="font-medium text-green-600 hover:text-green-500 transition-colors"
        >
          Register here
        </a>
      </p>
    </AuthLayoutUser>
  );
}

export default LoginUser;

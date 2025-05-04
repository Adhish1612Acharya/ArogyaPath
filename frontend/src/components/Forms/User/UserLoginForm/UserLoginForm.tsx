import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import userLoginSchema from "./UserLoginSchema";
import { Input } from "@/components/ui/input";
import Button from "@mui/material/Button";
import { Loader2, LogIn } from "lucide-react";
import useAuth from "@/hooks/user/useAuth/useAuth";
import GoogleIcon from "@mui/icons-material/Google";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLoginForm = () => {
  const { phonePaswordLogin } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userLoginSchema>) => {
    const response = await axios.post(
      "http://localhost:3000/api/auth/user/login",
      {
        username: data.phoneNumber,
        password: data.password,
      },
      { withCredentials: true }
    );
    if (response.data.success) {
      navigate("/gposts");
    } else {
      toast.error("Either username or password is incorrect");
    }
    // await phonePaswordLogin(data.phoneNumber + "@gmail.com", data.password);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="user"
                  {...field}
                  className="focus:ring-green-500 focus:border-green-500"
                />
              </FormControl>
              <FormMessage className="text-xs text-rose-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-gray-700">Password</FormLabel>
                <a
                  href="/user/forgot-password"
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  Forgot password?
                </a>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="focus:ring-green-500 focus:border-green-500"
                />
              </FormControl>
              <FormMessage className="text-xs text-rose-600" />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            disabled={form.formState.isSubmitting}
            startIcon={
              form.formState.isSubmitting ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <LogIn className="w-5 h-5" />
              )
            }
            sx={{
              textTransform: "none",
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Sign in
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outlined"
            fullWidth
            // onClick={googleLogin}
            startIcon={<GoogleIcon sx={{ color: "#EA4335" }} />}
            sx={{
              textTransform: "none",
              py: 1.5,
              fontWeight: 500,
              borderColor: "#E5E7EB",
              "&:hover": {
                borderColor: "#D1D5DB",
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            Continue with Google
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>
            Don't have an account?{" "}
            <a
              href="/user/register"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default UserLoginForm;

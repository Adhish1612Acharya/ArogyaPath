import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userRegisterSchema from "./UserRegisterSchema";
import { Loader2, UserPlus } from "lucide-react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import useUserAuth from "@/hooks/auth/useUserAuth/useUserAuth";

export const UserRegisterForm = () => {
  const { userSignUp } = useUserAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof userRegisterSchema>>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      fullName: "",
      password: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userRegisterSchema>) => {
    const newData = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };

    const response = await userSignUp(newData);

    if (response.success) {
      navigate("/user/complete-profile");
    }
  };

  const googleSignUp = async () => {
    window.open("http://localhost:3000/api/auth/google/user", "_self");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@gmail.com"
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
                <FormLabel className="text-gray-700">Password</FormLabel>
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
        </div>

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
                <UserPlus className="w-5 h-5" />
              )
            }
            sx={{
              textTransform: "none",
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Create Account
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

          <Button type="button" className="w-full" onClick={googleSignUp}>
            <GoogleIcon fontSize="large" />
            SignUp with Google
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <a
              href="/user/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </form>
    </Form>
  );
};

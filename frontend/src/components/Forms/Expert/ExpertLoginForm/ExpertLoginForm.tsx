import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Button from "@mui/material/Button"; 
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import GoogleIcon from "@mui/icons-material/Google";
import { FC } from "react";
import loginSchema from "./ExpertLoginFormSchema";
import useAuth from "@/hooks/expert/useAuth/useAuth";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";

const ExpertLoginForm: FC = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/expert/login",
        {
          username: data.email,
          password: data.password,
        },
        {withCredentials:true}
      );
      if (response.status === 200) {
        toast.success("Logged in successfully");
      }
    } catch (err: any) {
      if (err.response.status === 401) {
        throw new Error("You need to Login");
      } else if (err.response.status === 400) {
        throw new Error("Bad request : 400");
      } else {
        throw new Error(err.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10 text-amber-600"
          >
            <path d="M12 2v4M6 8l-3 3M21 11l-3-3M18 22v-4M15 15l3 3M9 15l-3 3" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Vaidya Login</h2>
        <p className="mt-2 text-sm text-gray-600">
          Access your Ayurvedic practice dashboard
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="vaidya@example.com"
                    {...field}
                    className="focus:ring-amber-500 focus:border-amber-500"
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
                    href="/expert/forgot-password"
                    className="text-sm font-medium text-amber-600 hover:text-amber-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="focus:ring-amber-500 focus:border-amber-500"
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
  color="warning"
  fullWidth
  disabled={form.formState.isSubmitting}
  startIcon={
    form.formState.isSubmitting ? (
      <Loader2 className="animate-spin w-5 h-5" />
    ) : (
      <LogIn className="w-5 h-5" />
    )
  }
  sx={{ textTransform: "none", py: 1.5 }}
>
  Sign in
</Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-5 py-2 text-gray-500 rounded-md">
  Or
</span>
              </div>
            </div>

            <Button
  type="button"
  variant="outlined"
  fullWidth
  onClick={() => googleLogin()}
  startIcon={<GoogleIcon sx={{ color: "#EA4335" }} />}
  sx={{ textTransform: "none", py: 1.5 }}
>
  Continue with Google
</Button>

          </div>
        </form>
      </Form>

      <div className="text-center text-sm text-gray-600">
        <p>
          New to ArogyaPath?{" "}
          <a
            href="/expert/register"
            className="font-medium text-amber-600 hover:text-amber-500"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default ExpertLoginForm;
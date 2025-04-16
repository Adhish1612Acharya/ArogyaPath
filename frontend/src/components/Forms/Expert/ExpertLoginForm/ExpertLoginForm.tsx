import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Button } from "@/components/ui/button";

const ExpertLoginForm: FC = () => {
  // const { googleLogin, signInWithEmailPassword } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      console.log("Sign IN with email password");
      const response = await axios.post(
        "http://localhost:3000/api/auth/expert/login",
        {
          username: data.email, // Explicit key-value
          password: data.password,
        },
        {withCredentials:true}
      );
      console.log("Response", response);
      if (response.status === 200) {
        toast.success("Logged in");
      }

      // useNavigate("/posts");
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Button
            type="submit"
            className="cursor-pointer"
            variant="outline"
            disabled={form.formState.isSubmitting}
            fullWidth
            icon={LogIn}
          >
            {form.formState.isSubmitting ? <Loader2 /> : "Sign in"}
          </Button>

          <Button
            type="button"
            onClick={() => googleLogin()}
            className="cursor-pointer"
            variant="outline"
            fullWidth
            icon={GoogleIcon}
          >
            Sign In with Google
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Dont have an account?{" "}
          <a
            href="/expert/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </a>
        </p>
      </form>
    </Form>
  );
};

export default ExpertLoginForm;

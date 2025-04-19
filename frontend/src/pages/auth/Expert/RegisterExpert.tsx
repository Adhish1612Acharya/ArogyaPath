import { FC, useState } from "react";
import { Heart, Loader2, UserPlus } from "lucide-react";
import AuthLayoutExpert from "@/components/AuthLayoutExpert/AuthLayoutExpert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";

// Schema
const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const userTypeOptions = [
  { type: "ayurvedic", label: "Ayurvedic Doctor", icon: Heart },
  { type: "naturopathy", label: "Naturopathy Doctor", icon: Heart },
];

const RegisterExpert: FC = () => {
  const navigate = useNavigate();

  const [userType, setUserType] = useState<string | null>(null);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/expert/signUp",
        {
          username: data.name,
          email: data.email,
          password: data.password,
        }
      );

      if (response.data.success) {
        toast.success("Registered successfully!");
        navigate("/gposts");
      }else{
         toast.error("Username already exists");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed.");
    }
  };

  const googleRegister = () => {
    toast.info("Google Registration coming soon!");
    // You can plug in your Google OAuth flow here.
  };

  return (
    <AuthLayoutExpert
      title="Create an Account"
      subtitle="Join our community and make a difference."
    >
      {!userType ? (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">
            Select your role
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {userTypeOptions.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setUserType(type)}
                className="p-4 border-2 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
              >
                <Icon className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <span className="block text-sm font-medium text-gray-900">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Expert Registration
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Join ArogyaPath as a certified{" "}
                {userType === "ayurvedic" ? "Ayurvedic" : "Naturopathy"}{" "}
                practitioner
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onRegisterSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Vaidya Name" {...field} />
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
                      <FormLabel className="text-gray-700">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="vaidya@example.com" {...field} />
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
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-600" />
                    </FormItem>
                  )}
                />

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
                      <UserPlus className="w-5 h-5" />
                    )
                  }
                  sx={{ textTransform: "none", py: 1.5 }}
                >
                  Register
                </Button>

                {/* Divider */}
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

                {/* Register with Google */}
                <Button
                  type="button"
                  variant="outlined"
                  fullWidth
                  onClick={googleRegister}
                  startIcon={<GoogleIcon sx={{ color: "#EA4335" }} />}
                  sx={{ textTransform: "none", py: 1.5 }}
                >
                  Register with Google
                </Button>
              </form>
            </Form>

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => setUserType(null)}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Change role
              </button>

              <p className="text-sm text-gray-600 text-right">
                Already have an account?{" "}
                <a
                  href="/expert/login"
                  className="font-medium text-amber-600 hover:text-amber-500"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </>
      )}
    </AuthLayoutExpert>
  );
};

export default RegisterExpert;

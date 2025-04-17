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
import useAuth from "@/hooks/user/useAuth/useAuth";
import { Loader2, UserPlus } from "lucide-react";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const UserRegisterForm = () => {
  const { userSignUp, googleLogin } = useAuth();
  
  const form = useForm<z.infer<typeof userRegisterSchema>>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      phoneNumber: "",
      language: "English", // Default value
      name: "",
      state: "",
      city: "",
      experience: "",
      password: "",
      confirmPassword: ""
    },
  });

  const onSubmit = async (data: z.infer<typeof userRegisterSchema>) => {
    const newData = {
      phoneNumber: Number(data.phoneNumber),
      language: data.language,
      name: data.name,
      state: data.state,
      city: data.city,
      experience: data.experience,
      password: data.password,
    };
    await userSignUp(newData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="1234567890"
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
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-rose-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">State</FormLabel>
                <FormControl>
                  <Input
                    placeholder="California"
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Los Angeles"
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
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Experience (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="5 years"
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Confirm Password</FormLabel>
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

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={googleLogin}
          >
            <GoogleIcon className="mr-2 h-4 w-4 text-[#EA4335]" />
            Continue with Google
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
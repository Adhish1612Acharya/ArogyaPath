import z from "zod";
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
import Button from "@/components/Button/Button";
import userRegisterSchema from "./UserRegisterSchema";
import useAuth from "@/hooks/user/useAuth/useAuth";
import { Loader2 } from "lucide-react";

export const UserRegisterForm = () => {
  const { userSignUp } = useAuth();
  const form = useForm({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      phoneNumber: "",
      language: "",
      name: "",
      state: "",
      city: "",
      experience: "",
      password: "",
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
    await userSignUp(newData as any);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="number" placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input placeholder="English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="California" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Los Angeles" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Input placeholder="5 years" {...field} />
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
            variant="outline"
            type="submit"
            fullWidth
            className="bg-green-600 hover:bg-green-700"
            disabled={form.formState.isSubmitting}
          >
              {form.formState.isSubmitting ?<Loader2/>:"Create Account"}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/user/login"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Sign in
          </a>
        </p>
      </form>
    </Form>
  );
};

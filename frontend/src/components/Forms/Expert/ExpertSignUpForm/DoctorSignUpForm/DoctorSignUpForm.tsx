import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import doctorSignUpSchema from "./DoctorSignUpFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import useAuth from "@/hooks/expert/useAuth/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";

const DoctorSignUpForm = () => {
  const { expertSignUp, googleSignUp } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof doctorSignUpSchema>>({
    resolver: zodResolver(doctorSignUpSchema),
    mode: "onSubmit",
    defaultValues: {
      type: "doctor",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      name: "",
      uniqueId: "",
      education: "",
      yearsOfPractice: "1",
    },
  });

  const onSubmit = async (data: z.infer<typeof doctorSignUpSchema>) => {
    try {
      const dataToPass = {
        username: data.name,
        email: data.email,
        password: data.password,
        profile: {
          fullname: data.name,
          experience: Number(data.yearsOfPractice),
          qualification: data.education,
          expertType: data.type,
          contact: data.phoneNumber,
        },
      };

      console.log("Data to pass", dataToPass);
      // const response: any = await expertSignUp(dataToPass);

      const response = await axios.post(
        "http://localhost:3000/api/auth/expert/signUp",
        dataToPass,
        { withCredentials: true }
      );
      console.log("SignUp", response);

      // const sessionResp = await axios.get(
      //   "http://localhost:3000/debug-session",
      //   {
      //     withCredentials: true,
      //   }
      // );

      // console.log("Session Response:", sessionResp.data);

      if (response.status === 200) {
        toast.success("Signed Up Successfully");
        navigate("/posts");
      }
    } catch (err: any) {
      console.log(err);
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

  const signUpWithGoogle = async () => {
    const profileFields: (keyof z.infer<typeof doctorSignUpSchema>)[] = [
      "phoneNumber",
      "address",
      "uniqueId",
      "education",
      "yearsOfPractice",
    ];

    let isValid = true;

    for (const field of profileFields) {
      const fieldValid = await form.trigger(field);
      if (!fieldValid) isValid = false;
    }

    if (!isValid) {
      toast.error(
        "Please fill all required fields correctly before signing up with Google."
      );
    } else {
      const phoneNumber = Number(form.getValues("phoneNumber"));
      const address = form.getValues("address");
      const profileData = {
        uniqueId: Number(form.getValues("uniqueId")),
        education: form.getValues("education"),
        yearsOfPractice: Number(form.getValues("yearsOfPractice")),
      };
      await googleSignUp("doctor", profileData, address, String(phoneNumber));
    }
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
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinic Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="uniqueId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unique ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearsOfPractice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Practice</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormLabel>Enter password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="*******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="space-y-4">
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? <Loader2 /> : "Create Account"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={signUpWithGoogle}
            className="flex items-center justify-center gap-2 cursor-pointer"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google Logo"
              className="w-5 h-5"
            />
            Sign Up with Google
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DoctorSignUpForm;

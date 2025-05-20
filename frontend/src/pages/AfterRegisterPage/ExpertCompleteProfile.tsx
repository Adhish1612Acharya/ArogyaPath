import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
// import useApi from "@/hooks/useApi/useApi";
// import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useExpertAuth from "@/hooks/auth/useExpertAuth/useExpertAuth";

const vaidyaSchema = z.object({
  contactNo: z.string().min(10, "Phone number is required"),
  clinicAddress: z.string().min(1, "Clinic address is required"),
  specialization: z.string().min(1, "Specialization is required"),
  experience: z.string().min(1, "Years of experience is required"),
  bio: z.string().optional(),
});

type VaidyaFormData = z.infer<typeof vaidyaSchema>;

const ExpertCompleteProfile: React.FC = () => {
  // const { post } = useApi();
  const { expertCompleteProfile } = useExpertAuth();
  const navigate = useNavigate();

  const form = useForm<VaidyaFormData>({
    resolver: zodResolver(vaidyaSchema),
    defaultValues: {
      contactNo: "",
      clinicAddress: "",
      specialization: "",
      experience: "",
      bio: "",
    },
  });

  const onSubmit = async (data: VaidyaFormData) => {
    console.log("Expert Profile Data:", data);
    const response = await expertCompleteProfile(data);
    console.log("Response from API:", response);
    if (response.success) {
      navigate("/gposts");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-3xl w-screen mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-green-800">
          Complete Your Vaidya Profile
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {["contactNo", "clinicAddress", "specialization", "experience"].map(
              (field) => (
                <FormField
                  key={field}
                  control={form.control}
                  name={field as keyof VaidyaFormData}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      {/* Use the field variable from the map function for the label */}
                      <FormLabel className="capitalize">
                        {field.replace(/([A-Z])/g, " $1")}
                      </FormLabel>
                      <FormControl>
                        <Input {...fieldProps} placeholder={`Enter ${field}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Tell us about your Ayurvedic journey..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 text-center">
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                startIcon={<SaveIcon />}
              >
                Save Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ExpertCompleteProfile;

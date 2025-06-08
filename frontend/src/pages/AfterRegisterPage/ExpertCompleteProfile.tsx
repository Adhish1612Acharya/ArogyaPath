import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import useExpertAuth from "@/hooks/auth/useExpertAuth/useExpertAuth";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  FormHelperText,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const vaidyaSchema = z.object({
  contactNo: z.string().min(10, "Phone number is required"),
  clinicAddress: z.string().min(1, "Clinic address is required"),
  specialization: z.string().min(1, "Specialization is required"),
  experience: z.string().min(1, "Years of experience is required"),
  bio: z.string().optional(),
});

type VaidyaFormData = z.infer<typeof vaidyaSchema>;

const ExpertCompleteProfile: React.FC = () => {
  const { expertCompleteProfile } = useExpertAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VaidyaFormData>({
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

  const fields = [
    { name: "contactNo", label: "Contact Number" },
    { name: "clinicAddress", label: "Clinic Address" },
    { name: "specialization", label: "Specialization" },
    { name: "experience", label: "Years of Experience" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              textAlign: "center",
              color: "success.dark",
              fontWeight: 600,
              mb: 4,
            }}
          >
            Complete Your Vaidya Profile
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: "100%" }}
          >
            <Stack spacing={3}>
              {fields.map((field) => (
                <Box key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    variant="outlined"
                    error={!!errors[field.name as keyof VaidyaFormData]}
                    {...control.register(field.name as keyof VaidyaFormData)}
                  />
                  {errors[field.name as keyof VaidyaFormData] && (
                    <FormHelperText error>
                      {errors[field.name as keyof VaidyaFormData]?.message}
                    </FormHelperText>
                  )}
                </Box>
              ))}

              <Box>
                <TextField
                  fullWidth
                  label="Short Bio"
                  variant="outlined"
                  multiline
                  rows={4}
                  error={!!errors.bio}
                  {...control.register("bio")}
                  placeholder="Tell us about your Ayurvedic journey..."
                />
                {errors.bio && (
                  <FormHelperText error>{errors.bio?.message}</FormHelperText>
                )}
              </Box>

              <Box sx={{ pt: 2, textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<SaveIcon />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Save Profile
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ExpertCompleteProfile;
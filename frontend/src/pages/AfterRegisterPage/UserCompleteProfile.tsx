// UserCompleteProfile.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  useTheme,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import useUserAuth from "@/hooks/auth/useUserAuth/useUserAuth";

const userSchema = z.object({
  contactNo: z.string().min(10, "Phone number is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  healthGoal: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

const UserCompleteProfile: React.FC = () => {
  const { userCompleteProfile } = useUserAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      contactNo: "",
      age: "",
      gender: "",
      healthGoal: "",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    console.log("User Profile Data:", data);
    const response = await userCompleteProfile(data);
    if (response.success) {
      navigate("/gposts");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.grey[100],
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 4 } }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            width: "100%",
            maxWidth: "800px",
            mx: "auto",
            backgroundColor: "background.paper",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 600,
              mb: 4,
              textAlign: "center",
              color: theme.palette.primary.dark,
            }}
          >
            Complete Your ArogyaPath Profile
          </Typography>

          <Box
            component="form"
            onSubmit={form.handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {["contactNo", "age", "gender"].map((field) => (
              <TextField
                key={field}
                fullWidth
                label={field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                variant="outlined"
                error={!!form.formState.errors[field as keyof UserFormData]}
                helperText={
                  form.formState.errors[field as keyof UserFormData]?.message
                }
                {...form.register(field as keyof UserFormData)}
                placeholder={`Enter ${field}`}
              />
            ))}

            <TextField
              fullWidth
              label="Health Goals"
              variant="outlined"
              multiline
              rows={4}
              placeholder="What are your wellness goals?"
              error={!!form.formState.errors.healthGoal}
              helperText={form.formState.errors.healthGoal?.message}
              {...form.register("healthGoal")}
            />

            <Box sx={{ pt: 2, textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<CheckCircleIcon />}
                sx={{ px: 4, py: 1.5 }}
              >
                Complete Profile
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserCompleteProfile;
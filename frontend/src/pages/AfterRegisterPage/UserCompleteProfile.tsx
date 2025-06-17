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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import useUserAuth from "@/hooks/auth/useUserAuth/useUserAuth";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const userSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.date().refine(
    (date) => {
      const today = new Date();
      const hundredYearsAgo = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
      );
      return date <= today && date >= hundredYearsAgo;
    },
    { message: "Invalid date of birth" }
  ),
  contactNo: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  currentCity: z.string().min(1, "Current city is required"),
  state: z.string().min(1, "State is required"),
  healthGoal: z.string().min(1, "Primary wellness goal is required"),
  profilePicture: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
      "Max image size is 2MB"
    )
    .refine(
      (file) =>
        !file ||
        (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Only .jpg, .jpeg, .png formats are supported"
    ),
  governmentId: z
    .any()
    .refine((file) => file instanceof File, "Government ID is required")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "Max file size is 2MB"
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png formats are supported"
    ),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type UserFormData = z.infer<typeof userSchema>;

const UserCompleteProfile: React.FC = () => {
  const { userCompleteProfile } = useUserAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      gender: "",
      dateOfBirth: new Date(new Date().getFullYear() - 18, 0, 1), // Default to 18 years ago
      contactNo: "",
      email: "",
      currentCity: "",
      state: "",
      healthGoal: "",
      consent: false,
    },
  });

  // Patch: Add 'age' to the data sent to userCompleteProfile
  const onSubmit = async (data: UserFormData) => {
    // Calculate age from dateOfBirth
    const today = new Date();
    const birthDate = new Date(data.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    const profileData = {
      ...data,
      age: age.toString(),
    };
    const response = await userCompleteProfile(profileData);
    if (response.success) {
      navigate("/gposts");
    }
  };

  const handleFileChange =
    (fieldName: keyof UserFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        form.setValue(fieldName, file, { shouldValidate: true });
      }
    };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.grey[100],
          py: 4,
        }}
      >
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 4 } }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 4,
              width: "100%",
              maxWidth: "900px",
              mx: "auto",
              backgroundColor: "background.paper",
              boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.primary.dark,
                  textAlign: "center",
                }}
              >
                Complete Your Profile
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "center", maxWidth: "600px" }}
              >
                Help us personalize your ArogyaPath experience by providing some
                additional details about yourself.
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={form.handleSubmit(onSubmit)}
              sx={{ mt: 4 }}
            >
              {/* Profile Picture Upload */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 120,
                    height: 120,
                  }}
                >
                  <Avatar
                    src={
                      form.watch("profilePicture")
                        ? URL.createObjectURL(form.watch("profilePicture"))
                        : ""
                    }
                    sx={{
                      width: "100%",
                      height: "100%",
                      fontSize: "3rem",
                      bgcolor: theme.palette.grey[300],
                    }}
                  >
                    {form.watch("fullName")?.[0]?.toUpperCase() || "P"}
                  </Avatar>
                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    <PhotoCamera />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange("profilePicture")}
                    />
                  </IconButton>
                </Box>
              </Box>
              {form.formState.errors.profilePicture && (
                <Box sx={{ mb: 3 }}>
                  <Typography color="error" variant="body2">
                    {form.formState.errors.profilePicture?.message?.toString()}
                  </Typography>
                </Box>
              )}

              {/* Personal Information Section */}
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              >
                Personal Information
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                  mb: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    error={!!form.formState.errors.fullName}
                    helperText={form.formState.errors.fullName?.message}
                    {...form.register("fullName")}
                    placeholder="As per your government ID"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth error={!!form.formState.errors.gender}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      label="Gender"
                      {...form.register("gender")}
                      defaultValue=""
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    {form.formState.errors.gender && (
                      <Typography color="error" variant="body2">
                        {form.formState.errors.gender.message}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                  mb: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <DatePicker
                    label="Date of Birth"
                    value={form.watch("dateOfBirth")}
                    onChange={(date) => form.setValue("dateOfBirth", date as Date)}
                    maxDate={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!form.formState.errors.dateOfBirth,
                        helperText: form.formState.errors.dateOfBirth?.message,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    variant="outlined"
                    type="tel"
                    error={!!form.formState.errors.contactNo}
                    helperText={form.formState.errors.contactNo?.message}
                    {...form.register("contactNo")}
                    placeholder="Enter 10-digit mobile number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+91</InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Email (Optional)"
                  variant="outlined"
                  type="email"
                  error={!!form.formState.errors.email}
                  helperText={form.formState.errors.email?.message}
                  {...form.register("email")}
                  placeholder="example@email.com"
                />
              </Box>

              {/* Location Information */}
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              >
                Location Information
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                  mb: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Current City"
                    variant="outlined"
                    error={!!form.formState.errors.currentCity}
                    helperText={form.formState.errors.currentCity?.message}
                    {...form.register("currentCity")}
                    placeholder="Enter your current city"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="State"
                    variant="outlined"
                    error={!!form.formState.errors.state}
                    helperText={form.formState.errors.state?.message}
                    {...form.register("state")}
                    placeholder="Enter your state"
                  />
                </Box>
              </Box>

              {/* Wellness Information */}
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              >
                Wellness Information
              </Typography>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Primary Wellness Goal"
                  variant="outlined"
                  error={!!form.formState.errors.healthGoal}
                  helperText={form.formState.errors.healthGoal?.message}
                  {...form.register("healthGoal")}
                  placeholder="E.g., Better sleep, Immunity, Weight management"
                />
              </Box>

              {/* Document Upload */}
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              >
                Document Verification
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{
                    py: 2,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    borderColor: form.formState.errors.governmentId
                      ? theme.palette.error.main
                      : theme.palette.grey[400],
                  }}
                >
                  Upload Government ID (Aadhaar/Voter ID/Driving License)
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange("governmentId")}
                  />
                </Button>
                {form.formState.errors.governmentId && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {form.formState.errors.governmentId.message}
                  </Typography>
                )}
                {form.watch("governmentId") && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected file: {form.watch("governmentId").name}
                  </Typography>
                )}
              </Box>

              {/* Consent Checkbox */}
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.watch("consent")}
                      {...form.register("consent")}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{" "}
                      <Typography
                        component="a"
                        href="#"
                        color="primary"
                        sx={{ textDecoration: "underline" }}
                      >
                        Terms of Service
                      </Typography>{" "}
                      and{" "}
                      <Typography
                        component="a"
                        href="#"
                        color="primary"
                        sx={{ textDecoration: "underline" }}
                      >
                        Privacy Policy
                      </Typography>
                      , and confirm that all information provided is accurate.
                    </Typography>
                  }
                />
                {form.formState.errors.consent && (
                  <Typography color="error" variant="body2">
                    {form.formState.errors.consent.message}
                  </Typography>
                )}
              </Box>

              {/* Submit Button */}
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<CheckCircleIcon />}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  Complete Profile
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default UserCompleteProfile;
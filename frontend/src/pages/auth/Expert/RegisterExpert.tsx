import { FC, useState } from "react";
import { Heart, UserPlus } from "lucide-react";
import AuthLayoutExpert from "@/components/AuthLayoutExpert/AuthLayoutExpert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import useExpertAuth from "@/hooks/auth/useExpertAuth/useExpertAuth";
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

// Schema
const registerSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const userTypeOptions = [
  { type: "ayurvedic", label: "Ayurvedic Doctor", icon: Heart },
  { type: "naturopathy", label: "Naturopathy Doctor", icon: Heart },
];

const RegisterExpert: FC = () => {
  const navigate = useNavigate();
  const { expertSignUp } = useExpertAuth();
  const theme = useTheme();
  const [userType, setUserType] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
    const response = await expertSignUp({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });

    if (response.success) {
      navigate("/expert/complete-profile");
    }
  };

  const googleRegister = () => {
    window.open(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/google/expert`,
      "_self"
    );
  };

  return (
    <AuthLayoutExpert
      title="Create an Account"
      subtitle="Join our community and make a difference."
    >
      {!userType ? (
        <Box sx={{ width: "100%" }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Select your role
          </Typography>
          <Grid container spacing={2}>
            {userTypeOptions.map(({ type, label, icon: Icon }) => (
              <Grid item xs={12} sm={6} key={type}>
                <Card
                  onClick={() => setUserType(type)}
                  sx={{
                    p: 3,
                    cursor: "pointer",
                    border: "2px solid transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: theme.palette.primary.lighter,
                    },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: theme.palette.primary.light,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Icon
                      style={{
                        width: 28,
                        height: 28,
                        color: theme.palette.primary.main,
                      }}
                    />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                mx: "auto",
                width: 80,
                height: 80,
                bgcolor: "warning.light",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <UserPlus style={{ width: 36, height: 36, color: theme.palette.warning.main }} />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Expert Registration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join ArogyaPath as a certified{" "}
              {userType === "ayurvedic" ? "Ayurvedic" : "Naturopathy"}{" "}
              practitioner
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onRegisterSubmit)}>
            <Stack spacing={3}>
              <FormControl fullWidth variant="outlined" error={!!errors.fullName}>
                <InputLabel htmlFor="fullName">Full Name</InputLabel>
                <OutlinedInput
                  id="fullName"
                  label="Full Name"
                  {...register("fullName")}
                  placeholder="Vaidya Name"
                />
                {errors.fullName && (
                  <FormHelperText>{errors.fullName.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth variant="outlined" error={!!errors.email}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                  id="email"
                  label="Email"
                  {...register("email")}
                  placeholder="vaidya@example.com"
                />
                {errors.email && (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth variant="outlined" error={!!errors.password}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  type="password"
                  label="Password"
                  {...register("password")}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                )}
              </FormControl>

              <LoadingButton
                type="submit"
                variant="contained"
                color="warning"
                size="large"
                loading={isSubmitting}
                loadingPosition="start"
                startIcon={<UserPlus style={{ width: 20, height: 20 }} />}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Register
              </LoadingButton>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                variant="outlined"
                size="large"
                onClick={googleRegister}
                startIcon={<GoogleIcon sx={{ color: "#EA4335" }} />}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Register with Google
              </Button>
            </Stack>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" mt={4}>
            <Button
              onClick={() => setUserType(null)}
              sx={{
                color: "primary.main",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Change role
            </Button>

            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Button
                href="/expert/login"
                sx={{
                  color: "warning.main",
                  textTransform: "none",
                  fontWeight: 600,
                  p: 0,
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign in
              </Button>
            </Typography>
          </Stack>
        </Box>
      )}
    </AuthLayoutExpert>
  );
};

export default RegisterExpert;
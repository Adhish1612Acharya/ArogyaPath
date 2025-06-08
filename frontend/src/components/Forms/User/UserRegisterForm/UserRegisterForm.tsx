import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userRegisterSchema from "./UserRegisterSchema";
import { useNavigate } from "react-router-dom";
import useUserAuth from "@/hooks/auth/useUserAuth/useUserAuth";
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  useTheme,
  Paper,
  Link,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  Google as GoogleIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

export const UserRegisterForm = () => {
  const { userSignUp } = useUserAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const form = useForm<z.infer<typeof userRegisterSchema>>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      fullName: "",
      password: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userRegisterSchema>) => {
    const newData = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };

    const response = await userSignUp(newData);

    if (response.success) {
      navigate("/complete-profile/user");
    }
  };

  const googleSignUp = async () => {
    window.open(`${import.meta.env.VITE_SERVER_URL}/api/auth/google/user`, "_self");
  };

  return (
        <Stack spacing={4}>
          {/* Header */}
          <Box textAlign="center">
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Create Your Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join our community today
            </Typography>
          </Box>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {/* Form Fields */}
              
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    error={!!form.formState.errors.fullName}
                    helperText={form.formState.errors.fullName?.message}
                    {...form.register("fullName")}
                    placeholder="John Doe"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        "&:focus-within fieldset": {
                          borderColor: `${theme.palette.success.main} !important`,
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    variant="outlined"
                    error={!!form.formState.errors.email}
                    helperText={form.formState.errors.email?.message}
                    {...form.register("email")}
                    placeholder="you@gmail.com"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        "&:focus-within fieldset": {
                          borderColor: `${theme.palette.success.main} !important`,
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    variant="outlined"
                    error={!!form.formState.errors.password}
                    helperText={form.formState.errors.password?.message}
                    {...form.register("password")}
                    placeholder="••••••••"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        "&:focus-within fieldset": {
                          borderColor: `${theme.palette.success.main} !important`,
                        },
                      },
                    }}
                  />
                </Grid>
              

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                size="large"
                disabled={form.formState.isSubmitting}
                startIcon={
                  form.formState.isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <PersonAddIcon />
                  )
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                Create Account
              </Button>

              {/* Divider */}
              <Divider sx={{ my: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 2 }}
                >
                  OR CONTINUE WITH
                </Typography>
              </Divider>

              {/* Google Button */}
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={googleSignUp}
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  borderWidth: 1.5,
                  "&:hover": {
                    borderWidth: 1.5,
                  },
                }}
              >
                Sign up with Google
              </Button>

              {/* Login Link */}
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ mt: 2 }}
              >
                Already have an account?{" "}
                <Link
                  href="/user/login"
                  color="success.main"
                  sx={{
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Stack>
          </form>
        </Stack>
  
  );
};
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import {
  Favorite as HeartIcon,
  Spa as LeafIcon,
  Security as ShieldIcon,
  People as UsersIcon,
} from "@mui/icons-material";

import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth";
import Loader from "@/components/Loader";

const HomePage = () => {
  const { checkAuthStatus, loading, authState } = useCheckAuth();

  useEffect(() => {
    const check = async () => {
      await checkAuthStatus();
    };
    check();
  }, []);

  if (loading) return <Loader />;

  return (
    <Box sx={{ minHeight: "100vh", width: "100vw" }}>
      <main>
        {/* Hero Section */}
        <Box
          sx={{
            pt: 20,
            pb: 16,
            background: "linear-gradient(to bottom, #f0fdf4, #ffffff)",
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                gap: 4,
              }}
            >
              <Box sx={{ width: { md: "50%" }, maxWidth: "100%", spaceY: 6 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: "3rem",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 3,
                  }}
                >
                  Your Journey to Holistic Health Starts Here
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: "1.25rem",
                    color: "text.secondary",
                    mb: 4,
                  }}
                >
                  Connect with expert Ayurvedic practitioners and discover
                  personalized wellness solutions.
                </Typography>

                {!authState?.loggedIn && (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      to="/auth"
                      sx={{
                        backgroundColor: "primary.main",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                    >
                      Get Started
                    </Button>
                    {/* <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/experts"
                    sx={{
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "primary.light",
                        borderColor: "primary.dark",
                      },
                    }}
                  >
                    Find Experts
                  </Button> */}
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  width: { md: "50%" },
                  mt: { xs: 8, md: 0 },
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
                  alt="Ayurvedic Medicine"
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 16 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              sx={{
                fontSize: "2.5rem",
                fontWeight: 700,
                textAlign: "center",
                mb: 8,
              }}
            >
              Why Choose AyurCare?
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                justifyContent: "center",
              }}
            >
              {[
                {
                  icon: <LeafIcon color="success" sx={{ fontSize: 32 }} />,
                  title: "Traditional Wisdom",
                  description:
                    "Access centuries-old healing practices adapted for modern life.",
                },
                {
                  icon: <UsersIcon color="success" sx={{ fontSize: 32 }} />,
                  title: "Expert Practitioners",
                  description:
                    "Connect with verified Ayurvedic doctors and specialists.",
                },
                {
                  icon: <ShieldIcon color="success" sx={{ fontSize: 32 }} />,
                  title: "Trusted Platform",
                  description:
                    "Secure, reliable, and privacy-focused healthcare platform.",
                },
                {
                  icon: <HeartIcon color="success" sx={{ fontSize: 32 }} />,
                  title: "Personalized Care",
                  description:
                    "Get customized wellness plans tailored to your needs.",
                },
              ].map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 32px)",
                      md: "calc(25% - 32px)",
                    },
                    minWidth: { xs: "100%", sm: "300px", md: "auto" },
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 6,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      "&:hover": {
                        boxShadow: 6,
                      },
                      transition: "box-shadow 0.3s ease-in-out",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "success.light",
                        width: 56,
                        height: 56,
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </main>
    </Box>
  );
};

export default HomePage;

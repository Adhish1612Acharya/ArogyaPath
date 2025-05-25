import React, { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import {
  Email,
  Phone,
  Place,
  Spa,
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LinkedIn,
  MedicalInformation,
  LocalHospital,
  HealthAndSafety,
  MenuBook,
  ContactSupport,
  People,
  QuestionAnswer,
  Emergency,
  Article,
  Lightbulb,
  Dashboard,
  Group,
  LibraryBooks,
  Healing,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Slide,
  Fade,
  Zoom,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

const FloatingIcon = styled(Box)(({ theme }) => ({
  position: "absolute",
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: "50%",
  width: 60,
  height: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: theme.shadows[10],
  zIndex: 1,
  "& svg": {
    fontSize: 30,
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  transition: "all 0.3s ease",
  "&:hover": {
    color: theme.palette.secondary.main,
    transform: "translateX(5px)",
  },
}));

const PageFooter = () => {
  const { role } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visible, setVisible] = useState(false);

  const footerLinks = {
    expert: [
      {
        title: "Professional",
        icon: <MedicalInformation />,
        links: [
          { label: "Dashboard", href: "/dashboard", icon: <Dashboard /> },
          { label: "Patient Management", href: "/patients", icon: <Group /> },
          { label: "Resources", href: "/resources", icon: <LibraryBooks /> },
          { label: "Clinical Guidelines", href: "/guidelines", icon: <Healing /> },
        ],
      },
      {
        title: "Support",
        icon: <ContactSupport />,
        links: [
          { label: "Help Center", href: "/help", icon: <QuestionAnswer /> },
          { label: "Documentation", href: "/docs", icon: <MenuBook /> },
          { label: "Community", href: "/community", icon: <People /> },
        ],
      },
    ],
    user: [
      {
        title: "Health",
        icon: <HealthAndSafety />,
        links: [
          { label: "Find Experts", href: "/experts", icon: <LocalHospital /> },
          { label: "Health Articles", href: "/articles", icon: <Article /> },
          { label: "Wellness Tips", href: "/tips", icon: <Lightbulb /> },
          { label: "Emergency Care", href: "/emergency", icon: <Emergency /> },
        ],
      },
      {
        title: "Support",
        icon: <ContactSupport />,
        links: [
          { label: "FAQs", href: "/faqs", icon: <QuestionAnswer /> },
          { label: "Contact Us", href: "/contact", icon: <Email /> },
          { label: "Patient Rights", href: "/rights", icon: <HealthAndSafety /> },
        ],
      },
    ],
    noUser: [
      {
        title: "Discover",
        icon: <Spa />,
        links: [
          { label: "About Us", href: "/about", icon: <People /> },
          { label: "Services", href: "/services", icon: <LocalHospital /> },
          { label: "Health Articles", href: "/articles", icon: <Article /> },
        ],
      },
    ],
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
      setVisible(position > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: theme.palette.primary.contrastText,
        position: "relative",
        overflow: "hidden",
        py: 8,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.light})`,
        },
      }}
    >
      {/* Floating decorative elements */}
      <Fade in={visible} timeout={1000}>
        <FloatingIcon sx={{ top: "10%", left: "5%", animation: "float 6s ease-in-out infinite" }}>
          <Spa />
        </FloatingIcon>
      </Fade>
      <Fade in={visible} timeout={1500}>
        <FloatingIcon sx={{ top: "20%", right: "5%", animation: "float 8s ease-in-out infinite" }}>
          <Healing />
        </FloatingIcon>
      </Fade>

      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Slide direction="up" in={true} timeout={500}>
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Spa sx={{ fontSize: 40, color: theme.palette.secondary.main, mr: 1 }} />
                  <Typography
                    variant="h4"
                    component={RouterLink}
                    to="/"
                    sx={{
                      fontWeight: 700,
                      color: "inherit",
                      textDecoration: "none",
                      "&:hover": { color: theme.palette.secondary.main },
                    }}
                  >
                    AyurCare
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Empowering health through traditional wisdom and modern care.
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", color: theme.palette.secondary.light }}>
                  <Spa sx={{ mr: 1 }} />
                  <Typography variant="caption">Ancient roots, modern healing</Typography>
                </Box>

                {/* Newsletter Subscription */}
                {!isMobile && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                      Stay Updated
                    </Typography>
                    <Box
                      component="form"
                      sx={{
                        display: "flex",
                        gap: 1,
                        "& .MuiInputBase-root": {
                          color: theme.palette.primary.contrastText,
                          "&::before": { borderColor: theme.palette.primary.contrastText },
                        },
                      }}
                    >
                      <input
                        type="email"
                        placeholder="Your email"
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: "4px",
                          border: "none",
                          background: "rgba(255, 255, 255, 0.1)",
                          color: "white",
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          background: theme.palette.secondary.main,
                          color: theme.palette.secondary.contrastText,
                          border: "none",
                          borderRadius: "4px",
                          padding: "8px 16px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          transition: "all 0.3s",
                          "&:hover": {
                            background: theme.palette.secondary.dark,
                          },
                        }}
                      >
                        Subscribe
                      </button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Slide>
          </Grid>

          {/* Dynamic Links Columns */}
          {footerLinks[role || "noUser"].map((section, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Slide direction="up" in={true} timeout={(index + 1) * 300}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {React.cloneElement(section.icon, {
                      sx: { color: theme.palette.secondary.main, mr: 1 },
                    })}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {section.title}
                    </Typography>
                  </Box>
                  <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <StyledLink
                          component={RouterLink}
                          to={link.href}
                          color="inherit"
                          underline="none"
                          sx={{ py: 0.5 }}
                        >
                          {link.icon}
                          {link.label}
                        </StyledLink>
                      </li>
                    ))}
                  </Box>
                </Box>
              </Slide>
            </Grid>
          ))}

          {/* Contact Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Slide direction="up" in={true} timeout={900}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ContactSupport sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Contact Us
                  </Typography>
                </Box>
                <Box sx={{ "& > *:not(:last-child)": { mb: 2 } }}>
                  <StyledLink href="mailto:ayurcare@example.com" color="inherit" underline="none">
                    <Email />
                    ayurcare@example.com
                  </StyledLink>
                  <StyledLink href="tel:+919876543210" color="inherit" underline="none">
                    <Phone />
                    +91 9876543210
                  </StyledLink>
                  <StyledLink href="#" color="inherit" underline="none">
                    <Place />
                    Mangalore, India
                  </StyledLink>
                </Box>

                {/* Social Media */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Follow Us
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {[
                      { icon: <Facebook />, name: "Facebook" },
                      { icon: <Twitter />, name: "Twitter" },
                      { icon: <Instagram />, name: "Instagram" },
                      { icon: <YouTube />, name: "YouTube" },
                      { icon: <LinkedIn />, name: "LinkedIn" },
                    ].map((social, i) => (
                      <Zoom in={true} timeout={1200 + i * 100} key={social.name}>
                        <IconButton
                          aria-label={social.name}
                          sx={{
                            background: "rgba(255, 255, 255, 0.1)",
                            color: "inherit",
                            "&:hover": {
                              background: theme.palette.secondary.main,
                              color: theme.palette.secondary.contrastText,
                            },
                          }}
                        >
                          {social.icon}
                        </IconButton>
                      </Zoom>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Slide>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, background: "rgba(255, 255, 255, 0.2)" }} />

        {/* Bottom Footer */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1500}>
              <Typography variant="body2" sx={{ textAlign: { xs: "center", md: "left" } }}>
                © {new Date().getFullYear()} AyurCare. All rights reserved.
              </Typography>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1500}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  gap: 2,
                }}
              >
                <Link component={RouterLink} to="/privacy" color="inherit" underline="hover" variant="body2">
                  Privacy Policy
                </Link>
                <Link component={RouterLink} to="/terms" color="inherit" underline="hover" variant="body2">
                  Terms of Service
                </Link>
                <Link component={RouterLink} to="/cookies" color="inherit" underline="hover" variant="body2">
                  Cookie Policy
                </Link>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      {/* Floating back to top button */}
      {scrollPosition > 300 && (
        <Fade in={scrollPosition > 300}>
          <Box
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: theme.shadows[10],
              zIndex: 1000,
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                background: theme.palette.secondary.dark,
              },
            }}
          >
            <Spa sx={{ transform: "rotate(180deg)" }} />
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default PageFooter;
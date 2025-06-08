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
  ArrowUpward,
  Send
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
  TextField,
  Button,
  Tooltip,
  Grow,
  Collapse
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

// Floating animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const FloatingIcon = styled(Box)(({ theme }) => ({
  position: "absolute",
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.light} 100%)`,
  color: theme.palette.primary.contrastText,
  borderRadius: "50%",
  width: 60,
  height: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: theme.shadows[10],
  zIndex: 1,
  animation: `${float} 6s ease-in-out infinite`,
  "& svg": {
    fontSize: 30,
  },
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: theme.shadows[16],
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  transition: "all 0.3s ease",
  padding: theme.spacing(0.5, 0),
  "&:hover": {
    color: theme.palette.secondary.main,
    transform: "translateX(5px)",
    textDecoration: "none",
  },
}));

const AnimatedDivider = styled(Divider)(({ theme }) => ({
  background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}, transparent)`,
  height: 2,
  opacity: 0.7,
}));

const PageFooter = () => {
  const { role } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [scrollPosition, setScrollPosition] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const socialMedia = [
    { icon: <Facebook />, name: "Facebook", color: "#3b5998" },
    { icon: <Twitter />, name: "Twitter", color: "#1da1f2" },
    { icon: <Instagram />, name: "Instagram", color: "#e1306c" },
    { icon: <YouTube />, name: "YouTube", color: "#ff0000" },
    { icon: <LinkedIn />, name: "LinkedIn", color: "#0077b5" },
  ];

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
          animation: `${float} 8s ease-in-out infinite`,
        },
      }}
    >
      {/* Floating decorative elements */}
      <FloatingIcon sx={{ 
        top: "10%", 
        left: "5%", 
        animationDelay: "0.5s",
        display: { xs: "none", lg: "flex" }
      }}>
        <Spa />
      </FloatingIcon>
      
      <FloatingIcon sx={{ 
        top: "20%", 
        right: "5%", 
        animationDelay: "1s",
        display: { xs: "none", lg: "flex" }
      }}>
        <Healing />
      </FloatingIcon>

      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Brand Column */}
          <Grid item xs={12} md={5} lg={4}>
            <Slide direction="up" in={true} timeout={500}>
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Spa sx={{ 
                    fontSize: 40, 
                    color: theme.palette.secondary.main, 
                    mr: 1,
                    animation: `${float} 4s ease-in-out infinite` 
                  }} />
                  <Typography
                    variant="h4"
                    component={RouterLink}
                    to="/"
                    sx={{
                      fontWeight: 700,
                      color: "inherit",
                      textDecoration: "none",
                      "&:hover": { 
                        color: theme.palette.secondary.main,
                        textShadow: `0 0 10px ${theme.palette.secondary.light}`
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    AyurCare
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Empowering health through traditional wisdom and modern care.
                </Typography>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  color: theme.palette.secondary.light,
                  mb: 4
                }}>
                  <Spa sx={{ mr: 1, fontSize: 18 }} />
                  <Typography variant="caption">Ancient roots, modern healing</Typography>
                </Box>

                {/* Newsletter Subscription */}
                <Box sx={{ mt: 4, maxWidth: 400 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Stay Updated
                  </Typography>
                  <Collapse in={!subscribed}>
                    <Box
                      component="form"
                      onSubmit={handleSubscribe}
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        placeholder="Your email"
                        size="small"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: theme.palette.primary.contrastText,
                            "& fieldset": {
                              borderColor: "rgba(255, 255, 255, 0.3)",
                            },
                            "&:hover fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "rgba(255, 255, 255, 0.7)",
                          },
                        }}
                      />
                      <Tooltip title="Subscribe">
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                          sx={{
                            minWidth: 0,
                            height: 40,
                            width: 40,
                            borderRadius: "50%",
                          }}
                        >
                          <Send />
                        </Button>
                      </Tooltip>
                    </Box>
                  </Collapse>
                  <Collapse in={subscribed}>
                    <Typography variant="body2" color="secondary" sx={{ fontStyle: "italic" }}>
                      Thank you for subscribing!
                    </Typography>
                  </Collapse>
                </Box>
              </Box>
            </Slide>
          </Grid>

          {/* Dynamic Links Columns */}
          {footerLinks[role || "noUser"].map((section, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
              <Grow in={true} timeout={(index + 1) * 300}>
                <Box>
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    mb: 2,
                    paddingBottom: 1,
                    borderBottom: `2px solid ${theme.palette.secondary.main}`,
                    width: "fit-content"
                  }}>
                    {React.cloneElement(section.icon, {
                      sx: { 
                        color: theme.palette.secondary.main, 
                        mr: 1,
                        fontSize: 22 
                      },
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
                        >
                          {React.cloneElement(link.icon, { sx: { fontSize: 18 } })}
                          {link.label}
                        </StyledLink>
                      </li>
                    ))}
                  </Box>
                </Box>
              </Grow>
            </Grid>
          ))}

          {/* Contact Column */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Slide direction="up" in={true} timeout={900}>
              <Box>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  mb: 2,
                  paddingBottom: 1,
                  borderBottom: `2px solid ${theme.palette.secondary.main}`,
                  width: "fit-content"
                }}>
                  <ContactSupport sx={{ 
                    color: theme.palette.secondary.main, 
                    mr: 1,
                    fontSize: 22 
                  }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Contact Us
                  </Typography>
                </Box>
                <Box sx={{ "& > *:not(:last-child)": { mb: 2 } }}>
                  <StyledLink href="mailto:ayurcare@example.com" color="inherit" underline="none">
                    <Email sx={{ fontSize: 18 }} />
                    ayurcare@example.com
                  </StyledLink>
                  <StyledLink href="tel:+919876543210" color="inherit" underline="none">
                    <Phone sx={{ fontSize: 18 }} />
                    +91 9876543210
                  </StyledLink>
                  <StyledLink href="#" color="inherit" underline="none">
                    <Place sx={{ fontSize: 18 }} />
                    Mangalore, India
                  </StyledLink>
                </Box>

                {/* Social Media */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Follow Us
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {socialMedia.map((social) => (
                      <Tooltip title={social.name} key={social.name}>
                        <IconButton
                          aria-label={social.name}
                          sx={{
                            background: hoveredIcon === social.name ? social.color : "rgba(255, 255, 255, 0.1)",
                            color: hoveredIcon === social.name ? "#fff" : "inherit",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: social.color,
                              color: "#fff",
                              transform: "translateY(-3px)",
                              boxShadow: `0 5px 15px ${social.color}80`,
                            },
                          }}
                          onMouseEnter={() => setHoveredIcon(social.name)}
                          onMouseLeave={() => setHoveredIcon(null)}
                        >
                          {social.icon}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Slide>
          </Grid>
        </Grid>

        <AnimatedDivider sx={{ my: 6 }} />

        {/* Bottom Footer */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1500}>
              <Typography variant="body2" sx={{ 
                textAlign: { xs: "center", md: "left" },
                opacity: 0.8
              }}>
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
                  flexWrap: "wrap",
                }}
              >
                <Link 
                  component={RouterLink} 
                  to="/privacy" 
                  color="inherit" 
                  underline="hover" 
                  variant="body2"
                  sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
                >
                  Privacy Policy
                </Link>
                <Link 
                  component={RouterLink} 
                  to="/terms" 
                  color="inherit" 
                  underline="hover" 
                  variant="body2"
                  sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
                >
                  Terms of Service
                </Link>
                <Link 
                  component={RouterLink} 
                  to="/cookies" 
                  color="inherit" 
                  underline="hover" 
                  variant="body2"
                  sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
                >
                  Cookie Policy
                </Link>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      {/* Floating back to top button */}
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
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.light} 100%)`,
            color: theme.palette.secondary.contrastText,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: theme.shadows[10],
            zIndex: 1000,
            transition: "all 0.3s",
            opacity: scrollPosition > 300 ? 1 : 0,
            "&:hover": {
              transform: "translateY(-5px) scale(1.1)",
              boxShadow: `0 5px 20px ${theme.palette.secondary.main}80`,
            },
          }}
        >
          <ArrowUpward />
        </Box>
      </Fade>
    </Box>
  );
};

export default PageFooter;
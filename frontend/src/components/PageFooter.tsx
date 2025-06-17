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
  Collapse,
  alpha
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

// Floating animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
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
    "& svg": {
      transform: "rotate(5deg)",
    }
  },
  "& svg": {
    transition: "all 0.3s ease",
  }
}));

const AnimatedDivider = styled(Divider)(({ theme }) => ({
  background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}, transparent)`,
  height: 2,
  opacity: 0.7,
  width: '100%',
  margin: '0 auto',
}));

const PageFooter = () => {
  const auth = useAuth && useAuth();
  const role = auth && auth.role ? auth.role : 'noUser';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [scrollPosition, setScrollPosition] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
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
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.secondary.main, 0.5)}, transparent)`,
        }
      }}
    >
      {/* Decorative elements */}
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.1,
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />
      
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

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Main footer content */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 4,
          mb: 6
        }}>
          {/* Brand and description */}
          <Box sx={{
            flex: { md: 1, lg: 1.5 },
            minWidth: { md: '300px' },
            position: 'relative',
            pr: { md: 4 }
          }}>
            <Slide direction="up" in={true} timeout={500}>
              <Box>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  mb: 3,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '60px',
                    height: '3px',
                    background: theme.palette.secondary.main,
                    borderRadius: '3px'
                  }
                }}>
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
                      fontWeight: 800,
                      color: "inherit",
                      textDecoration: "none",
                      letterSpacing: '1px',
                      "&:hover": { 
                        color: theme.palette.secondary.main,
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    AyurCare
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ 
                  mb: 3, 
                  opacity: 0.9,
                  lineHeight: 1.7,
                  fontSize: '1.05rem'
                }}>
                  Empowering health through traditional wisdom and modern care. Our integrative approach combines ancient Ayurvedic practices with contemporary medical expertise.
                </Typography>
                
                {/* Newsletter Subscription */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" sx={{ 
                    mb: 2, 
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      display: 'inline-block',
                      width: '30px',
                      height: '2px',
                      background: theme.palette.secondary.main,
                      mr: 1.5
                    }
                  }}>
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
                        maxWidth: '400px'
                      }}
                    >
                      <TextField
                        variant="outlined"
                        placeholder="Your email address"
                        size="small"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: theme.palette.primary.contrastText,
                            "& fieldset": {
                              borderColor: "rgba(255, 255, 255, 0.3)",
                              borderRadius: '50px'
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
                      <Tooltip title="Subscribe" arrow>
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                          sx={{
                            minWidth: 0,
                            height: 40,
                            width: 40,
                            borderRadius: "50%",
                            boxShadow: `0 4px 10px ${alpha(theme.palette.secondary.main, 0.3)}`,
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 6px 15px ${alpha(theme.palette.secondary.main, 0.4)}`
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Send />
                        </Button>
                      </Tooltip>
                    </Box>
                  </Collapse>
                  <Collapse in={subscribed}>
                    <Typography variant="body2" color="secondary" sx={{ 
                      fontStyle: "italic",
                      mt: 1,
                      display: 'flex',
                      alignItems: 'center',
                      '&::before': {
                        content: '"✓"',
                        display: 'inline-block',
                        mr: 1
                      }
                    }}>
                      Thank you for subscribing to our newsletter!
                    </Typography>
                  </Collapse>
                </Box>
              </Box>
            </Slide>
          </Box>

          {/* Links sections */}
          <Box sx={{
            flex: 2,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: { xs: 4, md: 2 },
            ml: { md: 2 }
          }}>
            {(footerLinks[role || "noUser"] || []).map((section, index) => (
              <Box key={index} sx={{
                minWidth: { xs: '140px', sm: '160px' },
                flex: 1
              }}>
                <Grow in={true} timeout={(index + 1) * 300}>
                  <Box>
                    <Box sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2.5,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -5,
                        left: 0,
                        width: '30px',
                        height: '2px',
                        background: theme.palette.secondary.main,
                        borderRadius: '2px'
                      }
                    }}>
                      {React.cloneElement(section.icon, {
                        sx: {
                          color: theme.palette.secondary.main,
                          mr: 1.5,
                          fontSize: 22
                        },
                      })}
                      <Typography variant="h6" sx={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        letterSpacing: '0.5px'
                      }}>
                        {section.title}
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{
                      listStyle: "none",
                      p: 0,
                      m: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5
                    }}>
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <StyledLink
                            component={RouterLink}
                            to={link.href}
                            color="inherit"
                            underline="none"
                            sx={{ fontSize: '0.95rem' }}
                          >
                            {React.cloneElement(link.icon, {
                              sx: {
                                fontSize: 18,
                                color: alpha(theme.palette.secondary.main, 0.8)
                              }
                            })}
                            {link.label}
                          </StyledLink>
                        </li>
                      ))}
                    </Box>
                  </Box>
                </Grow>
              </Box>
            ))}

            {/* Contact section */}
            <Box sx={{
              minWidth: { xs: '140px', sm: '180px' },
              flex: 1
            }}>
              <Slide direction="up" in={true} timeout={900}>
                <Box>
                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2.5,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -5,
                      left: 0,
                      width: '30px',
                      height: '2px',
                      background: theme.palette.secondary.main,
                      borderRadius: '2px'
                    }
                  }}>
                    <ContactSupport sx={{
                      color: theme.palette.secondary.main,
                      mr: 1.5,
                      fontSize: 22
                    }} />
                    <Typography variant="h6" sx={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      letterSpacing: '0.5px'
                    }}>
                      Contact
                    </Typography>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    <StyledLink href="mailto:ayurcare@example.com" color="inherit" underline="none">
                      <Email sx={{
                        fontSize: 18,
                        color: alpha(theme.palette.secondary.main, 0.8)
                      }} />
                      ayurcare@example.com
                    </StyledLink>
                    <StyledLink href="tel:+919876543210" color="inherit" underline="none">
                      <Phone sx={{
                        fontSize: 18,
                        color: alpha(theme.palette.secondary.main, 0.8)
                      }} />
                      +91 9876543210
                    </StyledLink>
                    <StyledLink href="#" color="inherit" underline="none">
                      <Place sx={{
                        fontSize: 18,
                        color: alpha(theme.palette.secondary.main, 0.8)
                      }} />
                      Mangalore, India
                    </StyledLink>
                  </Box>

                  {/* Social Media */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" sx={{
                      mb: 2,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      '&::before': {
                        content: '""',
                        display: 'inline-block',
                        width: '30px',
                        height: '2px',
                        background: theme.palette.secondary.main,
                        mr: 1.5
                      }
                    }}>
                      Follow Us
                    </Typography>
                    <Box sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: 'wrap'
                    }}>
                      {socialMedia.map((social) => (
                        <Tooltip title={social.name} key={social.name} arrow>
                          <IconButton
                            aria-label={social.name}
                            sx={{
                              background: hoveredIcon === social.name ? social.color : alpha(theme.palette.background.paper, 0.1),
                              color: hoveredIcon === social.name ? "#fff" : theme.palette.primary.contrastText,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: social.color,
                                color: "#fff",
                                transform: "translateY(-3px)",
                                boxShadow: `0 5px 15px ${alpha(social.color, 0.4)}`,
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
            </Box>
          </Box>
        </Box>

        <AnimatedDivider sx={{ 
          my: 6,
          maxWidth: '1200px'
        }} />

        {/* Bottom footer */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          pt: 2
        }}>
          <Fade in={true} timeout={1500}>
            <Typography variant="body2" sx={{ 
              opacity: 0.8,
              fontSize: '0.85rem'
            }}>
              © {new Date().getFullYear()} AyurCare. All rights reserved.
            </Typography>
          </Fade>
          
          <Fade in={true} timeout={1500}>
            <Box sx={{
              display: 'flex',
              gap: { xs: 1.5, sm: 3 },
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-end' }
            }}>
              <Link 
                component={RouterLink} 
                to="/privacy" 
                color="inherit" 
                underline="hover" 
                variant="body2"
                sx={{ 
                  opacity: 0.8, 
                  "&:hover": { 
                    opacity: 1,
                    color: theme.palette.secondary.main
                  },
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
              >
                Privacy Policy
              </Link>
              <Link 
                component={RouterLink} 
                to="/terms" 
                color="inherit" 
                underline="hover" 
                variant="body2"
                sx={{ 
                  opacity: 0.8, 
                  "&:hover": { 
                    opacity: 1,
                    color: theme.palette.secondary.main
                  },
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
              >
                Terms of Service
              </Link>
              <Link 
                component={RouterLink} 
                to="/cookies" 
                color="inherit" 
                underline="hover" 
                variant="body2"
                sx={{ 
                  opacity: 0.8, 
                  "&:hover": { 
                    opacity: 1,
                    color: theme.palette.secondary.main
                  },
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
              >
                Cookie Policy
              </Link>
            </Box>
          </Fade>
        </Box>
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
            boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.3)}`,
            zIndex: 1000,
            transition: "all 0.3s",
            opacity: scrollPosition > 300 ? 1 : 0,
            "&:hover": {
              transform: "translateY(-5px) scale(1.1)",
              boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.4)}`,
              animation: `${pulse} 1.5s infinite`
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
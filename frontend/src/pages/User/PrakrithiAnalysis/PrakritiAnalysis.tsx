import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  LinearProgress,
  CircularProgress,
  Box,
  Container,
  Divider,
  Paper,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DescriptionIcon from "@mui/icons-material/Description";
import HealingIcon from "@mui/icons-material/Healing";
import SpaIcon from "@mui/icons-material/Spa";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import FORM_FIELDS from "@/constants/prakrithiFormFields";
import PrakrithiForm from "@/components/Forms/User/PrakrithiForm/PrakrithiForm";
import { ApiResponse } from "./PrakrithiAnalysis.types";

// Calculate total sections from form fields
const TOTAL_SECTIONS = Math.max(...FORM_FIELDS.map((field) => field.section));

const sectionVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    x: 50,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#81c784',
      dark: '#4caf50',
      light: '#a5d6a7'
    },
    secondary: {
      main: '#ffb74d'
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0b0b0'
    }
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: '#2d2d2d',
          color: '#e0e0e0',
          '&:focus': {
            backgroundColor: '#2d2d2d'
          }
        },
        icon: {
          color: '#b0b0b0'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#b0b0b0',
          '&.Mui-focused': {
            color: '#81c784'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: '#e0e0e0',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#424242'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#81c784'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#81c784'
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#2d2d2d',
          color: '#e0e0e0',
          '&:hover': {
            backgroundColor: '#424242'
          },
          '&.Mui-selected': {
            backgroundColor: '#4caf50'
          }
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#b0b0b0',
          '&.Mui-checked': {
            color: '#81c784'
          }
        }
      }
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#b0b0b0',
          '&.Mui-checked': {
            color: '#81c784'
          }
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#b0b0b0',
          '&.Mui-checked': {
            color: '#81c784'
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#81c784'
          }
        },
        track: {
          backgroundColor: '#424242'
        }
      }
    }
  }
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20'
    },
    secondary: {
      main: '#ff9800'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  }
});

export default function PrakritiForm() {
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();

  // Detect system dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const generatePDF = async (responseData: ApiResponse) => {
    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      let y = height - 50;

      const drawText = (text: string) => {
        page.drawText(text, {
          x: 50,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= 20;
      };

      // Header
      page.drawText("Health Report", {
        x: width / 2 - 50,
        y: height - 30,
        size: 16,
        font,
        color: rgb(0, 0, 1),
      });

      y -= 40;

      // Basic Info
      drawText(`Name: ${responseData.Name}`);
      drawText(`Age: ${responseData.Age}`);
      drawText(`Gender: ${responseData.Gender}`);
      drawText(`Dominant Prakrithi: ${responseData.Dominant_Prakrithi}`);

      y -= 10;

      // Body Constituents
      drawText("Body Constituents:");
      Object.entries(responseData.Body_Constituents).forEach(([key, value]) => {
        drawText(`  - ${key.replace(/_/g, " ")}: ${value}`);
      });

      y -= 10;

      // Potential Health Concerns
      drawText("Potential Health Concerns:");
      responseData.Potential_Health_Concerns.forEach((concern: string) => {
        drawText(`  - ${concern}`);
      });

      y -= 10;

      // Recommendations
      drawText("Recommendations:");

      // Dietary Guidelines
      drawText("  - Dietary Guidelines:");
      responseData.Recommendations.Dietary_Guidelines.forEach(
        (item: string) => {
          drawText(`    • ${item}`);
        }
      );

      // Lifestyle Suggestions
      drawText("  - Lifestyle Suggestions:");
      responseData.Recommendations.Lifestyle_Suggestions.forEach(
        (item: string) => {
          drawText(`    • ${item}`);
        }
      );

      // Ayurvedic Herbs & Remedies
      drawText("  - Ayurvedic Herbs & Remedies:");
      if (
        Array.isArray(responseData.Recommendations.Ayurvedic_Herbs_Remedies)
      ) {
        responseData.Recommendations.Ayurvedic_Herbs_Remedies.forEach(
          (item: string) => {
            drawText(`    • ${item}`);
          }
        );
      } else {
        Object.entries(
          responseData.Recommendations.Ayurvedic_Herbs_Remedies
        ).forEach(([key, values]) => {
          drawText(
            `    • ${key.replace(/_/g, " ")}: ${(values as string[]).join(
              ", "
            )}`
          );
        });
      }

      // Save and trigger download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${responseData.Name}_Prakriti_Analysis.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
      setCurrentSection(1);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            width: "100vw",
            background: darkMode
              ? "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)"
              : "linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%)",
            color: theme.palette.primary.main
          }}
        >
          <motion.div
            animate={pulseAnimation}
            style={{ textAlign: "center" }}
          >
            <SpaIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Analyzing Your Prakriti
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We're carefully analyzing your responses to provide personalized Ayurvedic insights
            </Typography>
            <CircularProgress size={60} thickness={4} sx={{ mt: 4 }} />
          </motion.div>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: darkMode 
            ? "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)"
            : "linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%)",
          padding: theme.spacing(4),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: 'relative'
        }}
      >
        <IconButton 
          onClick={() => setDarkMode(!darkMode)} 
          color="inherit"
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16,
            zIndex: 1000
          }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <Container maxWidth="lg">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.dark,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2
                  }}
                >
                  <HealingIcon fontSize="large" />
                  Discover Your Ayurvedic Constitution
                </Typography>
              </motion.div>
              <Typography
                variant="h6"
                component="p"
                color="text.secondary"
                sx={{ maxWidth: 800, mx: "auto" }}
              >
                Complete this assessment to understand your unique Prakriti and
                receive personalized health recommendations based on 5,000 years of
                Ayurvedic wisdom.
              </Typography>
            </Box>

            <Card
              sx={{
                width: "100%",
                boxShadow: 6,
                border: "none",
                background: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                borderRadius: 3,
                overflow: "hidden",
                backdropFilter: "blur(10px)"
              }}
            >
              <CardHeader
                sx={{
                  textAlign: "center",
                  p: 4,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  background: darkMode
                    ? "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)"
                    : "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
                }}
                title={
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.dark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2
                    }}
                  >
                    <SelfImprovementIcon fontSize="large" />
                    Prakriti Analysis
                  </Typography>
                }
              />

              <Box sx={{ px: 4, pt: 3, pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    Section {currentSection} of {TOTAL_SECTIONS}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {Math.round((currentSection / TOTAL_SECTIONS) * 100)}% Complete
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(currentSection / TOTAL_SECTIONS) * 100}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: theme.palette.grey[200],
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5,
                      background: darkMode
                        ? "linear-gradient(90deg, #81c784 0%, #4caf50 100%)"
                        : "linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)"
                    }
                  }}
                />
              </Box>

              <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSection}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <PrakrithiForm
                      generatePDF={generatePDF}
                      currentSection={currentSection}
                      setCurrentSection={setCurrentSection}
                      TOTAL_SECTIONS={TOTAL_SECTIONS}
                      setLoading={setLoading}
                    />
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>

            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: 3,
                textAlign: "center",
                backgroundColor: "transparent",
                backgroundImage: "none"
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
              >
                <DescriptionIcon fontSize="small" />
                Your responses will help us provide accurate Ayurvedic insights.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                All information is kept confidential and secure.
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </motion.div>
    </ThemeProvider>
  );
}
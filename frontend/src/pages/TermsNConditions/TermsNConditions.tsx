import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  IconButton, 
  useTheme, 
  useMediaQuery,
  styled,
  Button
} from '@mui/material';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { KeyboardArrowUp } from '@mui/icons-material';

// Styled Components
const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const TocItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(4px)',
  },
  '&.active': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const TermsNConditions: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.98]);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Check scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for TOC highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: '-100px 0px -50% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  const sections = [
    { id: 'eligibility', title: 'Eligibility' },
    { id: 'services', title: 'Our Services' },
    { id: 'user-data', title: 'User Data and Privacy' },
    { id: 'responsibilities', title: 'User Responsibilities' },
    { id: 'community', title: 'Community Guidelines' },
    { id: 'disclaimer', title: 'Medical Disclaimer' },
    { id: 'third-party', title: 'Third-Party Links' },
    { id: 'ip', title: 'Intellectual Property' },
    { id: 'termination', title: 'Account Termination' },
    { id: 'modifications', title: 'Modifications' },
    { id: 'governing-law', title: 'Governing Law' },
    { id: 'contact', title: 'Contact Us' },
  ];

  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      bgcolor: 'background.default',
    }}>
      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}
          >
            <IconButton
              onClick={scrollToTop}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                boxShadow: theme.shadows[6],
              }}
              size="large"
            >
              <KeyboardArrowUp />
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar TOC (Desktop only) */}
      {!isMobile && (
        <Box sx={{
          position: 'fixed',
          top: '50%',
          left: 24,
          transform: 'translateY(-50%)',
          zIndex: 100,
          display: { xs: 'none', md: 'block' },
        }}>
          <Paper elevation={4} sx={{ 
            borderRadius: '12px',
            p: 2,
            bgcolor: 'background.paper',
          }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Table of Contents
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {sections.map((section) => (
              <TocItem
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={activeSection === section.id ? 'active' : ''}
              >
                <Typography variant="body2">
                  {section.title}
                </Typography>
              </TocItem>
            ))}
          </Paper>
        </Box>
      )}

      {/* Main Content */}
      <Box sx={{
        width: { xs: '100vw', md: 'calc(100vw - 260px)' }, // Responsive width
        maxWidth: { xs: '100vw', md: 'calc(100vw - 260px)' },
        mx: 0,
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 4, md: 6 },
        ml: { xs: 0, md: '260px' }, // Only apply left margin on desktop
        boxSizing: 'border-box',
        overflowX: 'auto',
      }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <GradientText variant="h3" fontWeight="bold" gutterBottom>
              Terms and Conditions
            </GradientText>
            <Typography variant="subtitle1" color="text.secondary" mb={2}>
              Please read these terms carefully before using ArogyaPath.
            </Typography>
            <Divider sx={{ my: 3, mx: 'auto', maxWidth: 600 }} />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 4,
              mb: 3,
              flexWrap: 'wrap',
            }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Last Updated:</strong> [Insert Date]
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Effective Date:</strong> [Insert Date]
              </Typography>
            </Box>
            <Typography variant="body1" paragraph sx={{ maxWidth: 800, mx: 'auto' }}>
              Welcome to <strong>ArogyaPath</strong> ("we", "us", or "our"). These Terms and Conditions ("Terms") govern your
              use of our website, mobile application, and any related services (collectively, the "Platform").
              By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree, please do
              not use our services.
            </Typography>
          </Box>
        </motion.div>

        {/* Terms Sections */}
        <motion.div style={{ opacity, scale }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {/* 1. Eligibility */}
            <SectionPaper elevation={3} id="eligibility">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  1. Eligibility
                </Typography>
                <Typography variant="body1" paragraph>
                  You must be at least 18 years old or have legal parental or guardian consent to use this Platform. By using
                  the Platform, you confirm that you meet these requirements.
                </Typography>
              </Box>
            </SectionPaper>

            {/* 2. Our Services */}
            <SectionPaper elevation={3} id="services">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  2. Our Services
                </Typography>
                <Typography variant="body1" paragraph>
                  We provide Ayurvedic wellness services, including:
                </Typography>
                <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                  <li><Typography variant="body1">AI-based Prakriti analysis</Typography></li>
                  <li><Typography variant="body1">Personalized wellness recommendations</Typography></li>
                  <li><Typography variant="body1">Access to verified Ayurvedic experts</Typography></li>
                  <li><Typography variant="body1">A community for sharing experiences and success stories</Typography></li>
                </Box>
                <Typography variant="body1" paragraph>
                  These services are provided for informational and educational purposes only and are not a substitute for
                  professional medical advice or treatment.
                </Typography>
              </Box>
            </SectionPaper>

            {/* 3. User Data and Privacy */}
            <SectionPaper elevation={3} id="user-data">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  3. User Data and Privacy
                </Typography>
                
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Personal Info Collected
                </Typography>
                <Typography variant="body1" paragraph>
                  We collect personal information such as:
                </Typography>
                <Box component="ul" sx={{ pl: 4, mb: 3 }}>
                  <li><Typography variant="body1">Name, age, gender</Typography></li>
                  <li><Typography variant="body1">Health-related information (used for Prakriti analysis)</Typography></li>
                  <li><Typography variant="body1">Contact information (for account and consultation purposes)</Typography></li>
                </Box>
                <Typography variant="body1" paragraph>
                  By using our services, you agree to our collection, storage, and use of your data as described in our Privacy Policy.
                </Typography>
                
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Your Consent:
                </Typography>
                <Typography variant="body1" paragraph>
                  You explicitly consent to the collection and processing of your personal and health data when you register
                  and interact with our platform. We will never sell or misuse your data.
                </Typography>
                
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Data Security:
                </Typography>
                <Typography variant="body1" paragraph>
                  We use industry-standard measures to protect your information. However, no system is 100% secure. By
                  using our Platform, you acknowledge this risk.
                </Typography>
              </Box>
            </SectionPaper>

            {/* 4. User Responsibilities */}
            <SectionPaper elevation={3} id="responsibilities">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  4. User Responsibilities
                </Typography>
                <Typography variant="body1" paragraph>
                  You agree:
                </Typography>
                <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                  <li><Typography variant="body1">To provide accurate, current, and complete information</Typography></li>
                  <li><Typography variant="body1">To not misuse the Platform for illegal or harmful purposes</Typography></li>
                  <li><Typography variant="body1">To respect the rights and privacy of other users and experts</Typography></li>
                </Box>
                <Typography variant="body1" paragraph>
                  You are solely responsible for any content you submit, including stories, posts, and health information.
                </Typography>
              </Box>
            </SectionPaper>

            {/* 5. Community Guidelines */}
            <SectionPaper elevation={3} id="community">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  5. Community Guidelines
                </Typography>
                <Typography variant="body1" paragraph>
                  You must not post:
                </Typography>
                <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                  <li><Typography variant="body1">False or misleading health claims</Typography></li>
                  <li><Typography variant="body1">Offensive, abusive, or unlawful content</Typography></li>
                  <li><Typography variant="body1">Content that impersonates others or violates copyrights</Typography></li>
                </Box>
                <Typography variant="body1" paragraph>
                  Expert reviews and verifications are done in good faith but do not constitute medical approval or certification.
                </Typography>
              </Box>
            </SectionPaper>

            {/* 6. Medical Disclaimer */}
            <SectionPaper elevation={3} id="disclaimer">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  6. Medical Disclaimer
                </Typography>
                <Typography variant="body1" paragraph>
                  We are not a healthcare provider. Any content, recommendation, or interaction on the Platform should not be
                  considered medical advice. Always consult a licensed healthcare professional before making any
                  health-related decisions.
                </Typography>
              </Box>
            </SectionPaper>

            {/* 7. Third-Party Links */}
            <SectionPaper elevation={3} id="third-party">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  7. Third-Party Links
                </Typography>
                <Typography variant="body1" paragraph>
                  Our Platform may contain links to third-party sites or services. We are not responsible for their content,
                  privacy practices, or accuracy.
                </Typography>
              </Box>
            </SectionPaper>

            {/* 8. Intellectual Property */}
            <SectionPaper elevation={3} id="ip">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  8. Intellectual Property
                </Typography>
                <Typography variant="body1" paragraph>
                  All content on the Platform, including logos, designs, AI tools, and wellness plans, are our property or that of
                  our partners. You may not use them without our written permission.
                </Typography>
              </Box>
            </SectionPaper>

            {/* 9. Account Termination */}
            <SectionPaper elevation={3} id="termination">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  9. Account Termination
                </Typography>
                <Typography variant="body1" paragraph>
                  We reserve the right to suspend or delete any user account found in violation of these Terms or engaged in
                  suspicious or abusive behavior.
                </Typography>
              </Box>
            </SectionPaper>

            {/* 10. Modifications */}
            <SectionPaper elevation={3} id="modifications">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  10. Modifications
                </Typography>
                <Typography variant="body1" paragraph>
                  We may revise these Terms at any time. Continued use of the Platform after such changes constitutes your
                  acceptance of the updated Terms.
                </Typography>
              </Box>
            </SectionPaper>

            {/* 11. Governing Law */}
            <SectionPaper elevation={3} id="governing-law">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  11. Governing Law
                </Typography>
                <Typography variant="body1" paragraph>
                  These Terms are governed by the laws of India. Any disputes will be resolved in the
                  jurisdiction of Mangalore, Karnataka.
                </Typography>
              </Box>
            </SectionPaper>

            {/* 12. Contact Us */}
            <SectionPaper elevation={3} id="contact">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  12. Contact Us
                </Typography>
                <Typography variant="body1" paragraph>
                  If you have any questions about these Terms, your data, or our services, please contact us at:
                </Typography>
                <Box sx={{ 
                  bgcolor: 'background.paper',
                  p: 3,
                  borderRadius: 2,
                  mt: 2,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                }}>
                  <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                    <strong>Email:</strong> support@arogyapath.in
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                    <strong>Address:</strong> Sahyadri College of Engineering & Management, Mangalore, India
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Phone:</strong> +91-9876543210
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph sx={{ mt: 3 }}>
                  By using this Platform, you agree to these Terms and Conditions and our Privacy Policy.
                </Typography>
              </Box>
            </SectionPaper>
            {/* Confirmation Section */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
              <Paper elevation={6} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, maxWidth: 420, width: '100%', textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Do you accept these Terms and Conditions?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  You must accept to continue using the website.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: 120, fontWeight: 600 }}
                    onClick={() => alert('Accepted!')}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ minWidth: 120, fontWeight: 600 }}
                    onClick={() => alert('Rejected!')}
                  >
                    Reject
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default TermsNConditions;
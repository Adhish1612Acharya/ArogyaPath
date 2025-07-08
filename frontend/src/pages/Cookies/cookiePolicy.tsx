import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Button,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';


const CookiePolicy: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.secondary.light}20 100%)`,
      }}
    >
      {/* Navbar */}
      {/* <PageNavBar /> */}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: { xs: 4, sm: 8 },
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: isMobile ? 20 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          sx={{
            maxWidth: 900,
            width: '100%',
            bgcolor: 'background.paper',
            px: { xs: 4, sm: 8 },
            py: { xs: 6, sm: 10 },
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            position: 'relative',
          }}
        >
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            variant="contained"
            color="primary"
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 3,
              px: 3,
              py: 1,
              fontSize: isMobile ? '0.85rem' : '1rem',
              boxShadow: '0 6px 18px rgba(25, 118, 210, 0.5)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.05)',
              },
            }}
          >
            Back
          </Button>

          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{ color: 'primary.dark', mb: 2 }}
          >
            Cookie Policy
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            fontStyle="italic"
            textAlign="center"
            mb={8}
          >
            Last updated: June 2025
          </Typography>

          <Box sx={{ maxWidth: 720, mx: 'auto', textAlign: 'left' }}>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.15rem', lineHeight: 1.85 }}>
              Cookies are small text files stored on your device by websites you visit. They help the website remember your preferences, login status, and improve your experience.
            </Typography>

            <Section
              title="How We Use Cookies"
              content={
                <>
                  <Typography paragraph>Our website uses cookies to:</Typography>
                  <ListWithIcons
                    items={[
                      'Enable core functionality, like session management.',
                      'Analyze site usage and performance anonymously.',
                      'Personalize content and advertisements.',
                    ]}
                  />
                </>
              }
            />

            <Section
              title="Types of Cookies We Use"
              content={
                <ListWithIcons
                  items={[
                    'Essential Cookies: Necessary for basic operations of the site.',
                    'Performance Cookies: Help us understand how visitors use the site.',
                    'Functional Cookies: Remember your preferences and choices.',
                    'Advertising Cookies: Track your activity to provide personalized ads.',
                  ]}
                />
              }
            />

            <Section
              title="Third-Party Cookies"
              content={
                <Typography paragraph>
                  We may use third-party services such as Google Analytics or Facebook Pixel which may place cookies on your device. These cookies are governed by their own privacy policies.
                </Typography>
              }
            />

            <Section
              title="Your Cookie Choices"
              content={
                <>
                  <Typography paragraph>
                    You can control or delete cookies using your browser settings. However, some cookies are necessary for the website to function properly and disabling them may affect your experience.
                  </Typography>
                  <Typography paragraph>
                    For more information on managing cookies, visit{' '}
                    <Link
                      href="https://www.aboutcookies.org/how-to-control-cookies/"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="secondary"
                      underline="hover"
                    >
                      AboutCookies.org
                    </Link>.
                  </Typography>
                </>
              }
            />

            <Divider sx={{ my: 6 }} />

            <Section
              title="Changes to This Cookie Policy"
              content={
                <Typography paragraph>
                  We may update this policy from time to time. Please review it periodically to stay informed about how we use cookies.
                </Typography>
              }
            />

            <Section
              title="Contact Us"
              content={
                <Typography paragraph>
                  If you have any questions about this Cookie Policy, please contact us at{' '}
                  <Link href="mailto:teamparakram16@gmail.com" color="secondary" underline="hover">
                    teamparakram16@gmail.com
                  </Link>.
                </Typography>
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface SectionProps {
  title: string;
  content: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, content }) => (
  <Box sx={{ mb: 5 }}>
    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.dark">
      {title}
    </Typography>
    {content}
  </Box>
);

interface ListWithIconsProps {
  items: string[];
}

const ListWithIcons: React.FC<ListWithIconsProps> = ({ items }) => (
  <Box component="ul" sx={{ pl: 3, mb: 0 }}>
    {items.map((item, i) => (
      <Box
        component="li"
        key={i}
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'text.primary',
          mb: 1.5,
          fontSize: '1rem',
          lineHeight: 1.5,
          '& svg': { mr: 1.5, color: 'primary.main' },
        }}
      >
        <CheckCircleOutlineIcon fontSize="small" />
        {item}
      </Box>
    ))}
  </Box>
);

export default CookiePolicy;

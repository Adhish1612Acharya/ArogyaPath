import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import GradientText from './GradientText.tsx';

const TermsHeader: React.FC = () => {
  return (
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
  );
};

export default TermsHeader;
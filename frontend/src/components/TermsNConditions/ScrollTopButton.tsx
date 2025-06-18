// src/components/TermsNConditions/ScrollTopButton.tsx
import React from 'react';
import { IconButton } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ScrollTopButtonProps {
  onClick: () => void;
}

const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({ onClick }) => {
  return (
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
        onClick={onClick}
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
          boxShadow: (theme) => theme.shadows[6],
        }}
        size="large"
      >
        <KeyboardArrowUp />
      </IconButton>
    </motion.div>
  );
};

export default ScrollTopButton;
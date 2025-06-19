import React from 'react';
import { Paper, Typography, Divider, Box } from '@mui/material';
import TocItem from './TocItem.tsx';

interface TableOfContentsProps {
  sections: Array<{ id: string; title: string }>;
  activeSection: string | null;
  scrollToSection: (id: string) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  sections, 
  activeSection, 
  scrollToSection 
}) => {
  return (
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
            active={activeSection === section.id}
            onClick={() => scrollToSection(section.id)}
            title={section.title}
          />
        ))}
      </Paper>
    </Box>
  );
};

export default TableOfContents;
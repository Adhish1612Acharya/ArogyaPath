import React from 'react';
import { Box, Typography } from '@mui/material';

interface TocItemProps {
  active: boolean;
  onClick: () => void;
  title: string;
}

const TocItem: React.FC<TocItemProps> = ({ active, onClick, title }) => {
  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        padding: theme.spacing(1, 2),
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          transform: 'translateX(4px)',
        },
        ...(active && {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.contrastText,
        }),
      })}
    >
      <Typography variant="body2">
        {title}
      </Typography>
    </Box>
  );
};

export default TocItem;
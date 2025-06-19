import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';

const AcceptanceSection: React.FC = () => {
  return (
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
  );
};

export default AcceptanceSection;
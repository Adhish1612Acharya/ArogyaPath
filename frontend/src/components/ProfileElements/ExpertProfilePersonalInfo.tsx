import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  Stack,
  useTheme
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DateRangeIcon from '@mui/icons-material/DateRange';

interface ExpertProfilePersonalInfoProps {
  isEditing: boolean;
}

export const ExpertProfilePersonalInfo = ({
  isEditing
}: ExpertProfilePersonalInfoProps) => {
  const theme = useTheme();

  // Mock data for demonstration
  const mockData = {
    name: "Dr. John Doe",
    phone: "9876543210",
    address: "123 Main St, City",
    dob: "1990-01-01"
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{
        mb: 4,
        fontWeight: 600,
        color: theme.palette.text.primary
      }}>
        Personal Information
      </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3
      }}>
        <Card variant="outlined" sx={{
          flex: 1,
          borderRadius: 2,
          borderColor: theme.palette.divider
        }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{
              mb: 3,
              fontWeight: 600,
              color: theme.palette.text.primary
            }}>
              Basic Details
            </Typography>

            <Stack spacing={3}>
              <TextField
                label="Name"
                value={mockData.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                  readOnly: !isEditing
                }}
                fullWidth
              />
              <TextField
                label="Phone"
                value={mockData.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                  readOnly: !isEditing
                }}
                fullWidth
              />
              <TextField
                label="Address"
                value={mockData.address}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon />
                    </InputAdornment>
                  ),
                  readOnly: !isEditing
                }}
                fullWidth
              />
              <TextField
                label="Date of Birth"
                value={mockData.dob}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRangeIcon />
                    </InputAdornment>
                  ),
                  readOnly: !isEditing
                }}
                fullWidth
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
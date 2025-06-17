import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  Stack,
  useTheme
} from "@mui/material";
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface UserProfileWellnessInfoProps {
  isEditing: boolean;
}

export const UserProfileWellnessInfo = ({
  isEditing
}: UserProfileWellnessInfoProps) => {
  const theme = useTheme();

  // Mock data for demonstration
  const mockData = {
    currentCity: "Bangalore",
    wellnessGoals: "Lose weight, Improve sleep",
    isSmoker: false,
    isAlcoholic: false
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{
        mb: 4,
        fontWeight: 600,
        color: theme.palette.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <HealthAndSafetyIcon fontSize="medium" /> Wellness Information
      </Typography>

      <Card variant="outlined" sx={{
        mb: 3,
        borderRadius: 2,
        borderColor: theme.palette.divider
      }}>
        <CardContent>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <TextField
                label="Current City"
                value={mockData.currentCity}
                InputProps={{
                  startAdornment: (
                    <LocationOnIcon />
                  ),
                  readOnly: !isEditing
                }}
                fullWidth
              />
            </Box>
            <TextField
              label="Wellness Goals"
              value={mockData.wellnessGoals}
              InputProps={{ readOnly: !isEditing }}
              fullWidth
            />
            <FormControlLabel
              control={<Checkbox checked={mockData.isSmoker} disabled />}
              label="Smoker"
            />
            <FormControlLabel
              control={<Checkbox checked={mockData.isAlcoholic} disabled />}
              label="Alcoholic"
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
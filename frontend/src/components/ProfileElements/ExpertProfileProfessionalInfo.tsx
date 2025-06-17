import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  FormHelperText,
  useTheme
} from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';

interface ExpertProfileProfessionalInfoProps {
  isEditing: boolean;
}

export const ExpertProfileProfessionalInfo = ({
  isEditing
}: ExpertProfileProfessionalInfoProps) => {
  const theme = useTheme();

  // Mock data for demonstration
  const mockData = {
    council: "Central Council",
    specializations: ["Ayurveda", "Panchakarma"],
    languages: ["English", "Hindi"],
    experience: "10 years"
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
        <WorkIcon fontSize="medium" /> Professional Details
      </Typography>

      <Card variant="outlined" sx={{
        mb: 3,
        borderRadius: 2,
        borderColor: theme.palette.divider
      }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{
            mb: 3,
            fontWeight: 600,
            color: theme.palette.text.primary
          }}>
            Professional Info
          </Typography>
          <TextField
            label="Council"
            value={mockData.council}
            InputProps={{ readOnly: !isEditing }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Specializations"
            value={mockData.specializations.join(", ")}
            InputProps={{ readOnly: !isEditing }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Languages"
            value={mockData.languages.join(", ")}
            InputProps={{ readOnly: !isEditing }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Experience"
            value={mockData.experience}
            InputProps={{ readOnly: !isEditing }}
            fullWidth
          />
        </CardContent>
      </Card>
    </Box>
  );
};
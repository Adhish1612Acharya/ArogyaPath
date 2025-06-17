import React from "react";
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Divider,
  IconButton,
  Button,
  useTheme
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SchoolIcon from '@mui/icons-material/School';

interface ExpertProfileQualificationsProps {
  isEditing: boolean;
}

export const ExpertProfileQualifications = ({
  isEditing
}: ExpertProfileQualificationsProps) => {
  const theme = useTheme();
  // Mock qualifications data
  const [qualifications, setQualifications] = React.useState([
    { degree: "BAMS", college: "Ayurveda College", year: "2012" }
  ]);

  const handleAddQualification = () => {
    setQualifications([...qualifications, { degree: "", college: "", year: "" }]);
  };

  const handleRemoveQualification = (index: number) => {
    if (qualifications.length > 1) {
      setQualifications(qualifications.filter((_, i) => i !== index));
    }
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
        <SchoolIcon fontSize="medium" /> Qualifications
      </Typography>
      <Card variant="outlined" sx={{ borderRadius: 2, borderColor: theme.palette.divider }}>
        <CardContent>
          {qualifications.map((q, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Qualification {idx + 1}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Degree"
                  value={q.degree}
                  InputProps={{ readOnly: !isEditing }}
                  fullWidth
                />
                <TextField
                  label="College"
                  value={q.college}
                  InputProps={{ readOnly: !isEditing }}
                  fullWidth
                />
                <TextField
                  label="Year"
                  value={q.year}
                  InputProps={{ readOnly: !isEditing }}
                  fullWidth
                />
                {isEditing && (
                  <IconButton onClick={() => handleRemoveQualification(idx)} color="error">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}
          {isEditing && (
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddQualification}
              sx={{ mt: 2 }}
            >
              Add Qualification
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
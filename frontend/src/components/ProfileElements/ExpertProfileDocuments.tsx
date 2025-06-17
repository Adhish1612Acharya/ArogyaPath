import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormHelperText,
  Stack,
  useTheme
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Mock type for demonstration
interface ExpertProfileDocumentsProps {
  isEditing: boolean;
}

export const ExpertProfileDocuments = ({
  isEditing
}: ExpertProfileDocumentsProps) => {
  const theme = useTheme();

  // Mock document data
  const documentCards = [
    {
      name: "identityProof",
      title: "Identity Proof",
      description: "(Aadhaar/Passport/Driving License/PAN)",
      error: false
    },
    {
      name: "degreeCertificate",
      title: "Degree Certificate",
      description: "(BAMS/MD)",
      error: false
    },
    {
      name: "registrationCertificate",
      title: "AYUSH Registration Certificate",
      description: "",
      error: false
    },
    {
      name: "practiceProof",
      title: "Practice Proof (Optional)",
      description: "",
      error: false
    }
  ];

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{
        mb: 4,
        fontWeight: 600,
        color: theme.palette.text.primary
      }}>
        <BadgeIcon sx={{ mr: 1 }} /> Documents
      </Typography>
      <Stack spacing={3}>
        {documentCards.map((doc) => (
          <Card key={doc.name} variant="outlined" sx={{ borderRadius: 2, borderColor: theme.palette.divider }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                {doc.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {doc.description}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={!isEditing}
                >
                  Upload
                  <input type="file" hidden />
                </Button>
                <CheckCircleIcon color="success" />
              </Stack>
              {doc.error && (
                <FormHelperText error>Document required</FormHelperText>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
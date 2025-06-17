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
import { Controller, Control, FieldErrors } from "react-hook-form";

interface ExpertProfileDocumentsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  isEditing: boolean;
}

export const ExpertProfileDocuments = ({
  control,
  errors,
  isEditing
}: ExpertProfileDocumentsProps) => {
  const theme = useTheme();

  const documentCards = [
    {
      name: "identityProof",
      title: "Identity Proof",
      description: "(Aadhaar/Passport/Driving License/PAN)",
    },
    {
      name: "degreeCertificate",
      title: "Degree Certificate",
      description: "(BAMS/MD)",
    },
    {
      name: "registrationCertificate",
      title: "AYUSH Registration Certificate",
      description: "",
    },
    {
      name: "practiceProof",
      title: "Practice Proof (Optional)",
      description: "",
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
                <Controller
                  name={doc.name}
                  control={control}
                  render={({ field }) => (
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      disabled={!isEditing}
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        onChange={e => field.onChange(e.target.files?.[0])}
                      />
                    </Button>
                  )}
                />
                {control._formValues && control._formValues[doc.name] && (
                  <CheckCircleIcon color="success" />
                )}
              </Stack>
              {errors && errors[doc.name] && (
                <FormHelperText error>{errors[doc.name]?.message?.toString()}</FormHelperText>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Box, 
  Container, 
  Paper, 
  Avatar,
  Divider,
  useTheme
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ProfileHeader } from "@/components/ProfileElements/ProfileHeader";
import { ProfileEditButton } from "@/components/ProfileElements/ProfileEditButton";
import { ExpertProfilePersonalInfo } from "@/components/ProfileElements/ExpertProfilePersonalInfo";
import { ExpertProfileProfessionalInfo } from "@/components/ProfileElements/ExpertProfileProfessionalInfo";
import { ExpertProfileQualifications } from "@/components/ProfileElements/ExpertProfileQualifications";
import { ExpertProfileDocuments } from "@/components/ProfileElements/ExpertProfileDocuments";

const expertProfileSchema = z.object({
  // ... (your schema definition)
});

type ExpertFormData = z.infer<typeof expertProfileSchema>;

const councilOptions = [
  "Central Council of Indian Medicine (CCIM)",
  "State Ayurvedic Board",
  "National Commission for Indian System of Medicine (NCISM)"
];

const specializationsOptions = [
  "Panchakarma",
  "Kayachikitsa",
  "Prasuti Tantra",
  "Balaroga",
  "Shalya Tantra",
  "Shalakya Tantra"
];

const languageOptions = [
  "Hindi", 
  "English",
  "Marathi",
  "Gujarati",
  "Bengali",
  "Tamil"
];

const ExpertProfilePage = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ExpertFormData>({
    resolver: zodResolver(expertProfileSchema),
    defaultValues: {
      // Initial values from API or empty
      qualifications: [{
        degree: "",
        college: "",
        year: ""
      }]
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleSave = (data: ExpertFormData) => {
    console.log("Save data:", data);
    // API call to save data
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth={false} disableGutters sx={{ py: 0, px: 0, width: '100vw', minWidth: 0 }}>
        <Paper elevation={3} sx={{ 
          p: { xs: 1, sm: 2, md: 4, lg: 6 }, 
          borderRadius: 0,
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
          width: '100vw',
          maxWidth: '100vw',
          minHeight: '100vh',
          mx: 0
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            mb: 4
          }}>
            <ProfileEditButton 
              isEditing={isEditing}
              onEdit={handleEdit}
              onSave={handleSubmit(handleSave)}
              onCancel={handleCancel}
            />
          </Box>

          <ProfileHeader
            title="Expert Profile"
            subtitle="Manage your professional information and personal details"
          />

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            mb: 6,
            position: 'relative'
          }}>
            <Avatar
              src={avatar || "/default-avatar.jpg"}
              sx={{ 
                width: 140, 
                height: 140,
                border: `4px solid ${theme.palette.primary.main}`,
                mb: 3
              }}
            />
            {isEditing && (
              <Box
                component="label"
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  cursor: 'pointer',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark
                  }
                }}
              >
                Change Photo
                <input type="file" hidden onChange={handleAvatarChange} />
              </Box>
            )}
          </Box>

          <ExpertProfilePersonalInfo 
            control={control} 
            errors={errors} 
            isEditing={isEditing} 
          />

          <Divider sx={{ 
            my: 6,
            borderColor: theme.palette.divider,
            borderWidth: 1
          }} />

          <ExpertProfileProfessionalInfo
            control={control}
            errors={errors}
            isEditing={isEditing}
            councilOptions={councilOptions}
            specializationsOptions={specializationsOptions}
            languageOptions={languageOptions}
          />

          <Divider sx={{ 
            my: 6,
            borderColor: theme.palette.divider,
            borderWidth: 1
          }} />

          <ExpertProfileQualifications 
            control={control} 
            errors={errors} 
            isEditing={isEditing} 
            watch={watch}
          />

          <Divider sx={{ 
            my: 6,
            borderColor: theme.palette.divider,
            borderWidth: 1
          }} />

          <ExpertProfileDocuments 
            control={control} 
            errors={errors} 
            isEditing={isEditing} 
            watch={watch}
          />
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default ExpertProfilePage;
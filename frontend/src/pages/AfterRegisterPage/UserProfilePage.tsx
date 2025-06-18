import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Container,
  Paper,
  Avatar,
  Button,
  // Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ProfileHeader } from "@/components/ProfileElements/ProfileHeader";
import { ProfileEditButton } from "@/components/ProfileElements/ProfileEditButton";
import { UserProfilePersonalInfo } from "@/components/ProfileElements/UserProfilePersonalInfo";
import { UserProfileWellnessInfo } from "@/components/ProfileElements/UserProfileWellnessInfo";

const userSchema = z.object({
  // ... (your schema definition)
});

type UserFormData = z.infer<typeof userSchema>;

const UserProfilePage = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    // watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      // Initial values from API or empty
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleSave = (data: UserFormData) => {
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
      <Container
        maxWidth={false}
        disableGutters
        sx={{ px: 0, py: 0, width: "100vw", minWidth: 0 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4, md: 6 },
            borderRadius: 0,
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
            width: "100vw",
            minHeight: "100vh",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 4,
            }}
          >
            <ProfileEditButton
              isEditing={isEditing}
              onEdit={handleEdit}
              onSave={handleSubmit(handleSave)}
              onCancel={handleCancel}
            />
          </Box>

          <ProfileHeader
            title="User Profile"
            subtitle="Manage your personal information and wellness preferences"
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 6,
              position: "relative",
            }}
          >
            <Avatar
              src={avatar || "/default-avatar.jpg"}
              sx={{
                width: 140,
                height: 140,
                border: `4px solid ${theme.palette.primary.main}`,
                mb: 3,
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
                  cursor: "pointer",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Change Photo
                <input type="file" hidden onChange={handleAvatarChange} />
              </Box>
            )}
          </Box>

          <UserProfilePersonalInfo
            control={control}
            errors={errors}
            isEditing={isEditing}
            onAvatarChange={handleAvatarChange}
            avatar={avatar}
          />

          <Divider
            sx={{
              my: 6,
              borderColor: theme.palette.divider,
              borderWidth: 1,
            }}
          />

          <UserProfileWellnessInfo
            control={control}
            errors={errors}
            isEditing={isEditing}
          />

          <Box sx={{ mt: 4, textAlign: "center" }}>
            {/* {(watch("governmentId") as any) && (
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 2,
                }}
              >
                Document uploaded: {watch("governmentId")}
              </Typography>
            )} */}

            {isEditing && (
              <Button
                component="label"
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Upload Verification Document
                <input type="file" hidden />
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default UserProfilePage;

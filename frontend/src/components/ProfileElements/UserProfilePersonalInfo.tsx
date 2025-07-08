import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Stack,
  useTheme,
  InputAdornment
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Controller, Control, FieldErrors } from "react-hook-form";

interface UserProfilePersonalInfoProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  isEditing: boolean;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  avatar: string | null;
}

export const UserProfilePersonalInfo = ({
  control,
  errors,
  isEditing,
  onAvatarChange,
  avatar
}: UserProfilePersonalInfoProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{
        mb: 4,
        fontWeight: 600,
        color: theme.palette.text.primary
      }}>
        Personal Information
      </Typography>
      <Card variant="outlined" sx={{
        mb: 3,
        borderRadius: 2,
        borderColor: theme.palette.divider
      }}>
        <CardContent>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 4,
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Avatar
              src={avatar || undefined}
              sx={{ width: 80, height: 80, mb: 2 }}
            >
              {/* Optionally show initials */}
            </Avatar>
            <Button variant="outlined" component="label" disabled={!isEditing}>
              Upload Avatar
              <input type="file" hidden onChange={onAvatarChange} />
            </Button>
          </Box>
          <Stack spacing={3}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Name"
                  {...field}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                    readOnly: !isEditing
                  }}
                  error={!!errors?.name}
                  helperText={errors?.name?.message?.toString()}
                  fullWidth
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Phone"
                  {...field}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                    readOnly: !isEditing
                  }}
                  error={!!errors?.phone}
                  helperText={errors?.phone?.message?.toString()}
                  fullWidth
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Email"
                  {...field}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                    readOnly: !isEditing
                  }}
                  error={!!errors?.email}
                  helperText={errors?.email?.message?.toString()}
                  fullWidth
                />
              )}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
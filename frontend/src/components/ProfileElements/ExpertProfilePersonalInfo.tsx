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
import { Controller, Control, FieldErrors } from "react-hook-form";

interface ExpertProfilePersonalInfoProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  isEditing: boolean;
}

export const ExpertProfilePersonalInfo = ({
  control,
  errors,
  isEditing
}: ExpertProfilePersonalInfoProps) => {
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
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Address"
                    {...field}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon />
                        </InputAdornment>
                      ),
                      readOnly: !isEditing
                    }}
                    error={!!errors?.address}
                    helperText={errors?.address?.message?.toString()}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Date of Birth"
                    {...field}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRangeIcon />
                        </InputAdornment>
                      ),
                      readOnly: !isEditing
                    }}
                    error={!!errors?.dob}
                    helperText={errors?.dob?.message?.toString()}
                    fullWidth
                  />
                )}
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
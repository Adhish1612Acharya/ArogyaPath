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

interface UserProfilePersonalInfoProps {
  isEditing: boolean;
}

export const UserProfilePersonalInfo = ({
  isEditing
}: UserProfilePersonalInfoProps) => {
  const theme = useTheme();

  // Mock data for demonstration
  const mockData = {
    name: "Jane Doe",
    phone: "9876543210",
    email: "jane@example.com",
    avatar: null as string | null
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
              src={mockData.avatar || undefined}
              sx={{ width: 80, height: 80, mb: 2 }}
            >
              {mockData.name[0]}
            </Avatar>
            <Button variant="outlined" component="label" disabled={!isEditing}>
              Upload Avatar
              <input type="file" hidden />
            </Button>
          </Box>
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
              label="Email"
              value={mockData.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
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
  );
};
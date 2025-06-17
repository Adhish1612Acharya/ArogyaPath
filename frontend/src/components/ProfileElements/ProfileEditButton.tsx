import { Button, IconButton, Stack, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface ProfileEditButtonProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export const ProfileEditButton = ({ 
  isEditing, 
  onSave, 
  onCancel, 
  onEdit 
}: ProfileEditButtonProps) => {
  const theme = useTheme();

  return isEditing ? (
    <Stack direction="row" spacing={2}>
      <Button
        variant="contained"
        color="primary"
        onClick={onSave}
        startIcon={<SaveIcon />}
        sx={{
          px: 3,
          py: 1,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600
        }}
      >
        Save Changes
      </Button>
      <Button
        variant="outlined"
        onClick={onCancel}
        startIcon={<CancelIcon />}
        sx={{
          px: 3,
          py: 1,
          borderRadius: 2,
          textTransform: 'none',
          borderColor: theme.palette.divider,
          '&:hover': {
            borderColor: theme.palette.error.main,
            color: theme.palette.error.main
          }
        }}
      >
        Cancel
      </Button>
    </Stack>
  ) : (
    <IconButton 
      onClick={onEdit} 
      color="primary"
      sx={{
        borderRadius: 2,
        background: theme.palette.action.hover,
        '&:hover': {
          background: theme.palette.primary.light
        }
      }}
    >
      <EditIcon />
    </IconButton>
  );
};
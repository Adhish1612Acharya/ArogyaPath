import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, TextField, Typography, Avatar } from "@mui/material";
import { Close, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const VerifiersDialog = ({
  open,
  onClose,
  verifiers
}: {
  open: boolean,
  onClose: () => void,
  verifiers: Array<{ _id: string, profile: { fullName: string, profileImage?: string } }>
}) => {
  const navigate = useNavigate();
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Verified By</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {verifiers.map((doctor) => (
            <Box 
              key={doctor._id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                  cursor: 'pointer'
                }
              }}
              onClick={() => navigate(`/doctors/profile/${doctor._id}`)}
            >
              <Avatar 
                src={doctor.profile.profileImage} 
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Typography variant="subtitle1">
                Dr. {doctor.profile.fullName}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <CheckCircle color="success" />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export const InvalidDialog = ({
  open,
  onClose,
  onConfirm,
  reason,
  setReason,
  loading
}: {
  open: boolean,
  onClose: () => void,
  onConfirm: () => void,
  reason: string,
  setReason: (reason: string) => void,
  loading: boolean
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Mark Post as Invalid</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please provide a reason for marking this post as invalid:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason (e.g., misleading information, inappropriate content, etc.)"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={onConfirm} 
          color="error"
          variant="contained"
          disabled={!reason.trim() || loading}
        >
          Confirm Invalid
        </Button>
      </DialogActions>
    </Dialog>
  );
};
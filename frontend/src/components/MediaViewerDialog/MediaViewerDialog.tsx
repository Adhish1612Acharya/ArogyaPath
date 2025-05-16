import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import React from "react";
import { MediaViewerDialogProps } from "./MediaViewerDialog.types";

const MediaViewerDialog: React.FC<MediaViewerDialogProps> = ({
  open,
  images,
  title,
  selectedImageIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  if (!images || images.length === 0) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      className="relative"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {selectedImageIndex + 1} / {images.length}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers className="relative">
        <div className="relative h-96 flex items-center justify-center">
          <img
            src={images[selectedImageIndex]}
            alt={`${title ?? "Image"} ${selectedImageIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
          {images.length > 1 && (
            <>
              <IconButton
                onClick={onPrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100"
              >
                <Close className="transform rotate-180" />
              </IconButton>
              <IconButton
                onClick={onNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100"
              >
                <Close />
              </IconButton>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaViewerDialog;

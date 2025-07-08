import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  useTheme,
  Typography,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import { Send, Email, Person, Subject, Message } from "@mui/icons-material";

interface ContactFormState {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

const ContactUsForm: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setOpen(true);
      setForm({ fullName: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={inputVariants}
      >
        <TextField
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
              },
            },
            "& .MuiInputLabel-root": {
              color: "text.secondary",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: theme.palette.primary.main,
            },
          }}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        custom={1}
        variants={inputVariants}
      >
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          fullWidth
          type="email"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
              },
            },
          }}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        custom={2}
        variants={inputVariants}
      >
        <TextField
          label="Subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Subject color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
              },
            },
          }}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        custom={3}
        variants={inputVariants}
      >
        <TextField
          label="Message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          fullWidth
          multiline
          minRows={5}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{ alignSelf: "flex-start", mt: 1 }}
              >
                <Message color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
              },
            },
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<Send />}
          disabled={isSubmitting}
          sx={{
            mt: 1,
            borderRadius: "12px",
            fontWeight: 600,
            boxShadow: `0 4px 20px ${theme.palette.primary.light}`,
            transition: "all 0.3s ease",
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 6px 25px ${theme.palette.primary.light}`,
            },
            "&:active": {
              transform: "translateY(0)",
            },
            "&.Mui-disabled": {
              background: theme.palette.action.disabledBackground,
            },
          }}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </motion.div>

      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={(props: any) => (
          <motion.div
            {...props}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          />
        )}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{
            width: "100%",
            boxShadow: theme.shadows[4],
            borderRadius: "12px",
            background: `linear-gradient(45deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
            color: "white",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            Message sent successfully! We'll get back to you soon.
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUsForm;

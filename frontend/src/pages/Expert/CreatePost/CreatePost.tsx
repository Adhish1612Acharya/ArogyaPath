import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import AddPostForm from "@/components/Forms/Expert/AddPostForm/AddPostForm";
import AddRoutineForm from "@/components/Forms/Expert/AddRoutineForm/AddRoutineForm";

const CreatePost = () => {
  const [postType, setPostType] = useState<"general" | "routine">("general");
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent) => {
    setPostType(event.target.value as "general" | "routine");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, #ffffff 100%)`,
        py: 8,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container sx={{ px: { xs: 0, lg: 2 } }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            px: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              lineHeight: 1.2,
            }}
          >
            Share Your{" "}
            <Typography
              component="span"
              color="primary.main"
              sx={{
                fontWeight: 700,
                fontSize: "inherit",
                display: "inline",
              }}
            >
              Wisdom
            </Typography>
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              maxWidth: "800px",
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Contribute to our community by sharing your expertise and healing
            knowledge
          </Typography>
        </Box>

        {/* Main Card */}
        <Card
          sx={{
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: 3,
            border: "none",
          }}
        >
          {/* Card Header with Gradient */}
          <CardHeader
            title={
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: "common.white",
                  textAlign: "center",
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                }}
              >
                Create New Post
              </Typography>
            }
            subheader={
              <Typography
                variant="body1"
                sx={{
                  color: "primary.light",
                  textAlign: "center",
                  mt: 1,
                }}
              >
                {postType === "general"
                  ? "Share insights, articles, or media"
                  : "Create a wellness routine"}
              </Typography>
            }
            sx={{
              py: 6,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
            }}
          />

          <CardContent sx={{ p: { xs: 3, md: 6 } }}>
            {/* Post Type Selector */}
            <Box
              sx={{
                mb: 6,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 3,
              }}
            >
              <Typography
                variant="h6"
                component="label"
                htmlFor="post-type-select"
                sx={{
                  fontWeight: 500,
                  color: "text.primary",
                  fontSize: "1.1rem",
                }}
              >
                What would you like to create?
              </Typography>

              <FormControl sx={{ minWidth: 240 }}>
                <InputLabel id="post-type-select-label">Post Type</InputLabel>
                <Select
                  labelId="post-type-select-label"
                  id="post-type-select"
                  value={postType}
                  onChange={handleChange}
                  label="Post Type"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": {
                        borderColor: "primary.light",
                      },
                    },
                  }}
                >
                  <MenuItem value="general">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "primary.main",
                      }}
                    >
                      <Add fontSize="small" />
                      General Post
                    </Box>
                  </MenuItem>
                  <MenuItem value="routine">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "primary.main",
                      }}
                    >
                      <Add fontSize="small" />
                      Wellness Routine
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 2 }} />

            {/* Dynamic Form Section */}
            <Box sx={{ mt: 4 }}>
              {postType === "general" ? <AddPostForm /> : <AddRoutineForm />}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CreatePost;
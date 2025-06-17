import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import WorkIcon from "@mui/icons-material/Work";
import { ProfessionalDetailsStepProps } from "./ProfessionalDetailsStep.types";

const ProfessionalDetailsStep: React.FC<ProfessionalDetailsStepProps> = ({
  control,
  errors,
  councilOptions,
  specializationsOptions,
  languageOptions,
  handleSpecializationChange,
  handleLanguageChange,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, color: theme.palette.primary.main }}
      >
        Professional Details
      </Typography>

      <Card
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          borderLeft: `4px solid ${theme.palette.primary.main}`,
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            <WorkIcon color="primary" sx={{ mr: 1 }} /> Registration Information
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="ayushRegistrationNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="AYUSH Registration Number"
                    placeholder="e.g., UP/A-12345"
                    error={!!errors.ayushRegistrationNumber}
                    helperText={
                      errors.ayushRegistrationNumber?.message ||
                      "Format: StateCode/A-Number"
                    }
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Box>

            <Box sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="registrationCouncil"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Registration Council"
                    error={!!errors.registrationCouncil}
                    helperText={errors.registrationCouncil?.message}
                    variant="outlined"
                    size="small"
                    SelectProps={{
                      native: true,
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      },
                    }}
                  >
                    <option value="">Select Council</option>
                    {councilOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                )}
              />
            </Box>

            <Box sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="yearOfRegistration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Year of Registration"
                    error={!!errors.yearOfRegistration}
                    helperText={errors.yearOfRegistration?.message}
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Box>

            <Box sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="yearsOfExperience"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Years of Experience"
                    type="number"
                    error={!!errors.yearsOfExperience}
                    helperText={errors.yearsOfExperience?.message}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          p: 2,
          borderLeft: `4px solid ${theme.palette.primary.main}`,
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            <WorkIcon color="primary" sx={{ mr: 1 }} /> Professional Expertise
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <FormControl
                fullWidth
                error={!!errors.specializations}
                variant="outlined"
                size="small"
              >
                <Controller
                  name="specializations"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Specializations"
                      error={!!errors.specializations}
                      helperText={errors.specializations?.message}
                      variant="outlined"
                      size="small"
                      SelectProps={{
                        native: true,
                        multiple: true,
                        onChange: handleSpecializationChange as any,
                      }}
                    >
                      {specializationsOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>
            </Box>

            <Box sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <FormControl
                fullWidth
                error={!!errors.languages}
                variant="outlined"
                size="small"
              >
                <Controller
                  name="languages"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Languages"
                      error={!!errors.languages}
                      helperText={errors.languages?.message}
                      variant="outlined"
                      size="small"
                      SelectProps={{
                        native: true,
                        multiple: true,
                        onChange: handleLanguageChange as any,
                      }}
                    >
                      {languageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfessionalDetailsStep;

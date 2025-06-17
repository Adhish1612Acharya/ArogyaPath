import React from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  SelectChangeEvent,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

// Zod schema for validation
const expertProfileSchema = z.object({
  // Personal Details
  dateOfBirth: z.date().refine(date => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100);
    return date <= today && date >= minDate;
  }, "Please enter a valid date of birth"),
  gender: z.string().min(1, "Gender is required"),
  mobileNumber: z.string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number cannot exceed 15 digits"),
  
  // Address
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z.string().min(6, "PIN code must be 6 digits").max(6),
  
  // Professional Details
  ayushRegistrationNumber: z.string()
    .min(3, "AYUSH registration number is required")
    .regex(/^[A-Za-z]{2,3}\/[A-Za-z]-?\d+$/, "Invalid AYUSH registration format"),
  registrationCouncil: z.string().min(1, "Registration council is required"),
  yearOfRegistration: z.string()
    .min(4, "Year must be 4 digits")
    .max(4)
    .refine(val => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1950 && year <= currentYear;
    }, "Please enter a valid year"),
  
  // Qualifications
  qualifications: z.array(z.object({
    degree: z.string().min(1, "Degree is required"),
    college: z.string().min(1, "College/University is required"),
    year: z.string().min(4, "Year must be 4 digits").max(4),
  })).nonempty("At least one qualification is required"),
  
  yearsOfExperience: z.number()
    .min(0, "Experience cannot be negative")
    .max(70, "Please enter a valid experience"),
  
  specializations: z.array(z.string()).nonempty("At least one specialization is required"),
  languages: z.array(z.string()).nonempty("At least one language is required"),
  
  // Documents
  identityProof: z.string().min(1, "Identity proof is required"),
  degreeCertificate: z.string().min(1, "Degree certificate is required"),
  registrationCertificate: z.string().min(1, "Registration certificate is required"),
  practiceProof: z.string().optional(),
  
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
});

type ExpertFormData = z.infer<typeof expertProfileSchema>;

const defaultDate = new Date(1990, 0, 1); // Jan 1, 1990 as a safe default

const steps = [
  'Personal Information',
  'Professional Details',
  'Qualifications',
  'Documents',
  'Review & Submit'
];

const ExpertCompleteProfile: React.FC = () => {
  // const { expertCompleteProfile } = useExpertAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = React.useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<ExpertFormData>({
    resolver: zodResolver(expertProfileSchema),
    defaultValues: {
      dateOfBirth: defaultDate,
      gender: '',
      mobileNumber: '',
      street: '',
      city: '',
      state: '',
      pinCode: '',
      ayushRegistrationNumber: '',
      registrationCouncil: '',
      yearOfRegistration: '',
      yearsOfExperience: 0,
      qualifications: [{ year: '', degree: '', college: '' }],
      specializations: [],
      languages: [],
      identityProof: '',
      degreeCertificate: '',
      registrationCertificate: '',
      practiceProof: '',
      bio: '',
    },
  });

  const specializationsOptions = [
    "Panchakarma",
    "Kaya Chikitsa",
    "Shalya Tantra",
    "Shalakya Tantra",
    "Bala Roga (Pediatrics)",
    "Prasuti Tantra (Obstetrics)",
    "Agada Tantra (Toxicology)",
    "Rasayana (Rejuvenation)",
    "Vajikarana (Aphrodisiac Therapy)",
  ];

  const languageOptions = [
    "Hindi", "English", "Sanskrit", "Bengali", "Tamil", 
    "Telugu", "Marathi", "Gujarati", "Punjabi", "Malayalam",
    "Kannada", "Odia", "Urdu"
  ];

  const councilOptions = [
    "Central Council of Indian Medicine (CCIM)",
    "Uttar Pradesh Ayurvedic and Unani Medicine Board",
    "Maharashtra Council of Indian Medicine",
    "Kerala Ayurveda Medical Council",
    "Tamil Nadu Board of Indian Medicine",
    "Karnataka Ayurveda and Unani Practitioners Board",
    "Gujarat Ayurvedic and Unani Medicine Board",
    "Rajasthan Ayurveda and Unani Medicine Board",
  ];

  const handleAddQualification = () => {
    const currentQualifications = watch("qualifications");
    setValue(
      "qualifications",
      ([...currentQualifications, { degree: "", college: "", year: "" }] as [
        { degree: string; college: string; year: string },
        ...Array<{ degree: string; college: string; year: string }>
      ])
    );
  };

  const handleRemoveQualification = (index: number) => {
    const currentQualifications = watch("qualifications");
    if (currentQualifications.length > 1) {
      const updated = currentQualifications.filter((_, i) => i !== index);
      setValue(
        "qualifications",
        (updated as [
          { degree: string; college: string; year: string },
          ...Array<{ degree: string; college: string; year: string }>
        ])
      );
    }
  };

  const handleSpecializationChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setValue(
      "specializations",
      (value.length > 0
        ? (value as [string, ...string[]])
        : ([""] as [string]))
    );
  };

  const handleLanguageChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setValue(
      "languages",
      (value.length > 0 ? (value as [string, ...string[]]) : ([""] as [string]))
    );
  };

  const onSubmit = async (data: ExpertFormData) => {
    console.log("Expert Profile Data:", data);
    // const response = await expertCompleteProfile(data);
    // console.log("Response from API:", response);
    // if (response.success) {
    //   navigate("/gposts");
    // }
  };

  const handleFileUpload = (fieldName: keyof ExpertFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setValue(fieldName, file.name);
    }
  };

  const handleNext = async () => {
    let isValid = false;
    
    switch (activeStep) {
      case 0:
        isValid = await trigger([
          'dateOfBirth', 'gender', 'mobileNumber',
          'street', 'city', 'state', 'pinCode'
        ]);
        break;
      case 1:
        isValid = await trigger([
          'ayushRegistrationNumber', 'registrationCouncil',
          'yearOfRegistration', 'yearsOfExperience',
          'specializations', 'languages'
        ]);
        break;
      case 2:
        isValid = await trigger(['qualifications']);
        break;
      case 3:
        isValid = await trigger([
          'identityProof', 'degreeCertificate',
          'registrationCertificate'
        ]);
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
              Personal Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid >
                <Card variant="outlined" sx={{ 
                  p: 2,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ 
                      mb: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 600,
                      color: theme.palette.text.primary
                    }}>
                      <PersonIcon color="primary" sx={{ mr: 1 }} /> Basic Details
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid >
                        <Controller
                          name="dateOfBirth"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              label="Date of Birth"
                              value={field.value ?? defaultDate}
                              onChange={field.onChange}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!errors.dateOfBirth,
                                  helperText: errors.dateOfBirth?.message,
                                  variant: 'outlined',
                                  size: 'small',
                                  InputProps: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <DateRangeIcon color="primary" />
                                      </InputAdornment>
                                    ),
                                  },
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              select
                              fullWidth
                              label="Gender"
                              error={!!errors.gender}
                              helperText={errors.gender?.message}
                              variant="outlined"
                              size="small"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonIcon color="primary" />
                                  </InputAdornment>
                                ),
                              }}
                            >
                              <MenuItem value="male">Male</MenuItem>
                              <MenuItem value="female">Female</MenuItem>
                              <MenuItem value="other">Other</MenuItem>
                              <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                            </TextField>
                          )}
                        />
                      </Grid>
                      
                      <Grid >
                        <Controller
                          name="mobileNumber"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Mobile Number"
                              error={!!errors.mobileNumber}
                              helperText={errors.mobileNumber?.message}
                              variant="outlined"
                              size="small"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PhoneIcon color="primary" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid>
                <Card variant="outlined" sx={{ 
                  p: 2,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ 
                      mb: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 600,
                      color: theme.palette.text.primary
                    }}>
                      <HomeIcon color="primary" sx={{ mr: 1 }} /> Address Details
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid >
                        <Controller
                          name="street"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Street Address"
                              error={!!errors.street}
                              helperText={errors.street?.message}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid >
                        <Controller
                          name="city"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="City"
                              error={!!errors.city}
                              helperText={errors.city?.message}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid >
                        <Controller
                          name="state"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="State"
                              error={!!errors.state}
                              helperText={errors.state?.message}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid >
                        <Controller
                          name="pinCode"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="PIN Code"
                              error={!!errors.pinCode}
                              helperText={errors.pinCode?.message}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
              Professional Details
            </Typography>
            
            <Card variant="outlined" sx={{ 
              p: 2, 
              mb: 3,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 600,
                  color: theme.palette.text.primary
                }}>
                  <WorkIcon color="primary" sx={{ mr: 1 }} /> Registration Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid>
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
                          helperText={errors.ayushRegistrationNumber?.message || "Format: StateCode/A-Number"}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid>
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
                            MenuProps: {
                              PaperProps: {
                                style: {
                                  maxHeight: 300,
                                },
                              },
                            },
                          }}
                        >
                          {councilOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  
                  <Grid>
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
                  </Grid>
                  
                  <Grid>
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
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ 
              p: 2,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 600,
                  color: theme.palette.text.primary
                }}>
                  <WorkIcon color="primary" sx={{ mr: 1 }} /> Professional Expertise
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid>
                    <FormControl fullWidth error={!!errors.specializations} variant="outlined" size="small">
                      <InputLabel>Area(s) of Specialization</InputLabel>
                      <Controller
                        name="specializations"
                        control={control}
                        render={({ field }) => (
                          <Select
                            multiple
                            value={field.value ?? []}
                            onChange={handleSpecializationChange}
                            input={<OutlinedInput label="Area(s) of Specialization" />}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} color="primary" size="small" />
                                ))}
                              </Box>
                            )}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 300,
                                },
                              },
                            }}
                          >
                            {specializationsOptions.map((specialization) => (
                              <MenuItem key={specialization} value={specialization}>
                                {specialization}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      <FormHelperText>{errors.specializations?.message}</FormHelperText>
                    </FormControl>
                  </Grid>
                  
                  <Grid>
                    <FormControl fullWidth error={!!errors.languages} variant="outlined" size="small">
                      <InputLabel>Languages Spoken</InputLabel>
                      <Controller
                        name="languages"
                        control={control}
                        render={({ field }) => (
                          <Select
                            multiple
                            value={field.value ?? []}
                            onChange={handleLanguageChange}
                            input={<OutlinedInput label="Languages Spoken" />}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} color="primary" size="small" />
                                ))}
                              </Box>
                            )}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 300,
                                },
                              },
                            }}
                          >
                            {languageOptions.map((language) => (
                              <MenuItem key={language} value={language}>
                                {language}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      <FormHelperText>{errors.languages?.message}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
              Educational Qualifications
            </Typography>
            
            <Card variant="outlined" sx={{ 
              p: 2,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }}>
              <CardContent>
                {watch("qualifications")?.map((_, index) => (
                  <React.Fragment key={index}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 2 
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Qualification {index + 1}
                      </Typography>
                      {index > 0 && (
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveQualification(index)}
                          size="small"
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      )}
                    </Box>
                    
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid >
                        <Controller
                          name={`qualifications.${index}.degree`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Degree"
                              placeholder="e.g., BAMS, MD Ayurveda"
                              error={!!errors.qualifications?.[index]?.degree}
                              helperText={errors.qualifications?.[index]?.degree?.message}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid >
                        <Controller
                          name={`qualifications.${index}.college`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="College/University"
                              error={!!errors.qualifications?.[index]?.college}
                              helperText={errors.qualifications?.[index]?.college?.message}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid >
                        <Controller
                          name={`qualifications.${index}.year`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Year of Passing"
                              error={!!errors.qualifications?.[index]?.year}
                              helperText={errors.qualifications?.[index]?.year?.message}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    
                    {index < watch("qualifications").length - 1 && <Divider sx={{ my: 2 }} />}
                  </React.Fragment>
                ))}
                
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddQualification}
                  sx={{ mt: 1 }}
                  size="small"
                >
                  Add Another Qualification
                </Button>
                {errors.qualifications && typeof errors.qualifications.message === 'string' && (
                  <FormHelperText error>{errors.qualifications.message}</FormHelperText>
                )}
              </CardContent>
            </Card>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
              Document Uploads
            </Typography>
            
            <Grid container spacing={3}>
              <Grid>
                <Card variant="outlined" sx={{ 
                  height: '100%',
                  borderLeft: `4px solid ${theme.palette.primary.main}`
                }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                      Identity Proof
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      (Aadhaar/Passport/Driving License/PAN)
                    </Typography>
                    <Controller
                      name="identityProof"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden-file-input"
                            id="identity-proof-upload"
                            type="file"
                            onChange={handleFileUpload("identityProof")}
                          />
                          <label htmlFor="identity-proof-upload">
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<CloudUploadIcon />}
                              fullWidth
                              sx={{ mb: 1 }}
                              size="small"
                            >
                              Upload File
                            </Button>
                          </label>
                          {field.value && (
                            <Typography variant="body2" sx={{ 
                              mt: 1, 
                              color: theme.palette.success.main,
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              ✓ {field.value}
                            </Typography>
                          )}
                          <FormHelperText error={!!errors.identityProof}>
                            {errors.identityProof?.message || "PDF or image (max 2MB)"}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid>
                <Card variant="outlined" sx={{ 
                  height: '100%',
                  borderLeft: `4px solid ${theme.palette.primary.main}`
                }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                      Degree Certificate
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      (BAMS/MD)
                    </Typography>
                    <Controller
                      name="degreeCertificate"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden-file-input"
                            id="degree-certificate-upload"
                            type="file"
                            onChange={handleFileUpload("degreeCertificate")}
                          />
                          <label htmlFor="degree-certificate-upload">
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<CloudUploadIcon />}
                              fullWidth
                              sx={{ mb: 1 }}
                              size="small"
                            >
                              Upload File
                            </Button>
                          </label>
                          {field.value && (
                            <Typography variant="body2" sx={{ 
                              mt: 1, 
                              color: theme.palette.success.main,
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              ✓ {field.value}
                            </Typography>
                          )}
                          <FormHelperText error={!!errors.degreeCertificate}>
                            {errors.degreeCertificate?.message || "PDF or image (max 2MB)"}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid>
                <Card variant="outlined" sx={{ 
                  height: '100%',
                  borderLeft: `4px solid ${theme.palette.primary.main}`
                }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                      AYUSH Registration Certificate
                    </Typography>
                    <Controller
                      name="registrationCertificate"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden-file-input"
                            id="registration-certificate-upload"
                            type="file"
                            onChange={handleFileUpload("registrationCertificate")}
                          />
                          <label htmlFor="registration-certificate-upload">
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<CloudUploadIcon />}
                              fullWidth
                              sx={{ mb: 1 }}
                              size="small"
                            >
                              Upload File
                            </Button>
                          </label>
                          {field.value && (
                            <Typography variant="body2" sx={{ 
                              mt: 1, 
                              color: theme.palette.success.main,
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              ✓ {field.value}
                            </Typography>
                          )}
                          <FormHelperText error={!!errors.registrationCertificate}>
                            {errors.registrationCertificate?.message || "PDF or image (max 2MB)"}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid >
                <Card variant="outlined" sx={{ 
                  height: '100%',
                  borderLeft: `4px solid ${theme.palette.primary.main}`
                }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                      Practice Proof (Optional)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Clinic ownership proof, hospital experience letter, or prescription sample
                    </Typography>
                    <Controller
                      name="practiceProof"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden-file-input"
                            id="practice-proof-upload"
                            type="file"
                            onChange={handleFileUpload("practiceProof")}
                          />
                          <label htmlFor="practice-proof-upload">
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<CloudUploadIcon />}
                              fullWidth
                              sx={{ mb: 1 }}
                              size="small"
                            >
                              Upload File
                            </Button>
                          </label>
                          {field.value && (
                            <Typography variant="body2" sx={{ 
                              mt: 1, 
                              color: theme.palette.success.main,
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              ✓ {field.value}
                            </Typography>
                          )}
                        </>
                      )}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
              Review Your Information
            </Typography>
            
            <Card variant="outlined" sx={{ 
              p: 2, 
              mb: 3,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 600
                }}>
                  <PersonIcon color="primary" sx={{ mr: 1 }} /> Personal Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid>
                    <Typography variant="body2" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body1">
                      {watch("dateOfBirth")?.toLocaleDateString()}
                    </Typography>
                  </Grid>
                  
                  <Grid >
                    <Typography variant="body2" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="body1">
                      {watch("gender")}
                    </Typography>
                  </Grid>
                  
                  <Grid >
                    <Typography variant="body2" color="text.secondary">
                      Mobile Number
                    </Typography>
                    <Typography variant="body1">
                      {watch("mobileNumber")}
                    </Typography>
                  </Grid>
                  
                  <Grid >
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  
                  <Grid >
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {watch("street")}, {watch("city")}, {watch("state")} - {watch("pinCode")}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ 
              p: 2, 
              mb: 3,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 600
                }}>
                  <WorkIcon color="primary" sx={{ mr: 1 }} /> Professional Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid  >
                    <Typography variant="body2" color="text.secondary">
                      AYUSH Registration
                    </Typography>
                    <Typography variant="body1">
                      {watch("ayushRegistrationNumber")}
                    </Typography>
                  </Grid>
                  
                  <Grid  >
                    <Typography variant="body2" color="text.secondary">
                      Registration Council
                    </Typography>
                    <Typography variant="body1">
                      {watch("registrationCouncil")}
                    </Typography>
                  </Grid>
                  
                  <Grid  >
                    <Typography variant="body2" color="text.secondary">
                      Year of Registration
                    </Typography>
                    <Typography variant="body1">
                      {watch("yearOfRegistration")}
                    </Typography>
                  </Grid>
                  
                  <Grid  >
                    <Typography variant="body2" color="text.secondary">
                      Years of Experience
                    </Typography>
                    <Typography variant="body1">
                      {watch("yearsOfExperience")}
                    </Typography>
                  </Grid>
                  
                  <Grid >
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  
                  <Grid  >
                    <Typography variant="body2" color="text.secondary">
                      Specializations
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {watch("specializations")?.map((spec) => (
                        <Chip key={spec} label={spec} color="primary" size="small" />
                      ))}
                    </Box>
                  </Grid>
                                    <Grid  >
                    <Typography variant="body2" color="text.secondary">
                      Languages Spoken
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {watch("languages")?.map((lang) => (
                        <Chip key={lang} label={lang} color="primary" size="small" />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ 
              p: 2, 
              mb: 3,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 600
                }}>
                  <SchoolIcon color="primary" sx={{ mr: 1 }} /> Qualifications
                </Typography>
                
                {watch("qualifications")?.map((qual, index) => (
                  <Box key={index} sx={{ mb: index < watch("qualifications").length - 1 ? 2 : 0 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {qual.degree}
                    </Typography>
                    <Typography variant="body2">
                      {qual.college}, {qual.year}
                    </Typography>
                    {index < watch("qualifications").length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ 
              p: 2,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 600
                }}>
                  <BadgeIcon color="primary" sx={{ mr: 1 }} /> Documents
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid  >
                    <Typography variant="body2" color="text.secondary">
                      Identity Proof
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: theme.palette.success.main,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      ✓ {watch("identityProof")}
                    </Typography>
                  </Grid>
                  
                  <Grid  >
                    <Typography variant="body2" color="text.secondary">
                      Degree Certificate
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: theme.palette.success.main,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      ✓ {watch("degreeCertificate")}
                    </Typography>
                  </Grid>
                  
                  <Grid  >
                    <Typography variant="body2" color="text.secondary">
                      Registration Certificate
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: theme.palette.success.main,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      ✓ {watch("registrationCertificate")}
                    </Typography>
                  </Grid>
                  
                  {watch("practiceProof") && (
                    <Grid  >
                      <Typography variant="body2" color="text.secondary">
                        Practice Proof
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: theme.palette.success.main,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        ✓ {watch("practiceProof")}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                About You
              </Typography>
              <Card variant="outlined" sx={{ 
                p: 2,
                borderLeft: `4px solid ${theme.palette.primary.main}`
              }}>
                <CardContent>
                  <Controller
                    name="bio"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        label="Short Bio"
                        placeholder="Tell us about your Ayurvedic journey, your approach to treatment, and any other relevant information..."
                        error={!!errors.bio}
                        helperText={errors.bio?.message || "Max 500 characters"}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </CardContent>
              </Card>
            </Box>
          </Box>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          py: isMobile ? 2 : 6,
          px: isMobile ? 1 : 2,
        }}
      >
        <Container 
          maxWidth="md" 
          sx={{
            width: '100%',
            px: isMobile ? 1 : 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: isMobile ? 2 : 4,
              borderRadius: 4,
              width: "100%",
              boxShadow: theme.shadows[10],
            }}
          >
            {/* Header Section */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  mb: 1,
                }}
              >
                Complete Your Practitioner Profile
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ 
                  maxWidth: 600, 
                  mx: "auto",
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              >
                Help us verify your credentials and showcase your expertise to potential clients
              </Typography>
            </Box>

            {/* Progress Stepper */}
            <Box sx={{ 
              width: "100%", 
              mb: 4,
              overflowX: 'auto',
              '& .MuiStepLabel-label': {
                fontSize: isMobile ? '0.7rem' : '0.875rem'
              }
            }}>
              <Stepper 
                activeStep={activeStep} 
                alternativeLabel
                sx={{
                  minWidth: isMobile ? '600px' : 'auto'
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Form Content */}
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              mt: 4,
              flexDirection: isMobile ? 'column-reverse' : 'row',
              gap: isMobile ? 2 : 0
            }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  width: isMobile ? '100%' : 'auto'
                }}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                  size="large"
                  startIcon={<SaveIcon />}
                  sx={{ 
                    px: 6, 
                    py: 1.5, 
                    fontSize: "1rem",
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  Submit Profile
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  size="large"
                  sx={{ 
                    px: 6, 
                    py: 1.5, 
                    fontSize: "1rem",
                    width: isMobile ? '100%' : 'auto'
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Next
                </Button>
              )}
            </Box>

            {/* Progress Indicator */}
            <Box sx={{ 
              mt: 3, 
              textAlign: "center",
              display: isMobile ? 'none' : 'block'
            }}>
              <Typography variant="caption" color="text.secondary">
                Step {activeStep + 1} of {steps.length}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default ExpertCompleteProfile;
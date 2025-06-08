import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Autocomplete,
  TextField,
  Chip,
  Tabs,
  Tab,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  Fade,
  Grow,
  Slide,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";



import { ayurvedicMedicines } from "@/constants/ayurvedicMedicines";
import { diseasesList } from "@/constants/diseasesList";


interface FilterProps {
  applyFilters: (filters: string) => Promise<void>;
  getAllPosts: () => Promise<void>;
}

export const Filter: FC<FilterProps> = ({ applyFilters, getAllPosts }) => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [activeFilter] = useState("Therapies");
  const [medicines, setMedicines] = useState<string[]>([]);
  const [diseases, setDiseases] = useState<string[]>([]);
  const [loadingDiseases, setLoadingDiseases] = useState(false);
  const [loadingMedicines, setLoadingMedicines] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, boolean>
  >({
    herbs: false,
    routines: false,
    wellnessTips: false,
    diet: false,
    yoga: false,
    detox: false,
    seasonal: false,
  });

  const categories = [
    { id: "herbs", label: "Herbs & Remedies" },
    { id: "routines", label: "Daily Routines" },
    { id: "wellnessTips", label: "Wellness Tips" },
    { id: "diet", label: "Diet & Nutrition" },
    { id: "yoga", label: "Yoga & Pranayama" },
    { id: "detox", label: "Detox & Cleansing" },
    { id: "seasonal", label: "Seasonal Care" },
  ];

  const getAllDiseasesList = () => {
    setLoadingDiseases(true);
    setTimeout(() => {
      setDiseases(diseasesList);
      setLoadingDiseases(false);
    }, 500);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleApplyFilters = async () => {
    try {
      const filters = {
        categories: Object.entries(selectedCategories)
          .filter(([_, value]) => value)
          .map(([key]) => key),
        diseases: selectedDiseases,
        medicines: selectedMedicines,
      };

      const queryString = Object.entries(filters)
        .map(([_key, value]) => value.join(","))
        .filter((filter) => filter !== "")
        .join(",");

      setOpen(false);
      await applyFilters(queryString);
    } catch (err) {
      console.error(err);
    }
  };

  const applyGetAllPosts = async () => {
    try {
      setOpen(false);
      await getAllPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const getAyurvedicMedicinesList = async () => {
    try {
      if (medicines.length > 0) return;
      setLoadingMedicines(true);
      setTimeout(() => {
        setMedicines(ayurvedicMedicines);
        setLoadingMedicines(false);
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          variant="outlined"
          className="border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 hover:text-green-700"
          onClick={() => setOpen(true)}
          sx={{
            px: 3,
            py: 1,
            borderRadius: "8px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            transition: "all 0.3s ease",
          }}
        >
          Filter
        </Button>
      </motion.div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        TransitionComponent={Slide}
        transitionDuration={300}
      >
        <DialogContent className="sm:max-w-lg" sx={{ p: 0 }}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              p: 3,
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <DialogTitle
              sx={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#065f46",
                p: 0,
                mb: 1,
              }}
            >
              Filter Posts
            </DialogTitle>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="filter tabs"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#059669",
                    height: 3,
                  },
                }}
              >
                <Tab
                  label="By Category"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: tabValue === 0 ? "#065f46" : "#6b7280",
                    "&:hover": {
                      color: "#059669",
                      backgroundColor: "rgba(5, 150, 105, 0.08)",
                    },
                  }}
                />
                <Tab
                  label="By Disease"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: tabValue === 1 ? "#065f46" : "#6b7280",
                    "&:hover": {
                      color: "#059669",
                      backgroundColor: "rgba(5, 150, 105, 0.08)",
                    },
                  }}
                />
                <Tab
                  label="By Medicine"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: tabValue === 2 ? "#065f46" : "#6b7280",
                    "&:hover": {
                      color: "#059669",
                      backgroundColor: "rgba(5, 150, 105, 0.08)",
                    },
                  }}
                />
              </Tabs>
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <Fade in={tabValue === 0} timeout={300}>
                <div className="flex h-full">
                  <div className="w-full space-y-6">
                    {activeFilter === "Therapies" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categories.map((category) => (
                          <motion.div
                            key={category.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedCategories[category.id]}
                                  onChange={() =>
                                    handleCategoryChange(category.id)
                                  }
                                  color="primary"
                                  sx={{
                                    color: "#059669",
                                    "&.Mui-checked": {
                                      color: "#059669",
                                    },
                                    "&:hover": {
                                      backgroundColor: "rgba(5, 150, 105, 0.08)",
                                    },
                                  }}
                                />
                              }
                              label={
                                <span className="text-gray-700">
                                  {category.label}
                                </span>
                              }
                              sx={{
                                "& .MuiFormControlLabel-label": {
                                  fontSize: "0.9rem",
                                  fontWeight: 500,
                                },
                                backgroundColor: selectedCategories[category.id]
                                  ? "#f0fdf4"
                                  : "transparent",
                                borderRadius: "8px",
                                px: 2,
                                py: 1,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  backgroundColor: "rgba(5, 150, 105, 0.05)",
                                },
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Fade>
            )}

            {tabValue === 1 && (
              <Grow in={tabValue === 1} timeout={300}>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Select diseases to filter relevant Ayurvedic posts:
                  </p>
                  <Autocomplete
                    multiple
                    loading={loadingDiseases}
                    options={diseases}
                    value={selectedDiseases}
                    onChange={(_event, newValue) => {
                      setSelectedDiseases(newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            className="m-1"
                            sx={{
                              backgroundColor: "#f0fdf4",
                              borderColor: "#059669",
                              color: "#059669",
                              "&:hover": {
                                backgroundColor: "#dcfce7",
                              },
                            }}
                          />
                        </motion.div>
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select Diseases"
                        placeholder="Search diseases..."
                        onFocus={getAllDiseasesList}
                        InputProps={{
                          ...params.InputProps,
                          sx: {
                            borderRadius: "8px",
                            "&:hover fieldset": {
                              borderColor: "#059669 !important",
                            },
                          },
                          endAdornment: (
                            <>
                              {loadingDiseases ? (
                                <CircularProgress
                                  color="success"
                                  size={20}
                                  sx={{ mr: 1 }}
                                />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </div>
              </Grow>
            )}

            {tabValue === 2 && (
              <Fade in={tabValue === 2} timeout={300}>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Select medicines to filter related Ayurvedic content:
                  </p>
                  <Autocomplete
                    multiple
                    loading={loadingMedicines}
                    options={medicines}
                    value={selectedMedicines}
                    onChange={(_event, newValue) => {
                      setSelectedMedicines(newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            className="m-1"
                            sx={{
                              backgroundColor: "#ecfdf5",
                              borderColor: "#10b981",
                              color: "#10b981",
                              "&:hover": {
                                backgroundColor: "#d1fae5",
                              },
                            }}
                          />
                        </motion.div>
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select Medicines"
                        placeholder="Search medicines..."
                        onFocus={getAyurvedicMedicinesList}
                        InputProps={{
                          ...params.InputProps,
                          sx: {
                            borderRadius: "8px",
                            "&:hover fieldset": {
                              borderColor: "#10b981 !important",
                            },
                          },
                          endAdornment: (
                            <>
                              {loadingMedicines ? (
                                <CircularProgress
                                  color="success"
                                  size={20}
                                  sx={{ mr: 1 }}
                                />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </div>
              </Fade>
            )}

            <DialogActions
              sx={{
                mt: 4,
                px: 0,
                justifyContent: "space-between",
              }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outlined"
                  onClick={applyGetAllPosts}
                  sx={{
                    color: "#6b7280",
                    borderColor: "#e5e7eb",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                      borderColor: "#d1d5db",
                    },
                  }}
                >
                  Reset Filters
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="contained"
                  onClick={handleApplyFilters}
                  sx={{
                    backgroundColor: "#059669",
                    color: "white",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#047857",
                    },
                  }}
                >
                  Apply Filters
                </Button>
              </motion.div>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
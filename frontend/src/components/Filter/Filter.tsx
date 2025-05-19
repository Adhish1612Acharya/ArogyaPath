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
} from "@mui/material";
import { Button } from "@/components/ui/button";

interface FilterProps {
  applyFilters: (filters: string) => Promise<void>;
  getAllPosts: () => Promise<void>;
}

export const Filter: FC<FilterProps> = ({ applyFilters, getAllPosts }) => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("Therapies");

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

  const diseases = [
    "Diabetes",
    "Hypertension",
    "Arthritis",
    "Asthma",
    "Migraine",
    "Digestive Disorders",
    "Skin Diseases",
    "Respiratory Issues",
  ];

  const medicines = [
    "Ashwagandha",
    "Turmeric",
    "Giloy",
    "Neem",
    "Tulsi",
    "Amla",
    "Shilajit",
    "Brahmi",
  ];

  const categories = [
    { id: "herbs", label: "Herbs & Remedies" },
    { id: "routines", label: "Daily Routines" },
    { id: "wellnessTips", label: "Wellness Tips" },
    { id: "diet", label: "Diet & Nutrition" },
    { id: "yoga", label: "Yoga & Pranayama" },
    { id: "detox", label: "Detox & Cleansing" },
    { id: "seasonal", label: "Seasonal Care" },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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

      // Convert each filter array to comma-separated string
      const queryString = Object.entries(filters)
        .map(([_key, value]) => value.join(","))
        .filter((filter) => {
          return filter !== "";
        })
        .join(",");

      setOpen(false);

      await applyFilters(queryString);
    } catch (err: any) {
      console.log(err);
    }
  };

  const applyGetAllPosts = async () => {
    try {
      setOpen(false);

      await getAllPosts();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="border-green-600 text-green-600 hover:bg-green-50"
        onClick={() => setOpen(true)}
      >
        Filter
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogContent className="sm:max-w-lg">
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Filter Posts
          </DialogTitle>

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="filter tabs"
            >
              <Tab
                label="By Category"
                sx={{ textTransform: "none", fontWeight: 500 }}
              />
              <Tab
                label="By Disease"
                sx={{ textTransform: "none", fontWeight: 500 }}
              />
              <Tab
                label="By Medicine"
                sx={{ textTransform: "none", fontWeight: 500 }}
              />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <div className="flex h-full">
              {/* Left Column: Filter Categories */}

              {/* Right Column: Filter Options */}
              <div className="w-3/4 pl-6 space-y-6">
                {activeFilter === "Therapies" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <FormControlLabel
                        key={category.id}
                        control={
                          <Checkbox
                            checked={selectedCategories[category.id]}
                            onChange={() =>
                              setSelectedCategories((prev) => ({
                                ...prev,
                                [category.id]: !prev[category.id],
                              }))
                            }
                            color="primary"
                            sx={{
                              color: "#059669",
                              "&.Mui-checked": {
                                color: "#059669",
                              },
                            }}
                          />
                        }
                        label={category.label}
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.875rem",
                          },
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tabValue === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Select diseases to filter relevant Ayurvedic posts:
              </p>
              <Autocomplete
                multiple
                options={diseases}
                value={selectedDiseases}
                onChange={(event, newValue) => {
                  setSelectedDiseases(newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      className="m-1"
                      sx={{
                        backgroundColor: "#f0fdf4",
                        borderColor: "#059669",
                        color: "#059669",
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select Diseases"
                    placeholder="Search diseases..."
                  />
                )}
              />
            </div>
          )}

          {tabValue === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Select medicines to filter related Ayurvedic content:
              </p>
              <Autocomplete
                multiple
                options={medicines}
                value={selectedMedicines}
                onChange={(event, newValue) => {
                  setSelectedMedicines(newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      className="m-1"
                      sx={{
                        backgroundColor: "#ecfdf5",
                        borderColor: "#10b981",
                        color: "#10b981",
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select Medicines"
                    placeholder="Search medicines..."
                  />
                )}
              />
            </div>
          )}

          <DialogActions className="mt-6">
            <Button
              variant="outline"
              onClick={applyGetAllPosts}
              className="text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Apply Filters
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

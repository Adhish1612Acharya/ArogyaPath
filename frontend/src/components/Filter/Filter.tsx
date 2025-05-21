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
} from "@mui/material";
// import useApi from "@/hooks/useApi/useApi";

import { ayurvedicMedicines } from "@/constants/ayurvedicMedicines";
import { diseasesList } from "@/constants/diseasesList";

interface FilterProps {
  applyFilters: (filters: string) => Promise<void>;
  getAllPosts: () => Promise<void>;
}

export const Filter: FC<FilterProps> = ({ applyFilters, getAllPosts }) => {
  // const { get } = useApi();

  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [activeFilter, _setActiveFilter] = useState("Therapies");
  const [medicines, setMedicines] = useState<string[]>([]);
  const [diseases, setDiseases] = useState<string[]>([]);

  // const [inputValue, setInputValue] = useState<string>("");

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

  const [_loadingDiseases, setLoadingDiseases] = useState<boolean>(false);

  // const diseases = [
  //   "Diabetes",
  //   "Hypertension",
  //   "Arthritis",
  //   "Asthma",
  //   "Migraine",
  //   "Digestive Disorders",
  //   "Skin Diseases",
  //   "Respiratory Issues",
  // ];

  const categories = [
    { id: "herbs", label: "Herbs & Remedies" },
    { id: "routines", label: "Daily Routines" },
    { id: "wellnessTips", label: "Wellness Tips" },
    { id: "diet", label: "Diet & Nutrition" },
    { id: "yoga", label: "Yoga & Pranayama" },
    { id: "detox", label: "Detox & Cleansing" },
    { id: "seasonal", label: "Seasonal Care" },
  ];

  // const getAllDiseasesList = async (query: string) => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_DISEASE_API}?terms=${query}`
  //     );
  //     setDiseases(response.data[3]);
  //   } catch (err: any) {
  //     console.log(err);
  //   }
  // };

  // // Debounced API call
  // const getAllDiseasesList = debounce(async (query: string) => {
  //   try {
  //     if (!query.trim()) {
  //       setDiseases([]);
  //       return;
  //     }
  //     setLoadingDiseases(true);

  //     // const response = await axios.get(
  //     //   `${import.meta.env.VITE_DISEASE_API}?terms=${query}`
  //     // );
  //     setDiseases(diseasesList);
  //   } catch (err) {
  //     console.error("Error fetching diseases:", err);
  //     setDiseases([]);
  //   } finally {
  //     setLoadingDiseases(false);
  //   }
  // }, 300); // 300ms debounce delay

  // Debounced API call
  const getAllDiseasesList = () => {
    setLoadingDiseases(true);

    // const response = await axios.get(
    //   `${import.meta.env.VITE_DISEASE_API}?terms=${query}`
    // );
    setDiseases(diseasesList);
  };

  // // Trigger API call when input changes
  // useEffect(() => {
  //   getAllDiseasesList(inputValue);
  //   // Cleanup debounce on unmount
  //   return () => getAllDiseasesList.cancel();
  // }, [inputValue]);

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

  const getAyurvedicMedicinesList = async () => {
    try {
      if (medicines.length > 0) return null;
      // console.log("Medicines");
      // const data = await get(import.meta.env.VITE_AYURVEDIC_MEDICINE);
      // const response = await axios.get(
      //   "https://ayurvedic-medcine-list.onrender.com/api/medicines"
      // );
      // if (response) {
      //   setMedicines(response.data);
      // } else {
      setMedicines(ayurvedicMedicines);
      // }
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <>
      <Button
        variant="contained"
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
                            onChange={() => handleCategoryChange(category.id)}
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
                // loading={loadingDiseases}
                options={diseases}
                value={selectedDiseases}
                onChange={(_event, newValue) => {
                  setSelectedDiseases(newValue);
                }}
                // inputValue={inputValue}
                // onInputChange={(_event, newInputValue) => {
                //   setInputValue(newInputValue);
                // }}
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
                    onFocus={getAllDiseasesList}
                    // InputProps={{
                    //   ...params.InputProps,
                    //   endAdornment: (
                    //     <>
                    //       {loadingDiseases ? (
                    //         <CircularProgress color="inherit" size={20} />
                    //       ) : null}
                    //       {params.InputProps.endAdornment}
                    //     </>
                    //   ),
                    // }}
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
                onChange={(_event, newValue) => {
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
                    onFocus={getAyurvedicMedicinesList}
                  />
                )}
              />
            </div>
          )}

          <DialogActions className="mt-6">
            <Button
              // variant="outline"
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

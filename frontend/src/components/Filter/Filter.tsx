import { useState } from 'react';
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
  FormControlLabel
} from '@mui/material';
import { Button } from '@/components/ui/button';

export const Filter = () => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('Therapies');

  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({
    Panchakarma: false,
    Shirodhara: false,
    Abhyanga: false,
    Nasya: false,
    Dinacharya: false,
    Ratricharya: false,
    Ritucharya: false,
    vata: false,
    pitta: false,
    kapha: false,
    'Sattvic Diet': false,
    'Spicy Foods': false,
    'Cooling Foods': false,
    'Detox Recipes': false
  });
  
  

  const diseases = [
    'Diabetes',
    'Hypertension',
    'Arthritis',
    'Asthma',
    'Migraine',
    'Digestive Disorders',
    'Skin Diseases',
    'Respiratory Issues'
  ];

  const medicines = [
    'Ashwagandha',
    'Turmeric',
    'Giloy',
    'Neem',
    'Tulsi',
    'Amla',
    'Shilajit',
    'Brahmi'
  ];

  const categories = [
    { id: 'herbs', label: 'Herbs & Remedies' },
    { id: 'routines', label: 'Daily Routines' },
    { id: 'wellnessTips', label: 'Wellness Tips' },
    { id: 'diet', label: 'Diet & Nutrition' },
    { id: 'yoga', label: 'Yoga & Pranayama' },
    { id: 'detox', label: 'Detox & Cleansing' },
    { id: 'seasonal', label: 'Seasonal Care' }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applied Filters:', {
      categories: Object.entries(selectedCategories)
        .filter(([_, value]) => value)
        .map(([key]) => key),
      diseases: selectedDiseases,
      medicines: selectedMedicines
    });
    setOpen(false);
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
      
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogContent className="sm:max-w-lg">
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Filter Posts
          </DialogTitle>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="filter tabs">
              <Tab label="By Category" sx={{ textTransform: 'none', fontWeight: 500 }} />
              <Tab label="By Disease" sx={{ textTransform: 'none', fontWeight: 500 }} />
              <Tab label="By Medicine" sx={{ textTransform: 'none', fontWeight: 500 }} />
            </Tabs>
          </Box>

          {tabValue === 0 && (
  <div className="flex h-full">
    {/* Left Column: Filter Categories */}
    <div className="w-1/4 border-r pr-4">
      <ul className="space-y-2 text-sm text-gray-700 font-medium">
        {[
          'Therapies',
          'Lifestyle Type',
          'Dominant Dosha',
          'Diet & Food',
        ].map((category) => (
          <li
            key={category}
            className={`cursor-pointer px-3 py-2 rounded hover:bg-gray-100 ${
              activeFilter === category ? 'bg-gray-100 font-semibold' : ''
            }`}
            onClick={() => setActiveFilter(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>

    {/* Right Column: Filter Options */}
    <div className="w-3/4 pl-6 space-y-6">
      {activeFilter === 'Therapies' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {['Panchakarma', 'Shirodhara', 'Abhyanga', 'Nasya'].map((therapy) => (
            <FormControlLabel
              key={therapy}
              control={
                <Checkbox
                  checked={selectedCategories[therapy]}
                  onChange={() =>
                    setSelectedCategories((prev) => ({
                      ...prev,
                      [therapy]: !prev[therapy],
                    }))
                  }
                  color="primary"
                  sx={{
                    color: '#059669',
                    '&.Mui-checked': {
                      color: '#059669',
                    },
                  }}
                />
              }
              label={therapy}
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
            />
          ))}
        </div>
      )}

      {activeFilter === 'Lifestyle Type' && (
        <div className="flex flex-wrap gap-4">
          {['Dinacharya', 'Ratricharya', 'Ritucharya'].map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={selectedCategories[type]}
                  onChange={() =>
                    setSelectedCategories((prev) => ({
                      ...prev,
                      Dinacharya: false,
                      Ratricharya: false,
                      Ritucharya: false,
                      [type]: true,
                    }))
                  }
                  color="primary"
                  sx={{
                    color: '#059669',
                    '&.Mui-checked': {
                      color: '#059669',
                    },
                  }}
                />
              }
              label={type}
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
            />
          ))}
        </div>
      )}

{activeFilter === 'Dominant Dosha' && (
  <div className="space-y-4">
    <h4 className="font-medium">Select Dominant Dosha</h4>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {['Vata', 'Pitta', 'Kapha'].map((dosha) => (
        <FormControlLabel
          key={dosha}
          control={
            <Checkbox
              checked={selectedCategories[dosha.toLowerCase()]}
              onChange={() =>
                setSelectedCategories((prev) => ({
                  ...prev,
                  vata: false,
                  pitta: false,
                  kapha: false,
                  [dosha.toLowerCase()]: true,
                }))
              }
              color="primary"
              sx={{
                color: '#059669',
                '&.Mui-checked': {
                  color: '#059669',
                },
              }}
            />
          }
          label={dosha}
          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
        />
      ))}
    </div>
  </div>
)}

      {activeFilter === 'Diet & Food' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {['Sattvic Diet', 'Spicy Foods', 'Cooling Foods', 'Detox Recipes'].map((item) => (
            <FormControlLabel
              key={item}
              control={
                <Checkbox
                  checked={selectedCategories[item]}
                  onChange={() =>
                    setSelectedCategories((prev) => ({
                      ...prev,
                      [item]: !prev[item],
                    }))
                  }
                  color="primary"
                  sx={{
                    color: '#059669',
                    '&.Mui-checked': {
                      color: '#059669',
                    },
                  }}
                />
              }
              label={item}
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
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
                        backgroundColor: '#f0fdf4',
                        borderColor: '#059669',
                        color: '#059669'
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
                        backgroundColor: '#ecfdf5',
                        borderColor: '#10b981',
                        color: '#10b981'
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
              onClick={() => setOpen(false)}
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
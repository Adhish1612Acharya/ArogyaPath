import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'; 
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';

const sections = [
  ['Name', 'Age', 'Gender', 'Height (cm)', 'Weight (kg)'],
  ['Body Type', 'Skin Type', 'Hair Type', 'Facial Structure', 'Complexion'],
  ['Eyes', 'Food Preference', 'Bowel Movement', 'Thirst Level', 'Sleep Duration (Hours)'],
  ['Sleep Quality', 'Energy Levels', 'Daily Activity Level', 'Exercise Routine', 'Food Habit'],
  ['Water Intake (Litres per day)', 'Health Issues', 'Hormonal Imbalance', 'Skin/Hair Problems', 'Ayurvedic Treatment Preference']
];

const options = {
  Gender: ['Male', 'Female', 'Other'],
  'Body Type': ['Heavy', 'Lean', 'Medium'],
  'Skin Type': ['Dry', 'Normal', 'Oily'],
  'Hair Type': ['Curly', 'Straight', 'Wavy'],
  'Facial Structure': ['Oval', 'Round', 'Square'],
  Complexion: ['Dark', 'Fair', 'Wheatish'],
  Eyes: ['Large', 'Medium', 'Small'],
  'Food Preference': ['Non-Veg', 'Vegan', 'Veg'],
  'Bowel Movement': ['Irregular', 'Regular'],
  'Thirst Level': ['High', 'Low', 'Medium'],
  'Sleep Quality': ['Average', 'Good', 'Poor'],
  'Energy Levels': ['High', 'Low', 'Medium'],
  'Daily Activity Level': ['High', 'Low', 'Medium'],
  'Exercise Routine': ['Intense', 'Light', 'Moderate', 'Sedentary'],
  'Food Habit': ['Balanced', 'Fast Food', 'Home Cooked'],
  'Water Intake (Litres per day)': ['1', '1.5', '2', '3'],
  'Health Issues': ['Diabetes', 'Digestive Issues', 'Hypertension', 'None'],
  'Hormonal Imbalance': ['Yes', 'No'],
  'Skin/Hair Problems': ['Acne', 'Dandruff', 'Hairfall', 'None'],
  'Ayurvedic Treatment Preference': ['Yes', 'No']
};

const initialData: Record<string, string | number> = {
  Name: '', Age: '', Gender: '', Height: '', Weight: '',
  'Body Type': '', 'Skin Type': '', 'Hair Type': '', 'Facial Structure': '', 'Complexion': '',
  Eyes: '', 'Food Preference': '', 'Bowel Movement': '', 'Thirst Level': '', 'Sleep Duration (Hours)': '',
  'Sleep Quality': '', 'Energy Levels': '', 'Daily Activity Level': '', 'Exercise Routine': '', 'Food Habit': '',
  'Water Intake (Litres per day)': '', 'Health Issues': '', 'Hormonal Imbalance': '', 'Skin/Hair Problems': '', 'Ayurvedic Treatment Preference': ''
};

export default function PrakritiForm() {
  const [formData, setFormData] = useState(initialData);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(''); // Clear error when user makes changes
  };

  const validateSection = () => {
    const currentSection = sections[sectionIndex];
    for (const field of currentSection) {
      if (!formData[field]) {
        setError(`Please fill out the ${field.toLowerCase()} field.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateSection()) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/analyze', formData);
      navigate(`/result?reportId=${response.data.reportId}`);
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (validateSection()) {
      setSectionIndex(sectionIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-green-600">
        <Loader className="animate-spin h-12 w-12" />
        <p className="mt-4 text-xl">Analyzing your data...</p>
      </div>
    );
  }

  return (
  
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">      <Card className="w-full max-w-6xl h-full shadow-2xl border rounded-lg bg-white">
        <CardHeader className="text-center p-8 border-b">
          <CardTitle className="text-4xl text-green-600 font-bold">Prakriti Analysis</CardTitle>
          <Progress
            value={((sectionIndex + 1) / sections.length) * 100}
            className="mt-3 bg-gray-300"
          />
        </CardHeader>
        <CardContent className="space-y-8 p-8 h-full">
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections[sectionIndex].map((field) => (
              <div key={field} className="space-y-1">
                <Label className="font-medium text-gray-700">{field}</Label>
                {options[field] ? (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button className="w-full border px-3 py-2 text-left">{formData[field] || `Select ${field}`}</Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="bg-white rounded shadow-md">
                      {options[field].map((option) => (
                        <DropdownMenu.Item
                          key={option}
                          onClick={() => handleChange(field, option)}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {option}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                ) : (
                  <Input
                    type={field === 'Age' || field === 'Height (cm)' || field === 'Weight (kg)' || field === 'Sleep Duration (Hours)' ? 'number' : 'text'}
                    value={formData[field] as string}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={`Enter your ${field.toLowerCase()}`}
                    className="border rounded-md px-3 py-2 focus:ring-green-400 focus:border-green-400"
                    required
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-8">
            {sectionIndex > 0 && (
              <Button
                onClick={() => setSectionIndex(sectionIndex - 1)}
                className="bg-green-500 text-white hover:bg-green-600 focus:ring focus:ring-green-300"
              >
                Previous
              </Button>
            )}
            {sectionIndex < sections.length - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-green-500 text-white hover:bg-green-600 focus:ring focus:ring-green-300"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-blue-500 text-white hover:bg-blue-600 focus:ring focus:ring-blue-300"
              >
                Submit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
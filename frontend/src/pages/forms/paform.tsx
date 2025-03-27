import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      <div className="flex flex-col items-center justify-center min-h-screen text-green-600">
        <Loader className="animate-spin h-12 w-12" />
        <p className="mt-4 text-xl">Analyzing your data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-12">
      <Card className="w-full max-w-5xl shadow-lg border rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-gray-800 font-bold">Prakriti Analysis</CardTitle>
          <Progress
            value={((sectionIndex + 1) / sections.length) * 100}
            className="mt-2 bg-gray-200"
          />
        </CardHeader>
        <CardContent className="space-y-6 px-8 py-8">
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sections[sectionIndex].map((field) => (
              <div key={field} className="space-y-1">
                <Label className="font-medium text-gray-700">{field}</Label>
                <Input
                  value={formData[field] as string}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={`Enter your ${field.toLowerCase()}`}
                  className="border rounded-md px-3 py-2 focus:ring-green-400 focus:border-green-400"
                  required
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
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
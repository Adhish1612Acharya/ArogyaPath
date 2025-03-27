import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { PDFDocument, rgb,StandardFonts } from "pdf-lib";

const sections = [
  ["Name", "Age", "Gender", "Height", "Weight"],
  ["Body_Type", "Skin_Type", "Hair_Type", "Facial_Structure", "Complexion"],
  [
    "Eyes",
    "Food_Preference",
    "Bowel_Movement",
    "Thirst_Level",
    "Sleep_Duration",
  ],
  [
    "Sleep_Quality",
    "Energy_Levels",
    "Daily_Activity_Level",
    "Exercise_Routine",
    "Food_Habit",
  ],
  [
    "Water_Intake",
    "Health_Issues",
    "Hormonal_Imbalance",
    "Skin_Hair_Problems",
    "Ayurvedic_Treatment",
  ],
];

const options = {
  Gender: ["Male", "Female", "Other"],
  Body_Type: ["Heavy", "Lean", "Medium"],
  Skin_Type: ["Dry", "Normal", "Oily"],
  Hair_Type: ["Curly", "Straight", "Wavy"],
  Facial_Structure: ["Oval", "Round", "Square"],
  Complexion: ["Dark", "Fair", "Wheatish"],
  Eyes: ["Large", "Medium", "Small"],
  Food_Preference: ["Non-Veg", "Vegan", "Veg"],
  Bowel_Movement: ["Irregular", "Regular"],
  Thirst_Level: ["High", "Low", "Medium"],
  Sleep_Quality: ["Average", "Good", "Poor"],
  Energy_Levels: ["High", "Low", "Medium"],
  Daily_Activity_Level: ["High", "Low", "Medium"],
  Exercise_Routine: ["Intense", "Light", "Moderate", "Sedentary"],
  Food_Habit: ["Balanced", "Fast Food", "Home Cooked"],
  Water_Intake: ["1", "1.5", "2", "3"],
  Health_Issues: ["Diabetes", "Digestive Issues", "Hypertension", "None"],
  Hormonal_Imbalance: ["Yes", "No"],
  Skin_Hair_Problems: ["Acne", "Dandruff", "Hairfall", "None"],
  Ayurvedic_Treatment: ["Yes", "No"],
};

const initialData: Record<string, string | number> = {
  Name: "",
  Age: 0,
  Gender: "",
  Height: 0,
  Weight: 0,
  Body_Type: "",
  Skin_Type: "",
  Hair_Type: "",
  Facial_Structure: "",
  Complexion: "",
  Eyes: "",
  Food_Preference: "",
  Bowel_Movement: "",
  Thirst_Level: "",
  Sleep_Duration: 0,
  Sleep_Quality: "",
  Energy_Levels: "",
  Daily_Activity_Level: "",
  Exercise_Routine: "",
  Food_Habit: "",
  Water_Intake: "",
  Health_Issues: "",
  Hormonal_Imbalance: "",
  Skin_Hair_Problems: "",
  Ayurvedic_Treatment: "",
};

export default function PrakritiForm() {
  const [formData, setFormData] = useState(initialData);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (key: string, value: string | number) => {
    console.log("Key : ", key);
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(""); // Clear error when user makes changes
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

 
async function generatePDF(responseData: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  let y = height - 50; // Start position for text

  const drawText = (text: string) => {
    page.drawText(text, { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
    y -= 20; // Move to next line
  };

  // Header
  page.drawText("Health Report", {
    x: width / 2 - 50,
    y: height - 30,
    size: 16,
    font,
    color: rgb(0, 0, 1),
  });

  y -= 40;

  // Basic Info
  drawText(`Name: ${responseData.Name}`);
  drawText(`Age: ${responseData.Age}`);
  drawText(`Gender: ${responseData.Gender}`);
  drawText(`Dominant Prakrithi: ${responseData.Dominant_Prakrithi}`);

  y -= 10;

  // Body Constituents
  drawText("Body Constituents:");
  Object.entries(responseData.Body_Constituents).forEach(([key, value]) => {
    drawText(`  - ${key.replace(/_/g, " ")}: ${value}`);
  });

  y -= 10;

  // Potential Health Concerns
  drawText("Potential Health Concerns:");
  responseData.Potential_Health_Concerns.forEach((concern: string) => {
    drawText(`  - ${concern}`);
  });

  y -= 10;

  // Recommendations
  drawText("Recommendations:");

  // Dietary Guidelines
  drawText("  - Dietary Guidelines:");
  responseData.Recommendations.Dietary_Guidelines.forEach((item: string) => {
    drawText(`    • ${item}`);
  });

  // Lifestyle Suggestions
  drawText("  - Lifestyle Suggestions:");
  responseData.Recommendations.Lifestyle_Suggestions.forEach((item: string) => {
    drawText(`    • ${item}`);
  });

  // Ayurvedic Herbs & Remedies
  drawText("  - Ayurvedic Herbs & Remedies:");
  Object.entries(responseData.Recommendations.Ayurvedic_Herbs_Remedies).forEach(
    ([key, values]) => {
      drawText(`    • ${key.replace(/_/g, " ")}: ${(values as string[]).join(", ")}`);
    }
  );

  // Save and trigger download
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = responseData.Name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
  

  

  const handleSubmit = async () => {
    if (!validateSection()) return;

    setLoading(true);
    try {
      // const jsonData:any=JSON.stringify(formData);

      formData.Height = parseFloat(formData.Height as string);
      formData.Weight = parseFloat(formData.Weight as string);
      formData.Age = parseInt(formData.Age as string);
      formData.Sleep_Duration = parseFloat(formData.Sleep_Duration as string);

      console.log("Form Data : ", formData);

      //  const dataTp= {
      //     "Name": "John Doe",
      //     "Age": 30,
      //     "Gender": "Male",
      //     "Height": 175.0,
      //     "Weight": 75.0,
      //     "Body_Type": "Medium",
      //     "Skin_Type": "Oily",
      //     "Hair_Type": "Thick",
      //     "Facial_Structure": "Square",
      //     "Complexion": "Fair",
      //     "Eyes": "Large",
      //     "Food_Preference": "Vegetarian",
      //     "Bowel_Movement": "Regular",
      //     "Thirst_Level": "High",
      //     "Sleep_Duration": 7.0,
      //     "Sleep_Quality": "Disturbed",
      //     "Energy_Levels": "Moderate",
      //     "Daily_Activity_Level": "Moderate",
      //     "Exercise_Routine": "Yoga",
      //     "Food_Habit": "Balanced",
      //     "Water_Intake": "2.5",
      //     "Health_Issues": "Acidity",
      //     "Hormonal_Imbalance": "No",
      //     "Skin_Hair_Problems": "Acne",
      //     "Ayurvedic_Treatment": "Yes"
      // }

      // const data=dataTp;

      // console.log("Data : ",data);

      const response = await axios.post(
        "https://prakritianalysis.onrender.com/generate_pdf/",
        formData
      );
      console.log(response.data);
      generatePDF(response.data);
    } catch (error) {
      console.error("Submission failed", error);
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      {" "}
      <Card className="w-full max-w-6xl h-full shadow-2xl border rounded-lg bg-white">
        <CardHeader className="text-center p-8 border-b">
          <CardTitle className="text-4xl text-green-600 font-bold">
            Prakriti Analysis
          </CardTitle>
          <Progress
            value={((sectionIndex + 1) / sections.length) * 100}
            className="mt-3 bg-gray-300"
          />
        </CardHeader>
        <CardContent className="space-y-8 p-8 h-full">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections[sectionIndex].map((field) => (
              <div key={field} className="space-y-1">
                <Label className="font-medium text-gray-700">{field}</Label>
                {options[field] ? (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button className="w-full border px-3 py-2 text-left">
                        {formData[field] || `Select ${field}`}
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="bg-white rounded shadow-md">
                      {(options[field] as any)?.map((option: any) => (
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
                    type={
                      field === "Age" ||
                      field === "Height" ||
                      field === "Weight" ||
                      field === "Sleep_Duration"
                        ? "number"
                        : "text"
                    }
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

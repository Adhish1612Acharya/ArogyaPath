import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

// Type definitions
type FormFieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "select";
  options?: string[];
  section: number;
  required?: boolean;
};

type FormValues = {
  [key: string]: string | number;
};

type ApiResponse = {
  Name: string;
  Age: number;
  Gender: string;
  Dominant_Prakrithi: string;
  Body_Constituents: Record<string, string>;
  Potential_Health_Concerns: string[];
  Recommendations: {
    Dietary_Guidelines: string[];
    Lifestyle_Suggestions: string[];
    Ayurvedic_Herbs_Remedies: Record<string, string[]>;
  };
};

// Form configuration - all fields organized with their metadata
const FORM_FIELDS: FormFieldConfig[] = [
  // Section 1: Basic Information
  { name: "Name", label: "Name", type: "text", section: 1, required: true },
  { name: "Age", label: "Age", type: "number", section: 1, required: true },
  {
    name: "Gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Other"],
    section: 1,
    required: true,
  },
  {
    name: "Height",
    label: "Height (cm)",
    type: "number",
    section: 1,
    required: true,
  },
  {
    name: "Weight",
    label: "Weight (kg)",
    type: "number",
    section: 1,
    required: true,
  },

  // Section 2: Physical Characteristics
  {
    name: "Body_Type",
    label: "Body Type",
    type: "select",
    options: ["Heavy", "Lean", "Medium"],
    section: 2,
    required: true,
  },
  {
    name: "Skin_Type",
    label: "Skin Type",
    type: "select",
    options: ["Dry", "Normal", "Oily"],
    section: 2,
    required: true,
  },
  {
    name: "Hair_Type",
    label: "Hair Type",
    type: "select",
    options: ["Curly", "Straight", "Wavy"],
    section: 2,
    required: true,
  },
  {
    name: "Facial_Structure",
    label: "Facial Structure",
    type: "select",
    options: ["Oval", "Round", "Square"],
    section: 2,
    required: true,
  },
  {
    name: "Complexion",
    label: "Complexion",
    type: "select",
    options: ["Dark", "Fair", "Wheatish"],
    section: 2,
    required: true,
  },

  // Section 3: Lifestyle and Habits
  {
    name: "Eyes",
    label: "Eyes",
    type: "select",
    options: ["Large", "Medium", "Small"],
    section: 3,
    required: true,
  },
  {
    name: "Food_Preference",
    label: "Food Preference",
    type: "select",
    options: ["Non-Veg", "Vegan", "Veg"],
    section: 3,
    required: true,
  },
  {
    name: "Bowel_Movement",
    label: "Bowel Movement",
    type: "select",
    options: ["Irregular", "Regular"],
    section: 3,
    required: true,
  },
  {
    name: "Thirst_Level",
    label: "Thirst Level",
    type: "select",
    options: ["High", "Low", "Medium"],
    section: 3,
    required: true,
  },
  {
    name: "Sleep_Duration",
    label: "Sleep Duration (hours)",
    type: "number",
    section: 3,
    required: true,
  },

  // Section 4: Daily Routine
  {
    name: "Sleep_Quality",
    label: "Sleep Quality",
    type: "select",
    options: ["Average", "Good", "Poor"],
    section: 4,
    required: true,
  },
  {
    name: "Energy_Levels",
    label: "Energy Levels",
    type: "select",
    options: ["High", "Low", "Medium"],
    section: 4,
    required: true,
  },
  {
    name: "Daily_Activity_Level",
    label: "Daily Activity Level",
    type: "select",
    options: ["High", "Low", "Medium"],
    section: 4,
    required: true,
  },
  {
    name: "Exercise_Routine",
    label: "Exercise Routine",
    type: "select",
    options: ["Intense", "Light", "Moderate", "Sedentary"],
    section: 4,
    required: true,
  },
  {
    name: "Food_Habit",
    label: "Food Habit",
    type: "select",
    options: ["Balanced", "Fast Food", "Home Cooked"],
    section: 4,
    required: true,
  },

  // Section 5: Health Information
  {
    name: "Water_Intake",
    label: "Water Intake (liters)",
    type: "select",
    options: ["1", "1.5", "2", "3"],
    section: 5,
    required: true,
  },
  {
    name: "Health_Issues",
    label: "Health Issues",
    type: "select",
    options: ["Diabetes", "Digestive Issues", "Hypertension", "None"],
    section: 5,
    required: true,
  },
  {
    name: "Hormonal_Imbalance",
    label: "Hormonal Imbalance",
    type: "select",
    options: ["Yes", "No"],
    section: 5,
    required: true,
  },
  {
    name: "Skin_Hair_Problems",
    label: "Skin/Hair Problems",
    type: "select",
    options: ["Acne", "Dandruff", "Hairfall", "None"],
    section: 5,
    required: true,
  },
  {
    name: "Ayurvedic_Treatment",
    label: "Ayurvedic Treatment",
    type: "select",
    options: ["Yes", "No"],
    section: 5,
    required: true,
  },
];

// Calculate total sections from form fields
const TOTAL_SECTIONS = Math.max(...FORM_FIELDS.map((field) => field.section));

export default function PrakritiForm() {
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);

  // Initialize react-hook-form
  const form = useForm<FormValues>({
    defaultValues: FORM_FIELDS.reduce((acc, field) => {
      acc[field.name] = field.type === "number" ? 0 : "";
      return acc;
    }, {} as FormValues),
  });

  /**
   * Filters form fields for the current section
   */
  const getCurrentSectionFields = () => {
    return FORM_FIELDS.filter((field) => field.section === currentSection);
  };

  /**
   * Handles moving to the next section with validation
   */
  const handleNext = async () => {
    // Validate current section fields
    const currentFields = getCurrentSectionFields();
    const isValid = await form.trigger(currentFields.map((f) => f.name));

    if (isValid && currentSection < TOTAL_SECTIONS) {
      setCurrentSection(currentSection + 1);
    }
  };

  const generatePDF = async (responseData: ApiResponse) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    let y = height - 50; // Start position for text

    const drawText = (text: string) => {
      page.drawText(text, {
        x: 50,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
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
    responseData.Recommendations.Lifestyle_Suggestions.forEach(
      (item: string) => {
        drawText(`    • ${item}`);
      }
    );

    // Ayurvedic Herbs & Remedies
    drawText("  - Ayurvedic Herbs & Remedies:");
    // Check if it's an array or object
    if (Array.isArray(responseData.Recommendations.Ayurvedic_Herbs_Remedies)) {
      responseData.Recommendations.Ayurvedic_Herbs_Remedies.forEach(
        (item: string) => {
          drawText(`    • ${item}`);
        }
      );
    } else {
      // Handle object case if needed
      Object.entries(
        responseData.Recommendations.Ayurvedic_Herbs_Remedies
      ).forEach(([key, values]) => {
        drawText(
          `    • ${key.replace(/_/g, " ")}: ${(values as string[]).join(", ")}`
        );
      });
    }

    // Save and trigger download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${responseData.Name}_Prakriti_Analysis.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  /**
   * Handles form submission to the API
   */
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // Convert numeric fields to proper types
      const processedData = {
        ...data,
        Age: Number(data.Age),
        Height: Number(data.Height),
        Weight: Number(data.Weight),
        Sleep_Duration: Number(data.Sleep_Duration),
      };

      const response = await axios.post(
        "https://prakritianalysis.onrender.com/generate_pdf/",
        processedData
      );

      console.log("Response : ", response.data);

      await generatePDF(response.data);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-green-600">
        <Loader className="animate-spin h-12 w-12" />
        <p className="mt-4 text-xl">Analyzing your data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4">
      <div className="mx-auto">
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center p-6 border-b">
            <CardTitle className="text-3xl md:text-4xl font-bold">
              Prakriti Analysis
            </CardTitle>
            <div className="mt-4 px-4">
              <Progress
                value={(currentSection / TOTAL_SECTIONS) * 100}
                className="h-2"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Section {currentSection} of {TOTAL_SECTIONS}
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-4 md:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getCurrentSectionFields().map((field) => (
                    <FormField
                      key={field.name}
                      control={form.control}
                      name={field.name}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>{field.label}</FormLabel>
                          {field.type === "select" ? (
                            <Select
                              onValueChange={formField.onChange}
                              value={formField.value as string}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={`Select ${field.label}`}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {field.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <FormControl>
                              <Input
                                type={field.type}
                                placeholder={`Enter your ${field.label.toLowerCase()}`}
                                {...formField}
                              />
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <div className="flex justify-between gap-4 pt-4">
                  {currentSection > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentSection(currentSection - 1)}
                      className="w-full sm:w-auto"
                    >
                      Previous
                    </Button>
                  )}
                  <div className="flex-1" /> {/* Spacer */}
                  {currentSection < TOTAL_SECTIONS ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full sm:w-auto">
                      Submit
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

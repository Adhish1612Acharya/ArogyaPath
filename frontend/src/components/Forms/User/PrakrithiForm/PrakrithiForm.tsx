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
import FORM_FIELDS from "@/constants/prakrithiFormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import prakrithiFormSchema from "./PrakrithiFromSchema";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PrakrithiAnalysisFormProps } from "./PrakrithiForm.types";

const PrakrithiForm: FC<PrakrithiAnalysisFormProps> = ({
  currentSection,
  setCurrentSection,
  setLoading,
  generatePDF,
  TOTAL_SECTIONS,
}) => {
  const form = useForm<z.infer<typeof prakrithiFormSchema>>({
    resolver: zodResolver(prakrithiFormSchema),
    mode: "onChange",
    defaultValues: {
      // Section 1: Basic Information
      Name: "",
      Age: 0,
      Gender: "Male",
      Height: 0,
      Weight: 0,

      // Section 2: Physical Characteristics
      Body_Type: "Medium",
      Skin_Type: "Normal",
      Hair_Type: "Straight",
      Facial_Structure: "Oval",
      Complexion: "Wheatish",

      // Section 3: Lifestyle and Habits
      Eyes: "Medium",
      Food_Preference: "Veg",
      Bowel_Movement: "Regular",
      Thirst_Level: "Medium",
      Sleep_Duration: 0,

      // Section 4: Daily Routine
      Sleep_Quality: "Good",
      Energy_Levels: "Medium",
      Daily_Activity_Level: "Medium",
      Exercise_Routine: "Moderate",
      Food_Habit: "Balanced",

      // Section 5: Health Information
      Water_Intake: "2",
      Health_Issues: "None",
      Hormonal_Imbalance: "No",
      Skin_Hair_Problems: "None",
      Ayurvedic_Treatment: "No",
    },
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
  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent accidental form submission
    // Validate current section fields
    const currentFields = getCurrentSectionFields();
    const isValid = await form.trigger(currentFields.map((f) => f.name));

    if (isValid && currentSection < TOTAL_SECTIONS) {
      setCurrentSection(currentSection + 1);
    }
  };

  /**
   * Handles form submission to the API
   */
  const onSubmit = async (data: z.infer<typeof prakrithiFormSchema>) => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <SelectValue placeholder={`Select ${field.label}`} />
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
              variant="outline"
              onClick={(e) => handleNext(e)}
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              variant={"secondary"}
              className="w-full sm:w-auto"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default PrakrithiForm;

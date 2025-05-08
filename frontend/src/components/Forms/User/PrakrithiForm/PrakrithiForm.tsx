import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import FORM_FIELDS from "@/constants/prakrithiFormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import prakrithiFormSchema from "./PrakrithiFromSchema";
import axios from "axios";
import { PrakrithiAnalysisFormProps } from "./PrakrithiForm.types";

const PrakrithiForm: FC<PrakrithiAnalysisFormProps> = ({
  currentSection,
  setCurrentSection,
  setLoading,
  generatePDF,
  TOTAL_SECTIONS,
}) => {
  const { control, handleSubmit, trigger } = useForm<z.infer<typeof prakrithiFormSchema>>({
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
    e.preventDefault();
    const currentFields = getCurrentSectionFields();
    const isValid = await trigger(currentFields.map((f) => f.name));

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {getCurrentSectionFields().map((field) => (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: controllerField, fieldState: { error } }) => (
              <FormControl fullWidth className="mb-4">
                {field.type === "select" ? (
                  <>
                    <InputLabel className="text-gray-600">
                      {field.label}
                    </InputLabel>
                    <Select
                      {...controllerField}
                      label={field.label}
                      error={!!error}
                      className="bg-white rounded-md"
                    >
                      {field.options?.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                ) : (
                  <TextField
                    {...controllerField}
                    label={field.label}
                    type={field.type}
                    error={!!error}
                    helperText={error?.message}
                    variant="outlined"
                    className="bg-white rounded-md"
                    InputProps={{
                      className: "text-gray-800",
                    }}
                  />
                )}
                {error && field.type === "select" && (
                  <FormHelperText error>{error.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        ))}
      </div>

      <div className="flex justify-between gap-4 pt-4">
        {currentSection > 1 && (
          <Button
            type="button"
            variant="outlined"
            onClick={() => setCurrentSection(currentSection - 1)}
            className="w-full sm:w-auto px-6 py-2 text-indigo-600 border-indigo-600 hover:bg-indigo-50 hover:border-indigo-700"
          >
            Previous
          </Button>
        )}
        <div className="flex-1" />
        {currentSection < TOTAL_SECTIONS ? (
          <Button
            type="button"
            variant="contained"
            onClick={(e) => handleNext(e)}
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white"
          >
            Submit
          </Button>
        )}
      </div>
    </form>
  );
};

export default PrakrithiForm;
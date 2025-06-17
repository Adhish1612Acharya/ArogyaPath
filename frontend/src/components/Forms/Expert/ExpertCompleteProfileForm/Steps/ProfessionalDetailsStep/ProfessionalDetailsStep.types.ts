import { Control, FieldErrors } from "react-hook-form";
import { ExpertFormData } from "../../ExpertCompleteProfileForm.types";
import type { SelectChangeEvent } from "@mui/material";

export interface ProfessionalDetailsStepProps {
  control: Control<ExpertFormData>;
  errors: FieldErrors<ExpertFormData>;
  councilOptions: string[];
  specializationsOptions: string[];
  languageOptions: string[];
  handleSpecializationChange: (event: SelectChangeEvent) => void;
  handleLanguageChange: (event: SelectChangeEvent) => void;
}

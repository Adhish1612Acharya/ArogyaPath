import { Control, FieldErrors, UseFormTrigger } from "react-hook-form";
import { ExpertFormData } from "../../ExpertCompleteProfileForm.types";

export interface DocumentsStepProps {
  control: Control<ExpertFormData>;
  errors: FieldErrors<ExpertFormData>;
  trigger: UseFormTrigger<ExpertFormData>;
}

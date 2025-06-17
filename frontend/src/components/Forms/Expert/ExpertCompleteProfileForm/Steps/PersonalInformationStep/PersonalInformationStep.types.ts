import { Control, FieldErrors, UseFormTrigger } from "react-hook-form";
import { ExpertFormData } from "../../ExpertCompleteProfileForm.types";

export interface PersonalInformationStepProps {
  control: Control<ExpertFormData>;
  errors: FieldErrors<ExpertFormData>;
  defaultDate?: Date;
  trigger: UseFormTrigger<ExpertFormData>;
}

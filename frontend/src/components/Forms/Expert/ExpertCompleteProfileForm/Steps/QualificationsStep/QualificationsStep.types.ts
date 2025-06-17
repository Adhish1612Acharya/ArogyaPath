import { Control, FieldErrors } from "react-hook-form";
import { ExpertFormData } from "../../ExpertCompleteProfileForm.types";

export interface QualificationsStepProps {
  control: Control<ExpertFormData>;
  errors: FieldErrors<ExpertFormData>;
}

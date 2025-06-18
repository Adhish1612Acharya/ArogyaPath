import { Control, FieldErrors, UseFormTrigger } from "react-hook-form";
import { ExpertFormData } from "@/pages/AfterRegisterPage/ExpertCompleteProfile/ExpertCompleteProfile.types";

export interface QualificationsStepProps {
  control: Control<ExpertFormData>;
  errors: FieldErrors<ExpertFormData>;
  trigger: UseFormTrigger<ExpertFormData>;
}

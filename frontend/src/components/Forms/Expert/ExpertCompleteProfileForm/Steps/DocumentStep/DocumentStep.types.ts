import { ExpertFormData } from "@/pages/AfterRegisterPage/ExpertCompleteProfile/ExpertCompleteProfile.types";
import { Control, FieldErrors, UseFormTrigger } from "react-hook-form";

export interface DocumentsStepProps {
  control: Control<ExpertFormData>;
  errors: FieldErrors<ExpertFormData>;
  trigger: UseFormTrigger<ExpertFormData>;
}

import React from "react";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, SelectChangeEvent } from "@mui/material";

import PersonalInformationStep from "./Steps/PersonalInformationStep/PersonalInformationStep";
import ProfessionalDetailsStep from "./Steps/ProfessionalDetailsStep/ProfessionalDetailsStep";
import QualificationsStep from "./Steps/QualificationsStep/QualificationsStep";
import DocumentsStep from "./Steps/DocumentStep/DocumentsStep";
import ReviewStep from "./Steps/ReviewStep/ReviewStep";

const ExpertCompleteProfileForm: React.FC<ExpertProfileFormProps> = ({
  onSubmit,
  activeStep,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ExpertFormData>({
    resolver: zodResolver(expertProfileSchema),
    defaultValues: {
      dateOfBirth: new Date(1990, 0, 1), // Jan 1, 1990 as a safe default
      gender: "",
      mobileNumber: "",
      street: "",
      city: "",
      state: "",
      pinCode: "",
      ayushRegistrationNumber: "",
      registrationCouncil: "",
      yearOfRegistration: "",
      yearsOfExperience: 0,
      qualifications: [{ year: "", degree: "", college: "" }],
      specializations: [],
      languages: [],
      identityProof: null,
      degreeCertificate: null,
      registrationProof: null,
      practiceProof: null,
      bio: "",
    },
  });

  const formData = watch();

  const handleSpecializationChange = (event: SelectChangeEvent<string[]>) => {
    setValue("specializations", event.target.value as string[]);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string[]>) => {
    setValue("languages", event.target.value as string[]);
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <PersonalInformationStep control={control} errors={errors} />;
      case 1:
        return (
          <ProfessionalDetailsStep
            control={control}
            errors={errors}
            handleSpecializationChange={handleSpecializationChange}
            onLanguageChange={handleLanguageChange}
          />
        );
      case 2:
        return <QualificationsStep control={control} errors={errors} />;
      case 3:
        return <DocumentsStep control={control} errors={errors} />;
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>{renderStep()}</form>
      </CardContent>
    </Card>
  );
};

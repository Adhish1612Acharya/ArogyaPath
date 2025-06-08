export interface ExpertRegisterFormData {
  fullName: string;
  email: string;
  password: string;
}

export interface ExpertCompleteProfileData {
  contactNo: string | number;
  clinicAddress: string;
  specialization: string;
  experience: string | number;
  bio?: string;
}

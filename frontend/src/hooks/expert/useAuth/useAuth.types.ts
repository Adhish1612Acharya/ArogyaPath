interface DoctorSignUp {
  uniqueId: number;
  education: string;
  yearsOfPractice: number;
}

export type SignInWithEmailPasswordProps = (
  email: string,
  password: string
) => Promise<void>;

export type GoogleLoginProps = () => Promise<void>;

export type GoogleSignUpProps = (
  role: "ayurvedicDoctor" | "naturopathyDoctor",
  profileData: DoctorSignUp,
  address: string,
  phoneNumber: number
) => Promise<void>;

export interface SignUpArguTypes {
  email: string;
  password: string;
  name: string;
  address: string;
  contactNo: number;
  role: "ayurvedicDoctor" | "naturopathyDoctor";
  profileData: DoctorSignUp;
}

export type SignUpArguProps = (data: SignUpArguTypes) => Promise<void>;

export type CompleteProfile = (profileData: DoctorSignUp) => Promise<void>;
import { FC, useState } from "react";
import { Heart } from "lucide-react";
import DoctorSignUpForm from "@/components/Forms/Expert/ExpertSignUpForm/DoctorSignUpForm/DoctorSignUpForm";
import AuthLayoutExpert from "@/components/AuthLayoutExpert/AuthLayoutExpert";

const userTypeOptions = [
  { type: "ayurvedic", label: "Ayurvedic Doctor", icon: Heart },
  { type: "naturopathy", label: "Naturopathy Doctor", icon: Heart },
];

const RegisterExpert: FC = () => {
  const [userType, setUserType] = useState<string | null>(null);

  return (
    <AuthLayoutExpert
      title="Create an Account"
      subtitle="Join our community and make a difference."
    >
      {!userType ? (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">
            Select your role
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {userTypeOptions.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => {
                  setUserType(type);
                }}
                className="p-4 border-2 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
              >
                <Icon className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <span className="block text-sm font-medium text-gray-900">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-4 justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Register as {userType === "ayurvedic" ? "Ayurvedic Doctor" : "Naturopathy Doctor"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setUserType(null);
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Change role
            </button>
          </div>
          <DoctorSignUpForm />
          <div className="flex flex-col items-center gap-3 w-full">
            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <a
                href="/expert/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </>
      )}
    </AuthLayoutExpert>
  );
};

export default RegisterExpert;
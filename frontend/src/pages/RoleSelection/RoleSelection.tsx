import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoleCard from "@/components/RoleCard/RoleCard";

type Role = "farmer" | "expert" | null;

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === "farmer") {
      navigate("/farmer/login");
    } else if (selectedRole === "expert") {
      navigate("/expert/login");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-green-50 via-emerald-100 to-lime-50 dark:from-green-900 dark:via-emerald-800 dark:to-lime-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Welcome to ArogyaPath
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-green-700 dark:text-green-300">
            Select your role to begin your Ayurvedic journey
          </p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-screen-xl px-2 sm:px-6 lg:px-12">
          <RoleCard
            title="Ayurveda Seeker"
            description="Explore holistic wellness tips and routines for your well-being"
            icon={
              <Leaf className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-green-600 dark:text-green-300" />
            }
            selected={selectedRole === "farmer"}
            onClick={() => setSelectedRole("farmer")}
          />
          <RoleCard
            title="Ayurvedic Expert"
            description="Share natural healing practices and guide others toward balance"
            icon={
              <Brain className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-purple-600 dark:text-purple-300" />
            }
            selected={selectedRole === "expert"}
            onClick={() => setSelectedRole("expert")}
          />
        </div>

        {selectedRole && (
          <div className="mt-10 text-center">
            <Button
              size="lg"
              className="w-full sm:w-auto px-10 py-6 text-base sm:text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleContinue}
            >
              Continue as {selectedRole === "farmer" ? "Ayurveda Seeker" : "Ayurvedic Expert"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;

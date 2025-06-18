import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuthAndGetNavigation } from "@/utils/checkVerifications";

const ExpertProtectedRoute = () => {
  const { setIsLoggedIn, setRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const checkExpert = async () => {
      try {
        const { authStatus, navigation } = await checkAuthAndGetNavigation();
        setIsLoggedIn(authStatus.loggedIn);
        setRole(authStatus.userRole || undefined);

        if (navigation.shouldRedirect) {
          setRedirectPath(navigation.redirectPath);
        } else if (authStatus.userRole !== "expert") {
          setRedirectPath("/");
        }
      } catch {
        console.log("Error");
        setIsLoggedIn(false);
        setRole(undefined);
        setRedirectPath("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkExpert();
  }, []);

  if (loading) return <div className="p-4">Checking expert access...</div>;
  if (redirectPath) return <Navigate to={redirectPath} replace />;

  return <Outlet />;
};

export default ExpertProtectedRoute;

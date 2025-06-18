import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { checkAuthAndGetNavigation } from "@/utils/checkVerifications";

const ProtectedRoute = () => {
  const { setIsLoggedIn, setRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authStatus, navigation } = await checkAuthAndGetNavigation();
        setIsLoggedIn(authStatus.loggedIn);
        setRole(authStatus.userRole || undefined);

        if (navigation.shouldRedirect) {
          setRedirectPath(navigation.redirectPath);
        }
      } catch {
        setIsLoggedIn(false);
        setRole(undefined);
        setRedirectPath("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setIsLoggedIn, setRole]);

  if (loading) return <div className="p-4">Checking authentication...</div>;

  if (redirectPath) return <Navigate to={redirectPath} replace />;

  return <Outlet />;
};

export default ProtectedRoute;

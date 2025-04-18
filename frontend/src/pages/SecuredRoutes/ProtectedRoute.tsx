import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useApi from "@/hooks/useApi/useApi";

const ProtectedRoute = () => {
  const { get } = useApi<{
    message: string;
    loggedIn: boolean;
    userRole: "expert" | "user" | null;
  }>();
  const { isLoggedIn, setIsLoggedIn, setRole } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Protected route");
        const res = await get(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/check`
        );
        console.log("Res : ", res);
        setIsLoggedIn(res.loggedIn);
        setRole(res.userRole || undefined);
      } catch {
        setIsLoggedIn(false);
        setRole(undefined);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setIsLoggedIn]);

  if (loading) return <div className="p-4">Checking authentication...</div>;

  if (!loading && !isLoggedIn) return <Navigate to="/auth" replace />;

  return !loading && isLoggedIn && <Outlet />;
};

export default ProtectedRoute;

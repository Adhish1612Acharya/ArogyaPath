import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi/useApi";

const GuestProtectedRoute = () => {
  const { get } = useApi<{
    message: string;
    loggedIn: boolean;
    userRole: "expert" | "user" | null;
  }>();
  const { isLoggedIn, setIsLoggedIn, setRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await get(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/check`
        );
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
  }, [setIsLoggedIn, setRole, navigate]);

  if (loading) return <div>Loading...</div>;

  if (!loading && isLoggedIn) return <Navigate to="/" replace />;

  return !isLoggedIn && !loading && <Outlet />;
};

export default GuestProtectedRoute;

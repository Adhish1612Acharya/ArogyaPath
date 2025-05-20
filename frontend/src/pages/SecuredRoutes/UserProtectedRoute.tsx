import { useAuth } from "@/context/AuthContext";
import useApi from "@/hooks/useApi/useApi";
import  { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const { get } = useApi<{
    message: string;
    loggedIn: boolean;
    userRole: "expert" | "user" | null;
  }>();
  const { isLoggedIn, role, setIsLoggedIn, setRole } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await get(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/check`
        );
        setIsLoggedIn(res.loggedIn);
        setRole(res.userRole || undefined); // "user"
      } catch {
        setIsLoggedIn(false);
        setRole(undefined);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [setIsLoggedIn, setRole]);

  if (loading) return <div className="p-4">Checking user access...</div>;

  if (!loading && !isLoggedIn) return <Navigate to="/auth" replace />;

  return isLoggedIn && role === "user" && !loading ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default UserProtectedRoute;

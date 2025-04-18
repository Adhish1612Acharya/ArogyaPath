import { useAuth } from "@/context/AuthContext";
import useApi from "@/hooks/useApi/useApi";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ExpertProtectedRoute = () => {
  const { get } = useApi<{
    message: string;
    loggedIn: boolean;
    userRole: "expert" | "user" | null;
  }>();
  const { isLoggedIn, role, setIsLoggedIn, setRole } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkExpert = async () => {
      try {
        const res = await get(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/check`
        );
        setIsLoggedIn(res.loggedIn);
        setRole(res.userRole || undefined); // "expert"
      } catch {
        setIsLoggedIn(false);
        setRole(undefined);
      } finally {
        setLoading(false);
      }
    };

    checkExpert();
  }, [setIsLoggedIn, setRole]);

  if (loading) return <div className="p-4">Checking expert access...</div>;

  if (!loading && !isLoggedIn) return <Navigate to="/auth" replace />;

  return isLoggedIn && role === "expert" && !loading ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default ExpertProtectedRoute;

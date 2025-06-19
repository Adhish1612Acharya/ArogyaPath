import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth";
import Loader from "@/components/Loader";

const UserProtectedRoute = () => {
  const { checkAuthStatus, loading, navigationState, authState } =
    useCheckAuth();

  useEffect(() => {
    const check = async () => {
      await checkAuthStatus();
    };
    check();
  }, []);

  if (loading) return <Loader />;

  if (navigationState?.shouldRedirect) {
    return <Navigate to={navigationState.redirectPath} replace />;
  }

  // Additional check for user role
  if (!loading && authState?.userRole !== "user") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default UserProtectedRoute;

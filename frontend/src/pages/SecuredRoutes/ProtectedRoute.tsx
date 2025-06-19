import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth";
import Loader from "@/components/Loader";

const ProtectedRoute = () => {
  const { checkAuthStatus, loading, navigationState } = useCheckAuth();
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

  // if (navigationState?.shouldRedirect) {
  //   const currentPath = window.location.pathname;

  //   if (navigationState.redirectPath !== currentPath) {
  //     return <Navigate to={navigationState.redirectPath} replace />;
  //   }
  // }

  return <Outlet />;
};

export default ProtectedRoute;

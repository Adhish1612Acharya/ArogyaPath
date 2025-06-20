import { useState } from "react";
import useApi from "@/hooks/useApi/useApi";
import { useAuth } from "@/context/AuthContext";

interface AuthCheckResponse {
  success: boolean;
  message: string;
  loggedIn: boolean;
  userRole: "user" | "expert" | null;
  verifications: {
    email: boolean;
    contactNo: boolean;
    completeProfile: boolean;
    isDoctor?: boolean;
  } | null;
}

interface NavigationState {
  shouldRedirect: boolean;
  redirectPath: string;
  message?: string;
}

const useCheckAuth = () => {
  const { get } = useApi<AuthCheckResponse>();
  const { setIsLoggedIn, setRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<AuthCheckResponse | null>(null);
  const [navigationState, setNavigationState] =
    useState<NavigationState | null>(null);

  const getExpertNavigationState = (
    verifications: AuthCheckResponse["verifications"]
  ): NavigationState => {
    if (!verifications) {
      return {
        shouldRedirect: true,
        redirectPath: "/login",
        message: "Please log in to continue",
      };
    }

    const { email, contactNo, completeProfile, isDoctor } = verifications;

    if (!email) {
      return {
        shouldRedirect: true,
        redirectPath: "/email/verify",
        message: "Please verify your email to continue",
      };
    }

    if (!contactNo && window.location.pathname !== "/verify-mobile") {
      return {
        shouldRedirect: true,
        redirectPath: "/verify-mobile",
        message: "Please verify your contact number to continue",
      };
    }

    // Only redirect to complete-profile if NOT already on that route
    if (
      !completeProfile &&
      window.location.pathname !== "/complete-profile/expert"
    ) {
      return {
        shouldRedirect: true,
        redirectPath: "/complete-profile/expert",
        message: "Please complete your profile to continue",
      };
    }

    if (!isDoctor && window.location.pathname !== "/complete-profile/expert") {
      return {
        shouldRedirect: true,
        redirectPath: "/complete-profile/expert",
        message: "Your documents are pending verification",
      };
    }

    return {
      shouldRedirect: false,
      redirectPath: "",
    };
  };

  const getUserNavigationState = (
    verifications: AuthCheckResponse["verifications"]
  ): NavigationState => {
    if (!verifications) {
      return {
        shouldRedirect: true,
        redirectPath: "/auth",
        message: "Please log in to continue",
      };
    }

    const { email, contactNo, completeProfile } = verifications;

    if (!email) {
      return {
        shouldRedirect: true,
        redirectPath: "/email/verify",
        message: "Please verify your email to continue",
      };
    }

    if (!contactNo && window.location.pathname !== "/verify-mobile") {
      return {
        shouldRedirect: true,
        redirectPath: "/verify-mobile",
        message: "Please verify your contact number to continue",
      };
    }

    if (
      !completeProfile &&
      window.location.pathname !== "/user/complete-profile"
    ) {
      return {
        shouldRedirect: true,
        redirectPath: "/user/complete-profile",
        message: "Please complete your profile to continue",
      };
    }

    return {
      shouldRedirect: false,
      redirectPath: "",
    };
  };

  const checkAuthStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/check`
      );
      setAuthState(response);
      setIsLoggedIn(response.loggedIn);
      setRole(response.userRole || undefined);

      let navigation: NavigationState;
      if (!response.loggedIn) {
        navigation = {
          shouldRedirect: true,
          redirectPath: "/auth",
          message: "Please log in to continue",
        };
      } else if (response.userRole === "expert") {
        navigation = getExpertNavigationState(response.verifications);
      } else if (response.userRole === "user") {
        navigation = getUserNavigationState(response.verifications);
      } else {
        navigation = {
          shouldRedirect: true,
          redirectPath: "/auth",
          message: "Invalid user role",
        };
      }

      setNavigationState(navigation);
      return { authState: response, navigation };
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to check authentication status";
      setError(errorMessage);
      setIsLoggedIn(false);
      setRole(undefined);

      const navigation: NavigationState = {
        shouldRedirect: true,
        redirectPath: "/auth",
        message: errorMessage,
      };

      setNavigationState(navigation);
      return { authState: null, navigation };
    } finally {
      setLoading(false);
    }
  };

  return {
    checkAuthStatus,
    loading,
    error,
    authState,
    navigationState,
  };
};

export default useCheckAuth;

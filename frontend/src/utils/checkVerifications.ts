import axios from "axios";

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

export const checkAuth = async (): Promise<AuthCheckResponse> => {
  try {
    const response = await axios.get<AuthCheckResponse>(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/check`
    );
    return response.data;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return {
      success: false,
      message: "Failed to check authentication status",
      loggedIn: false,
      userRole: null,
      verifications: null,
    };
  }
};

export const getExpertNavigationState = (
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

  if (!contactNo) {
    return {
      shouldRedirect: true,
      redirectPath: "/verify-mobile",
      message: "Please verify your contact number to continue",
    };
  }

  if (!completeProfile) {
    return {
      shouldRedirect: true,
      redirectPath: "/complete-profile/expert",
      message: "Please complete your profile to continue",
    };
  }

  if (!isDoctor) {
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

export const getUserNavigationState = (
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

  if (!contactNo) {
    return {
      shouldRedirect: true,
      redirectPath: "/verify-mobile",
      message: "Please verify your contact number to continue",
    };
  }

  if (!completeProfile) {
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

export const checkAuthAndGetNavigation = async (): Promise<{
  authStatus: AuthCheckResponse;
  navigation: NavigationState;
}> => {
  const authStatus = await checkAuth();

  if (!authStatus.loggedIn) {
    return {    
      authStatus,
      navigation: {
        shouldRedirect: true,
        redirectPath: "/auth",
        message: "Please log in to continue",
      },
    };
  }

  let navigation: NavigationState;

  if (authStatus.userRole === "expert") {
    navigation = getExpertNavigationState(authStatus.verifications);
  } else if (authStatus.userRole === "user") {
    navigation = getUserNavigationState(authStatus.verifications);
  } else {
    navigation = {
      shouldRedirect: true,
      redirectPath: "/auth",
      message: "Invalid user role",
    };
  }

  return { authStatus, navigation };
};

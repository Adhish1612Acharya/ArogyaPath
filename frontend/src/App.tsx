import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginExpert from "./pages/auth/Expert/LoginExpert";
import RegisterExpert from "./pages/auth/Expert/RegisterExpert";
import LoginUser from "./pages/auth/User/LoginUser";
import RegisterUser from "./pages/auth/User/RegisterUser";
import RoleSelection from "./pages/RoleSelection/RoleSelection";
import PrakrutiForm from "./pages/User/PrakrithiAnalysis/PrakritiAnalysis";
import CreatePost from "./pages/Expert/CreatePost/CreatePost";
import HomePage from "./pages/HomePage";
import CreateSuccessStory from "./pages/User/CreateSuccessStory/CreateSuccessStory";
import { PageNotFound } from "./pages/PageNotFound/PageNotFound";
import EmailVerify from "./pages/AfterRegisterPage/EmailVerify";
import MobileVerify from "./pages/AfterRegisterPage/MobileVerify";
import ExpertCompleteProfile from "./pages/AfterRegisterPage/ExpertCompleteProfile";
import UserCompleteProfile from "./pages/AfterRegisterPage/UserCompleteProfile";
import { GeneralPost } from "./pages/posts/PostPage/GeneralPost";
import { RoutinePost } from "./pages/posts/PostPage/RoutinePost";
import { SuccessStoryPost } from "./pages/posts/PostPage/SuccessStoryPost";
import AISearchPage from "./pages/AIquery/AIQuery";
import { ExpertTaggedPosts } from "./pages/Expert/TaggedView/ViewTagged";
import GuestProtectedRoute from "./pages/SecuredRoutes/GuestProtectedRoute";
import ProtectedRoute from "./pages/SecuredRoutes/ProtectedRoute";
import ExpertProtectedRoute from "./pages/SecuredRoutes/ExpertProtectedRoute";
import UserProtectedRoute from "./pages/SecuredRoutes/UserProtectedRoute";
import { AllGeneralPosts } from "./pages/posts/GeneralPosts";
import { AllRoutinePosts } from "./pages/posts/RoutinesPosts";
import { AllSuccessStoriesPosts } from "./pages/posts/SuccessStoryPosts";
import { VerifiedByVaidya } from "./pages/Expert/VerifiedSuccessStory/VerifiedSuccessStories";

import { ForgotPasswordPage } from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage/ResetPasswordPage";
import CopySnackbar from "./components/CopySnackBar/CopySnackBar";
import DoctorProfile from "./pages/DoctorProfile/DoctorProfile";

import PageFooter from "./components/PageFooter";
import PageNavBar from "./components/PageNavBar";
import PrakrithiAnalysis from "./pages/User/PrakrithiAnalysis/PrakritiAnalysis";

const App = () => {
  const { isLoggedIn } = useAuth();
  return (
    <>
      <PageNavBar />

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ marginTop: "5rem" }}
      />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<GuestProtectedRoute />}>
            <Route path="/verify-email" element={<EmailVerify />} />
            <Route path="/verify-mobile" element={<MobileVerify />} />
            <Route path="/expert/login" element={<LoginExpert />} />
            <Route path="/expert/register" element={<RegisterExpert />} />
            <Route path="/user/login" element={<LoginUser />} />
            <Route path="/user/register" element={<RegisterUser />} />
            <Route path="/auth" element={<RoleSelection />} />
            <Route
              path="/:role/forgot-password"
              element={<ForgotPasswordPage />}
            />
            <Route
              path="/:role/reset-password/:token"
              element={<ResetPasswordPage />}
            />
          </Route>

          <Route element={<UserProtectedRoute />}>
            <Route
              path="/complete-profile/user"
              element={<UserCompleteProfile />}
            />
            <Route path="/prakrithi/analysis" element={<PrakrithiAnalysis />} />
            <Route
              path="/user/success-stories/create"
              element={<CreateSuccessStory />}
            />
          </Route>

          <Route element={<ExpertProtectedRoute />}>
            <Route
              path="/complete-profile/expert"
              element={<ExpertCompleteProfile />}
            />
            <Route
              path="/verified/success-stories"
              element={<VerifiedByVaidya />}
            />
            <Route path="/expert/posts/create" element={<CreatePost />} />
            <Route path="/expert/tagged" element={<ExpertTaggedPosts />} />
            {/* <Route path="/posts/create" element={<CreatePost />} /> */}
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/gposts/:id" element={<GeneralPost />} />
            <Route path="/routines/:id" element={<RoutinePost />} />
            <Route path="/success-stories/:id" element={<SuccessStoryPost />} />
            <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
            <Route path="/ai-query" element={<AISearchPage />} />
            {/* <Route path="/posts" element={<PostsPage />} /> */}
            <Route path="/gposts" element={<AllGeneralPosts />} />
            <Route path="/routines" element={<AllRoutinePosts />} />
            <Route
              path="/success-stories"
              element={<AllSuccessStoriesPosts />}
            />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <CopySnackbar />
      {isLoggedIn !== undefined && <PageFooter />}
    </>
  );
};

export default App;

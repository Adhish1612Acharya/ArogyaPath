import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginExpert from "./pages/auth/Expert/LoginExpert";
import RegisterExpert from "./pages/auth/Expert/RegisterExpert";
import LoginUser from "./pages/auth/User/LoginUser";
import RegisterUser from "./pages/auth/User/RegisterUser";
import RoleSelection from "./pages/RoleSelection/RoleSelection";
import { PostsPage } from "./pages/posts";
import PrakrutiForm from "./pages/User/PrakrithiAnalysis/PrakritiAnalysis";
import CreatePost from "./pages/Expert/CreatePost/CreatePost";
import HomePage from "./pages/HomePage";
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

const App = () => {
  const role = useAuth();
  return (
    <>
      {/* {nav && <NavBar />} */}

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
          <Route path="/expert/login" element={<LoginExpert />} />
          <Route path="/expert/register" element={<RegisterExpert />} />
          <Route path="/user/login" element={<LoginUser />} />
          <Route path="/user/register" element={<RegisterUser />} />
          <Route path="/auth" element={<RoleSelection />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/create" element={<CreatePost />} />

          <Route path="/prakrithi/analysis" element={<PrakrutiForm />} />
          <Route path="/not-found" element={<PageNotFound  />} />
          <Route path="/verify-email" element={<EmailVerify />} />
          <Route path="/verify-mobile" element={<MobileVerify />} />
          <Route path="/complete-profile/expert" element={<ExpertCompleteProfile />} />
          <Route path="/complete-profile/user" element={<UserCompleteProfile />} />
          <Route path="/gposts/:id" element={<GeneralPost />} />
          <Route path="/routines/:id" element={<RoutinePost />} />
          <Route path="/success-stories/:id" element={<SuccessStoryPost />} />
          <Route path="/ai-query" element={<AISearchPage />} />
          <Route path="/expert/tagged" element={<ExpertTaggedPosts />} />
        </Routes>
      </div>
      {/* {nav && <Footer />} */}
    </>
  );
};

export default App;

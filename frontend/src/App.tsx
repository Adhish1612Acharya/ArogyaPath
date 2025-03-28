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
import { CreatePostPage } from "./pages/posts/create";
import { CreateUserPostPage } from "./pages/posts/usercreate";
import { HomePage } from "./pages/home";
import PrakrutiForm from "./pages/forms/PrakrutiForm";
import AIConsultPage from "./pages/Aiconsult";


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
          <Route path="/posts/create" element={<CreatePostPage />} />
          <Route path="/posts/usercreate" element={<CreateUserPostPage />} />

          <Route path="/prakrithi/analysis" element={<PrakrutiForm />} />
          <Route path="/ai-consult" element={<AIConsultPage />} />


        </Routes>
      </div>
      {/* {nav && <Footer />} */}
    </>
  );
};

export default App;

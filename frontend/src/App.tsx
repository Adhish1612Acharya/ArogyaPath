import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginExpert  from "./pages/auth/Expert/LoginExpert";
import  RegisterExpert  from "./pages/auth/Expert/RegisterExpert";
import LoginUser  from "./pages/auth/Expert/LoginExpert";
import  RegisterUser  from "./pages/auth/Expert/RegisterExpert";
import RoleSelection from "./pages/RoleSelection/RoleSelection";

const App = () => {
  const role  = useAuth();
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
        <Route path="/farmer/login" element={<LoginUser />} />
        <Route path="/farmer/register" element={<RegisterUser />} />
        <Route path="/auth" element={<RoleSelection />} />

        </Routes>
      </div>
      {/* {nav && <Footer />} */}
    </>
  );
};

export default App;

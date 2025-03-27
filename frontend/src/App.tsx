import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/auth/login";

const App = () => {
  const { role } = useAuth();
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
        <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>

      {/* {nav && <Footer />} */}
    </>
  );
};

export default App;

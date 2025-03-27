import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

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
          {/* <Route path="/" element={<Home />} />
          <Route element={<AuthProtectedRoute />}>
            <Route path="/expert/register" element={<RegisterExpert />} />
            <Route path="/farmer/login" element={<LoginFarmer />} />
            <Route path="/farmer/register" element={<RegisterFarmer />} />
            <Route path="/expert/login" element={<LoginExpert />} />
            <Route path="/auth" element={<RoleSelection />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/workshops" element={<WorkshopsPage />} />
            <Route path="/workshops/:id" element={<WorkShopDetail />} />
          </Route>
          <Route element={<FarmerProtectRoute />}>
            <Route path="/solve-query" element={<AiSolveQuery />} />
          </Route>

          <Route element={<ExpertProtectRoute />}>
            <Route path="/workshops/create" element={<CreateWorkShop />} />
            <Route path="/profile/farmer" element={<FarmerProfile />} />
            <Route path="/profile/doctor" element={<DoctorProfile />} />
            <Route path="/profile/ngo" element={<NGOProfile />} />
            <Route
              path="/profile/researchinsti"
              element={<ResearchInstituteProfile />}
            />
            <Route path="/profile/volunteer" element={<VolunteerProfile />} />
          </Route>
          <Route path="*" element={<PageNotFound />} /> */}
        </Routes>
      </div>

      {/* {nav && <Footer />} */}
    </>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import RecipientDashboard from "./pages/RecipientDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {
  return (
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/donor"
              element={
                <ProtectedRoute allowedRoles={["donor"]}>
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recipient"
              element={
                <ProtectedRoute allowedRoles={["recipient"]}>
                  <RecipientDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={["staff"]}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
  );
}

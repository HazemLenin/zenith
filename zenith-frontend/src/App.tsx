import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, NotFound, Unauthorized } from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

// Example user role - in a real app, this would come from your auth context/state
const userRole = "admin"; // This should come from your authentication system

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Example protected admin route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]} userRole={userRole}>
              <div>Admin Dashboard</div>
            </ProtectedRoute>
          }
        />

        {/* Example protected user route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["user", "admin"]}
              userRole={userRole}
            >
              <div>User Dashboard</div>
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

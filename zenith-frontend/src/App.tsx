import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, NotFound } from "./pages";

import "./App.css";
import LayOut from "./components/Layout/Layout";

import ProtectedRoute from "./components/ProtectedRoute";

// Example user role - in a real app, this would come from your auth context/state
// const userRole = "admin";
// This should come from your authentication system

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <LayOut />,
      children: [
        { index: true, path: "/", element: <Home /> },
        { index: true, path: "Login", element: <NotFound /> },
        { index: true, path: "SignUp", element: <NotFound /> },
        {
          path: "Courses",
          element: <ProtectedRoute children={<NotFound />} />,
        },
        {
          path: "Community",
          element: <ProtectedRoute children={<NotFound />} />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>

    // <Router>

    //   <Routes>
    //     <Route path="/" element={<Home />} />

    //     {/* Example protected admin route */}
    //     <Route
    //       path="/admin"
    //       element={
    //         <ProtectedRoute allowedRoles={["admin"]} userRole={userRole}>
    //           <div>Admin Dashboard</div>
    //         </ProtectedRoute>
    //       }
    //     />

    //     {/* Example protected user route */}
    //     <Route
    //       path="/dashboard"
    //       element={
    //         <ProtectedRoute
    //           allowedRoles={["user", "admin"]}
    //           userRole={userRole}
    //         >
    //           <div>User Dashboard</div>
    //         </ProtectedRoute>
    //       }
    //     />

    //     <Route path="/unauthorized" element={<Unauthorized />} />
    //     <Route path="*" element={<NotFound />} />
    //   </Routes>
    // </Router>
  );
}

export default App;

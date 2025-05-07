import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, NotFound } from "./pages";

import "./App.css";
import SignUp from "./pages/SignUP";
import Login from "./pages/Login";
import LayOut from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import SkillDetails from "./pages/SkillDetails";

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
        { index: true, path: "Login", element: <SignUp /> },
        { index: true, path: "SignUp", element: <Login /> },
        { index: true, path: "SkillDetails", element: <SkillDetails /> },
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
  );
}

export default App;

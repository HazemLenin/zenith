import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, NotFound, Chat } from "./pages";
import { Layout, ProtectedRoute } from "./components";
import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import SkillDetails from "./pages/SkillDetails";
import ChapterDetails from "./pages/ChapterDetails";

// Example user role - in a real app, this would come from your auth context/state
// const userRole = "admin";
// This should come from your authentication system

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { index: true, path: "/", element: <Home /> },
        { index: true, path: "login", element: <Login /> },
        { index: true, path: "signup", element: <SignUp /> },
        { index: true, path: "SkillDetails", element: <SkillDetails /> },
        { index: true, path: "/courses/:coursId/chapters", element: <ChapterDetails/> },
        {
          path: "courses",
          element: <ProtectedRoute children={<NotFound />} />,
        },
        {
          path: "community",
          element: <ProtectedRoute children={<NotFound />} />,
        },
        {
          path: "chat",
          element: <ProtectedRoute children={<Chat />} />,
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

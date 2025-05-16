import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, NotFound, Chat } from "./pages";
import { Layout, ProtectedRoute } from "./components";
import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import SkillDetails from "./pages/SkillDetails";
import Profile from "./pages/Profile";
import ChapterDetails from "./pages/ChapterDetails";
import Search from "./pages/Search";
import Coursesupload from "./pages/Coursesupload";

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
        { path: "users/:username", element: <Profile /> },
        { index: true, path: "courses/:coursId/chapters", element: <ChapterDetails /> },
        { index: true, path: "skill-transfers/teachers-search", element: <Search /> },
        { path: "courses/upload", element: <Coursesupload /> },
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

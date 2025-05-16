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
import SearchCourses from "./pages/CoursesSearch";
import Coursesupload from "./pages/Coursesupload";

// Example user role - in a real app, this would come from your auth context/state
// const userRole = "admin";
// This should come from your authentication system

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "signup", element: <SignUp /> },
        {
          path: "SkillDetails",
          element: <ProtectedRoute children={<SkillDetails />} />,
        },
        {
          path: "users/:username",
          element: <ProtectedRoute children={<Profile />} />,
        },
        {
          path: "courses/:coursId/chapters",
          element: <ProtectedRoute children={<ChapterDetails />} />,
        },
        {
          path: "skill-transfers/teachers-search",
          element: <ProtectedRoute children={<Search />} />
        },
        { 
          path: "courses/upload", 
          element: <ProtectedRoute children={<Coursesupload />} /> 
        },
        {
          path: "courses",
          element: <ProtectedRoute children={<SearchCourses />} />,
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

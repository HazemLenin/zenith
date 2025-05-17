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
import CoursesUpload from "./pages/CoursesUpload";
import CourseDetails from "./pages/CourseDetails";
import Requests from "./pages/Requests";
import Sessions from "./pages/Sessions";

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
          element: (
            <ProtectedRoute
              allowedRoles={["student"]}
              children={<SkillDetails />}
            />
          ),
        },
        {
          path: "users/:username",
          element: <ProtectedRoute children={<Profile />} />,
        },
        {
          path: "courses/:id",
          element: <ProtectedRoute children={<CourseDetails />} />,
        },
        {
          path: "courses/:coursId/chapters",
          element: (
            <ProtectedRoute
              allowedRoles={["student"]}
              children={<ChapterDetails />}
            />
          ),
        },
        {
          path: "skill-transfers/teachers-search",
          element: (
            <ProtectedRoute allowedRoles={["student"]} children={<Search />} />
          ),
        },
        {
          path: "courses/upload",
          element: (
            <ProtectedRoute
              allowedRoles={["instructor"]}
              children={<CoursesUpload />}
            />
          ),
        },
        {
          path: "skill-transfers/my-requests",
          element: <ProtectedRoute children={<Requests />} />,
        },
        {
<<<<<<< HEAD
          path: "skill-transfers/transfer-details/:skillTransferId",
          element: <ProtectedRoute children={<Sessions/>} />
        },
        { 
          path: "courses/upload", 
          element: <ProtectedRoute children={<Coursesupload />} /> 
=======
          path: "courses/upload",
          element: <ProtectedRoute children={<CoursesUpload />} />,
>>>>>>> 22892e4077847b96d53ab77e26e056a35e9b8355
        },
        {
          path: "courses",
          element: (
            <ProtectedRoute
              allowedRoles={["student"]}
              children={<SearchCourses />}
            />
          ),
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

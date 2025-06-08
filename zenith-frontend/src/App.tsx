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
import SkillsUpdate from "./pages/SkillsUpdate";
import TeacherSearch from "./pages/TeacherSearch";
import SkillExchanges from "./pages/SkillExchanges";

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
          path: "skill-transfers/:skillTransferId",
          element: (
            <ProtectedRoute
              allowedRoles={["student", "teacher"]}
              children={<SkillDetails />}
            />
          ),
        },
        {
          path: "users/:username",
          element: <ProtectedRoute children={<Profile />} />,
        },
        {
          path: "users/:username/skills-update",
          element: <ProtectedRoute children={<SkillsUpdate />} />,
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
          path: "adding-sessions",
          element: <ProtectedRoute children={<Sessions />} />,
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
          path: "skill-hub",
          element: (
            <ProtectedRoute
              allowedRoles={["student"]}
              children={<TeacherSearch />}
            />
          ),
        },
        {
          path: "skill-transfers",
          element: <ProtectedRoute children={<SkillExchanges />} />,
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

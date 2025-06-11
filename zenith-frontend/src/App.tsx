import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Home,
  NotFound,
  Chat,
  SkillDetails,
  UserProfile,
  ChapterDetails,
  Search,
  Courses,
  CourseUpload,
  CourseDetails,
  SkillTransferRequests,
  Sessions,
  SkillsUpdate,
  TeachersSearch,
  SkillExchanges,
  Unauthorized,
} from "./pages";
import { Layout, ProtectedRoute } from "./components";
import AuthPage from "./pages/AuthPage";
import "./App.css";

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
        { path: "login", element: <AuthPage /> },
        { path: "signup", element: <AuthPage /> },
        { path: "unauthorized", element: <Unauthorized /> },
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
          element: <ProtectedRoute children={<UserProfile />} />,
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
              children={<CourseUpload />}
            />
          ),
        },
        {
          path: "skill-transfers/my-requests",
          element: <ProtectedRoute children={<SkillTransferRequests />} />,
        },
        {
          path: "adding-sessions",
          element: <ProtectedRoute children={<Sessions />} />,
        },
        {
          path: "courses",
          element: (
            <ProtectedRoute allowedRoles={["student"]} children={<Courses />} />
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
              children={<TeachersSearch />}
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

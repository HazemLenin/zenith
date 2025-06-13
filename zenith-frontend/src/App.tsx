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
  AddSessions,
  SkillsUpdate,
  TeachersSearch,
  SkillTransfers,
  Unauthorized,
  SkillTransferDetails,
} from "./pages";
import { Layout, ProtectedRoute } from "./components";
import AuthPage from "./pages/AuthPage";
import "./App.css";
import { ToastProvider } from "./context/ToastContext";

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
          path: "skill-transfers/:id",
          element: (
            <ProtectedRoute
              allowedRoles={["student", "teacher"]}
              children={<SkillTransferDetails />}
            />
          ),
        },
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
          element: <ProtectedRoute children={<AddSessions />} />,
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
          element: <ProtectedRoute children={<SkillTransfers />} />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;

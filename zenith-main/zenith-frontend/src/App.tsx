import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, NotFound, Unauthorized } from "./pages";

import "./App.css";
import LayOut from "./components/Layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute";

// Example user role - in a real app, this would come from your auth context/state
// const userRole = "admin"; 
// This should come from your authentication system

function App() {
  const router = createBrowserRouter(
    [
      {
        path:"",
        element:<LayOut/>,
        children:[
          {index:true,path:'Home' ,element: <Home/> },
          { index:true, path: 'Login', element:<NotFound/> },
          { index:true, path: 'SignUp', element:<NotFound/> },
          { path: 'Courses', element:<ProtectedRoute><NotFound/> </ProtectedRoute>  },
          { path: 'Community', element: <ProtectedRoute><NotFound/></ProtectedRoute> },


        ]


      }]);
       const myClient = new QueryClient();

  return (
    <>

    <QueryClientProvider client={myClient}>
          <RouterProvider router={router} />
    </QueryClientProvider>
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

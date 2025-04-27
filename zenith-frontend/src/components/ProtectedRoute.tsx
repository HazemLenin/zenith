import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  userRole?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles,
  userRole,
}: ProtectedRouteProps) => {
  const location = useLocation();

  if (!userRole) {
    // Redirect to login if no user role is provided
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect to unauthorized page if user role is not allowed
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

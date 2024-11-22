import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ isLoggedIn, children }: {isLoggedIn: boolean, children: ReactNode}) {
  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

export default ProtectedRoute;

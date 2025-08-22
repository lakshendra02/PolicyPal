import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function ProtectedRoute() {
  const authed = isAuthenticated();
  const location = useLocation();
  return authed ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

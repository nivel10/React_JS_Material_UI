import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./userAuth";
import { FullScreenLoader } from "../components/FullScreenLoader";

const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <FullScreenLoader message="Loading wait..." />;

  return isAuthenticated ? <Navigate to="/tasks" replace /> : <Outlet />;
};

export default PublicRoute;
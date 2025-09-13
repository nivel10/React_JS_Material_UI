import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./UserAuth";

const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Cargando sesión…</div>;

  return isAuthenticated ? <Navigate to="/task" replace /> : <Outlet />;
};

export default PublicRoute;
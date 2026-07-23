// src/app/components/layout/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function ProtectedRoute() {
  const location = useLocation();

  const isAuthenticated = Boolean(localStorage.getItem('admin_access_token'));

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

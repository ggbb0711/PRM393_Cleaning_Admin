// src/app/components/layout/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function ProtectedRoute() {
  const location = useLocation();
  
  // Kiểm tra xem có access_token thật hay không
  const isAuthenticated = Boolean(localStorage.getItem('admin_access_token'));

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
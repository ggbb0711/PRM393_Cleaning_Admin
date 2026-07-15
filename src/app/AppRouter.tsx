import { Route, Routes } from 'react-router-dom';
import { AdminShell } from '../components/layout/AdminShell';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

import { LoginPage } from '../features/auth/LoginPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { NotFoundPage } from '../features/not-found/NotFoundPage';

// Các module chuẩn bị code (Nếu chưa tạo file thì comment các dòng này lại để tránh lỗi Vite)
import { WorkerApplicationsPage } from '../features/worker-applications/WorkerApplicationsPage';
import { AccountsPage } from '../features/accounts/AccountsPage';
import { ServicesPage } from '../features/services/ServicesPage';
import { BookingsPage } from '../features/bookings/BookingsPage';

export function AppRouter() {
  return (
    <Routes>
      {/* Route Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Routes yêu cầu đăng nhập (Admin) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminShell />}>
          <Route index element={<DashboardPage />} />
          
          <Route path="worker-applications" element={<WorkerApplicationsPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
        </Route>
      </Route>

      {/* Bắt các đường dẫn không tồn tại */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
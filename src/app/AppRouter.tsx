import { Route, Routes } from 'react-router-dom';
import { AdminShell } from '../components/layout/AdminShell';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

import { LoginPage } from '../features/auth/LoginPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { NotFoundPage } from '../features/not-found/NotFoundPage';

import { WorkerApplicationsPage } from '../features/worker-applications/WorkerApplicationsPage';
import { AccountsPage } from '../features/accounts/AccountsPage';
import { ServicesPage } from '../features/services/ServicesPage';
import { BookingsPage } from '../features/bookings/BookingsPage';

export function AppRouter() {
  return (
    <Routes>
      {/* Route Public */}
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="worker-applications" element={<WorkerApplicationsPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

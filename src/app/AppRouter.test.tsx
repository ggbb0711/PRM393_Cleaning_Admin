import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderAdminApp } from '../test/renderAdminApp';
import { adminApi } from '../api/adminApi'; 

describe('Admin routing', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('[IT-WEB-FOUNDATION-001-01] hiển thị dashboard trong bố cục quản trị', async () => {
    localStorage.setItem('admin_access_token', 'fake-test-token');

    vi.spyOn(adminApi, 'getDashboardStats').mockResolvedValue({
      totalClients: 2,
      totalWorkers: 1,
      totalBookings: 1,
      totalRevenue: 500000,
    });

    renderAdminApp();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    });

    expect(screen.getByText('CleanAI Admin')).toBeInTheDocument();
    expect(screen.getByText('Tổng quan số liệu hệ thống CleanAI.')).toBeInTheDocument();
  });

  it('[IT-WEB-FOUNDATION-001-02] hiển thị trang không tìm thấy cho route không hợp lệ', () => {
    localStorage.setItem('admin_access_token', 'fake-test-token');

    renderAdminApp('/missing');

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to dashboard' })).toHaveAttribute('href', '/');
  });
});

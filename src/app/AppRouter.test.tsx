import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderAdminApp } from '../test/renderAdminApp';
import { adminApi } from '../api/adminApi'; // Bổ sung import adminApi

describe('Admin routing', () => {
  // Dọn dẹp và thiết lập lại state trước mỗi bài test
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('[IT-WEB-FOUNDATION-001-01] hiển thị dashboard trong bố cục quản trị', async () => {
    // 1. Giả lập trạng thái "Đã đăng nhập" để vượt qua ProtectedRoute
    localStorage.setItem('admin_access_token', 'fake-test-token');

    // 2. Giả lập API thống kê trả về dữ liệu giả để biểu đồ không bị lỗi
    vi.spyOn(adminApi, 'getDashboardStats').mockResolvedValue({
      totalClients: 2,
      totalWorkers: 1,
      totalBookings: 1,
      totalRevenue: 500000,
    });

    renderAdminApp();

    // 3. Chờ UI render xong sau khi call API
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    });

    expect(screen.getByText('CleanAI Admin')).toBeInTheDocument();
    expect(screen.getByText('Tổng quan số liệu hệ thống CleanAI.')).toBeInTheDocument();
  });

  it('[IT-WEB-FOUNDATION-001-02] hiển thị trang không tìm thấy cho route không hợp lệ', () => {
    // Cũng cần giả lập đã đăng nhập ở test case này để không bị văng ra Login
    localStorage.setItem('admin_access_token', 'fake-test-token');

    renderAdminApp('/missing');

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to dashboard' })).toHaveAttribute('href', '/');
  });
});

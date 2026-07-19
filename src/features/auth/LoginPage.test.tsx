import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminApi } from '../../api/adminApi';
import { apiClient } from '../../api/apiClient';
import { renderAdminApp } from '../../test/renderAdminApp';

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  async function fillAndSubmit(email = 'admin@cleanai.local', password = 'Password123!') {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Email hoặc Số điện thoại/), email);
    await user.type(screen.getByLabelText(/Mật khẩu/), password);
    await user.click(screen.getByRole('button', { name: 'Đăng nhập' }));
  }

  it('[UT-WEB-AUTH-001] logs in an admin and stores tokens', async () => {
    vi.spyOn(adminApi, 'getDashboardStats').mockResolvedValue({
      totalClients: 0,
      totalWorkers: 0,
      totalBookings: 0,
      totalRevenue: 0,
    });
    vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: {
        data: {
          role: 'Admin',
          accessToken: 'access-1',
          refreshToken: 'refresh-1',
          fullName: 'Quan Tri',
        },
      },
    });

    renderAdminApp('/login');
    await fillAndSubmit();

    await waitFor(() => {
      expect(localStorage.getItem('admin_access_token')).toBe('access-1');
    });
    expect(localStorage.getItem('admin_refresh_token')).toBe('refresh-1');
    expect(localStorage.getItem('admin_full_name')).toBe('Quan Tri');
  });

  it('[UT-WEB-AUTH-002] accepts an already-unwrapped response body', async () => {
    vi.spyOn(adminApi, 'getDashboardStats').mockResolvedValue({
      totalClients: 0,
      totalWorkers: 0,
      totalBookings: 0,
      totalRevenue: 0,
    });
    vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: { role: 'admin', accessToken: 'access-2', refreshToken: 'refresh-2', fullName: 'X' },
    });

    renderAdminApp('/login');
    await fillAndSubmit();

    await waitFor(() => {
      expect(localStorage.getItem('admin_access_token')).toBe('access-2');
    });
  });

  it('[UT-WEB-AUTH-003] rejects a non-admin account without storing tokens', async () => {
    vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: { data: { role: 'Client', accessToken: 'a', refreshToken: 'r', fullName: 'X' } },
    });

    renderAdminApp('/login');
    await fillAndSubmit();

    expect(
      await screen.findByText('Tài khoản của bạn không có quyền truy cập không gian quản trị.'),
    ).toBeInTheDocument();
    expect(localStorage.getItem('admin_access_token')).toBeNull();
  });

  it('[UT-WEB-AUTH-004] surfaces the backend error message on a failed login', async () => {
    const headers = new AxiosHeaders();
    vi.spyOn(apiClient, 'post').mockRejectedValue(
      new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 401,
        statusText: 'Unauthorized',
        headers,
        config: { headers },
        data: { message: 'Sai mật khẩu.' },
      }),
    );

    renderAdminApp('/login');
    await fillAndSubmit();

    expect(await screen.findByText('Sai mật khẩu.')).toBeInTheDocument();
  });

  it('[UT-WEB-AUTH-005] falls back to a generic message for a non-axios error', async () => {
    vi.spyOn(apiClient, 'post').mockRejectedValue(new Error('boom'));

    renderAdminApp('/login');
    await fillAndSubmit();

    expect(await screen.findByText('Đã xảy ra lỗi không xác định ở Client.')).toBeInTheDocument();
  });
});

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminApi } from '../../api/adminApi';
import { apiClient } from '../../api/apiClient';
import { renderAdminApp } from '../../test/renderAdminApp';

function login() {
  localStorage.setItem('admin_access_token', 'fake-test-token');
}

describe('AdminShell', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(adminApi, 'getDashboardStats').mockResolvedValue({
      totalClients: 0,
      totalWorkers: 0,
      totalBookings: 0,
      totalRevenue: 0,
    });
  });

  it('[UT-WEB-SHELL-001] navigates to another section via the sidebar', async () => {
    login();
    vi.spyOn(adminApi, 'getAllBookings').mockResolvedValue([]);

    renderAdminApp('/');
    await screen.findByRole('heading', { name: 'Dashboard' });

    const user = userEvent.setup();
    await user.click(screen.getByText('Lịch dọn dẹp'));

    expect(await screen.findByText('No records found')).toBeInTheDocument();
  });

  it('[UT-WEB-SHELL-002] opens the mobile navigation drawer', async () => {
    login();
    renderAdminApp('/');
    await screen.findByRole('heading', { name: 'Dashboard' });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    expect(screen.getByText('Administration workspace')).toBeInTheDocument();
  });

  it('[UT-WEB-SHELL-003] logs out without calling the API when there is no refresh token', async () => {
    login();
    const post = vi.spyOn(apiClient, 'post');

    renderAdminApp('/');
    await screen.findByRole('heading', { name: 'Dashboard' });

    const user = userEvent.setup();
    await user.click(screen.getByText('Đăng xuất'));

    await waitFor(() => {
      expect(localStorage.getItem('admin_access_token')).toBeNull();
    });
    expect(post).not.toHaveBeenCalled();
  });

  it('[UT-WEB-SHELL-004] logs out and revokes the refresh token when one is present', async () => {
    login();
    localStorage.setItem('admin_refresh_token', 'refresh-1');
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: {} });

    renderAdminApp('/');
    await screen.findByRole('heading', { name: 'Dashboard' });

    const user = userEvent.setup();
    await user.click(screen.getByText('Đăng xuất'));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith('/Auth/logout', { refreshToken: 'refresh-1' });
    });
    expect(localStorage.getItem('admin_access_token')).toBeNull();
    expect(localStorage.getItem('admin_refresh_token')).toBeNull();
  });

  it('[UT-WEB-SHELL-005] still logs out locally when the server logout call fails', async () => {
    login();
    localStorage.setItem('admin_refresh_token', 'refresh-1');
    vi.spyOn(apiClient, 'post').mockRejectedValue(new Error('network down'));

    renderAdminApp('/');
    await screen.findByRole('heading', { name: 'Dashboard' });

    const user = userEvent.setup();
    await user.click(screen.getByText('Đăng xuất'));

    await waitFor(() => {
      expect(localStorage.getItem('admin_access_token')).toBeNull();
    });
  });
});

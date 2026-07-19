import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminApi, type AccountAdminDto } from '../../api/adminApi';
import { renderAdminApp } from '../../test/renderAdminApp';

const account: AccountAdminDto = {
  id: 'acc-1',
  email: 'client@cleanai.local',
  fullName: 'Nguyen Van A',
  phoneNumber: '0900000000',
  role: 'Client',
  status: 'Active',
  createdAt: '2026-01-01T00:00:00.000Z',
};

function login() {
  localStorage.setItem('admin_access_token', 'fake-test-token');
}

describe('AccountsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('[UT-WEB-ACC-001] renders accounts from an unwrapped response', async () => {
    login();
    vi.spyOn(adminApi, 'getAccounts').mockResolvedValue([account]);

    renderAdminApp('/accounts');

    expect(await screen.findByText('client@cleanai.local')).toBeInTheDocument();
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument();
  });

  it('[UT-WEB-ACC-002] renders accounts from an enveloped response', async () => {
    login();
    vi.spyOn(adminApi, 'getAccounts').mockResolvedValue({ data: [account] } as unknown as Awaited<
      ReturnType<typeof adminApi.getAccounts>
    >);

    renderAdminApp('/accounts');

    expect(await screen.findByText('client@cleanai.local')).toBeInTheDocument();
  });

  it('[UT-WEB-ACC-003] shows an error state and supports retry', async () => {
    login();
    const spy = vi
      .spyOn(adminApi, 'getAccounts')
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce([account]);

    renderAdminApp('/accounts');

    expect(await screen.findByRole('alert')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('client@cleanai.local')).toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('[UT-WEB-ACC-004] changes an account status through the dialog', async () => {
    login();
    vi.spyOn(adminApi, 'getAccounts').mockResolvedValue([account]);
    const changeStatus = vi.spyOn(adminApi, 'changeAccountStatus').mockResolvedValue({} as never);

    renderAdminApp('/accounts');
    await screen.findByText('client@cleanai.local');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Edit client@cleanai.local' }));

    expect(screen.getByRole('dialog', { name: 'Đổi trạng thái tài khoản' })).toBeInTheDocument();

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: 'Inactive (Khóa)' }));
    await user.click(screen.getByRole('button', { name: 'Lưu' }));

    await waitFor(() => {
      expect(changeStatus).toHaveBeenCalledWith('acc-1', 'Inactive');
    });
  });
});

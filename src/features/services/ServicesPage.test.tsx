import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminApi, type ServiceDto } from '../../api/adminApi';
import { renderAdminApp } from '../../test/renderAdminApp';

const service: ServiceDto = {
  id: 'svc-1',
  name: 'Don dep theo gio',
  description: 'Mo ta',
  propertyType: 'House',
  unitType: 'Hour',
  basePrice: 100000,
  minimumHours: 2,
  isActive: true,
};

function login() {
  localStorage.setItem('admin_access_token', 'fake-test-token');
}

describe('ServicesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('[UT-WEB-SVC-001] renders services from an unwrapped response', async () => {
    login();
    vi.spyOn(adminApi, 'getAllServices').mockResolvedValue([service]);

    renderAdminApp('/services');

    expect(await screen.findByText('Don dep theo gio')).toBeInTheDocument();
  });

  it('[UT-WEB-SVC-002] renders services from an enveloped response', async () => {
    login();
    vi.spyOn(adminApi, 'getAllServices').mockResolvedValue({
      data: [service],
    } as unknown as Awaited<ReturnType<typeof adminApi.getAllServices>>);

    renderAdminApp('/services');

    expect(await screen.findByText('Don dep theo gio')).toBeInTheDocument();
  });

  it('[UT-WEB-SVC-003] creates a new service through the dialog', async () => {
    login();
    vi.spyOn(adminApi, 'getAllServices').mockResolvedValue([]);
    const create = vi.spyOn(adminApi, 'createService').mockResolvedValue(service);

    renderAdminApp('/services');
    await screen.findByText('No records found');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: '+ Thêm Dịch Vụ' }));

    expect(screen.getByRole('dialog', { name: 'Thêm dịch vụ mới' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Tên dịch vụ'), 'Don dep van phong');
    await user.click(screen.getByRole('button', { name: 'Lưu' }));

    await waitFor(() => {
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Don dep van phong', basePrice: 0, minimumHours: 2 }),
      );
    });
  });

  it('[UT-WEB-SVC-004] edits an existing service through the dialog', async () => {
    login();
    vi.spyOn(adminApi, 'getAllServices').mockResolvedValue([service]);
    const update = vi.spyOn(adminApi, 'updateService').mockResolvedValue(service);

    renderAdminApp('/services');
    await screen.findByText('Don dep theo gio');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Edit Don dep theo gio' }));

    expect(screen.getByRole('dialog', { name: 'Sửa dịch vụ' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Lưu' }));

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith(
        'svc-1',
        expect.objectContaining({ name: 'Don dep theo gio', isActive: true }),
      );
    });
  });

  it('[UT-WEB-SVC-005] archives a service after confirming the destructive dialog', async () => {
    login();
    vi.spyOn(adminApi, 'getAllServices').mockResolvedValue([service]);
    const archive = vi.spyOn(adminApi, 'archiveService').mockResolvedValue({} as never);

    renderAdminApp('/services');
    await screen.findByText('Don dep theo gio');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Delete Don dep theo gio' }));
    await user.click(screen.getByRole('button', { name: 'Confirm delete' }));

    await waitFor(() => {
      expect(archive).toHaveBeenCalledWith('svc-1');
    });
  });
});

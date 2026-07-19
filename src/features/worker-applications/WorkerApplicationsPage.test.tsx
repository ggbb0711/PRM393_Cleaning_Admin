import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminApi, type WorkerApplicationDto } from '../../api/adminApi';
import { renderAdminApp } from '../../test/renderAdminApp';

const application: WorkerApplicationDto = {
  id: 'app-1',
  userId: 'user-1',
  status: 'pending',
  governmentId: '012345678901',
  experienceSummary: '5 nam kinh nghiem',
  evidence: '{}',
  submittedAt: '2026-01-01T00:00:00.000Z',
  rejectionReason: null,
};

function login() {
  localStorage.setItem('admin_access_token', 'fake-test-token');
}

describe('WorkerApplicationsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('[UT-WEB-WAPP-001] renders applications from an unwrapped response', async () => {
    login();
    vi.spyOn(adminApi, 'getWorkerApplications').mockResolvedValue([application]);

    renderAdminApp('/worker-applications');

    expect(await screen.findByText('012345678901')).toBeInTheDocument();
  });

  it('[UT-WEB-WAPP-002] renders applications from an enveloped response', async () => {
    login();
    vi.spyOn(adminApi, 'getWorkerApplications').mockResolvedValue({
      data: [application],
    } as unknown as Awaited<ReturnType<typeof adminApi.getWorkerApplications>>);

    renderAdminApp('/worker-applications');

    expect(await screen.findByText('012345678901')).toBeInTheDocument();
  });

  it('[UT-WEB-WAPP-003] shows an error state and supports retry', async () => {
    login();
    const spy = vi
      .spyOn(adminApi, 'getWorkerApplications')
      .mockRejectedValueOnce(new Error('down'))
      .mockResolvedValueOnce([application]);

    renderAdminApp('/worker-applications');

    expect(await screen.findByRole('alert')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('012345678901')).toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('[UT-WEB-WAPP-004] approves a worker application', async () => {
    login();
    vi.spyOn(adminApi, 'getWorkerApplications').mockResolvedValue([application]);
    const approve = vi.spyOn(adminApi, 'approveWorker').mockResolvedValue({} as never);

    renderAdminApp('/worker-applications');
    await screen.findByText('012345678901');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Edit 012345678901' }));

    expect(screen.getByRole('dialog', { name: 'Xử lý đơn ứng tuyển thợ' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('5 nam kinh nghiem')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Duyệt (Approve)' }));

    await waitFor(() => {
      expect(approve).toHaveBeenCalledWith('app-1', '00000000-0000-0000-0000-000000000000');
    });
  });

  it('[UT-WEB-WAPP-005] rejects a worker application once a reason is entered', async () => {
    login();
    vi.spyOn(adminApi, 'getWorkerApplications').mockResolvedValue([application]);
    const reject = vi.spyOn(adminApi, 'rejectWorker').mockResolvedValue({} as never);

    renderAdminApp('/worker-applications');
    await screen.findByText('012345678901');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Edit 012345678901' }));

    const rejectButton = screen.getByRole('button', { name: 'Từ chối' });
    expect(rejectButton).toBeDisabled();

    await user.type(screen.getByLabelText(/Lý do từ chối/), 'Thieu ho so');
    expect(rejectButton).toBeEnabled();
    await user.click(rejectButton);

    await waitFor(() => {
      expect(reject).toHaveBeenCalledWith(
        'app-1',
        '00000000-0000-0000-0000-000000000000',
        'Thieu ho so',
      );
    });
  });
});

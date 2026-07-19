import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminApi, type BookingAdminDto } from '../../api/adminApi';
import { renderAdminApp } from '../../test/renderAdminApp';

const booking: BookingAdminDto = {
  id: 'booking-123456789',
  clientId: 'client-1',
  workerId: 'worker-1',
  serviceId: 'service-1',
  status: 'Completed',
  totalPrice: 250000,
  scheduledStartTime: '2026-01-01T09:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
};

function login() {
  localStorage.setItem('admin_access_token', 'fake-test-token');
}

describe('BookingsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('[UT-WEB-BOOK-001] renders bookings from an unwrapped response', async () => {
    login();
    vi.spyOn(adminApi, 'getAllBookings').mockResolvedValue([booking]);

    renderAdminApp('/bookings');

    expect(await screen.findByText('250,000 VND')).toBeInTheDocument();
    expect(screen.getByText('booking-...')).toBeInTheDocument();
  });

  it('[UT-WEB-BOOK-002] renders bookings from an enveloped response', async () => {
    login();
    vi.spyOn(adminApi, 'getAllBookings').mockResolvedValue({
      data: [booking],
    } as unknown as Awaited<ReturnType<typeof adminApi.getAllBookings>>);

    renderAdminApp('/bookings');

    expect(await screen.findByText('250,000 VND')).toBeInTheDocument();
  });

  it('[UT-WEB-BOOK-003] shows an error state and supports retry', async () => {
    login();
    const spy = vi
      .spyOn(adminApi, 'getAllBookings')
      .mockRejectedValueOnce(new Error('down'))
      .mockResolvedValueOnce([booking]);

    renderAdminApp('/bookings');

    expect(await screen.findByRole('alert')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('250,000 VND')).toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});

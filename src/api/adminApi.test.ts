import { afterEach, describe, expect, it, vi } from 'vitest';
import { adminApi } from './adminApi';
import { apiClient } from './apiClient';

describe('adminApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('[UT-WEB-API-001] getDashboardStats GETs the stats endpoint and unwraps axios data', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: { totalClients: 1, totalWorkers: 2, totalBookings: 3, totalRevenue: 4 },
    });

    const result = await adminApi.getDashboardStats();

    expect(get).toHaveBeenCalledWith('/Admin/dashboard-stats');
    expect(result).toEqual({ totalClients: 1, totalWorkers: 2, totalBookings: 3, totalRevenue: 4 });
  });

  it('[UT-WEB-API-002] getAccounts GETs the accounts endpoint', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [] });

    const result = await adminApi.getAccounts();

    expect(get).toHaveBeenCalledWith('/Admin/accounts');
    expect(result).toEqual([]);
  });

  it('[UT-WEB-API-003] changeAccountStatus PUTs the new status', async () => {
    const put = vi.spyOn(apiClient, 'put').mockResolvedValue({ data: {} });

    await adminApi.changeAccountStatus('acc-1', 'Inactive');

    expect(put).toHaveBeenCalledWith('/Admin/accounts/acc-1/status', { status: 'Inactive' });
  });

  it('[UT-WEB-API-004] getWorkerApplications GETs the applications endpoint', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [] });

    const result = await adminApi.getWorkerApplications();

    expect(get).toHaveBeenCalledWith('/Admin/worker-applications');
    expect(result).toEqual([]);
  });

  it('[UT-WEB-API-005] approveWorker PUTs the approval', async () => {
    const put = vi.spyOn(apiClient, 'put').mockResolvedValue({ data: {} });

    await adminApi.approveWorker('app-1', 'admin-1');

    expect(put).toHaveBeenCalledWith('/Admin/worker-applications/app-1/approve', {
      adminId: 'admin-1',
    });
  });

  it('[UT-WEB-API-006] rejectWorker PUTs the rejection with a reason', async () => {
    const put = vi.spyOn(apiClient, 'put').mockResolvedValue({ data: {} });

    await adminApi.rejectWorker('app-1', 'admin-1', 'no docs');

    expect(put).toHaveBeenCalledWith('/Admin/worker-applications/app-1/reject', {
      adminId: 'admin-1',
      reason: 'no docs',
    });
  });

  it('[UT-WEB-API-007] getAllServices GETs the services endpoint', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [] });

    const result = await adminApi.getAllServices();

    expect(get).toHaveBeenCalledWith('/Admin/services');
    expect(result).toEqual([]);
  });

  it('[UT-WEB-API-008] createService POSTs the new service payload', async () => {
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: {} });
    const payload = {
      name: 'Don dep',
      propertyType: 'House',
      unitType: 'Hour',
      basePrice: 100000,
      minimumHours: 2,
    };

    await adminApi.createService(payload);

    expect(post).toHaveBeenCalledWith('/Admin/services', payload);
  });

  it('[UT-WEB-API-009] updateService PUTs the updated service payload', async () => {
    const put = vi.spyOn(apiClient, 'put').mockResolvedValue({ data: {} });
    const payload = { name: 'Don dep', basePrice: 100000, minimumHours: 2, isActive: true };

    await adminApi.updateService('svc-1', payload);

    expect(put).toHaveBeenCalledWith('/Admin/services/svc-1', payload);
  });

  it('[UT-WEB-API-010] archiveService DELETEs the service', async () => {
    const del = vi.spyOn(apiClient, 'delete').mockResolvedValue({ data: {} });

    await adminApi.archiveService('svc-1');

    expect(del).toHaveBeenCalledWith('/Admin/services/svc-1');
  });

  it('[UT-WEB-API-011] getAllBookings GETs the bookings endpoint', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [] });

    const result = await adminApi.getAllBookings();

    expect(get).toHaveBeenCalledWith('/Admin/bookings');
    expect(result).toEqual([]);
  });
});

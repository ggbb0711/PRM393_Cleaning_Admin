import { apiClient } from './apiClient';

export interface AdminDashboardStatsDto {
  totalClients: number;
  totalWorkers: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface AccountAdminDto {
  id: string;
  email: string;
  fullName: string | null;
  phoneNumber: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export interface WorkerApplicationDto {
  id: string;
  userId: string;
  status: string;
  governmentId: string | null;
  experienceSummary: string | null;
  evidence: string;
  submittedAt: string;
  rejectionReason: string | null;
}

export interface ServiceDto {
  id: string;
  name: string;
  description: string | null;
  propertyType: string;
  unitType: string;
  basePrice: number;
  minimumHours: number;
  isActive: boolean;
  bookingFormSchema?: string;
}

export interface CreateServiceDto {
  name: string;
  description?: string | null;
  propertyType: string;
  unitType: string;
  basePrice: number;
  minimumHours: number;
  bookingFormSchema?: string;
  operatingSchedule?: string;
}

export interface UpdateServiceDto {
  name: string;
  description?: string | null;
  basePrice: number;
  minimumHours: number;
  bookingFormSchema?: string;
  operatingSchedule?: string;
  isActive: boolean;
}

export interface BookingAdminDto {
  id: string;
  clientId: string;
  workerId: string | null;
  serviceId: string;
  status: string;
  totalPrice: number;
  scheduledStartTime: string;
  createdAt: string;
}

export const adminApi = {
  getDashboardStats: () =>
    apiClient.get<AdminDashboardStatsDto>('/Admin/dashboard-stats').then((res) => res.data),

  getAccounts: () => apiClient.get<AccountAdminDto[]>('/Admin/accounts').then((res) => res.data),
  changeAccountStatus: (id: string, status: string) =>
    apiClient.put(`/Admin/accounts/${id}/status`, { status }),

  getWorkerApplications: () =>
    apiClient.get<WorkerApplicationDto[]>('/Admin/worker-applications').then((res) => res.data),
  approveWorker: (id: string, adminId: string) =>
    apiClient.put(`/Admin/worker-applications/${id}/approve`, { adminId }),
  rejectWorker: (id: string, adminId: string, reason: string) =>
    apiClient.put(`/Admin/worker-applications/${id}/reject`, { adminId, reason }),

  getAllServices: () => apiClient.get<ServiceDto[]>('/Admin/services').then((res) => res.data),
  createService: (data: CreateServiceDto) =>
    apiClient.post<ServiceDto>('/Admin/services', data).then((res) => res.data),
  updateService: (id: string, data: UpdateServiceDto) =>
    apiClient.put<ServiceDto>(`/Admin/services/${id}`, data).then((res) => res.data),
  archiveService: (id: string) => apiClient.delete(`/Admin/services/${id}`),

  getAllBookings: () => apiClient.get<BookingAdminDto[]>('/Admin/bookings').then((res) => res.data),
};

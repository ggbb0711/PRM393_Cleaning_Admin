import axios from 'axios';
import type { AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// The backend wraps every response body in an envelope:
// { success, message, data, errorCode, errors }. Unwrap it here so every
// call site can keep treating `response.data` as the actual DTO, instead of
// each feature re-deriving `response.data.data` on its own.
function isEnvelope(value: unknown): value is { success: boolean; data: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).success === 'boolean' &&
    'data' in value
  );
}

apiClient.interceptors.response.use((response: AxiosResponse) => {
  if (isEnvelope(response.data)) {
    response.data = response.data.data;
  }
  return response;
});

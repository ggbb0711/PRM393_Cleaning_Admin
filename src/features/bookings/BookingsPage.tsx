import { useState, useEffect } from 'react';
import { Chip } from '@mui/material';
import { AdminDataTable, type AdminTableColumn } from '../../components/table/AdminDataTable';
import { adminApi, type BookingAdminDto } from '../../api/adminApi';

export function BookingsPage() {
  const [bookings, setBookings] = useState<BookingAdminDto[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const fetchBookings = () => {
    adminApi
      .getAllBookings()
      .then((data) => {
        setBookings(data);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const columns: AdminTableColumn<BookingAdminDto>[] = [
    { id: 'id', header: 'Mã Đơn', render: (r) => r.id.substring(0, 8) + '...' },
    {
      id: 'startTime',
      header: 'Lịch Làm',
      render: (r) => new Date(r.scheduledStartTime).toLocaleString('vi-VN'),
    },
    { id: 'price', header: 'Tổng Tiền', render: (r) => `${r.totalPrice.toLocaleString()} VND` },
    {
      id: 'status',
      header: 'Trạng thái',
      render: (r) => (
        <Chip
          label={r.status}
          size="small"
          color={r.status === 'Completed' ? 'success' : r.status === 'Cancelled' ? 'error' : 'info'}
        />
      ),
    },
  ];

  return (
    <AdminDataTable
      title="Lịch sử Đơn Dọn Dẹp"
      columns={columns}
      rows={bookings}
      status={status}
      getRowId={(r) => r.id}
      getRowLabel={(r) => r.id}
      onRetry={() => {
        setStatus('loading');
        fetchBookings();
      }}
    />
  );
}

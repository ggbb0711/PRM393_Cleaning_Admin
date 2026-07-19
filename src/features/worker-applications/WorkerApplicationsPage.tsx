import { useState, useEffect } from 'react';
import {
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
// Thêm chữ "type" để sửa lỗi: does not provide an export named 'AdminTableColumn'
import { AdminDataTable, type AdminTableColumn } from '../../components/table/AdminDataTable';
import { adminApi, type WorkerApplicationDto } from '../../api/adminApi';

export function WorkerApplicationsPage() {
  const [apps, setApps] = useState<WorkerApplicationDto[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [selectedApp, setSelectedApp] = useState<WorkerApplicationDto | null>(null);

  const fetchApps = () => {
    adminApi
      .getWorkerApplications()
      .then((res: unknown) => {
        const payload = res as { data?: WorkerApplicationDto[] };
        setApps(payload.data ? payload.data : (res as WorkerApplicationDto[]));
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const columns: AdminTableColumn<WorkerApplicationDto>[] = [
    {
      id: 'submittedAt',
      header: 'Ngày nộp',
      render: (r) => new Date(r.submittedAt).toLocaleDateString('vi-VN'),
    },
    { id: 'govId', header: 'CCCD/CMND', render: (r) => r.governmentId || 'N/A' },
    {
      id: 'status',
      header: 'Trạng thái',
      render: (r) => (
        <Chip
          label={r.status}
          size="small"
          color={r.status === 'pending' ? 'warning' : r.status === 'approved' ? 'success' : 'error'}
        />
      ),
    },
  ];

  return (
    <>
      <AdminDataTable
        title="Đơn đăng ký làm thợ"
        columns={columns}
        rows={apps}
        status={status}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.governmentId || r.id}
        onEdit={(r) => setSelectedApp(r)} // Mở modal duyệt
        onRetry={() => {
          setStatus('loading');
          fetchApps();
        }}
      />

      {/* Kỹ thuật key trick giúp reset state tự động khi đổi App khác */}
      <ApplicationActionDialog
        key={selectedApp?.id || 'empty'}
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
        onSuccess={() => {
          setSelectedApp(null);
          fetchApps();
        }}
      />
    </>
  );
}

// ----------------------------------------------------
// COMPONENT DIALOG NẰM GỘP CHUNG FILE
// ----------------------------------------------------
function ApplicationActionDialog({
  app,
  onClose,
  onSuccess,
}: {
  app: WorkerApplicationDto | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState('');

  // Lấy ID admin đang đăng nhập từ local (thay chuỗi số 0 nếu cần)
  const getAdminId = () =>
    localStorage.getItem('admin_profile_id') || '00000000-0000-0000-0000-000000000000';

  const handleApprove = () => {
    if (app) adminApi.approveWorker(app.id, getAdminId()).then(onSuccess);
  };

  const handleReject = () => {
    if (app && reason) adminApi.rejectWorker(app.id, getAdminId(), reason).then(onSuccess);
  };

  return (
    <Dialog open={!!app} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Xử lý đơn ứng tuyển thợ</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Tóm tắt kinh nghiệm"
            multiline
            rows={3}
            disabled
            value={app?.experienceSummary || ''}
          />
          <TextField
            label="Lý do từ chối (Chỉ nhập nếu Từ chối)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button onClick={handleReject} color="error" variant="contained" disabled={!reason}>
          Từ chối
        </Button>
        <Button onClick={handleApprove} color="success" variant="contained">
          Duyệt (Approve)
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import {
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AdminDataTable, type AdminTableColumn } from '../../components/table/AdminDataTable';
import { adminApi, type AccountAdminDto } from '../../api/adminApi';

export function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountAdminDto[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [selectedAccount, setSelectedAccount] = useState<AccountAdminDto | null>(null);

  const fetchAccounts = () => {
    adminApi
      .getAccounts()
      .then((data) => {
        setAccounts(data);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const columns: AdminTableColumn<AccountAdminDto>[] = [
    { id: 'email', header: 'Email', render: (r) => r.email },
    { id: 'fullName', header: 'Họ tên', render: (r) => r.fullName || 'Chưa cập nhật' },
    {
      id: 'role',
      header: 'Vai trò',
      render: (r) => (
        <Chip label={r.role} size="small" color={r.role === 'Admin' ? 'error' : 'default'} />
      ),
    },
    {
      id: 'status',
      header: 'Trạng thái',
      render: (r) => (
        <Chip label={r.status} size="small" color={r.status === 'Active' ? 'success' : 'warning'} />
      ),
    },
  ];

  return (
    <>
      <AdminDataTable
        title="Quản lý Tài khoản"
        columns={columns}
        rows={accounts}
        status={status}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.email}
        onEdit={(r) => setSelectedAccount(r)}
        onRetry={() => {
          setStatus('loading');
          fetchAccounts();
        }}
      />

      <ChangeStatusDialog
        key={selectedAccount?.id || 'empty'}
        account={selectedAccount}
        onClose={() => setSelectedAccount(null)}
        onSuccess={() => {
          setSelectedAccount(null);
          fetchAccounts();
        }}
      />
    </>
  );
}

function ChangeStatusDialog({
  account,
  onClose,
  onSuccess,
}: {
  account: AccountAdminDto | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [newStatus, setNewStatus] = useState(account?.status || '');

  const handleSave = () => {
    if (account) {
      adminApi.changeAccountStatus(account.id, newStatus).then(onSuccess);
    }
  };

  return (
    <Dialog open={!!account} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Đổi trạng thái tài khoản</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={newStatus}
            label="Trạng thái"
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <MenuItem value="Active">Active (Hoạt động)</MenuItem>
            <MenuItem value="Banned">Banned (Khóa)</MenuItem>
            <MenuItem value="PendingVerification">PendingVerification (Chờ xác thực)</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}

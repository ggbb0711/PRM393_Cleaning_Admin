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
// Thêm chữ "type" vào trước các Interface để tuân thủ verbatimModuleSyntax
import { AdminDataTable, type AdminTableColumn } from '../../components/table/AdminDataTable';
import { adminApi, type AccountAdminDto } from '../../api/adminApi';

export function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountAdminDto[]>([]);
  // Trạng thái mặc định đã là loading, không cần set lại lúc khởi tạo
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [selectedAccount, setSelectedAccount] = useState<AccountAdminDto | null>(null);

  const fetchAccounts = () => {
    adminApi
      .getAccounts()
      // Thay any bằng unknown và ép kiểu an toàn
      .then((res: unknown) => {
        const payload = res as { data?: AccountAdminDto[] };
        // Lấy data từ vỏ bọc nếu có, không thì lấy trực tiếp
        setAccounts(payload.data ? payload.data : (res as AccountAdminDto[]));
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

      {/* Sử dụng Key Trick: Gắn key bằng ID của account. 
        Mỗi khi chọn account khác, React sẽ tự động re-mount component này, 
        giúp state newStatus bên trong tự reset mà KHÔNG CẦN dùng useEffect.
      */}
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

// Component Modal nằm ngay bên dưới
function ChangeStatusDialog({
  account,
  onClose,
  onSuccess,
}: {
  account: AccountAdminDto | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  // Lấy giá trị khởi tạo trực tiếp từ prop (an toàn vì component sẽ re-mount khi account thay đổi nhờ prop key ở trên)
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
            <MenuItem value="Inactive">Inactive (Khóa)</MenuItem>
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

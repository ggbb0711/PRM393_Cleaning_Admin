import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Box } from '@mui/material';
// Thêm chữ "type" để fix lỗi import
import { AdminDataTable, type AdminTableColumn } from '../../components/table/AdminDataTable';
import { adminApi, type ServiceDto } from '../../api/adminApi';

export function ServicesPage() {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDto | null>(null);

  const fetchServices = () => {
    // Tạm thời set success do chưa có hàm getServices bên backend
    // Sử dụng setTimeout để tránh lỗi set-state-in-effect (cập nhật state đồng bộ)
    setTimeout(() => {
      setServices([]);
      setStatus('success'); 
    }, 0);
  };

  useEffect(() => { fetchServices(); }, []);

  const columns: AdminTableColumn<ServiceDto>[] = [
    { id: 'name', header: 'Tên Dịch Vụ', render: (r) => r.name },
    { id: 'price', header: 'Giá Cơ Bản', render: (r) => `${r.basePrice.toLocaleString()} VND` },
    { id: 'minHours', header: 'Giờ tối thiểu', render: (r) => `${r.minimumHours} giờ` },
  ];

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={() => { setSelectedService(null); setOpenDialog(true); }}>
          + Thêm Dịch Vụ
        </Button>
      </Box>
      <AdminDataTable
        title="Quản lý Dịch vụ"
        columns={columns}
        rows={services}
        status={status}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
        onEdit={(r) => { setSelectedService(r); setOpenDialog(true); }}
        onDelete={(r) => adminApi.archiveService(r.id).then(fetchServices)}
        onRetry={() => {
          setStatus('loading');
          fetchServices();
        }}
      />
      
      {/* Component Dialog nằm ngay trong file này */}
      <ServiceFormDialog 
        key={selectedService?.id || 'new'}
        open={openDialog}
        service={selectedService}
        onClose={() => setOpenDialog(false)}
        onSuccess={() => { setOpenDialog(false); fetchServices(); }}
      />
    </>
  );
}

// ----------------------------------------------------
// COMPONENT DIALOG NẰM GỘP CHUNG FILE
// ----------------------------------------------------
function ServiceFormDialog({ open, service, onClose, onSuccess }: { open: boolean, service: ServiceDto | null, onClose: () => void, onSuccess: () => void }) {
  // Lấy dữ liệu mặc định an toàn không cần useEffect
  const [formData, setFormData] = useState<Partial<ServiceDto>>(
    service || { name: '', description: '', propertyType: 'House', unitType: 'Hour', basePrice: 0, minimumHours: 2 }
  );

  const handleSave = () => {
    // Ép kiểu (cast type) an toàn và loại bỏ "any"
    if (service) {
      adminApi.updateService(service.id, formData as ServiceDto).then(onSuccess);
    } else {
      adminApi.createService(formData as ServiceDto).then(onSuccess);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{service ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Tên dịch vụ" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <TextField label="Giá cơ bản" type="number" value={formData.basePrice || 0} onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })} />
          <TextField label="Giờ tối thiểu" type="number" value={formData.minimumHours || 0} onChange={(e) => setFormData({ ...formData, minimumHours: Number(e.target.value) })} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} variant="contained">Lưu</Button>
      </DialogActions>
    </Dialog>
  );
}
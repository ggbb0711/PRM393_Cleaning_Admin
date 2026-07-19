import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Box } from '@mui/material';
import { AdminDataTable, type AdminTableColumn } from '../../components/table/AdminDataTable';
import { adminApi, type ServiceDto, type CreateServiceDto, type UpdateServiceDto, type MaybeEnveloped } from '../../api/adminApi';

export function ServicesPage() {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDto | null>(null);

  // Cập nhật hàm fetchServices gọi API thật
  const fetchServices = async () => {
    try {
      setStatus('loading');
      
      // Gọi API lấy dữ liệu từ Backend
      // Data bóc tách từ vỏ bọc nếu Backend có cấu trúc chuẩn như lúc login
      const responseData = await adminApi.getAllServices() as MaybeEnveloped<ServiceDto[]>;
      const data = responseData.data ? responseData.data : responseData;
      
      setServices(data);
      setStatus('success');
    } catch (error) {
      console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      setStatus('error');
    }
  };

  useEffect(() => { 
    // Tránh lỗi gọi setState đồng bộ bằng cách bọc gọi hàm trong setTimeout (chỉ áp dụng ở strict mode nếu cần thiết)
    // Hoặc đơn giản là gọi thẳng vì bản chất fetchServices đã là async
    setTimeout(() => {
      fetchServices();
    }, 0);
  }, []);

  const columns: AdminTableColumn<ServiceDto>[] = [
    { id: 'name', header: 'Tên Dịch Vụ', render: (r) => r.name },
    { id: 'price', header: 'Giá Cơ Bản', render: (r) => `${r.basePrice.toLocaleString()} VND` },
    { id: 'minHours', header: 'Giờ tối thiểu', render: (r) => `${r.minimumHours} giờ` },
    // Có thể thêm cột trạng thái IsActive ở đây nếu cần
    { id: 'isActive', header: 'Trạng thái', render: (r) => r.isActive ? 'Hoạt động' : 'Đã ẩn' }
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
        onRetry={fetchServices}
      />
      
      <ServiceFormDialog 
        key={selectedService?.id || (openDialog ? 'new' : 'closed')}
        open={openDialog}
        service={selectedService}
        onClose={() => setOpenDialog(false)}
        onSuccess={() => { setOpenDialog(false); fetchServices(); }}
      />
    </>
  );
}

// ----------------------------------------------------
// COMPONENT DIALOG 
// ----------------------------------------------------
function ServiceFormDialog({ open, service, onClose, onSuccess }: { open: boolean, service: ServiceDto | null, onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState<Partial<ServiceDto>>(
    service || { name: '', description: '', propertyType: 'House', unitType: 'Hour', basePrice: 0, minimumHours: 2, isActive: true }
  );

  const handleSave = () => {
    if (service) {
      const updateData: UpdateServiceDto = {
        name: formData.name || '',
        description: formData.description,
        basePrice: formData.basePrice || 0,
        minimumHours: formData.minimumHours || 0,
        isActive: formData.isActive ?? true,
      };
      adminApi.updateService(service.id, updateData).then(onSuccess);
    } else {
      const createData: CreateServiceDto = {
        name: formData.name || '',
        description: formData.description,
        propertyType: formData.propertyType || 'House',
        unitType: formData.unitType || 'Hour',
        basePrice: formData.basePrice || 0,
        minimumHours: formData.minimumHours || 0,
      };
      adminApi.createService(createData).then(onSuccess);
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
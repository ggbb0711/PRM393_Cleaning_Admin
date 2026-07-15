import { Box, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { adminApi, type AdminDashboardStatsDto } from '../../api/adminApi';
// Import các component cần thiết từ thư viện recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function DashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStatsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboardStats()
      // Tách vỏ ApiResponse nếu BE đang bọc
      .then((res: any) => setStats(res.data ? res.data : res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  // 1. Dữ liệu cho các Thẻ thống kê (Cards)
  const summaries = [
    { label: 'Tổng Khách Hàng', value: stats?.totalClients || 0, color: 'primary.main' },
    { label: 'Tổng Thợ', value: stats?.totalWorkers || 0, color: 'secondary.main' },
    { label: 'Tổng Đơn Dọn Dẹp', value: stats?.totalBookings || 0, color: 'info.main' },
    { label: 'Doanh Thu', value: `${stats?.totalRevenue?.toLocaleString() || 0} VND`, color: 'success.main' },
  ];

  // 2. Dữ liệu cho Biểu đồ (Bỏ doanh thu ra vì lệch thang đo với các số lượng khác)
  const chartData = [
    { name: 'Khách Hàng', 'Số lượng': stats?.totalClients || 0 },
    { name: 'Thợ', 'Số lượng': stats?.totalWorkers || 0 },
    { name: 'Đơn Dọn Dẹp', 'Số lượng': stats?.totalBookings || 0 },
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>Dashboard</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>Tổng quan số liệu hệ thống CleanAI.</Typography>
      </Box>

      {/* Khu vực 1: Các Thẻ Thống Kê Tổng Quan */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, minmax(0, 1fr))' }, gap: 2 }}>
        {summaries.map((summary) => (
          <Card variant="outlined" key={summary.label} sx={{ boxShadow: 1, borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500 }}>
                {summary.label}
              </Typography>
              <Typography color={summary.color} sx={{ mt: 1, fontWeight: 'bold' }} variant="h5">
                {summary.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Khu vực 2: Biểu đồ trực quan */}
      <Card variant="outlined" sx={{ p: 3, boxShadow: 1, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
          Biểu đồ Thống kê Số lượng
        </Typography>
        
        {/* ResponsiveContainer giúp biểu đồ tự động co giãn theo màn hình */}
        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#666' }} axisLine={false} />
              <YAxis tick={{ fill: '#666' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar 
                dataKey="Số lượng" 
                fill="#1976d2" /* Màu xanh chuẩn của MUI Primary */
                radius={[6, 6, 0, 0]} /* Bo tròn góc trên của cột */
                barSize={60} 
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    </Stack>
  );
}
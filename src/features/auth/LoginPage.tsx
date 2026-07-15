// src/app/features/auth/LoginPage.tsx
import LockOutlined from '@mui/icons-material/LockOutlined';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import thêm axios để kiểm tra lỗi
import { apiClient } from '../../api/apiClient';

// Định nghĩa interface hứng dữ liệu từ AuthResponseDto của .NET
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  profileId: string;
  fullName: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Gọi API POST /api/Auth/login (tạm bỏ <AuthResponse> để lấy vỏ bọc)
      const response = await apiClient.post('/Auth/login', {
        emailOrPhone: emailOrPhone,
        password: password,
      });

      // Lấy phần data thực sự nằm bên trong vỏ bọc ApiResponse của .NET
      // Dùng cú pháp an toàn đề phòng lúc có lúc không bọc
      const data = response.data.data ? response.data.data : response.data;

      console.log("Dữ liệu thật bóc ra từ vỏ:", data);

      // Kiểm tra quyền truy cập an toàn, đề phòng data.role bị undefined
      if (!data.role || data.role.toLowerCase() !== 'admin') {
        setError('Tài khoản của bạn không có quyền truy cập không gian quản trị.');
        setIsLoading(false);
        return;
      }

      // Lưu trữ thông tin đăng nhập vào localStorage
      localStorage.setItem('admin_access_token', data.accessToken);
      localStorage.setItem('admin_refresh_token', data.refreshToken);
      localStorage.setItem('admin_full_name', data.fullName);

      // Chuyển hướng vào trang quản trị
      navigate(from, { replace: true });
      
    } catch (err: unknown) { // Đã sửa lỗi any ở đây
      if (axios.isAxiosError(err)) {
        // Xử lý lỗi trả về từ backend (AppException)
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Sai tài khoản, mật khẩu hoặc không thể kết nối đến máy chủ.');
        }
      } else {
        setError('Đã xảy ra lỗi không xác định ở Client.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Card variant="outlined" sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 48, height: 48 }}>
              <LockOutlined />
            </Avatar>
            {/* Đã sửa lỗi fontWeight ở đây */}
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              CleanAI Admin
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đăng nhập không gian quản trị
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                id="emailOrPhone"
                label="Email hoặc Số điện thoại"
                name="emailOrPhone"
                autoComplete="email"
                autoFocus
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                disabled={isLoading}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
              >
                {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
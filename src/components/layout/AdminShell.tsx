import AssignmentIndRounded from '@mui/icons-material/AssignmentIndRounded';
import CleaningServicesRounded from '@mui/icons-material/CleaningServicesRounded';
import DashboardRounded from '@mui/icons-material/DashboardRounded';
import EventNoteRounded from '@mui/icons-material/EventNoteRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import PeopleRounded from '@mui/icons-material/PeopleRounded';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { layoutTokens } from '../../theme/tokens';

export function AdminShell() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Danh sách các menu điều hướng
  const menuItems = [
    { title: 'Dashboard', path: '/', icon: <DashboardRounded /> },
    { title: 'Duyệt thợ', path: '/worker-applications', icon: <AssignmentIndRounded /> },
    { title: 'Tài khoản', path: '/accounts', icon: <PeopleRounded /> },
    { title: 'Dịch vụ', path: '/services', icon: <CleaningServicesRounded /> },
    { title: 'Lịch dọn dẹp', path: '/bookings', icon: <EventNoteRounded /> },
  ];

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('admin_refresh_token');
      if (refreshToken) {
        await apiClient.post('/Auth/logout', {
          refreshToken: refreshToken
        });
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất ở server", error);
    } finally {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_full_name');
      navigate('/login');
    }
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar>
        <Typography color="primary" sx={{ fontWeight: 800 }} variant="h6">
          CleanAI Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      
      <Divider />
      <List sx={{ px: 1.5, py: 2 }}>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutRounded color="error" />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          width: { md: `calc(100% - ${layoutTokens.drawerWidth}px)` },
          ml: { md: `${layoutTokens.drawerWidth}px` },
        }}
      >
        <Toolbar>
          {!desktop && (
            <IconButton
  edge="start"
  aria-label="Open navigation"
  onClick={(e) => {
    setMobileOpen(true);
    e.currentTarget.blur(); 
  }}
  sx={{ mr: 1 }}
>
  <MenuRounded />
</IconButton>
          )}
          <Typography component="span" sx={{ fontWeight: 700 }}>
            Administration workspace
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: layoutTokens.drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={desktop ? 'permanent' : 'temporary'}
          open={desktop || mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: layoutTokens.drawerWidth } }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 4 } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
// src/components/common/Header.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Box,
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux';
import { USER_TYPES } from '../../utils/constants';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  
  const { user, signOut, userType } = useAuth();
  const userProfile = useSelector(state => state.user.profile);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await signOut();
    navigate('/');
  };

  const handleNavigation = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const getDashboardPath = () => {
    return userType === USER_TYPES.TUTOR ? '/tutor/dashboard' : '/dashboard';
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
          <SchoolIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold'
            }}
          >
            AI Learn
          </Typography>
        </Box>

        {/* Navigation Links (for authenticated users - hidden on mobile) */}
        {user && (
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            ml: 4, 
            gap: 2 
          }}>
            <Button
              color="inherit"
              component={Link}
              to={getDashboardPath()}
              startIcon={<DashboardIcon />}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/courses"
            >
              Courses
            </Button>
            {userType === USER_TYPES.TUTOR && (
              <Button
                color="inherit"
                component={Link}
                to="/tutor/create-course"
              >
                Create Course
              </Button>
            )}
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Right side - User actions */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationMenuOpen}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Profile */}
            <Tooltip title="Account">
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar
                  src={user.photoURL}
                  alt={user.displayName}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.displayName?.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          // Not authenticated - show login/register
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              component={Link}
              to="/login"
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/register"
            >
              Sign Up
            </Button>
          </Box>
        )}

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography variant="caption" color="primary">
              {userType === USER_TYPES.TUTOR ? 'Tutor' : 'Student'}
            </Typography>
          </Box>
          <Divider />
          
          <MenuItem onClick={() => handleNavigation(getDashboardPath())}>
            <DashboardIcon sx={{ mr: 2 }} />
            Dashboard
          </MenuItem>
          
          <MenuItem onClick={() => handleNavigation('/profile')}>
            <AccountCircle sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          
          <MenuItem onClick={() => handleNavigation('/settings')}>
            <SettingsIcon sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 2 }} />
            Sign Out
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1, minWidth: 300 }}>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          <Divider />
          
          <MenuItem onClick={handleMenuClose}>
            <Box>
              <Typography variant="body2">
                New course available: Advanced Neural Networks
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2 hours ago
              </Typography>
            </Box>
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose}>
            <Box>
              <Typography variant="body2">
                Assignment due tomorrow
              </Typography>
              <Typography variant="caption" color="text.secondary">
                1 day ago
              </Typography>
            </Box>
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose}>
            <Box>
              <Typography variant="body2">
                You earned a new badge!
              </Typography>
              <Typography variant="caption" color="text.secondary">
                3 days ago
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
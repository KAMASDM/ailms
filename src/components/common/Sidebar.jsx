// src/components/common/Sidebar.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as CourseIcon,
  Quiz as QuizIcon,
  Analytics as AnalyticsIcon,
  EmojiEvents as BadgeIcon,
  VideoCall as LiveIcon,
  Event as PlannerIcon,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  WorkspacePremium as CertificateIcon,
  ThumbUp as RecommendIcon,
  Settings as SettingsIcon,
  Create as CreateIcon,
  ManageAccounts as ManageIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { USER_TYPES } from '../../utils/constants';

const DRAWER_WIDTH = 280;

const Sidebar = ({ onStateChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile); // Set initial state based on screen size
  const [expandedItems, setExpandedItems] = useState({});
  const { userType } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Set initial open state based on screen size
  useEffect(() => {
    const shouldOpen = !isMobile;
    setOpen(shouldOpen);
  }, [isMobile]);

  // Notify parent of state changes immediately and on changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange({ open: open && !isMobile, isMobile });
    }
  }, [open, isMobile, onStateChange]);

  // Student navigation items
  const studentNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      id: 'courses',
      label: 'My Courses',
      icon: <CourseIcon />,
      path: '/courses',
      children: [
        { label: 'All Courses', path: '/courses' },
        { label: 'Enrolled', path: '/courses/enrolled' },
        { label: 'Completed', path: '/courses/completed' }
      ]
    },
    {
      id: 'quizzes',
      label: 'Quizzes',
      icon: <QuizIcon />,
      path: '/quizzes'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <AnalyticsIcon />,
      path: '/progress'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: <BadgeIcon />,
      path: '/achievements'
    },
    {
      id: 'live',
      label: 'Live Sessions',
      icon: <LiveIcon />,
      path: '/live'
    },
    {
      id: 'planner',
      label: 'Study Planner',
      icon: <PlannerIcon />,
      path: '/planner'
    },
    {
      id: 'search',
      label: 'Search',
      icon: <SearchIcon />,
      path: '/search'
    },
    {
      id: 'bookmarks',
      label: 'Bookmarks',
      icon: <BookmarkIcon />,
      path: '/bookmarks'
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: <CertificateIcon />,
      path: '/certificates'
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: <RecommendIcon />,
      path: '/recommendations'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings'
    }
  ];

  // Tutor navigation items
  const tutorNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/tutor/dashboard'
    },
    {
      id: 'courses',
      label: 'Course Management',
      icon: <CourseIcon />,
      path: '/tutor/courses',
      children: [
        { label: 'Create Course', path: '/tutor/create-course' },
        { label: 'My Courses', path: '/tutor/manage-courses' },
        { label: 'Course Analytics', path: '/tutor/analytics' }
      ]
    },
    {
      id: 'students',
      label: 'Students',
      icon: <ManageIcon />,
      path: '/tutor/students'
    },
    {
      id: 'quizzes',
      label: 'Quiz Management',
      icon: <QuizIcon />,
      path: '/tutor/quizzes'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/tutor/analytics'
    },
    {
      id: 'live',
      label: 'Live Sessions',
      icon: <LiveIcon />,
      path: '/tutor/live'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      path: '/tutor/settings'
    }
  ];

  const navItems = userType === USER_TYPES.TUTOR ? tutorNavItems : studentNavItems;

  const handleToggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (item) => {
    if (item.children) {
      return item.children.some(child => isActive(child.path));
    }
    return isActive(item.path);
  };

  const renderNavItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const active = isParentActive(item);

    return (
      <Box key={item.id}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleToggleExpand(item.id);
              } else {
                handleNavigation(item.path);
              }
            }}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: 2,
              mx: 1,
              backgroundColor: active ? 'primary.main' : 'transparent',
              color: active ? 'primary.contrastText' : 'text.primary',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: active ? 'primary.dark' : 'action.hover',
                transform: 'translateX(4px)'
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: active ? 'primary.contrastText' : 'text.secondary',
                minWidth: 40
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: active ? 600 : 500,
                fontSize: '0.95rem'
              }}
            />
            {hasChildren && (
              <Box sx={{ color: active ? 'primary.contrastText' : 'text.secondary' }}>
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </Box>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ ml: 1 }}>
              {item.children.map((child) => (
                <ListItem key={child.path} disablePadding sx={{ mb: 0.25 }}>
                  <ListItemButton
                    sx={{ 
                      pl: 5,
                      pr: 2,
                      py: 1,
                      borderRadius: 2,
                      mx: 1,
                      backgroundColor: isActive(child.path) ? 'primary.light' : 'transparent',
                      color: isActive(child.path) ? 'primary.main' : 'text.secondary',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: isActive(child.path) ? 'primary.light' : 'action.hover',
                        color: 'primary.main'
                      }
                    }}
                    onClick={() => handleNavigation(child.path)}
                  >
                    <ListItemText 
                      primary={child.label}
                      primaryTypographyProps={{
                        fontWeight: isActive(child.path) ? 600 : 400,
                        fontSize: '0.875rem'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.paper'
    }}>
      {/* Drawer Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          minHeight: 64,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" fontWeight={600} color="primary">
          Navigation
        </Typography>
        {!isMobile && (
          <IconButton 
            onClick={() => setOpen(false)}
            size="small"
            sx={{ 
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <List sx={{ 
        flexGrow: 1, 
        py: 2,
        px: 0,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.divider,
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: theme.palette.action.hover,
        },
      }}>
        {navItems.map((item) => renderNavItem(item))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              mt: '64px', // Account for header height
              height: 'calc(100vh - 64px)'
            }
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        /* Desktop drawer */
        <Drawer
          variant="permanent"
          open={true}
          sx={{
            width: open ? DRAWER_WIDTH : 0,
            flexShrink: 0,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              position: 'fixed',
              height: 'calc(100vh - 64px)',
              top: 64,
              left: open ? 0 : -DRAWER_WIDTH,
              borderRight: `1px solid ${theme.palette.divider}`,
              zIndex: theme.zIndex.drawer,
              transition: theme.transitions.create('left', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              }),
              overflowX: 'hidden',
            }
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Mobile menu button */}
      {isMobile && !open && (
        <IconButton
          color="primary"
          aria-label="open drawer"
          edge="start"
          onClick={() => setOpen(true)}
          sx={{ 
            position: 'fixed', 
            top: 70, 
            left: 8, 
            zIndex: 1300,
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              bgcolor: 'background.paper',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </>
  );
};

export default Sidebar;
// src/components/common/Sidebar.jsx
import { useState } from 'react';
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

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const { userType } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleToggleExpand(item.id);
              } else {
                handleNavigation(item.path);
              }
            }}
            sx={{
              backgroundColor: active ? 'primary.light' : 'transparent',
              color: active ? 'primary.contrastText' : 'inherit',
              '&:hover': {
                backgroundColor: active ? 'primary.main' : 'action.hover'
              }
            }}
          >
            <ListItemIcon sx={{ color: active ? 'primary.contrastText' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItem key={child.path} disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => handleNavigation(child.path)}
                    selected={isActive(child.path)}
                  >
                    <ListItemText primary={child.label} />
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          p: 1,
          minHeight: 64
        }}
      >
        <IconButton onClick={() => setOpen(false)}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      
      <Divider />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, py: 0 }}>
        {navItems.map((item) => renderNavItem(item))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
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
              width: DRAWER_WIDTH
            }
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        /* Desktop drawer */
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              position: 'relative',
              height: 'calc(100vh - 64px)',
              top: 64
            }
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Mobile menu button */}
      {isMobile && !open && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setOpen(true)}
          sx={{ position: 'fixed', top: 70, left: 8, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default Sidebar;
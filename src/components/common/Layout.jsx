// src/components/common/Layout.jsx
import { useState } from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

const Layout = ({ children, showSidebar = true, maxWidth = 'xl' }) => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarState, setSidebarState] = useState({ open: !isMobile, isMobile });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      {/* Sidebar for authenticated users - fixed positioned, outside main layout flow */}
      {isAuthenticated && showSidebar && (
        <Sidebar onStateChange={setSidebarState} />
      )}
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)', // Subtract header height
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          // Add margin for desktop when sidebar is actually open
          ...(isAuthenticated && showSidebar && sidebarState.open && !sidebarState.isMobile && {
            ml: '280px', // Account for fixed sidebar width
          }),
        }}
      >
        {maxWidth ? (
          <Container 
            maxWidth={maxWidth}
            sx={{
              px: { xs: 0, sm: 2 }, // Remove padding on mobile for full width
              height: '100%',
            }}
          >
            {children}
          </Container>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
};

export default Layout;
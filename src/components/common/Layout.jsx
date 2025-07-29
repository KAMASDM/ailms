// src/components/common/Layout.jsx
import { Box, Container } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

const Layout = ({ children, showSidebar = true, maxWidth = 'xl' }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Sidebar for authenticated users */}
        {isAuthenticated && showSidebar && (
          <Sidebar />
        )}
        
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: 'background.default',
            minHeight: 'calc(100vh - 64px)' // Subtract header height
          }}
        >
          {maxWidth ? (
            <Container maxWidth={maxWidth}>
              {children}
            </Container>
          ) : (
            children
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
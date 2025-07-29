// src/components/auth/AuthGuard.jsx
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { USER_TYPES } from '../../utils/constants';

const AuthGuard = ({ children, requiredUserType = null, fallbackPath = '/login' }) => {
  const { user, isAuthenticated, isLoading, userType } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={fallbackPath}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check if user type is required and matches
  if (requiredUserType && userType !== requiredUserType) {
    // Redirect to appropriate dashboard based on user type
    const redirectPath = userType === USER_TYPES.TUTOR ? '/tutor/dashboard' : '/dashboard';
    return (
      <Navigate
        to={redirectPath}
        replace
      />
    );
  }

  // User is authenticated and has correct permissions
  return children;
};

// Specific guards for different user types
export const StudentGuard = ({ children }) => (
  <AuthGuard requiredUserType={USER_TYPES.STUDENT}>
    {children}
  </AuthGuard>
);

export const TutorGuard = ({ children }) => (
  <AuthGuard requiredUserType={USER_TYPES.TUTOR}>
    {children}
  </AuthGuard>
);

// Component for protecting routes that should only be accessible to non-authenticated users
export const GuestGuard = ({ children }) => {
  const { isAuthenticated, isLoading, userType } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Redirect authenticated users to their dashboard
  if (isAuthenticated) {
    const redirectPath = userType === USER_TYPES.TUTOR ? '/tutor/dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default AuthGuard;
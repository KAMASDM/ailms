// src/components/common/Loading.jsx
import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';

const Loading = ({ 
  type = 'spinner', 
  size = 40, 
  message = 'Loading...', 
  fullScreen = false,
  lines = 3 
}) => {
  if (type === 'skeleton') {
    return (
      <Box sx={{ width: '100%' }}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={60}
            sx={{ mb: 1, borderRadius: 1 }}
          />
        ))}
      </Box>
    );
  }

  const containerStyles = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    p: 4
  };

  return (
    <Box sx={containerStyles}>
      <CircularProgress size={size} />
      {message && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loading;
// src/components/common/Loading.jsx
import { Box, CircularProgress, Typography, Skeleton, LinearProgress } from '@mui/material';

const Loading = ({ 
  type = 'spinner', 
  size = 40, 
  message = 'Loading...', 
  fullScreen = false,
  lines = 3,
  variant = 'text', // for skeleton: 'text', 'circular', 'rectangular', 'rounded'
  height = 60,
  showProgress = false,
  progress = 0
}) => {
  if (type === 'skeleton') {
    return (
      <Box sx={{ width: '100%' }}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant={variant}
            height={height}
            sx={{ 
              mb: 1, 
              borderRadius: variant === 'rounded' ? 2 : 1,
              '&:last-child': { mb: 0 }
            }}
          />
        ))}
      </Box>
    );
  }

  if (type === 'linear') {
    return (
      <Box sx={{ width: '100%', py: 2 }}>
        <LinearProgress 
          variant={showProgress ? 'determinate' : 'indeterminate'} 
          value={progress}
          sx={{ mb: 1 }}
        />
        {message && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
          >
            {message}
          </Typography>
        )}
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
// src/components/common/NotificationSnackbar.jsx
import { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Slide
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

const NotificationSnackbar = ({
  open,
  onClose,
  message,
  title,
  severity = 'info', // 'error', 'warning', 'info', 'success'
  autoHideDuration = 6000,
  position = { vertical: 'bottom', horizontal: 'left' },
  action,
  variant = 'filled' // 'filled', 'outlined', 'standard'
}) => {
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => {
    setInternalOpen(open);
  }, [open]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    
    setInternalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const renderAction = () => {
    if (action) {
      return action;
    }

    return (
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    );
  };

  return (
    <Snackbar
      open={internalOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={position}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant={variant}
        action={renderAction()}
        sx={{ width: '100%' }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

// Hook for managing notifications
export const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    title: '',
    severity: 'info'
  });

  const showNotification = (message, options = {}) => {
    setNotification({
      open: true,
      message,
      title: options.title || '',
      severity: options.severity || 'info',
      autoHideDuration: options.autoHideDuration || 6000
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const showSuccess = (message, title) => {
    showNotification(message, { severity: 'success', title });
  };

  const showError = (message, title) => {
    showNotification(message, { severity: 'error', title });
  };

  const showWarning = (message, title) => {
    showNotification(message, { severity: 'warning', title });
  };

  const showInfo = (message, title) => {
    showNotification(message, { severity: 'info', title });
  };

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default NotificationSnackbar;
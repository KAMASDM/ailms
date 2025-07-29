// src/components/common/ConfirmDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  IconButton,
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning', 'error', 'info', 'success'
  confirmColor = 'primary',
  isLoading = false,
  maxWidth = 'sm'
}) => {
  const getIcon = () => {
    const iconProps = { sx: { fontSize: 40, mb: 1 } };
    
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" {...iconProps} />;
      case 'success':
        return <SuccessIcon color="success" {...iconProps} />;
      case 'info':
        return <InfoIcon color="info" {...iconProps} />;
      case 'warning':
      default:
        return <WarningIcon color="warning" {...iconProps} />;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading && onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={isLoading}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          {getIcon()}
        </Box>
        
        <DialogContentText id="confirm-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          variant="outlined"
        >
          {cancelText}
        </Button>
        
        <Button
          onClick={handleConfirm}
          color={confirmColor}
          variant="contained"
          disabled={isLoading}
          autoFocus
        >
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
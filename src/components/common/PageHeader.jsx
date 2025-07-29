// src/components/common/PageHeader.jsx
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  status,
  showBackButton = false,
  backPath = null
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0) return null;

    return (
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          if (isLast || !crumb.path) {
            return (
              <Typography key={index} color="text.primary">
                {crumb.label}
              </Typography>
            );
          }

          return (
            <Link
              key={index}
              component={RouterLink}
              to={crumb.path}
              underline="hover"
              color="inherit"
            >
              {crumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  const renderStatus = () => {
    if (!status) return null;

    const getStatusColor = () => {
      switch (status.type) {
        case 'success':
          return 'success';
        case 'warning':
          return 'warning';
        case 'error':
          return 'error';
        case 'info':
        default:
          return 'primary';
      }
    };

    return (
      <Chip
        label={status.label}
        color={getStatusColor()}
        size="small"
        variant="outlined"
      />
    );
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Breadcrumbs */}
      {renderBreadcrumbs()}

      {/* Main header content */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        {/* Left side - Title and subtitle */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            {showBackButton && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ flexShrink: 0 }}
              >
                Back
              </Button>
            )}
            
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {title}
            </Typography>
            
            {renderStatus()}
          </Box>

          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Right side - Actions */}
        {actions.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            {actions.map((action, index) => {
              if (typeof action === 'function') {
                return action(index);
              }

              return (
                <Button
                  key={index}
                  variant={action.variant || 'contained'}
                  color={action.color || 'primary'}
                  size={action.size || 'medium'}
                  startIcon={action.icon}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  href={action.href}
                  component={action.component}
                  to={action.to}
                >
                  {action.label}
                </Button>
              );
            })}
          </Stack>
        )}
      </Box>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default PageHeader;
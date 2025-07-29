// src/pages/LiveSessionsPage.jsx
import { Box, Typography } from '@mui/material';
import { PageHeader } from '../components/common';

const LiveSessionsPage = ({ variant = 'student' }) => {
  return (
    <Box>
      <PageHeader
        title="Live Sessions"
        subtitle={variant === 'tutor' ? 'Manage your live teaching sessions' : 'Join live learning sessions'}
      />
      <Typography variant="body1">
        Live sessions functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default LiveSessionsPage;
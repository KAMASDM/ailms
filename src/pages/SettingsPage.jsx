// src/pages/SettingsPage.jsx
import { Box, Typography } from '@mui/material';
import { PageHeader } from '../components/common';

const SettingsPage = ({ variant = 'student' }) => {
  return (
    <Box>
      <PageHeader
        title="Settings"
        subtitle={`Manage your ${variant} account settings and preferences`}
      />
      <Typography variant="body1">
        Settings page functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default SettingsPage;
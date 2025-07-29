// src/pages/ProfilePage.jsx
import { Box, Typography } from '@mui/material';
import { PageHeader } from '../components/common';

const ProfilePage = () => {
  return (
    <Box>
      <PageHeader
        title="Profile"
        subtitle="Manage your account information and preferences"
      />
      <Typography variant="body1">
        Profile page functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default ProfilePage;
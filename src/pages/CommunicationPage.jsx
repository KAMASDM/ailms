// src/pages/CommunicationPage.jsx
import { Box, Typography } from '@mui/material';
import { PageHeader } from '../components/common';

const CommunicationPage = () => {
  return (
    <Box>
      <PageHeader
        title="Communication"
        subtitle="Chat with instructors and fellow students"
      />
      <Typography variant="body1">
        Communication functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default CommunicationPage;

// src/pages/CertificatesPage.jsx
import { Box, Typography } from '@mui/material';
import { PageHeader } from '../components/common';

const CertificatesPage = () => {
  return (
    <Box>
      <PageHeader
        title="Certificates"
        subtitle="View and download your course completion certificates"
      />
      <Typography variant="body1">
        Certificates page functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default CertificatesPage;
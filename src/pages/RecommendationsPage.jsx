// src/pages/RecommendationsPage.jsx
import { Box, Typography } from '@mui/material';
import { PageHeader } from '../components/common';

const RecommendationsPage = () => {
  return (
    <Box>
      <PageHeader
        title="Recommendations"
        subtitle="AI-powered learning recommendations tailored for you"
      />
      <Typography variant="body1">
        AI recommendations functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default RecommendationsPage;
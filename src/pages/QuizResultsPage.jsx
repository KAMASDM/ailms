// src/pages/QuizResultsPage.jsx
import { Box, Typography } from '@mui/material';
import { PageHeader } from '../components/common';

const QuizResultsPage = () => {
  return (
    <Box>
      <PageHeader
        title="Quiz Results"
        subtitle="Review your quiz performance and feedback"
      />
      <Typography variant="body1">
        Quiz results page functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default QuizResultsPage;
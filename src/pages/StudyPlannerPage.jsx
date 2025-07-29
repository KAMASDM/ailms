// src/pages/StudyPlannerPage.jsx
import { Box, Typography } from '@mui/material';
import { PageHeader } from '../components/common';

const StudyPlannerPage = () => {
  return (
    <Box>
      <PageHeader
        title="Study Planner"
        subtitle="Plan your learning schedule and set study goals"
      />
      <Typography variant="body1">
        Study planner functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default StudyPlannerPage;
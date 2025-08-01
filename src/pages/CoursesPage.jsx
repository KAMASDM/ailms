// src/pages/CoursesPage.jsx
import React from 'react';
import LiveCourseList from '../components/courses/LiveCourseList';
import { Box, Typography } from '@mui/material';

const CoursesPage = ({ filter = 'all', variant = 'student' }) => {
  const getTitle = () => {
    if (filter === 'enrolled') return 'My Courses';
    if (filter === 'completed') return 'Completed Courses';
    return 'All Courses';
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Courses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover and enroll in cutting-edge AI courses with real-time updates
        </Typography>
      </Box>
      
      <LiveCourseList 
        title={getTitle()}
        variant={variant}
        showFilters={true}
        showSearch={true}
      />
    </Box>
  );
};

export default CoursesPage;
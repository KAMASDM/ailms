// src/pages/TutorCoursesPage.jsx
import React from 'react';
import LiveCourseList from '../components/courses/LiveCourseList';
import { Button, Box, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const TutorCoursesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            My Courses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track your courses with real-time updates
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/tutor/create-course')}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Create New Course
        </Button>
      </Box>
      
      <LiveCourseList
        tutorId={user?.uid}
        title="Your Courses"
        variant="created"
        showFilters={true}
        showSearch={true}
      />
    </Box>
  );
};

export default TutorCoursesPage;
// src/components/courses/LiveCourseList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  CircularProgress,
  Typography,
  Button
} from '@mui/material';
import CourseList from './CourseList';
import realtimeCourseService from '../../services/realtimeCourseService';

const LiveCourseList = ({ 
  showFilters = true, 
  showSearch = true,
  limit = null,
  title = "All Courses",
  tutorId = null, // If provided, show only courses by this tutor
  ...otherProps 
}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let subscription;

    if (tutorId) {
      // Subscribe to courses by specific tutor
      subscription = realtimeCourseService.subscribeToTutorCourses(tutorId, (response) => {
        if (response.success) {
          setCourses(response.courses);
          setError(null);
        } else {
          setError(response.error);
          setCourses([]);
        }
        setLoading(false);
      });
    } else {
      // Subscribe to all published courses
      const filters = {
        status: 'published',
        limit: limit
      };

      subscription = realtimeCourseService.subscribeToAllCourses((response) => {
        if (response.success) {
          setCourses(response.courses);
          setError(null);
        } else {
          setError(response.error);
          setCourses([]);
        }
        setLoading(false);
      }, filters);
    }

    // Cleanup subscription on unmount
    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [tutorId, limit]);

  if (loading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress sx={{ mr: 2 }} />
          <Typography variant="body1">Loading live course data...</Typography>
        </Box>
        <CourseList 
          courses={[]}
          loading={true}
          title={title}
          showFilters={showFilters}
          showSearch={showSearch}
          {...otherProps}
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load live course data: {error}
        </Alert>
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {courses.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {tutorId ? 'No courses created yet' : 'No courses available'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tutorId 
              ? 'Start by creating your first course!'
              : 'New courses will appear here automatically when tutors publish them.'
            }
          </Typography>
        </Box>
      ) : (
        <CourseList 
          courses={courses}
          loading={false}
          title={title}
          showFilters={showFilters}
          showSearch={showSearch}
          {...otherProps}
        />
      )}
    </Box>
  );
};

export default LiveCourseList;
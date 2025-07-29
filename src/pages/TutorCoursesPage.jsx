// src/pages/TutorCoursesPage.jsx
import { CourseList } from '../components/courses';
import { Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TutorCoursesPage = () => {
  const navigate = useNavigate();

  // Mock tutor courses
  const courses = [
    {
      id: 1,
      title: 'My Deep Learning Course',
      description: 'A comprehensive course on deep learning',
      thumbnail: '/api/placeholder/300/200',
      price: 99,
      studentsCount: 45,
      rating: 4.8,
      reviewsCount: 12,
      status: 'published'
    }
  ];

  return (
    <CourseList 
      courses={courses}
      title="My Courses"
      variant="created"
      showFilters={false}
      actions={[
        {
          label: 'Create New Course',
          icon: <AddIcon />,
          onClick: () => navigate('/tutor/create-course'),
          variant: 'contained'
        }
      ]}
    />
  );
};

export default TutorCoursesPage;
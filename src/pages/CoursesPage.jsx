// src/pages/CoursesPage.jsx
import { CourseList } from '../components/courses';

const CoursesPage = ({ filter = 'all', variant = 'student' }) => {
  // Mock courses data
  const courses = [
    {
      id: 1,
      title: 'Deep Learning Fundamentals',
      description: 'Learn the basics of neural networks and deep learning',
      thumbnail: '/api/placeholder/300/200',
      instructor: { name: 'Dr. Sarah Chen', avatar: '/api/placeholder/40/40' },
      price: 99,
      level: 'beginner',
      category: 'Deep Learning',
      duration: 720,
      studentsCount: 1234,
      rating: 4.8,
      reviewsCount: 156
    },
    {
      id: 2,
      title: 'Computer Vision with CNNs',
      description: 'Master computer vision using convolutional neural networks',
      thumbnail: '/api/placeholder/300/200',
      instructor: { name: 'Prof. Mike Johnson', avatar: '/api/placeholder/40/40' },
      price: 149,
      level: 'intermediate',
      category: 'Computer Vision',
      duration: 960,
      studentsCount: 856,
      rating: 4.7,
      reviewsCount: 94
    }
  ];

  return (
    <CourseList 
      courses={courses}
      title={filter === 'enrolled' ? 'My Courses' : filter === 'completed' ? 'Completed Courses' : 'All Courses'}
      variant={variant}
    />
  );
};

export default CoursesPage;
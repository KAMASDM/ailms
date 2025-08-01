// src/components/courses/CourseDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Avatar,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
  Paper,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  WorkspacePremium as CertificateIcon,
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { PageHeader, Loading } from '../common';
import { formatDuration, formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import courseService from '../../services/courseService';
import userService from '../../services/userService';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    loadCourseDetail();
  }, [id]);

  const loadCourseDetail = async () => {
    setLoading(true);
    try {
      // Load course data from Firebase
      const courseResult = await courseService.getCourse(id);
      
      if (courseResult.success) {
        setCourse(courseResult.course);
        
        // Check if user is enrolled
        if (user) {
          const enrollmentResult = await courseService.checkEnrollment(user.uid, id);
          setIsEnrolled(enrollmentResult.success && enrollmentResult.isEnrolled);
          
          // Check if course is bookmarked
          const bookmarkResult = await userService.isBookmarked(user.uid, id);
          setIsBookmarked(bookmarkResult.success && bookmarkResult.isBookmarked);
        }
      } else {
        console.error('Failed to load course:', courseResult.error);
        // Fallback to mock data for development
        const mockCourse = {
        id: id,
        title: 'Deep Learning Fundamentals',
        description: 'Master the foundations of deep learning and neural networks. This comprehensive course covers everything from basic perceptrons to advanced architectures like CNNs, RNNs, and Transformers.',
        fullDescription: `This course provides a comprehensive introduction to deep learning, one of the most exciting areas of machine learning. You'll learn about neural networks, backpropagation, and how to build and train deep learning models.

        Throughout this course, you'll work on hands-on projects that will give you practical experience with popular deep learning frameworks. By the end, you'll be able to build your own neural networks and understand how to apply them to real-world problems.

        Whether you're a beginner looking to enter the field of AI or an experienced programmer wanting to add deep learning to your skillset, this course will provide you with the knowledge and tools you need to succeed.`,
        thumbnail: '/api/placeholder/800/400',
        price: 99,
        originalPrice: 149,
        level: 'intermediate',
        category: 'Deep Learning',
        duration: 720, // minutes
        lessonsCount: 45,
        studentsCount: 1234,
        rating: 4.8,
        reviewsCount: 156,
        language: 'English',
        lastUpdated: new Date('2024-01-15'),
        instructor: {
          id: 1,
          name: 'Dr. Sarah Chen',
          title: 'AI Research Scientist',
          avatar: '/api/placeholder/100/100',
          bio: 'Dr. Sarah Chen is a leading AI researcher with over 10 years of experience in deep learning and neural networks.',
          rating: 4.9,
          coursesCount: 12,
          studentsCount: 25000
        },
        curriculum: [
          {
            id: 1,
            title: 'Introduction to Deep Learning',
            lessons: [
              { id: 1, title: 'What is Deep Learning?', duration: 15, type: 'video', isPreview: true },
              { id: 2, title: 'Neural Network Basics', duration: 20, type: 'video', isPreview: false },
              { id: 3, title: 'Setting Up Your Environment', duration: 25, type: 'video', isPreview: false },
              { id: 4, title: 'Quiz: Fundamentals', duration: 10, type: 'quiz', isPreview: false }
            ]
          },
          {
            id: 2,
            title: 'Neural Network Architectures',
            lessons: [
              { id: 5, title: 'Feedforward Networks', duration: 30, type: 'video', isPreview: false },
              { id: 6, title: 'Activation Functions', duration: 18, type: 'video', isPreview: false },
              { id: 7, title: 'Backpropagation Algorithm', duration: 35, type: 'video', isPreview: false },
              { id: 8, title: 'Hands-on: Building Your First Network', duration: 45, type: 'assignment', isPreview: false }
            ]
          },
          {
            id: 3,
            title: 'Convolutional Neural Networks',
            lessons: [
              { id: 9, title: 'Introduction to CNNs', duration: 25, type: 'video', isPreview: false },
              { id: 10, title: 'Convolution and Pooling', duration: 30, type: 'video', isPreview: false },
              { id: 11, title: 'CNN Architectures', duration: 28, type: 'video', isPreview: false },
              { id: 12, title: 'Image Classification Project', duration: 60, type: 'project', isPreview: false }
            ]
          }
        ],
        whatYouWillLearn: [
          'Understand the fundamentals of neural networks and deep learning',
          'Build and train your own neural networks from scratch',
          'Master popular deep learning frameworks like TensorFlow and PyTorch',
          'Apply CNNs for computer vision tasks',
          'Implement RNNs for sequence modeling',
          'Understanding of modern architectures like Transformers',
          'Best practices for training deep learning models',
          'Real-world project experience'
        ],
        requirements: [
          'Basic knowledge of Python programming',
          'Understanding of linear algebra and calculus',
          'Familiarity with machine learning concepts (helpful but not required)',
          'A computer with internet connection'
        ],
        features: [
          'Lifetime access to course materials',
          'Certificate of completion',
          'Access to instructor and community',
          'Mobile and TV access',
          'Assignments and projects',
          'Downloadable resources'
        ]
      };

        setCourse(mockCourse);
        
        // Check if user is enrolled (mock)
        setIsEnrolled(false);
        setIsBookmarked(false);
      }
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    if (course.price > 0) {
      setShowEnrollDialog(true);
    } else {
      // Free course - enroll directly
      enrollInCourse();
    }
  };

  const enrollInCourse = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      const result = await courseService.enrollInCourse(user.uid, course.id);
      
      if (result.success) {
        setIsEnrolled(true);
        setShowEnrollDialog(false);
        // Navigate to course learning page
        navigate(`/course/${course.id}/learn`);
      } else {
        console.error('Failed to enroll:', result.error);
        // Show error notification
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Implementation for bookmarking
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTotalDuration = () => {
    if (!course?.curriculum) return 0;
    return course.curriculum.reduce((total, module) => {
      return total + (module.lessons?.reduce((moduleTotal, lesson) => moduleTotal + lesson.duration, 0) || 0);
    }, 0);
  };

  const getCompletedLessons = () => {
    // Mock completed lessons
    return 12;
  };

  const getTotalLessons = () => {
    if (!course?.curriculum) return 0;
    return course.curriculum.reduce((total, module) => total + (module.lessons?.length || 0), 0);
  };

  if (loading) {
    return <Loading message="Loading course details..." />;
  }

  if (!course) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6">Course not found</Typography>
        <Button onClick={() => navigate('/courses')} sx={{ mt: 2 }}>
          Browse Courses
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={course.title}
        breadcrumbs={[
          { label: 'Courses', path: '/courses' },
          { label: course.title }
        ]}
        showBackButton
        backPath="/courses"
      />

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Course Video/Image */}
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="300"
              image={course.thumbnail}
              alt={course.title}
              sx={{ objectFit: 'cover' }}
            />
          </Card>

          {/* Course Info Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Overview" />
              <Tab label="Curriculum" />
              <Tab label="Instructor" />
              <Tab label="Reviews" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Overview Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Course Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {course.fullDescription}
                  </Typography>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    What You'll Learn
                  </Typography>
                  <List>
                    {course.whatYouWillLearn?.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Requirements
                  </Typography>
                  <List>
                    {course.requirements?.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Curriculum Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Course Content
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {course.curriculum?.length || 0} modules • {getTotalLessons()} lessons • {formatDuration(getTotalDuration())} total
                  </Typography>

                  {course.curriculum?.map((module) => (
                    <Accordion key={module.id} sx={{ mt: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {module.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto', mr: 2 }}>
                          {module.lessons?.length || 0} lessons
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {module.lessons?.map((lesson) => (
                            <ListItem key={lesson.id}>
                              <ListItemIcon>
                                {lesson.isPreview ? (
                                  <PlayIcon color="primary" />
                                ) : isEnrolled ? (
                                  <PlayIcon />
                                ) : (
                                  <LockIcon color="action" />
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={lesson.title}
                                secondary={`${formatDuration(lesson.duration)} • ${lesson.type}`}
                              />
                              {lesson.isPreview && (
                                <Chip label="Preview" size="small" color="primary" />
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}

              {/* Instructor Tab */}
              {activeTab === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={course.instructor.avatar}
                      sx={{ width: 80, height: 80, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">{course.instructor.name}</Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {course.instructor.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <StarIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                        <Typography variant="body2">
                          {course.instructor.rating} instructor rating
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body1" paragraph>
                    {course.instructor.bio}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Courses: {course.instructor.coursesCount}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Students: {course.instructor.studentsCount.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Reviews Tab */}
              {activeTab === 3 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h2" fontWeight="bold" sx={{ mr: 2 }}>
                      {course.rating}
                    </Typography>
                    <Box>
                      <Rating value={course.rating} precision={0.1} readOnly />
                      <Typography variant="body2" color="text.secondary">
                        {course.reviewsCount} reviews
                      </Typography>
                    </Box>
                  </Box>

                  {/* Mock reviews */}
                  <Typography variant="body1">
                    Reviews section would be implemented here with actual review data.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            {/* Enrollment Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                {/* Price */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </Typography>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <Typography 
                      variant="h6" 
                      sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                    >
                      ${course.originalPrice}
                    </Typography>
                  )}
                </Box>

                {/* Progress for enrolled students */}
                {isEnrolled && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Your Progress
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(getCompletedLessons() / getTotalLessons()) * 100}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {getCompletedLessons()} of {getTotalLessons()} lessons completed
                    </Typography>
                  </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{ mb: 2 }}>
                  {isEnrolled ? (
                    <Button 
                      variant="contained" 
                      fullWidth 
                      size="large"
                      startIcon={<PlayIcon />}
                      onClick={() => navigate(`/course/${course.id}/learn`)}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      fullWidth 
                      size="large"
                      onClick={handleEnroll}
                    >
                      {course.price === 0 ? 'Enroll for Free' : 'Buy Now'}
                    </Button>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={handleBookmark}>
                    {isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                  </IconButton>
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
                  <IconButton>
                    <DownloadIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course Information
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon><SchoolIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Level" 
                      secondary={course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><TimeIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Duration" 
                      secondary={formatDuration(course.duration)}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Students" 
                      secondary={course.studentsCount.toLocaleString()}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><LanguageIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Language" 
                      secondary={course.language}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><CertificateIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Certificate" 
                      secondary="Certificate of completion"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  This Course Includes
                </Typography>
                
                <List dense>
                  {course.features?.map((feature, index) => (
                    <ListItem key={index}>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Enrollment Dialog */}
      <Dialog open={showEnrollDialog} onClose={() => setShowEnrollDialog(false)}>
        <DialogTitle>Enroll in Course</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            You are about to enroll in "{course.title}" for ${course.price}.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will have lifetime access to all course materials.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEnrollDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={enrollInCourse}>
            Enroll Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseDetail;
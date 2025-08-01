// src/components/dashboard/TutorDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  School as CourseIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { PageHeader, NotificationSnackbar } from '../common';
import platformService from '../../services/platformService';
import courseService from '../../services/courseService';

const TutorDashboard = () => {
  const { user } = useAuth();
  const userProfile = useSelector(state => state.user.profile);
  const navigate = useNavigate();
  
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
    avgRating: 0
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatingTestCourse, setCreatingTestCourse] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user?.uid) {
      loadTutorDashboardData();
    }
  }, [user]);

  const loadTutorDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tutor-specific dashboard data from Firebase
      const response = await platformService.getUserDashboardData(user.uid, user.userType);
      
      if (response.success) {
        const { courses = [], stats = {} } = response.data || {};
        
        setDashboardStats({
          totalStudents: stats.totalStudents || 0,
          totalCourses: stats.totalCourses || courses.length || 0,
          totalRevenue: stats.totalRevenue || 0,
          avgRating: stats.avgRating || 4.5 // This would be calculated from course ratings
        });

        // Get top courses by enrollment
        const sortedCourses = courses
          .map(course => ({
            ...course,
            enrollmentCount: course.studentsCount || 0,
            revenue: (course.price || 0) * (course.studentsCount || 0)
          }))
          .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
          .slice(0, 5);

        setTopCourses(sortedCourses);

        // For recent enrollments, we would need a separate collection
        // For now, we'll show an empty array since it requires more complex queries
        setRecentEnrollments([]);

        // Generate mock analytics data (this would come from a separate analytics service)
        const generateAnalyticsData = () => {
          const last7Days = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push({
              name: date.toLocaleDateString('en-US', { weekday: 'short' }),
              enrollments: Math.floor(Math.random() * 20) + 5,
              revenue: Math.floor(Math.random() * 500) + 100
            });
          }
          return last7Days;
        };
        
        setAnalyticsData(generateAnalyticsData());

      } else {
        // If no data found, initialize with empty state instead of error
        console.log('No dashboard data found, initializing empty state');
        setDashboardStats({
          totalStudents: 0,
          totalCourses: 0,
          totalRevenue: 0,
          avgRating: 0
        });
        setTopCourses([]);
        setRecentEnrollments([]);
        setAnalyticsData([]);
      }

    } catch (err) {
      console.error('Error loading tutor dashboard:', err);
      // Initialize with empty state instead of showing error for new tutors
      setDashboardStats({
        totalStudents: 0,
        totalCourses: 0,
        totalRevenue: 0,
        avgRating: 0
      });
      setTopCourses([]);
      setRecentEnrollments([]);
      setAnalyticsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const handleCreateTestCourse = async () => {
    try {
      setCreatingTestCourse(true);
      const result = await courseService.createTestCourse(user.uid);
      if (result.success) {
        setNotification({
          open: true,
          message: result.message,
          severity: 'success'
        });
        // Reload dashboard data to show the new course
        loadTutorDashboardData();
      } else {
        setNotification({
          open: true,
          message: result.error || 'Failed to create test course',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating test course:', error);
      setNotification({
        open: true,
        message: 'Error creating test course',
        severity: 'error'
      });
    } finally {
      setCreatingTestCourse(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Tutor Dashboard</Typography>
        <Grid container spacing={3}>
          {/* Stats Loading */}
          <Grid item xs={12} sm={6} md={3}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
          {/* Analytics Chart Loading */}
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          {/* Top Courses Loading */}
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
        <Typography sx={{ textAlign: 'center', mt: 2 }}>Loading your dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Tutor Dashboard</Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadTutorDashboardData}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={`${getGreeting()}, ${user?.displayName?.split(' ')[0] || 'Tutor'}!`}
        subtitle="Manage your courses and track your teaching progress"
        actions={[
          {
            label: 'Create New Course',
            icon: <AddIcon />,
            onClick: () => navigate('/tutor/create-course'),
            variant: 'contained'
          }
        ]}
      />

      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {/* Stats Cards */}
        <Grid item xs={6} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ 
              textAlign: 'center',
              py: { xs: 2, md: 3 }
            }}>
              <PeopleIcon 
                color="primary" 
                sx={{ 
                  fontSize: { xs: 36, md: 48 }, 
                  mb: 1 
                }} 
              />
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color="primary"
                sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
              >
                {dashboardStats.totalStudents}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
              >
                Total Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ 
              textAlign: 'center',
              py: { xs: 2, md: 3 }
            }}>
              <CourseIcon 
                color="secondary" 
                sx={{ 
                  fontSize: { xs: 36, md: 48 }, 
                  mb: 1 
                }} 
              />
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color="secondary"
                sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
              >
                {dashboardStats.totalCourses}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
              >
                Active Courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ 
              textAlign: 'center',
              py: { xs: 2, md: 3 }
            }}>
              <MoneyIcon 
                color="success" 
                sx={{ 
                  fontSize: { xs: 36, md: 48 }, 
                  mb: 1 
                }} 
              />
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color="success.main"
                sx={{ fontSize: { xs: '1.25rem', md: '2.125rem' } }}
              >
                ${dashboardStats.totalRevenue.toLocaleString()}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
              >
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ 
              textAlign: 'center',
              py: { xs: 2, md: 3 }
            }}>
              <StarIcon 
                color="warning" 
                sx={{ 
                  fontSize: { xs: 36, md: 48 }, 
                  mb: 1 
                }} 
              />
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color="warning.main"
                sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
              >
                {dashboardStats.avgRating}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
              >
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics Chart */}
        <Grid item xs={12} lg={8}>
          <Card elevation={2}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                <TrendingUpIcon sx={{ mr: 1 }} />
                Enrollments & Revenue Trend
              </Typography>
              
              {analyticsData.length > 0 ? (
                <Box sx={{ width: '100%', height: { xs: 250, md: 300 } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="enrollments" 
                        stroke="#1976d2" 
                        strokeWidth={2}
                        name="Enrollments"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#dc004e" 
                        strokeWidth={2}
                        name="Revenue ($)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ 
                  height: { xs: 250, md: 300 }, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                  borderRadius: 1
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Analytics will appear here once you have course enrollments
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Enrollments */}
        <Grid item xs={12} lg={4}>
          <Card elevation={2}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                Recent Enrollments
              </Typography>
              
              <List dense sx={{ px: 0 }}>
                {recentEnrollments.length > 0 ? (
                  recentEnrollments.map((enrollment) => (
                    <ListItem 
                      key={enrollment.id} 
                      sx={{ 
                        px: 0,
                        py: { xs: 0.5, md: 1 }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={enrollment.avatar}
                          sx={{ 
                            width: { xs: 36, md: 40 },
                            height: { xs: 36, md: 40 }
                          }}
                        >
                          {enrollment.studentName?.charAt(0) || 'S'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={enrollment.studentName || 'Unknown Student'}
                        secondary={`${enrollment.courseName || 'Unknown Course'} • ${enrollment.enrolledAt ? formatDate(enrollment.enrolledAt) : 'Recently'}`}
                        primaryTypographyProps={{ 
                          variant: 'body2', 
                          fontWeight: 'medium',
                          fontSize: { xs: '0.875rem', md: '1rem' }
                        }}
                        secondaryTypographyProps={{ 
                          variant: 'caption',
                          fontSize: { xs: '0.75rem', md: '0.875rem' }
                        }}
                        sx={{ mr: 1 }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem sx={{ px: 0, py: 2, justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No recent enrollments
                    </Typography>
                  </ListItem>
                )}
              </List>
              
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  mt: 1,
                  py: { xs: 1, md: 1.5 }
                }}
              >
                View All Students
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performing Courses */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Your Courses
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleCreateTestCourse}
                    disabled={creatingTestCourse}
                    startIcon={creatingTestCourse ? <CircularProgress size={20} /> : <AddIcon />}
                  >
                    {creatingTestCourse ? 'Creating...' : 'Quick Test Course'}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/tutor/create-course')}
                  >
                    Create Course
                  </Button>
                </Box>
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course Title</TableCell>
                      <TableCell align="center">Students</TableCell>
                      <TableCell align="center">Rating</TableCell>
                      <TableCell align="center">Revenue</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCourses.length > 0 ? (
                      topCourses.map((course) => (
                        <TableRow key={course.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {course.title || 'Untitled Course'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {course.enrollmentCount || course.studentsCount || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <StarIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                              <Typography variant="body2">
                                {course.rating || course.averageRating || 'N/A'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="medium" color="success.main">
                              ${course.revenue?.toLocaleString() || '0'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={course.status || 'draft'}
                              color={getStatusColor(course.status || 'draft')}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={() => navigate(`/tutor/course/${course.id}`)}>
                              <ViewIcon />
                            </IconButton>
                            <IconButton size="small" onClick={() => navigate(`/tutor/course/${course.id}/edit`)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" onClick={handleMenuClick}>
                              <MoreIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            No courses created yet. Start by creating your first course!
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                            <Button
                              variant="outlined"
                              onClick={handleCreateTestCourse}
                              disabled={creatingTestCourse}
                              startIcon={creatingTestCourse ? <CircularProgress size={20} /> : <AddIcon />}
                            >
                              {creatingTestCourse ? 'Creating...' : 'Quick Test Course'}
                            </Button>
                            <Button
                              variant="contained"
                              startIcon={<AddIcon />}
                              onClick={() => navigate('/tutor/create-course')}
                            >
                              Create Course
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>View Analytics</MenuItem>
                <MenuItem onClick={handleMenuClose}>Duplicate Course</MenuItem>
                <MenuItem onClick={handleMenuClose}>Archive Course</MenuItem>
              </Menu>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notification Snackbar */}
      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Box>
  );
};

export default TutorDashboard;
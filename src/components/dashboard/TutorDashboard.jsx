// src/components/dashboard/TutorDashboard.jsx
import { useState, useEffect } from 'react';
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
  MenuItem
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
import { PageHeader } from '../common';

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

  useEffect(() => {
    loadTutorDashboardData();
  }, []);

  const loadTutorDashboardData = async () => {
    // Mock data - replace with actual API calls
    setDashboardStats({
      totalStudents: 245,
      totalCourses: 8,
      totalRevenue: 12540,
      avgRating: 4.7
    });

    setRecentEnrollments([
      {
        id: 1,
        studentName: 'Alice Johnson',
        courseName: 'Deep Learning Fundamentals',
        enrolledAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        avatar: null
      },
      {
        id: 2,
        studentName: 'Bob Smith',
        courseName: 'Computer Vision Basics',
        enrolledAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        avatar: null
      },
      {
        id: 3,
        studentName: 'Carol Davis',
        courseName: 'Natural Language Processing',
        enrolledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        avatar: null
      }
    ]);

    setTopCourses([
      {
        id: 1,
        title: 'Deep Learning Fundamentals',
        students: 89,
        rating: 4.8,
        revenue: 4450,
        status: 'published'
      },
      {
        id: 2,
        title: 'Computer Vision Basics',
        students: 67,
        rating: 4.6,
        revenue: 3350,
        status: 'published'
      },
      {
        id: 3,
        title: 'NLP with Transformers',
        students: 45,
        rating: 4.9,
        revenue: 2250,
        status: 'published'
      },
      {
        id: 4,
        title: 'AI Ethics Workshop',
        students: 23,
        rating: 4.5,
        revenue: 1150,
        status: 'draft'
      }
    ]);

    setAnalyticsData([
      { month: 'Jan', enrollments: 12, revenue: 600 },
      { month: 'Feb', enrollments: 19, revenue: 950 },
      { month: 'Mar', enrollments: 25, revenue: 1250 },
      { month: 'Apr', enrollments: 32, revenue: 1600 },
      { month: 'May', enrollments: 28, revenue: 1400 },
      { month: 'Jun', enrollments: 35, revenue: 1750 }
    ]);
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

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PeopleIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="primary">
                {dashboardStats.totalStudents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CourseIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="secondary">
                {dashboardStats.totalCourses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MoneyIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                ${dashboardStats.totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <StarIcon color="warning" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {dashboardStats.avgRating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                Enrollments & Revenue Trend
              </Typography>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
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
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Enrollments */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Enrollments
              </Typography>
              
              <List dense>
                {recentEnrollments.map((enrollment) => (
                  <ListItem key={enrollment.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar src={enrollment.avatar}>
                        {enrollment.studentName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={enrollment.studentName}
                      secondary={`${enrollment.courseName} • ${formatDate(enrollment.enrolledAt)}`}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
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
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/tutor/create-course')}
                >
                  Create Course
                </Button>
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
                    {topCourses.map((course) => (
                      <TableRow key={course.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {course.title}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {course.students}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <StarIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                            <Typography variant="body2">
                              {course.rating}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            ${course.revenue}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={course.status}
                            color={getStatusColor(course.status)}
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
                    ))}
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
    </Box>
  );
};

export default TutorDashboard;
// src/components/analytics/TutorAnalytics.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  Button,
  IconButton,
  Menu
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Quiz as QuizIcon,
  Timer as TimerIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { PageHeader } from '../common';
import { formatDate, formatDuration } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import analyticsService from '../../services/analyticsService';

const TutorAnalytics = ({ type = 'overview', courseId = null, quizId = null }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [courseFilter, setCourseFilter] = useState('all');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, courseFilter]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Load real analytics data from Firebase
      let result;
      
      if (type === 'quiz' && quizId) {
        result = await analyticsService.getQuizAnalytics(user.uid, quizId, timeRange);
      } else if (courseId) {
        result = await analyticsService.getCourseAnalytics(user.uid, courseId, timeRange);
      } else {
        result = await analyticsService.getTutorAnalytics(user.uid, timeRange);
      }
      
      if (result.success) {
        setAnalyticsData(result.analytics);
      } else {
        console.error('Failed to load analytics:', result.error);
        // Fallback to mock data for development
        const mockData = {
        overview: {
          totalStudents: 245,
          totalRevenue: 12540,
          totalCourses: 8,
          avgRating: 4.7,
          totalEnrollments: 312,
          completionRate: 78,
          monthlyGrowth: 15.5,
          totalReviews: 89
        },
        revenueData: [
          { month: 'Jan', revenue: 2100, enrollments: 15 },
          { month: 'Feb', revenue: 2800, enrollments: 22 },
          { month: 'Mar', revenue: 3200, enrollments: 28 },
          { month: 'Apr', revenue: 2900, enrollments: 25 },
          { month: 'May', revenue: 3800, enrollments: 35 },
          { month: 'Jun', revenue: 4200, enrollments: 42 }
        ],
        studentEngagement: [
          { week: 'Week 1', active: 85, completed: 12, dropped: 3 },
          { week: 'Week 2', active: 92, completed: 18, dropped: 2 },
          { week: 'Week 3', active: 88, completed: 22, dropped: 4 },
          { week: 'Week 4', active: 95, completed: 28, dropped: 1 }
        ],
        coursePerformance: [
          {
            id: 1,
            title: 'Deep Learning Fundamentals',
            students: 89,
            rating: 4.8,
            revenue: 4450,
            completionRate: 85,
            avgTimeToComplete: 12, // days
            enrollmentTrend: '+12%',
            lastEnrollment: new Date('2024-01-25')
          },
          {
            id: 2,
            title: 'Computer Vision Basics',
            students: 67,
            rating: 4.6,
            revenue: 3350,
            completionRate: 78,
            avgTimeToComplete: 15,
            enrollmentTrend: '+8%',
            lastEnrollment: new Date('2024-01-24')
          },
          {
            id: 3,
            title: 'Natural Language Processing',
            students: 45,
            rating: 4.9,
            revenue: 2250,
            completionRate: 92,
            avgTimeToComplete: 10,
            enrollmentTrend: '+25%',
            lastEnrollment: new Date('2024-01-23')
          },
          {
            id: 4,
            title: 'AI Ethics Workshop',
            students: 23,
            rating: 4.5,
            revenue: 1150,
            completionRate: 95,
            avgTimeToComplete: 7,
            enrollmentTrend: '+5%',
            lastEnrollment: new Date('2024-01-22')
          }
        ],
        topStudents: [
          {
            id: 1,
            name: 'Alice Johnson',
            avatar: '/api/placeholder/40/40',
            coursesCompleted: 3,
            avgScore: 95,
            totalTimeSpent: 1200,
            lastActive: new Date('2024-01-25')
          },
          {
            id: 2,
            name: 'Bob Smith',
            avatar: '/api/placeholder/40/40',
            coursesCompleted: 2,
            avgScore: 92,
            totalTimeSpent: 980,
            lastActive: new Date('2024-01-24')
          },
          {
            id: 3,
            name: 'Carol Davis',
            avatar: '/api/placeholder/40/40',
            coursesCompleted: 2,
            avgScore: 89,
            totalTimeSpent: 850,
            lastActive: new Date('2024-01-23')
          }
        ],
        quizAnalytics: [
          {
            courseTitle: 'Deep Learning Fundamentals',
            quizName: 'Neural Networks Basics',
            avgScore: 87,
            completionRate: 92,
            attempts: 156,
            difficulty: 'Medium'
          },
          {
            courseTitle: 'Computer Vision Basics',
            quizName: 'Image Processing',
            avgScore: 82,
            completionRate: 88,
            attempts: 98,
            difficulty: 'Hard'
          },
          {
            courseTitle: 'NLP Fundamentals',
            quizName: 'Text Preprocessing',
            avgScore: 91,
            completionRate: 95,
            attempts: 67,
            difficulty: 'Easy'
          }
        ],
        demographics: [
          { region: 'North America', students: 45, color: '#8884d8' },
          { region: 'Europe', students: 35, color: '#82ca9d' },
          { region: 'Asia', students: 15, color: '#ffc658' },
          { region: 'Others', students: 5, color: '#ff7300' }
        ]
      };

        setAnalyticsData(mockData);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderOverviewCards = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              {analyticsData.overview.totalStudents}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Students
            </Typography>
            <Chip 
              label={`+${analyticsData.overview.monthlyGrowth}%`} 
              size="small" 
              color="success" 
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <MoneyIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="success.main">
              ${analyticsData.overview.totalRevenue.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Revenue
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <StarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {analyticsData.overview.avgRating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Rating
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({analyticsData.overview.totalReviews} reviews)
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="secondary.main">
              {analyticsData.overview.completionRate}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completion Rate
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderRevenueChart = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Revenue & Enrollments Trend
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="right" dataKey="enrollments" fill="#82ca9d" name="Enrollments" />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="revenue" 
              stroke="#8884d8" 
              strokeWidth={3}
              name="Revenue ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderEngagementChart = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Student Engagement
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analyticsData.studentEngagement}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="active" 
              stackId="1"
              stroke="#8884d8" 
              fill="#8884d8" 
              name="Active Students"
            />
            <Area 
              type="monotone" 
              dataKey="completed" 
              stackId="1"
              stroke="#82ca9d" 
              fill="#82ca9d" 
              name="Completed"
            />
            <Area 
              type="monotone" 
              dataKey="dropped" 
              stackId="1"
              stroke="#ffc658" 
              fill="#ffc658" 
              name="Dropped"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderCoursePerformanceTable = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Course Performance</Typography>
          <Button startIcon={<DownloadIcon />} size="small">
            Export Data
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell align="center">Students</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center">Revenue</TableCell>
                <TableCell align="center">Completion</TableCell>
                <TableCell align="center">Trend</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analyticsData.coursePerformance.map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {course.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg completion: {course.avgTimeToComplete} days
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="bold">
                      {course.students}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                      <Typography variant="body2">{course.rating}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      ${course.revenue}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={course.completionRate} 
                        sx={{ width: 60, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="body2">{course.completionRate}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={course.enrollmentTrend} 
                      size="small" 
                      color="success"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        setMenuAnchor(e.currentTarget);
                        setSelectedCourse(course);
                      }}
                    >
                      <MoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderTopStudents = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Top Performing Students
        </Typography>
        <List>
          {analyticsData.topStudents.map((student, index) => (
            <ListItem key={student.id}>
              <ListItemAvatar>
                <Avatar src={student.avatar}>
                  {student.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={student.name}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {student.coursesCompleted} courses • {student.avgScore}% avg score
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDuration(student.totalTimeSpent)} total time
                    </Typography>
                  </Box>
                }
              />
              <Chip 
                label={`#${index + 1}`} 
                size="small" 
                color="primary"
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderQuizAnalytics = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quiz Performance
        </Typography>
        <List>
          {analyticsData.quizAnalytics.map((quiz, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={quiz.quizName}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {quiz.courseTitle}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Typography variant="body2">
                        Avg Score: {quiz.avgScore}%
                      </Typography>
                      <Typography variant="body2">
                        Completion: {quiz.completionRate}%
                      </Typography>
                      <Typography variant="body2">
                        Attempts: {quiz.attempts}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <Chip 
                label={quiz.difficulty} 
                size="small" 
                color={
                  quiz.difficulty === 'Easy' ? 'success' :
                  quiz.difficulty === 'Medium' ? 'warning' : 'error'
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderDemographics = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Student Demographics
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analyticsData.demographics}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="students"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {analyticsData.demographics.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  if (!analyticsData) {
    return <Typography>Loading analytics...</Typography>;
  }

  return (
    <Box>
      <PageHeader
        title="Teaching Analytics"
        subtitle="Comprehensive insights into your teaching performance"
      />

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Course</InputLabel>
          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            label="Course"
          >
            <MenuItem value="all">All Courses</MenuItem>
            <MenuItem value="dl">Deep Learning</MenuItem>
            <MenuItem value="cv">Computer Vision</MenuItem>
            <MenuItem value="nlp">NLP</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overview Cards */}
      <Box sx={{ mb: 4 }}>
        {renderOverviewCards()}
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
          <Tab label="Overview" />
          <Tab label="Courses" />
          <Tab label="Students" />
          <Tab label="Revenue" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Grid container spacing={3}>
        {activeTab === 0 && (
          <>
            <Grid item xs={12} md={8}>
              {renderEngagementChart()}
            </Grid>
            <Grid item xs={12} md={4}>
              {renderDemographics()}
            </Grid>
            <Grid item xs={12}>
              {renderCoursePerformanceTable()}
            </Grid>
          </>
        )}

        {activeTab === 1 && (
          <>
            <Grid item xs={12} md={8}>
              {renderCoursePerformanceTable()}
            </Grid>
            <Grid item xs={12} md={4}>
              {renderQuizAnalytics()}
            </Grid>
          </>
        )}

        {activeTab === 2 && (
          <>
            <Grid item xs={12} md={6}>
              {renderTopStudents()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderEngagementChart()}
            </Grid>
          </>
        )}

        {activeTab === 3 && (
          <>
            <Grid item xs={12}>
              {renderRevenueChart()}
            </Grid>
          </>
        )}
      </Grid>

      {/* Course Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <DownloadIcon sx={{ mr: 1 }} />
          Export Data
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TutorAnalytics;
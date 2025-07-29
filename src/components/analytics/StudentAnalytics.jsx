// src/components/analytics/StudentAnalytics.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Tab,
  Tabs,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CompleteIcon,
  Timeline as TimelineIcon
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
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { PageHeader } from '../common';
import { formatDuration, formatDate } from '../../utils/helpers';

const StudentAnalytics = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock analytics data - replace with actual API call
      const mockData = {
        overview: {
          totalStudyTime: 2840, // minutes
          coursesCompleted: 4,
          coursesInProgress: 2,
          avgQuizScore: 87.5,
          totalQuizzes: 15,
          totalAssignments: 8,
          completionRate: 92,
          currentStreak: 7,
          totalPoints: 1850
        },
        studyTimeData: [
          { date: '2024-01-01', minutes: 45, courses: 1 },
          { date: '2024-01-02', minutes: 60, courses: 1 },
          { date: '2024-01-03', minutes: 30, courses: 1 },
          { date: '2024-01-04', minutes: 90, courses: 2 },
          { date: '2024-01-05', minutes: 75, courses: 2 },
          { date: '2024-01-06', minutes: 120, courses: 2 },
          { date: '2024-01-07', minutes: 60, courses: 2 },
          { date: '2024-01-08', minutes: 85, courses: 2 },
          { date: '2024-01-09', minutes: 70, courses: 2 },
          { date: '2024-01-10', minutes: 95, courses: 3 }
        ],
        performanceData: [
          { week: 'Week 1', quizScore: 78, assignmentScore: 85, engagement: 92 },
          { week: 'Week 2', quizScore: 82, assignmentScore: 88, engagement: 87 },
          { week: 'Week 3', quizScore: 85, assignmentScore: 92, engagement: 95 },
          { week: 'Week 4', quizScore: 89, assignmentScore: 90, engagement: 88 }
        ],
        skillsRadar: [
          { skill: 'Deep Learning', score: 85 },
          { skill: 'Computer Vision', score: 78 },
          { skill: 'NLP', score: 65 },
          { skill: 'ML Basics', score: 92 },
          { skill: 'Math & Stats', score: 70 },
          { skill: 'Programming', score: 88 }
        ],
        courseProgress: [
          {
            id: 1,
            title: 'Deep Learning Fundamentals',
            progress: 100,
            timeSpent: 480,
            avgScore: 92,
            completed: true,
            lastActivity: new Date('2024-01-20')
          },
          {
            id: 2,
            title: 'Computer Vision Basics',
            progress: 75,
            timeSpent: 360,
            avgScore: 88,
            completed: false,
            lastActivity: new Date('2024-01-25')
          },
          {
            id: 3,
            title: 'Natural Language Processing',
            progress: 45,
            timeSpent: 180,
            avgScore: 85,
            completed: false,
            lastActivity: new Date('2024-01-24')
          },
          {
            id: 4,
            title: 'Machine Learning Ethics',
            progress: 100,
            timeSpent: 240,
            avgScore: 95,
            completed: true,
            lastActivity: new Date('2024-01-15')
          }
        ],
        weakAreas: [
          { topic: 'Backpropagation Algorithm', score: 65, improvement: '+15%' },
          { topic: 'Convolutional Layers', score: 70, improvement: '+10%' },
          { topic: 'Loss Functions', score: 72, improvement: '+8%' }
        ],
        strongAreas: [
          { topic: 'Neural Network Basics', score: 95, consistency: '98%' },
          { topic: 'Data Preprocessing', score: 92, consistency: '95%' },
          { topic: 'Model Evaluation', score: 90, consistency: '93%' }
        ],
        learningPatterns: {
          bestStudyTime: '2:00 PM - 4:00 PM',
          avgSessionLength: 47,
          preferredContentType: 'Video Lectures',
          engagementByDay: [
            { day: 'Mon', engagement: 85 },
            { day: 'Tue', engagement: 78 },
            { day: 'Wed', engagement: 82 },
            { day: 'Thu', engagement: 90 },
            { day: 'Fri', engagement: 75 },
            { day: 'Sat', engagement: 95 },
            { day: 'Sun', engagement: 88 }
          ]
        }
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverviewCards = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TimerIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              {Math.floor(analyticsData.overview.totalStudyTime / 60)}h {analyticsData.overview.totalStudyTime % 60}m
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Study Time
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              {analyticsData.overview.coursesCompleted}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Courses Completed
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <QuizIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              {analyticsData.overview.avgQuizScore}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Quiz Score
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TimelineIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              {analyticsData.overview.currentStreak}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Day Streak
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderStudyTimeChart = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Study Time Trend
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analyticsData.studyTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value) => [`${value} min`, 'Study Time']}
            />
            <Area 
              type="monotone" 
              dataKey="minutes" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderPerformanceChart = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Performance Over Time
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="quizScore" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Quiz Score (%)"
            />
            <Line 
              type="monotone" 
              dataKey="assignmentScore" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="Assignment Score (%)"
            />
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="#ffc658" 
              strokeWidth={2}
              name="Engagement (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderSkillsRadar = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Skills Assessment
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={analyticsData.skillsRadar}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar 
              dataKey="score" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderCourseProgress = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Course Progress
        </Typography>
        <List>
          {analyticsData.courseProgress.map((course, index) => (
            <Box key={course.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: course.completed ? 'success.main' : 'primary.main' }}>
                    {course.completed ? <CompleteIcon /> : <SchoolIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{course.title}</Typography>
                      <Chip 
                        label={`${course.progress}%`} 
                        size="small" 
                        color={course.completed ? 'success' : 'primary'}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Time spent: {formatDuration(course.timeSpent)} • 
                        Avg score: {course.avgScore}% • 
                        Last activity: {formatDate(course.lastActivity)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{ mt: 1, height: 6, borderRadius: 3 }}
                        color={course.completed ? 'success' : 'primary'}
                      />
                    </Box>
                  }
                />
              </ListItem>
              {index < analyticsData.courseProgress.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderLearningInsights = () => (
    <>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="error">
              Areas for Improvement
            </Typography>
            <List dense>
              {analyticsData.weakAreas.map((area, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={area.topic}
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          Current: {area.score}%
                        </Typography>
                        <Chip 
                          label={area.improvement} 
                          size="small" 
                          color="success"
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="success.main">
              Strong Areas
            </Typography>
            <List dense>
              {analyticsData.strongAreas.map((area, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={area.topic}
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          Score: {area.score}%
                        </Typography>
                        <Chip 
                          label={`${area.consistency} consistent`} 
                          size="small" 
                          color="success"
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Learning Patterns
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Best Study Time
                </Typography>
                <Typography variant="h6">
                  {analyticsData.learningPatterns.bestStudyTime}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Avg Session Length
                </Typography>
                <Typography variant="h6">
                  {analyticsData.learningPatterns.avgSessionLength} min
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Preferred Content
                </Typography>
                <Typography variant="h6">
                  {analyticsData.learningPatterns.preferredContentType}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Most Active Day
                </Typography>
                <Typography variant="h6">
                  Saturday
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Weekly Engagement Pattern
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analyticsData.learningPatterns.engagementByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Engagement']} />
                  <Bar dataKey="engagement" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  );

  if (loading || !analyticsData) {
    return <Typography>Loading analytics...</Typography>;
  }

  return (
    <Box>
      <PageHeader
        title="Learning Analytics"
        subtitle="Insights into your learning progress and performance"
      />

      {/* Time Range Selector */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
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
      </Box>

      {/* Overview Cards */}
      <Box sx={{ mb: 4 }}>
        {renderOverviewCards()}
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
          <Tab label="Overview" />
          <Tab label="Performance" />
          <Tab label="Skills" />
          <Tab label="Insights" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Grid container spacing={3}>
        {activeTab === 0 && (
          <>
            <Grid item xs={12} md={8}>
              {renderStudyTimeChart()}
            </Grid>
            <Grid item xs={12} md={4}>
              {renderCourseProgress()}
            </Grid>
          </>
        )}

        {activeTab === 1 && (
          <>
            <Grid item xs={12}>
              {renderPerformanceChart()}
            </Grid>
          </>
        )}

        {activeTab === 2 && (
          <>
            <Grid item xs={12} md={6}>
              {renderSkillsRadar()}
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Skill Recommendations
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Based on your current performance and goals
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Strengthen Backpropagation Understanding"
                        secondary="Practice with interactive visualizations"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Advance Computer Vision Skills"
                        secondary="Take the Advanced CNN course"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Explore NLP Applications"
                        secondary="Try the Transformer Models course"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {activeTab === 3 && renderLearningInsights()}
      </Grid>
    </Box>
  );
};

export default StudentAnalytics;
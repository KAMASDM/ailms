// src/components/gamification/ProgressTracking.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Paper,
  Tab,
  Tabs,
  Button,
  Divider,
  Alert
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckIcon,
  PlayArrow as PlayIcon,
  BookmarkBorder as BookmarkIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { PageHeader } from '../common';
import { formatDuration, formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux';

const ProgressTracking = () => {
  const { user } = useAuth();
  const userProfile = useSelector(state => state.user.profile);
  const [activeTab, setActiveTab] = useState(0);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      // Mock progress data - replace with actual API call
      const mockData = {
        overview: {
          totalPoints: 1850,
          coursesEnrolled: 6,
          coursesCompleted: 4,
          quizzesCompleted: 12,
          avgQuizScore: 87,
          studyTimeThisWeek: 480, // minutes
          currentStreak: 7,
          longestStreak: 12,
          level: 'Intermediate',
          nextLevelPoints: 500,
          badges: 8
        },
        weeklyActivity: [
          { day: 'Mon', minutes: 45, points: 120 },
          { day: 'Tue', minutes: 60, points: 150 },
          { day: 'Wed', minutes: 30, points: 80 },
          { day: 'Thu', minutes: 90, points: 200 },
          { day: 'Fri', minutes: 75, points: 180 },
          { day: 'Sat', minutes: 120, points: 250 },
          { day: 'Sun', minutes: 60, points: 140 }
        ],
        skillDistribution: [
          { name: 'Deep Learning', value: 35, color: '#8884d8' },
          { name: 'Computer Vision', value: 25, color: '#82ca9d' },
          { name: 'NLP', value: 20, color: '#ffc658' },
          { name: 'ML Basics', value: 15, color: '#ff7300' },
          { name: 'AI Ethics', value: 5, color: '#8dd1e1' }
        ],
        recentActivity: [
          {
            id: 1,
            type: 'course_completion',
            title: 'Completed "Neural Network Fundamentals"',
            points: 200,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            icon: <SchoolIcon color="success" />
          },
          {
            id: 2,
            type: 'quiz_completion',
            title: 'Scored 95% on Deep Learning Quiz',
            points: 50,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            icon: <QuizIcon color="primary" />
          },
          {
            id: 3,
            type: 'achievement',
            title: 'Earned "Perfect Score" badge',
            points: 100,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            icon: <TrophyIcon color="warning" />
          },
          {
            id: 4,
            type: 'milestone',
            title: 'Reached 7-day learning streak',
            points: 75,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            icon: <TimelineIcon color="error" />
          }
        ],
        currentGoals: [
          {
            id: 1,
            title: 'Complete Computer Vision Course',
            progress: 75,
            target: 100,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            type: 'course'
          },
          {
            id: 2,
            title: 'Maintain 14-day streak',
            progress: 7,
            target: 14,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            type: 'streak'
          },
          {
            id: 3,
            title: 'Score 90%+ on next 3 quizzes',
            progress: 1,
            target: 3,
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            type: 'performance'
          }
        ],
        monthlyProgress: [
          { month: 'Jul', coursesCompleted: 1, points: 450 },
          { month: 'Aug', coursesCompleted: 2, points: 680 },
          { month: 'Sep', coursesCompleted: 1, points: 520 },
          { month: 'Oct', coursesCompleted: 0, points: 200 }
        ]
      };

      setProgressData(mockData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGoalIcon = (type) => {
    switch (type) {
      case 'course': return <SchoolIcon />;
      case 'streak': return <TimelineIcon />;
      case 'performance': return <TrophyIcon />;
      default: return <StarIcon />;
    }
  };

  const getGoalColor = (type) => {
    switch (type) {
      case 'course': return 'primary';
      case 'streak': return 'error';
      case 'performance': return 'warning';
      default: return 'default';
    }
  };

  const renderOverviewStats = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <StarIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {progressData.overview.totalPoints}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Points
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
              <CircularProgress
                variant="determinate"
                value={(progressData.overview.coursesCompleted / progressData.overview.coursesEnrolled) * 100}
                size={60}
                thickness={4}
                sx={{ color: 'success.main' }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" component="div" fontWeight="bold">
                  {progressData.overview.coursesCompleted}/{progressData.overview.coursesEnrolled}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              Courses
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TimelineIcon sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="error.main">
              {progressData.overview.currentStreak}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Day Streak
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TimerIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {Math.floor(progressData.overview.studyTimeThisWeek / 60)}h
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This Week
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderActivityChart = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Weekly Activity
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={progressData.weeklyActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" fill="#8884d8" name="Study Time (min)" />
            <Bar dataKey="points" fill="#82ca9d" name="Points Earned" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderSkillDistribution = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Skill Distribution
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={progressData.skillDistribution}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {progressData.skillDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderGoalProgress = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Current Goals
        </Typography>
        <List>
          {progressData.currentGoals.map((goal, index) => (
            <Box key={goal.id}>
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: `${getGoalColor(goal.type)}.light` }}>
                    {getGoalIcon(goal.type)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={goal.title}
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          Progress: {goal.progress}/{goal.target}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Due: {formatDate(goal.deadline)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(goal.progress / goal.target) * 100}
                        sx={{ height: 6, borderRadius: 3 }}
                        color={getGoalColor(goal.type)}
                      />
                    </Box>
                  }
                />
              </ListItem>
              {index < progressData.currentGoals.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderRecentActivity = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List>
          {progressData.recentActivity.map((activity, index) => (
            <Box key={activity.id}>
              <ListItem>
                <ListItemIcon>
                  {activity.icon}
                </ListItemIcon>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(activity.timestamp)}
                      </Typography>
                      <Chip 
                        label={`+${activity.points} pts`} 
                        size="small" 
                        color="success"
                      />
                    </Box>
                  }
                />
              </ListItem>
              {index < progressData.recentActivity.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderLevelProgress = () => {
    const currentLevel = progressData.overview.level;
    const nextLevelProgress = (progressData.overview.totalPoints % 1000) / 10; // Mock calculation
    
    return (
      <Card sx={{ bgcolor: 'primary.light' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <TrophyIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {currentLevel} Learner
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progressData.overview.nextLevelPoints} points to next level
              </Typography>
            </Box>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={nextLevelProgress}
            sx={{ 
              height: 10, 
              borderRadius: 5,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main'
              }
            }}
          />
          
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            {Math.round(nextLevelProgress)}% to Advanced
          </Typography>
        </CardContent>
      </Card>
    );
  };

  if (loading || !progressData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Your Progress"
        subtitle="Track your learning journey and achievements"
      />

      {/* Level Progress */}
      <Box sx={{ mb: 3 }}>
        {renderLevelProgress()}
      </Box>

      {/* Overview Stats */}
      <Box sx={{ mb: 3 }}>
        {renderOverviewStats()}
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
          <Tab label="Activity" />
          <Tab label="Goals" />
          <Tab label="Skills" />
          <Tab label="History" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Grid container spacing={3}>
        {activeTab === 0 && (
          <>
            <Grid item xs={12} md={8}>
              {renderActivityChart()}
            </Grid>
            <Grid item xs={12} md={4}>
              {renderRecentActivity()}
            </Grid>
          </>
        )}

        {activeTab === 1 && (
          <>
            <Grid item xs={12} md={8}>
              {renderGoalProgress()}
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayIcon />}
                    sx={{ mb: 2 }}
                  >
                    Continue Learning
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<BookmarkIcon />}
                    sx={{ mb: 2 }}
                  >
                    Set New Goal
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CalendarIcon />}
                  >
                    Schedule Study Time
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {activeTab === 2 && (
          <>
            <Grid item xs={12} md={6}>
              {renderSkillDistribution()}
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Skill Recommendations
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Based on your progress, we recommend focusing on Computer Vision next.
                  </Alert>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Computer Vision Advanced"
                        secondary="Build on your current knowledge"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Reinforcement Learning"
                        secondary="New area to explore"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="MLOps Fundamentals"
                        secondary="Practical deployment skills"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {activeTab === 3 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Progress
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={progressData.monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="coursesCompleted" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      name="Courses Completed"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="points" 
                      stroke="#82ca9d" 
                      strokeWidth={3}
                      name="Points Earned"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProgressTracking;
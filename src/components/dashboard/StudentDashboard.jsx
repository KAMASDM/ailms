// src/components/dashboard/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Alert
} from '@mui/material';
import {
  School as SchoolIcon,
  Quiz as QuizIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingIcon,
  PlayArrow as PlayIcon,
  BookmarkBorder as BookmarkIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockData = {
          stats: {
            enrolledCourses: 3,
            completedCourses: 1,
            totalHours: 24,
            currentStreak: 7,
            totalPoints: 1250,
            nextMilestone: 500
          },
          recentCourses: [
            {
              id: 1,
              title: 'Deep Learning Fundamentals',
              instructor: 'Dr. Sarah Chen',
              progress: 75,
              thumbnail: '/api/placeholder/100/60',
              lastAccessed: '2 hours ago'
            },
            {
              id: 2,
              title: 'Computer Vision Basics',
              instructor: 'Prof. Mike Johnson',
              progress: 45,
              thumbnail: '/api/placeholder/100/60',
              lastAccessed: '1 day ago'
            }
          ],
          upcomingQuizzes: [
            {
              id: 1,
              title: 'Neural Networks Quiz',
              course: 'Deep Learning Fundamentals',
              dueDate: 'Tomorrow',
              questions: 15
            },
            {
              id: 2,
              title: 'Computer Vision Test',
              course: 'Computer Vision Basics',
              dueDate: 'In 3 days',
              questions: 20
            }
          ],
          achievements: [
            {
              id: 1,
              title: 'First Course Completed',
              description: 'Completed your first course',
              icon: '🎓',
              earned: true
            },
            {
              id: 2,
              title: '7-Day Streak',
              description: 'Studied for 7 consecutive days',
              icon: '🔥',
              earned: true
            }
          ]
        };

        setDashboardData(mockData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Student Dashboard</Typography>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading your dashboard...</Typography>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load dashboard data. Please refresh the page.
        </Alert>
      </Box>
    );
  }

  const { stats, recentCourses, upcomingQuizzes, achievements } = dashboardData;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Welcome back! 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Continue your learning journey
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.enrolledCourses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enrolled Courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrophyIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.completedCourses}
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
              <TrendingIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.totalHours}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Study Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ mb: 1 }}>🔥</Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {stats.currentStreak}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Day Streak
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Continue Learning */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Continue Learning
              </Typography>
              
              {recentCourses.map((course) => (
                <Card key={course.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        variant="rounded"
                        src={course.thumbnail}
                        sx={{ width: 60, height: 40 }}
                      >
                        <SchoolIcon />
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {course.instructor} • Last accessed {course.lastAccessed}
                        </Typography>
                        
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={course.progress}
                            sx={{ flex: 1, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {course.progress}%
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Button
                        variant="contained"
                        startIcon={<PlayIcon />}
                        size="small"
                      >
                        Continue
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Quizzes */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Quizzes
              </Typography>
              
              <List>
                {upcomingQuizzes.map((quiz) => (
                  <ListItem key={quiz.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.light' }}>
                        <QuizIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={quiz.title}
                      secondary={`${quiz.course} • ${quiz.questions} questions • Due ${quiz.dueDate}`}
                    />
                    <ListItemSecondaryAction>
                      <Button size="small" variant="outlined">
                        Take Quiz
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Recent Achievements */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Achievements
              </Typography>
              
              {achievements.map((achievement) => (
                <Box key={achievement.id} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  p: 1,
                  bgcolor: 'success.light',
                  borderRadius: 1,
                  mb: 1
                }}>
                  <Typography variant="h4">{achievement.icon}</Typography>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {achievement.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {achievement.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View All Achievements
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              
              <Button
                fullWidth
                variant="contained"
                startIcon={<SchoolIcon />}
                sx={{ mb: 1 }}
              >
                Browse Courses
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<BookmarkIcon />}
                sx={{ mb: 1 }}
              >
                My Bookmarks
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<TrendingIcon />}
              >
                View Progress
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
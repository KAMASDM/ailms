// src/components/dashboard/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert,
  Skeleton,
  CircularProgress
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
import { useAuth } from '../../hooks/useAuth';
import platformService from '../../services/platformService';
import courseService from '../../services/courseService';
import quizService from '../../services/quizService';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch student-specific dashboard data from Firebase
        const response = await platformService.getUserDashboardData(user.uid, 'student');
        
        if (response.success) {
          const { enrollments, courses, stats } = response.data;

          // Get recent quizzes for enrolled courses
          const quizzes = [];
          for (const enrollment of enrollments.slice(0, 3)) {
            try {
              const quizResponse = await quizService.getCourseQuizzes(enrollment.courseId);
              if (quizResponse.success && quizResponse.quizzes.length > 0) {
                quizzes.push(...quizResponse.quizzes.slice(0, 2).map(quiz => ({
                  ...quiz,
                  courseName: courses.find(c => c.id === enrollment.courseId)?.title || 'Unknown Course'
                })));
              }
            } catch (err) {
              console.error('Error fetching quizzes:', err);
            }
          }

          // Format the data for dashboard display
          setDashboardData({
            stats: {
              enrolledCourses: stats.totalCourses || 0,
              completedCourses: stats.completedCourses || 0,
              inProgressCourses: stats.inProgress || 0,
              avgProgress: stats.avgProgress || 0,
              totalPoints: enrollments.reduce((sum, e) => sum + (e.points || 0), 0),
              currentStreak: user.currentStreak || 0
            },
            recentCourses: courses.slice(0, 4).map(course => {
              const enrollment = enrollments.find(e => e.courseId === course.id);
              return {
                id: course.id,
                title: course.title,
                instructor: course.instructor?.name || 'Unknown Instructor',
                progress: enrollment?.progress || 0,
                thumbnail: course.thumbnail || '/api/placeholder/100/60',
                lastAccessed: enrollment?.lastAccessed ? 
                  new Date(enrollment.lastAccessed.seconds * 1000).toLocaleDateString() : 
                  'Recently'
              };
            }),
            upcomingQuizzes: quizzes.slice(0, 5).map(quiz => ({
              id: quiz.id,
              title: quiz.title,
              course: quiz.courseName,
              dueDate: quiz.dueDate ? 
                new Date(quiz.dueDate.seconds * 1000).toLocaleDateString() : 
                'No due date',
              questions: quiz.questions?.length || 0
            })),
            achievements: [] // This would come from a separate achievements system
          });
        } else {
          setError('Failed to load dashboard data');
        }

      } catch (err) {
        console.error('Error loading student dashboard:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Student Dashboard</Typography>
        <Grid container spacing={3}>
          {/* Stats Loading */}
          <Grid item xs={12} md={6} lg={3}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
          {/* Course Progress Loading */}
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
          {/* Quick Actions Loading */}
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading your dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Student Dashboard</Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!dashboardData || !dashboardData.stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Student Dashboard</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          No enrollment data found. Start by enrolling in your first course!
        </Alert>
        <Button variant="contained" onClick={() => navigate('/courses')}>
          Browse Courses
        </Button>
      </Box>
    );
  }

  const { stats, recentCourses, upcomingQuizzes, achievements } = dashboardData;

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      bgcolor: 'background.default'
    }}>
      {/* Header */}
      <Box sx={{ 
        mb: 4,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Welcome back! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Continue your learning journey
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{ 
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ 
              textAlign: 'center',
              py: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgcolor: 'primary.main',
                borderRadius: '12px 12px 0 0'
              }
            }}>
              <SchoolIcon sx={{ 
                fontSize: 48, 
                color: 'primary.main', 
                mb: 2 
              }} />
              <Typography 
                variant="h3" 
                fontWeight={700} 
                color="primary"
                sx={{ mb: 1 }}
              >
                {stats.enrolledCourses}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                fontWeight={500}
              >
                Enrolled Courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{ 
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ 
              textAlign: 'center',
              py: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgcolor: 'success.main',
                borderRadius: '12px 12px 0 0'
              }
            }}>
              <TrophyIcon sx={{ 
                fontSize: 48, 
                color: 'success.main', 
                mb: 2 
              }} />
              <Typography 
                variant="h3" 
                fontWeight={700} 
                color="success.main"
                sx={{ mb: 1 }}
              >
                {stats.completedCourses}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                fontWeight={500}
              >
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{ 
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ 
              textAlign: 'center',
              py: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgcolor: 'warning.main',
                borderRadius: '12px 12px 0 0'
              }
            }}>
              <TrendingIcon sx={{ 
                fontSize: 48, 
                color: 'warning.main', 
                mb: 2 
              }} />
              <Typography 
                variant="h3" 
                fontWeight={700} 
                color="warning.main"
                sx={{ mb: 1 }}
              >
                {stats.totalHours}h
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                fontWeight={500}
              >
                Study Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{ 
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ 
              textAlign: 'center',
              py: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgcolor: 'error.main',
                borderRadius: '12px 12px 0 0'
              }
            }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  mb: 2,
                  fontSize: '3rem'
                }}
              >
                🔥
              </Typography>
              <Typography 
                variant="h3" 
                fontWeight={700} 
                color="error.main"
                sx={{ mb: 1 }}
              >
                {stats.currentStreak}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                fontWeight={500}
              >
                Day Streak
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Continue Learning */}
        <Grid item xs={12} lg={8}>
          <Card 
            elevation={4}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              p: 3, 
              bgcolor: 'primary.main',
              color: 'primary.contrastText'
            }}>
              <Typography variant="h5" fontWeight={600}>
                Continue Learning
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Pick up where you left off
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              
              {recentCourses.map((course) => (
                <Card 
                  key={course.id} 
                  variant="outlined" 
                  sx={{ 
                    mb: 2,
                    transition: 'all 0.2s ease',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)',
                      borderColor: 'primary.main'
                    },
                    '&:last-child': { mb: 0 }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 2
                    }}>
                      <Avatar
                        variant="rounded"
                        src={course.thumbnail}
                        sx={{ 
                          width: 64, 
                          height: 48,
                          flexShrink: 0,
                          bgcolor: 'grey.100'
                        }}
                      >
                        <SchoolIcon />
                      </Avatar>
                      
                      <Box sx={{ 
                        flex: 1, 
                        minWidth: 0
                      }}>
                        <Typography 
                          variant="h6" 
                          fontWeight={600}
                          sx={{ 
                            fontSize: '1.1rem',
                            mb: 0.5,
                            lineHeight: 1.3
                          }}
                        >
                          {course.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mb: 2,
                            lineHeight: 1.4
                          }}
                        >
                          {course.instructor} • Last accessed {course.lastAccessed}
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2,
                          mb: 1
                        }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              mb: 0.5 
                            }}>
                              <Typography variant="body2" color="text.secondary">
                                Progress
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {course.progress}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={course.progress}
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                bgcolor: 'grey.100'
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                      
                      <Button
                        variant="contained"
                        startIcon={<PlayIcon />}
                        size="medium"
                        onClick={() => navigate(`/course/${course.id}/learn`)}
                        sx={{ 
                          flexShrink: 0,
                          minWidth: 100,
                          borderRadius: 2
                        }}
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
          <Card 
            elevation={4} 
            sx={{ 
              mt: 3,
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              p: 3, 
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText'
            }}>
              <Typography variant="h5" fontWeight={600}>
                Upcoming Quizzes
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Test your knowledge
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {upcomingQuizzes.map((quiz) => (
                  <Card 
                    key={quiz.id}
                    variant="outlined"
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: 'secondary.main'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2
                      }}>
                        <Avatar sx={{ 
                          bgcolor: 'secondary.light',
                          width: 48,
                          height: 48
                        }}>
                          <QuizIcon />
                        </Avatar>
                        
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ mb: 0.5 }}
                          >
                            {quiz.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {quiz.course}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            flexWrap: 'wrap',
                            alignItems: 'center'
                          }}>
                            <Typography variant="caption" color="text.secondary">
                              {quiz.questions} questions
                            </Typography>
                            <Typography variant="caption" color="error.main" fontWeight={600}>
                              Due {quiz.dueDate}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Button 
                          variant="contained"
                          color="secondary"
                          size="medium"
                          onClick={() => navigate(`/quiz/${quiz.id}`)}
                          sx={{ 
                            flexShrink: 0,
                            minWidth: 100,
                            borderRadius: 2
                          }}
                        >
                          Take Quiz
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Recent Achievements */}
          <Card 
            elevation={4}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              p: 3, 
              bgcolor: 'success.main',
              color: 'success.contrastText'
            }}>
              <Typography variant="h5" fontWeight={600}>
                Recent Achievements
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Your latest accomplishments
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              
              {achievements.map((achievement) => (
                <Box key={achievement.id} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 1.5, md: 2 }, 
                  p: { xs: 1, md: 1.5 },
                  bgcolor: 'success.light',
                  borderRadius: 1,
                  mb: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'success.main',
                    color: 'success.contrastText',
                    transform: 'translateY(-1px)',
                    boxShadow: 1
                  }
                }}>
                  <Typography 
                    variant="h4"
                    sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                  >
                    {achievement.icon}
                  </Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="subtitle2" 
                      fontWeight="medium"
                      sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                    >
                      {achievement.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {achievement.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => navigate('/achievements')}
                sx={{ 
                  mt: 2,
                  py: { xs: 1, md: 1.5 }
                }}
              >
                View All Achievements
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card 
            elevation={4} 
            sx={{ 
              mt: 3,
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              p: 3, 
              bgcolor: 'info.main',
              color: 'info.contrastText'
            }}>
              <Typography variant="h5" fontWeight={600}>
                Quick Actions
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Shortcuts to key features
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SchoolIcon />}
                  onClick={() => navigate('/courses')}
                  sx={{ py: { xs: 1, md: 1.5 } }}
                >
                  Browse Courses
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BookmarkIcon />}
                  onClick={() => navigate('/bookmarks')}
                  sx={{ py: { xs: 1, md: 1.5 } }}
                >
                  My Bookmarks
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<TrendingIcon />}
                  onClick={() => navigate('/progress')}
                  sx={{ py: { xs: 1, md: 1.5 } }}
                >
                  View Progress
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  Chip,
  Paper,
  LinearProgress,
  Stack,
  Fade,
  Slide,
  Zoom,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import {
  School as SchoolIcon,
  Psychology as AIIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as GrowthIcon,
  CheckCircle as CheckIcon,
  Groups as CommunityIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Rocket as RocketIcon,
  AutoAwesome as SparkleIcon,
  Lightbulb as LightbulbIcon,
  WorkspacePremium as PremiumIcon,
  ArrowForward as ArrowIcon,
  Code as CodeIcon,
  Analytics as AnalyticsIcon,
  CameraAlt as VisionIcon,
  TextFields as NLPIcon,
  Memory as MLIcon,
  AccountTree as DeepLearningIcon,
  Schedule as ScheduleIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import platformService from '../services/platformService';
import realtimeCourseService from '../services/realtimeCourseService';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State for dynamic data
  const [stats, setStats] = useState([]);
  const [features, setFeatures] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.userType === 'student') {
        navigate('/dashboard');
      } else if (user?.userType === 'tutor' || user?.userType === 'instructor') {
        navigate('/tutor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/register');
    }
  };

  // Course categories with modern icons
  const courseCategories = [
    { 
      name: 'Machine Learning', 
      icon: <MLIcon sx={{ fontSize: 32 }} />, 
      color: '#667eea',
      courses: '25+ Courses',
      popularity: 95
    },
    { 
      name: 'Deep Learning', 
      icon: <DeepLearningIcon sx={{ fontSize: 32 }} />, 
      color: '#764ba2',
      courses: '18+ Courses',
      popularity: 88
    },
    { 
      name: 'Computer Vision', 
      icon: <VisionIcon sx={{ fontSize: 32 }} />, 
      color: '#f093fb',
      courses: '12+ Courses',
      popularity: 82
    },
    { 
      name: 'NLP', 
      icon: <NLPIcon sx={{ fontSize: 32 }} />, 
      color: '#4facfe',
      courses: '15+ Courses',
      popularity: 78
    },
    { 
      name: 'Data Science', 
      icon: <AnalyticsIcon sx={{ fontSize: 32 }} />, 
      color: '#43e97b',
      courses: '20+ Courses',
      popularity: 92
    },
    { 
      name: 'Programming', 
      icon: <CodeIcon sx={{ fontSize: 32 }} />, 
      color: '#fa709a',
      courses: '30+ Courses',
      popularity: 98
    }
  ];

  // Learning path steps
  const learningSteps = [
    {
      step: '01',
      title: 'Choose Your Path',
      description: 'Select from our comprehensive AI specializations based on your career goals',
      icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
      color: '#667eea'
    },
    {
      step: '02', 
      title: 'Learn with Experts',
      description: 'Get personalized guidance from industry professionals and AI researchers',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: '#764ba2'
    },
    {
      step: '03',
      title: 'Build Real Projects',
      description: 'Apply your knowledge in production-ready projects and build your portfolio',
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      color: '#f093fb'
    },
    {
      step: '04',
      title: 'Launch Your Career',
      description: 'Get certified, receive career support, and land your dream AI job',
      icon: <RocketIcon sx={{ fontSize: 40 }} />,
      color: '#4facfe'
    }
  ];

  // Why choose us features
  const whyChooseUs = [
    {
      title: 'Industry Experts',
      description: 'Learn from professionals working at top AI companies',
      icon: <PremiumIcon sx={{ fontSize: 48 }} />,
      color: '#667eea'
    },
    {
      title: 'Real Projects',
      description: 'Build production-ready AI applications and systems',
      icon: <CodeIcon sx={{ fontSize: 48 }} />,
      color: '#764ba2'
    },
    {
      title: 'Career Support',
      description: 'Get job placement assistance and career mentorship',
      icon: <RocketIcon sx={{ fontSize: 48 }} />,
      color: '#f093fb'
    },
    {
      title: 'Flexible Learning',
      description: 'Study at your own pace with lifetime access',
      icon: <ScheduleIcon sx={{ fontSize: 48 }} />,
      color: '#4facfe'
    }
  ];

  // Fetch data from Firebase with real-time subscriptions
  useEffect(() => {
    const subscriptions = [];
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Set up real-time course statistics subscription
        const statsSubscription = realtimeCourseService.subscribeToCourseStats(async (response) => {
          if (response.success) {
            const platformStats = response.stats;
            
            // If no courses exist, create sample courses
            if (platformStats.totalCourses === 0) {
              try {
                console.log('No courses found, creating sample courses...');
                const sampleResult = await realtimeCourseService.createSampleCourses();
                if (sampleResult.success) {
                  console.log('Sample courses created successfully');
                }
              } catch (error) {
                console.error('Error creating sample courses:', error);
              }
            }
            
            setStats([
              { 
                icon: <CommunityIcon sx={{ fontSize: 40 }} />, 
                number: `${platformStats.totalStudents.toLocaleString()}+`, 
                label: 'Active Students',
                color: '#667eea'
              },
              { 
                icon: <StarIcon sx={{ fontSize: 40 }} />, 
                number: `${platformStats.totalCourses}+`, 
                label: 'AI Courses',
                color: '#764ba2'
              },
              { 
                icon: <TrophyIcon sx={{ fontSize: 40 }} />, 
                number: `${platformStats.totalEnrollments.toLocaleString()}+`, 
                label: 'Enrollments',
                color: '#f093fb'
              },
              { 
                icon: <VerifiedIcon sx={{ fontSize: 40 }} />, 
                number: `${platformStats.averageRating.toFixed(1)}⭐`, 
                label: 'Average Rating',
                color: '#4facfe'
              }
            ]);
          }
        });
        
        subscriptions.push(statsSubscription);

        // Fetch platform features
        const featuresResponse = await platformService.getPlatformFeatures();
        if (featuresResponse.success && featuresResponse.features.length > 0) {
          setFeatures(featuresResponse.features);
        }

        // Fetch testimonials
        const testimonialsResponse = await platformService.getTestimonials();
        if (testimonialsResponse.success) {
          setTestimonials(testimonialsResponse.testimonials);
        }

      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto-advance learning steps
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % learningSteps.length);
    }, 3000);

    // Cleanup all subscriptions on unmount
    return () => {
      subscriptions.forEach(subscription => {
        if (subscription?.unsubscribe) {
          subscription.unsubscribe();
        }
      });
      clearInterval(stepInterval);
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ overflow: 'hidden', bgcolor: 'background.default' }}>
      {error && (
        <Alert severity="info" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Modern Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, 
            ${theme.palette.primary.main} 0%, 
            ${theme.palette.primary.dark} 50%, 
            ${theme.palette.secondary.main} 100%)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(255,235,59,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255,235,59,0.05) 0%, transparent 50%)
            `,
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: { xs: 6, md: 10 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} lg={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Chip
                    label="🚀 #1 AI Learning Platform"
                    sx={{
                      bgcolor: 'rgba(255,235,59,0.15)',
                      color: '#ffeb3b',
                      fontWeight: 700,
                      px: 2,
                      py: 0.5,
                      mb: 3,
                      border: '1px solid rgba(255,235,59,0.3)',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.05)' }
                      }
                    }}
                  />
                  
                  <Typography 
                    variant="h1" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 900,
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                      lineHeight: { xs: 1.2, md: 1.1 },
                      mb: 3,
                      color: 'white',
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    Transform Your
                    <br />
                    <Box component="span" sx={{ 
                      background: 'linear-gradient(45deg, #ffeb3b 0%, #ffc107 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      textShadow: 'none'
                    }}>
                      AI Journey
                    </Box>
                  </Typography>

                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4, 
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: 1.6,
                      maxWidth: 500
                    }}
                  >
                    Learn from world-class AI experts, build production-ready projects, 
                    and accelerate your career with personalized mentorship and cutting-edge curriculum.
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGetStarted}
                      startIcon={<SparkleIcon />}
                      sx={{ 
                        bgcolor: '#ffeb3b',
                        color: '#1976d2',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: 2,
                        textTransform: 'none',
                        boxShadow: '0 8px 32px rgba(255,235,59,0.4)',
                        '&:hover': {
                          bgcolor: '#fdd835',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 40px rgba(255,235,59,0.5)'
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {isAuthenticated ? 'Go to Dashboard' : 'Start Learning Free'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/courses')}
                      endIcon={<ArrowIcon />}
                      sx={{ 
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: 'none',
                        borderWidth: 2,
                        backdropFilter: 'blur(10px)',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.2)',
                          transform: 'translateY(-3px)',
                          borderWidth: 2
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      Explore Courses
                    </Button>
                  </Stack>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Stack direction="row" sx={{ ml: -1 }}>
                        {[...Array(5)].map((_, i) => (
                          <Avatar 
                            key={i}
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              border: '2px solid white',
                              ml: -1,
                              bgcolor: `hsl(${i * 60}, 70%, 50%)`
                            }}
                          />
                        ))}
                      </Stack>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                        Join 10,000+ students
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Stack direction="row">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} sx={{ color: '#ffeb3b', fontSize: 20 }} />
                        ))}
                      </Stack>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                        4.9/5 rating
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} lg={6}>
              <Slide direction="left" in timeout={1200}>
                <Box sx={{ position: 'relative', textAlign: 'center' }}>
                  {/* Interactive Course Categories */}
                  <Grid container spacing={2}>
                    {courseCategories.map((category, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Zoom in timeout={800 + index * 100}>
                          <Card
                            sx={{
                              p: 2,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-8px) scale(1.05)',
                                bgcolor: 'rgba(255,255,255,0.15)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                              }
                            }}
                          >
                            <Box sx={{ 
                              color: category.color, 
                              mb: 1,
                              display: 'flex',
                              justifyContent: 'center'
                            }}>
                              {category.icon}
                            </Box>
                            <Typography 
                              variant="body2" 
                              fontWeight={600} 
                              sx={{ color: 'white', mb: 0.5 }}
                            >
                              {category.name}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                              {category.courses}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={category.popularity}
                              sx={{
                                mt: 1,
                                height: 3,
                                borderRadius: 2,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: category.color,
                                  borderRadius: 2
                                }
                              }}
                            />
                          </Card>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Live Stats Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              fontWeight={800}
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Trusted by Thousands Worldwide
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Real-time platform statistics updated live
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Zoom in timeout={500 + index * 100}>
                  <Paper
                    elevation={8}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}25 100%)`,
                      border: `1px solid ${stat.color}30`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: `0 20px 40px ${stat.color}30`
                      }
                    }}
                  >
                    <Box sx={{ color: stat.color, mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h3" 
                      fontWeight={800} 
                      gutterBottom
                      sx={{ color: stat.color }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight={600}
                      sx={{ color: 'text.primary' }}
                    >
                      {stat.label}
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              fontWeight={800}
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Your Learning Journey
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Four simple steps to master AI and transform your career
            </Typography>
          </Box>

          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                {learningSteps.map((step, index) => (
                  <Fade in timeout={1000 + index * 200} key={index}>
                    <Card
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                        border: `2px solid ${activeStep === index ? step.color : 'transparent'}`,
                        transition: 'all 0.5s ease',
                        transform: activeStep === index ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: activeStep === index ? `0 10px 30px ${step.color}30` : 2,
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: `0 10px 30px ${step.color}30`
                        }
                      }}
                      onClick={() => setActiveStep(index)}
                    >
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}80 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}
                        >
                          {step.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight={700} gutterBottom>
                            {step.title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {step.description}
                          </Typography>
                        </Box>
                        <Chip
                          label={step.step}
                          sx={{
                            bgcolor: step.color,
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.9rem'
                          }}
                        />
                      </Stack>
                    </Card>
                  </Fade>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Zoom in timeout={1500}>
                  <Paper
                    elevation={12}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${learningSteps[activeStep].color}15 0%, ${learningSteps[activeStep].color}25 100%)`,
                      border: `2px solid ${learningSteps[activeStep].color}30`
                    }}
                  >
                    <Box sx={{ 
                      color: learningSteps[activeStep].color, 
                      mb: 3,
                      fontSize: '4rem'
                    }}>
                      {learningSteps[activeStep].icon}
                    </Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      {learningSteps[activeStep].title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                      {learningSteps[activeStep].description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: learningSteps[activeStep].color,
                        '&:hover': {
                          bgcolor: learningSteps[activeStep].color + 'dd'
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </Paper>
                </Zoom>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              fontWeight={800}
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Why 10,000+ Students Choose Us
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Experience the difference that sets us apart from other platforms
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {whyChooseUs.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in timeout={600 + index * 100}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}25 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        color: item.color,
                        border: `2px solid ${item.color}30`
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, 
            ${theme.palette.primary.main} 0%, 
            ${theme.palette.primary.dark} 50%, 
            ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255,235,59,0.1) 0%, transparent 70%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Fade in timeout={1000}>
            <Box>
              <Typography 
                variant="h2" 
                component="h2" 
                fontWeight={800}
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Ready to Transform Your Future?
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 6, 
                  opacity: 0.95,
                  lineHeight: 1.6,
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Join thousands of students who are already building successful AI careers. 
                Start your journey today with our comprehensive courses and expert mentorship.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ justifyContent: 'center', mb: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  startIcon={<RocketIcon />}
                  sx={{
                    bgcolor: '#ffeb3b',
                    color: '#1976d2',
                    px: 6,
                    py: 2.5,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    textTransform: 'none',
                    boxShadow: '0 15px 35px rgba(255,235,59,0.4)',
                    '&:hover': {
                      bgcolor: '#fdd835',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 20px 45px rgba(255,235,59,0.5)'
                    }
                  }}
                >
                  Start Learning Now
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/courses')}
                  endIcon={<ArrowIcon />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.7)',
                    color: 'white',
                    px: 6,
                    py: 2.5,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: 'none',
                    borderWidth: 2,
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-3px)',
                      borderWidth: 2
                    }
                  }}
                >
                  Browse Courses
                </Button>
              </Stack>
              
              <Stack direction="row" spacing={4} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon sx={{ color: '#4caf50' }} />
                  <Typography variant="body1">Free to start</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon sx={{ color: '#4caf50' }} />
                  <Typography variant="body1">Expert mentorship</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon sx={{ color: '#4caf50' }} />
                  <Typography variant="body1">Career support</Typography>
                </Box>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
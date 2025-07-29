// src/pages/HomePage.jsx
import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(userType === 'tutor' ? '/tutor/dashboard' : '/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Master AI with Expert Guidance
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Learn AI and Machine Learning from industry experts with hands-on projects and AI-powered assessments
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleGetStarted}
          sx={{ mr: 2, mb: 2 }}
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/browse')}
          sx={{ mb: 2 }}
        >
          Browse Courses
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ py: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>🎓</Typography>
              <Typography variant="h6" gutterBottom>Expert-Led Courses</Typography>
              <Typography variant="body2" color="text.secondary">
                Learn from industry professionals with real-world experience
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>🤖</Typography>
              <Typography variant="h6" gutterBottom>AI-Powered Learning</Typography>
              <Typography variant="body2" color="text.secondary">
                Personalized recommendations and intelligent assessment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>🏆</Typography>
              <Typography variant="h6" gutterBottom>Gamified Experience</Typography>
              <Typography variant="body2" color="text.secondary">
                Earn badges, track progress, and compete with peers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
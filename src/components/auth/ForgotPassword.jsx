// src/components/auth/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  CircularProgress,
  Container
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { resetPassword, error: authError } = useAuth();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setErrors({ email: emailValidation.errors[0] });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await resetPassword(email);
      if (result.success) {
        setIsEmailSent(true);
      }
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Card sx={{ width: '100%', maxWidth: 400 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ mb: 3 }}>
                <EmailIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: 'primary.main', 
                    mb: 2 
                  }} 
                />
                <Typography component="h1" variant="h4" gutterBottom>
                  Check Your Email
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  We've sent a password reset link to:
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 3 }}>
                  {email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  If you don't see the email in your inbox within a few minutes, 
                  check your spam folder.
                </Typography>
              </Box>

              <Button
                component={Link}
                to="/login"
                variant="contained"
                fullWidth
                sx={{ mb: 2 }}
              >
                Back to Sign In
              </Button>

              <Button
                variant="text"
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
                sx={{ textTransform: 'none' }}
              >
                Try a different email
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography component="h1" variant="h4" gutterBottom>
                Forgot Password?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
            </Box>

            {authError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {authError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <Button
                component={Link}
                to="/login"
                fullWidth
                variant="text"
                startIcon={<ArrowBackIcon />}
                sx={{ textTransform: 'none' }}
              >
                Back to Sign In
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
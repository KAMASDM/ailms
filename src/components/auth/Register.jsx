// src/components/auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { USER_TYPES } from '../../utils/constants';
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword, 
  validateRequired 
} from '../../utils/validators';

const Register = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: USER_TYPES.STUDENT,
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp, signInWithGoogle, error: authError, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate display name
    const nameValidation = validateRequired(formData.displayName, 'Full Name');
    if (!nameValidation.isValid) {
      newErrors.displayName = nameValidation.errors[0];
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors[0];
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    // Validate confirm password
    const confirmPasswordValidation = validateConfirmPassword(
      formData.password, 
      formData.confirmPassword
    );
    if (!confirmPasswordValidation.isValid) {
      newErrors.confirmPassword = confirmPasswordValidation.errors[0];
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const userData = {
        displayName: formData.displayName,
        userType: formData.userType
      };

      const result = await signUp(formData.email, formData.password, userData);
      if (result.success) {
        // Show success message and redirect to login
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! Please check your email for verification.' 
          } 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

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
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join thousands of learners in mastering AI
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
                id="displayName"
                label="Full Name"
                name="displayName"
                autoComplete="name"
                autoFocus
                value={formData.displayName}
                onChange={handleInputChange}
                error={!!errors.displayName}
                helperText={errors.displayName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
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

              <FormControl fullWidth margin="normal">
                <InputLabel id="userType-label">I am a</InputLabel>
                <Select
                  labelId="userType-label"
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  label="I am a"
                  onChange={handleInputChange}
                >
                  <MenuItem value={USER_TYPES.STUDENT}>Student</MenuItem>
                  <MenuItem value={USER_TYPES.TUTOR}>Tutor</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => togglePasswordVisibility('password')}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link to="/terms" style={{ color: '#1976d2' }}>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" style={{ color: '#1976d2' }}>
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{ mt: 1 }}
              />
              {errors.agreeToTerms && (
                <Typography variant="caption" color="error" display="block">
                  {errors.agreeToTerms}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Create Account'
                )}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                sx={{ py: 1.5, mb: 2 }}
                disabled={isLoading}
              >
                Continue with Google
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    style={{
                      textDecoration: 'none',
                      color: '#1976d2',
                      fontWeight: 500
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register;
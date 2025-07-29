// src/components/common/ErrorBoundary.jsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Here you could also log the error to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              textAlign: 'center'
            }}
          >
            <Card sx={{ maxWidth: 600, p: 2 }}>
              <CardContent>
                <ErrorIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: 'error.main', 
                    mb: 2 
                  }} 
                />
                
                <Typography variant="h4" gutterBottom>
                  Oops! Something went wrong
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  We're sorry, but something unexpected happened. 
                  Please try refreshing the page or contact support if the problem persists.
                </Typography>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Error Details (Development Mode):
                    </Typography>
                    <Typography variant="body2" component="pre" sx={{ 
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>
                      {this.state.error.toString()}
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={this.handleRefresh}
                  >
                    Refresh Page
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={this.handleReset}
                  >
                    Try Again
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
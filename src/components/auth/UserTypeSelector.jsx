// src/components/auth/UserTypeSelector.jsx
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Button,
  Container,
  Grid,
  Chip,
  Avatar
} from '@mui/material';
import {
  School as StudentIcon,
  Person as TutorIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { USER_TYPES } from '../../utils/constants';

const UserTypeSelector = ({ onUserTypeSelect, selectedUserType, showContinue = true }) => {
  const [selected, setSelected] = useState(selectedUserType || '');

  const userTypes = [
    {
      type: USER_TYPES.STUDENT,
      title: 'Student',
      description: 'I want to learn AI and machine learning',
      icon: <StudentIcon sx={{ fontSize: 40 }} />,
      features: [
        'Access to AI courses',
        'Interactive quizzes',
        'Progress tracking',
        'Certificates',
        'Community discussions'
      ],
      color: '#1976d2'
    },
    {
      type: USER_TYPES.TUTOR,
      title: 'Tutor',
      description: 'I want to teach and create AI courses',
      icon: <TutorIcon sx={{ fontSize: 40 }} />,
      features: [
        'Create courses',
        'Build quizzes',
        'Track student progress',
        'Earn revenue',
        'Analytics dashboard'
      ],
      color: '#dc004e'
    }
  ];

  const handleSelect = (userType) => {
    setSelected(userType);
    if (onUserTypeSelect) {
      onUserTypeSelect(userType);
    }
  };

  const handleContinue = () => {
    if (selected && onUserTypeSelect) {
      onUserTypeSelect(selected);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Choose Your Role
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select how you'd like to use our AI learning platform
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {userTypes.map((userType) => (
            <Grid item xs={12} md={6} key={userType.type}>
              <Card
                sx={{
                  height: '100%',
                  border: selected === userType.type ? 2 : 1,
                  borderColor: selected === userType.type ? userType.color : 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: userType.color,
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardActionArea
                  onClick={() => handleSelect(userType.type)}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: selected === userType.type ? userType.color : 'grey.100',
                          color: selected === userType.type ? 'white' : userType.color,
                          mx: 'auto',
                          mb: 2,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {userType.icon}
                      </Avatar>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {userType.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {userType.description}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        What you can do:
                      </Typography>
                      {userType.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{
                            m: 0.5,
                            borderColor: selected === userType.type ? userType.color : 'divider',
                            color: selected === userType.type ? userType.color : 'text.secondary'
                          }}
                        />
                      ))}
                    </Box>

                    {selected === userType.type && (
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Chip
                          label="Selected"
                          color="primary"
                          sx={{
                            bgcolor: userType.color,
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {showContinue && (
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleContinue}
              disabled={!selected}
              sx={{ minWidth: 200 }}
            >
              Continue
            </Button>
          </Box>
        )}

        {selected && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              You can change this later in your profile settings
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default UserTypeSelector;
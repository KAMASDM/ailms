// src/components/quizzes/QuizList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Quiz as QuizIcon,
  Timer as TimerIcon,
  Grade as GradeIcon,
  PlayArrow as StartIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  CheckCircle as CompleteIcon,
  Schedule as PendingIcon,
  Lock as LockedIcon
} from '@mui/icons-material';
import { PageHeader, ConfirmDialog } from '../common';
import { formatDuration, formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { USER_TYPES } from '../../utils/constants';
import quizService from '../../services/quizService';

const QuizList = ({ courseId = null, variant = 'student' }) => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, [courseId, activeTab]);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      let result;
      
      if (userType === USER_TYPES.TUTOR || variant === 'tutor') {
        // Load tutor's quizzes
        result = await quizService.getTutorQuizzes(user.uid, { courseId });
      } else {
        // Load quizzes for students
        if (courseId) {
          result = await quizService.getCourseQuizzes(courseId);
        } else {
          result = await quizService.getAvailableQuizzes(user.uid);
        }
      }

      if (result.success) {
        let filteredQuizzes = result.quizzes || [];

        // Apply tab filters
        if (userType === USER_TYPES.STUDENT) {
          switch (activeTab) {
            case 0: // Available
              filteredQuizzes = filteredQuizzes.filter(quiz => 
                quiz.status === 'published' && 
                (!quiz.attempts || quiz.attempts.length < (quiz.settings?.attemptsAllowed || 1))
              );
              break;
            case 1: // Completed
              filteredQuizzes = filteredQuizzes.filter(quiz => 
                quiz.attempts && quiz.attempts.length > 0 && 
                quiz.attempts.some(attempt => attempt.passed)
              );
              break;
            case 2: // All
              filteredQuizzes = filteredQuizzes.filter(quiz => 
                quiz.status === 'published'
              );
              break;
          }
        } else {
          // Tutor view
          switch (activeTab) {
            case 0: // Published
              filteredQuizzes = filteredQuizzes.filter(quiz => 
                quiz.status === 'published'
              );
              break;
            case 1: // Draft
              filteredQuizzes = filteredQuizzes.filter(quiz => 
                quiz.status === 'draft'
              );
              break;
            case 2: // All
              // Show all quizzes
              break;
          }
        }

        setQuizzes(filteredQuizzes);
      } else {
        console.error('Failed to load quizzes:', result.error);
        setQuizzes([]);
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };

  const handleViewResults = (quiz) => {
    navigate(`/quiz/${quiz.id}/results`);
  };

  const handleEditQuiz = (quiz) => {
    navigate(`/tutor/quiz/${quiz.id}/edit`);
  };

  const handleDeleteQuiz = async () => {
    if (selectedQuiz) {
      try {
        const result = await quizService.deleteQuiz(selectedQuiz.id);
        
        if (result.success) {
          setQuizzes(prev => prev.filter(quiz => quiz.id !== selectedQuiz.id));
          console.log('Quiz deleted successfully');
        } else {
          console.error('Failed to delete quiz:', result.error);
          alert('Failed to delete quiz. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Error deleting quiz. Please try again.');
      } finally {
        setDeleteDialog(false);
        setSelectedQuiz(null);
      }
    }
  };

  const handleMenuClick = (event, quiz) => {
    setMenuAnchor(event.currentTarget);
    setSelectedQuiz(quiz);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedQuiz(null);
  };

  const getStatusIcon = (quiz) => {
    if (userType === USER_TYPES.STUDENT) {
      if (quiz.status === 'locked') return <LockedIcon color="action" />;
      if (quiz.attempts.some(attempt => attempt.passed)) return <CompleteIcon color="success" />;
      if (quiz.attempts.length > 0) return <PendingIcon color="warning" />;
      return <QuizIcon color="primary" />;
    } else {
      return quiz.isPublished ? <QuizIcon color="primary" /> : <PendingIcon color="warning" />;
    }
  };

  const getStatusText = (quiz) => {
    if (userType === USER_TYPES.STUDENT) {
      if (quiz.status === 'locked') return 'Locked';
      if (quiz.attempts.some(attempt => attempt.passed)) return 'Completed';
      if (quiz.attempts.length > 0) return 'In Progress';
      return 'Available';
    } else {
      return quiz.isPublished ? 'Published' : 'Draft';
    }
  };

  const getStatusColor = (quiz) => {
    if (userType === USER_TYPES.STUDENT) {
      if (quiz.status === 'locked') return 'default';
      if (quiz.attempts.some(attempt => attempt.passed)) return 'success';
      if (quiz.attempts.length > 0) return 'warning';
      return 'primary';
    } else {
      return quiz.isPublished ? 'success' : 'warning';
    }
  };

  const renderQuizCard = (quiz) => (
    <Card key={quiz.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getStatusIcon(quiz)}
            <Typography variant="h6" sx={{ ml: 1, flex: 1 }}>
              {quiz.title}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={getStatusText(quiz)}
              color={getStatusColor(quiz)}
              size="small"
              sx={{ mr: 1 }}
            />
            {userType === USER_TYPES.TUTOR && (
              <IconButton size="small" onClick={(e) => handleMenuClick(e, quiz)}>
                <MoreIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {quiz.description}
        </Typography>

        {/* Course Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={quiz.instructor.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {quiz.courseName} • {quiz.instructor.name}
          </Typography>
        </Box>

        {/* Quiz Stats */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {quiz.totalQuestions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Questions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {Math.floor(quiz.duration / 60)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Minutes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {quiz.totalPoints}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Points
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Student Progress */}
        {userType === USER_TYPES.STUDENT && quiz.bestScore !== null && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Best Score</Typography>
              <Typography variant="body2" fontWeight="bold">
                {quiz.bestScore}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={quiz.bestScore}
              color={quiz.bestScore >= quiz.passingScore ? 'success' : 'warning'}
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption" color="text.secondary">
              Attempts: {quiz.attemptsUsed}/{quiz.maxAttempts}
            </Typography>
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ mt: 'auto' }}>
          {userType === USER_TYPES.STUDENT ? (
            <Box>
              {quiz.status === 'locked' ? (
                <Button fullWidth disabled>
                  Locked
                </Button>
              ) : quiz.attempts.some(attempt => attempt.passed) ? (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  onClick={() => handleViewResults(quiz)}
                >
                  View Results
                </Button>
              ) : quiz.attemptsUsed >= quiz.maxAttempts ? (
                <Button fullWidth disabled>
                  No Attempts Left
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<StartIcon />}
                  onClick={() => handleStartQuiz(quiz)}
                >
                  {quiz.attempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
                </Button>
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ViewIcon />}
                onClick={() => navigate(`/tutor/quiz/${quiz.id}`)}
                sx={{ flex: 1 }}
              >
                View
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => handleEditQuiz(quiz)}
                sx={{ flex: 1 }}
              >
                Edit
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const getTabLabels = () => {
    if (userType === USER_TYPES.STUDENT) {
      return ['Available', 'Completed', 'All'];
    } else {
      return ['Published', 'Draft', 'All'];
    }
  };

  return (
    <Box>
      <PageHeader
        title="Quizzes"
        subtitle={userType === USER_TYPES.STUDENT ? 
          "Test your knowledge and track your progress" : 
          "Create and manage quiz assessments"
        }
        actions={userType === USER_TYPES.TUTOR ? [
          {
            label: 'Create Quiz',
            icon: <QuizIcon />,
            onClick: () => navigate('/tutor/create-quiz'),
            variant: 'contained'
          }
        ] : []}
      />

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
          {getTabLabels().map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Paper>

      {/* Quiz Grid */}
      {loading ? (
        <Typography>Loading quizzes...</Typography>
      ) : quizzes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <QuizIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No quizzes found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userType === USER_TYPES.TUTOR ? 
              'Create your first quiz to get started.' : 
              'Check back later for new quizzes.'
            }
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {quizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
              {renderQuizCard(quiz)}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/tutor/quiz/${selectedQuiz.id}`);
          handleMenuClose();
        }}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          handleEditQuiz(selectedQuiz);
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Quiz
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/tutor/quiz/${selectedQuiz.id}/analytics`);
          handleMenuClose();
        }}>
          <GradeIcon sx={{ mr: 1 }} />
          View Analytics
        </MenuItem>
        <MenuItem 
          onClick={() => {
            setDeleteDialog(true);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Quiz
        </MenuItem>
      </Menu>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDeleteQuiz}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${selectedQuiz?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};

export default QuizList;
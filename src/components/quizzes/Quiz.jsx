// src/components/quizzes/Quiz.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Checkbox,
  FormGroup,
  TextField,
  LinearProgress,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Timer as TimerIcon,
  QuestionAnswer as QuestionIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { PageHeader, ConfirmDialog } from '../common';
import { formatDuration } from '../../utils/helpers';
import { QUIZ_TYPES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import quizService from '../../services/quizService';

const Quiz = ({ variant = 'take' }) => { // 'take' or 'preview'
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  useEffect(() => {
    loadQuiz();
  }, [id]);

  useEffect(() => {
    let timer;
    if (timeRemaining > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  const loadQuiz = async () => {
    // Mock quiz data - replace with actual API call
    const mockQuiz = {
      id: id,
      title: 'Deep Learning Fundamentals Quiz',
      description: 'Test your understanding of neural networks and deep learning concepts.',
      courseId: 1,
      duration: 1800, // 30 minutes in seconds
      passingScore: 80,
      allowReview: true,
      showCorrectAnswers: true,
      questions: [
        {
          id: 1,
          type: QUIZ_TYPES.MULTIPLE_CHOICE,
          question: 'What is the primary function of an activation function in a neural network?',
          options: [
            'To initialize the weights',
            'To introduce non-linearity into the network',
            'To calculate the loss function',
            'To update the learning rate'
          ],
          correctAnswer: 1,
          explanation: 'Activation functions introduce non-linearity, allowing neural networks to learn complex patterns.',
          points: 10
        },
        {
          id: 2,
          type: QUIZ_TYPES.TRUE_FALSE,
          question: 'Backpropagation is used to update the weights in a neural network.',
          correctAnswer: true,
          explanation: 'Backpropagation is the algorithm used to calculate gradients and update weights.',
          points: 5
        },
        {
          id: 3,
          type: QUIZ_TYPES.MULTIPLE_CHOICE,
          question: 'Which of the following are common activation functions? (Select all that apply)',
          options: [
            'ReLU',
            'Sigmoid',
            'Tanh',
            'Linear'
          ],
          correctAnswers: [0, 1, 2], // Multiple correct answers
          explanation: 'ReLU, Sigmoid, and Tanh are all commonly used activation functions.',
          points: 15
        },
        {
          id: 4,
          type: QUIZ_TYPES.SHORT_ANSWER,
          question: 'Explain the vanishing gradient problem in your own words.',
          sampleAnswer: 'The vanishing gradient problem occurs when gradients become exponentially small as they propagate backward through deep networks, making it difficult to train earlier layers.',
          points: 20
        },
        {
          id: 5,
          type: QUIZ_TYPES.CODE,
          question: 'Write a simple Python function to implement the ReLU activation function.',
          sampleAnswer: 'def relu(x):\n    return max(0, x)',
          points: 25
        }
      ]
    };

    setQuiz(mockQuiz);
    setTimeRemaining(mockQuiz.duration);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmitQuiz = async () => {
    if (variant === 'preview') {
      // Just close preview mode
      navigate(-1);
      return;
    }

    try {
      setIsSubmitted(true);
      
      // Submit the quiz attempt to Firebase
      const attemptData = {
        quizId: quiz.id,
        studentId: user.uid,
        answers: answers,
        timeSpent: (quiz.settings?.timeLimit || 30) * 60 - (timeRemaining || 0),
        flaggedQuestions: Array.from(flaggedQuestions),
        submittedAt: new Date()
      };

      const result = await quizService.submitQuizAttempt(attemptData);
      
      if (result.success) {
        setResults(result.results);
        setShowSubmitDialog(false);
        
        // Redirect to results page after a delay
        setTimeout(() => {
          navigate(`/quiz/${quiz.id}/results`);
        }, 3000);
      } else {
        console.error('Failed to submit quiz:', result.error);
        alert('Failed to submit quiz. Please try again.');
        setIsSubmitted(false);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
      setIsSubmitted(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question) => {
    const userAnswer = answers[question.id];
    const questionResult = results?.questionResults[question.id];

    switch (question.type) {
      case QUIZ_TYPES.MULTIPLE_CHOICE:
        if (question.correctAnswers) {
          // Multiple choice with multiple answers
          return (
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Select all that apply:</FormLabel>
              <FormGroup>
                {question.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={Array.isArray(userAnswer) ? userAnswer.includes(index) : false}
                        onChange={(e) => {
                          const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
                          const newAnswers = e.target.checked
                            ? [...currentAnswers, index]
                            : currentAnswers.filter(answer => answer !== index);
                          handleAnswerChange(question.id, newAnswers);
                        }}
                        disabled={isSubmitted}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
            </FormControl>
          );
        } else {
          // Single choice
          return (
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={userAnswer || ''}
                onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
              >
                {question.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio disabled={isSubmitted} />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          );
        }

      case QUIZ_TYPES.TRUE_FALSE:
        return (
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={userAnswer !== undefined ? userAnswer.toString() : ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value === 'true')}
            >
              <FormControlLabel
                value="true"
                control={<Radio disabled={isSubmitted} />}
                label="True"
              />
              <FormControlLabel
                value="false"
                control={<Radio disabled={isSubmitted} />}
                label="False"
              />
            </RadioGroup>
          </FormControl>
        );

      case QUIZ_TYPES.SHORT_ANSWER:
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer here..."
            disabled={isSubmitted}
          />
        );

      case QUIZ_TYPES.CODE:
        return (
          <TextField
            fullWidth
            multiline
            rows={8}
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your code here..."
            disabled={isSubmitted}
            sx={{
              '& .MuiInputBase-input': {
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }
            }}
          />
        );

      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <Box>
        <Card sx={{ mb: 3, bgcolor: results.passed ? 'success.light' : 'error.light' }}>
          <CardContent>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                {results.percentage}%
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {results.passed ? 'Congratulations! You passed!' : 'You did not pass this time.'}
              </Typography>
              <Typography variant="body1">
                You scored {results.earnedPoints} out of {results.totalPoints} points
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time taken: {formatTime(results.timeTaken)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {quiz.showCorrectAnswers && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Review Your Answers</Typography>
              {quiz.questions.map((question, index) => {
                const questionResult = results.questionResults[question.id];
                return (
                  <Box key={question.id} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ flex: 1 }}>
                        Question {index + 1}: {question.question}
                      </Typography>
                      {questionResult.isCorrect ? 
                        <CheckIcon color="success" /> : 
                        <CancelIcon color="error" />
                      }
                    </Box>
                    
                    {questionResult.explanation && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        {questionResult.explanation}
                      </Alert>
                    )}
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/courses')}
            sx={{ mr: 2 }}
          >
            Back to Courses
          </Button>
          {!results.passed && (
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Retake Quiz
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  if (!quiz) {
    return <Typography>Loading quiz...</Typography>;
  }

  if (isSubmitted && results) {
    return (
      <Box>
        <PageHeader
          title="Quiz Results"
          subtitle={quiz.title}
        />
        {renderResults()}
      </Box>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <Box>
      <PageHeader
        title={quiz.title}
        subtitle={quiz.description}
      />

      {/* Quiz Header */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimerIcon sx={{ mr: 1 }} />
            <Typography variant="h6" color={timeRemaining < 300 ? 'error' : 'inherit'}>
              {formatTime(timeRemaining)}
            </Typography>
          </Box>
          
          <Typography variant="body1">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Typography>
        </Box>
        
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
      </Paper>

      {/* Question */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QuestionIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Question {currentQuestionIndex + 1}
                </Typography>
                <Chip 
                  label={`${currentQuestion.points} pts`} 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              </Box>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                {currentQuestion.question}
              </Typography>
            </Box>
            
            <IconButton
              onClick={() => toggleFlagQuestion(currentQuestion.id)}
              color={flaggedQuestions.has(currentQuestion.id) ? 'warning' : 'default'}
            >
              <FlagIcon />
            </IconButton>
          </Box>

          {renderQuestion(currentQuestion)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          startIcon={<PrevIcon />}
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowSubmitDialog(true)}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              endIcon={<NextIcon />}
              variant="contained"
              onClick={handleNextQuestion}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>

      {/* Question Navigator */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Question Navigator</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {quiz.questions.map((question, index) => {
            const isAnswered = answers[question.id] !== undefined;
            const isFlagged = flaggedQuestions.has(question.id);
            const isCurrent = index === currentQuestionIndex;
            
            return (
              <Button
                key={question.id}
                variant={isCurrent ? 'contained' : isAnswered ? 'outlined' : 'text'}
                color={isFlagged ? 'warning' : 'primary'}
                size="small"
                onClick={() => setCurrentQuestionIndex(index)}
                sx={{ minWidth: 40, height: 40 }}
              >
                {index + 1}
              </Button>
            );
          })}
        </Box>
      </Paper>

      {/* Submit Confirmation Dialog */}
      <ConfirmDialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={handleSubmitQuiz}
        title="Submit Quiz"
        message={`Are you sure you want to submit your quiz? You have answered ${Object.keys(answers).length} out of ${quiz.questions.length} questions.`}
        confirmText="Submit"
        confirmColor="primary"
      />
    </Box>
  );
};

export default Quiz;
// src/components/quizzes/QuizCreator.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Chip,
  Paper,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Quiz as QuizIcon,
  Timer as TimerIcon,
  Grade as GradeIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import { PageHeader, ConfirmDialog } from '../common';
import { QUIZ_TYPES } from '../../utils/constants';

const QuizCreator = ({ editMode = false, quizId = null }) => {
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    courseId: '',
    duration: 30, // minutes
    passingScore: 80,
    allowReview: true,
    showCorrectAnswers: true,
    shuffleQuestions: false,
    shuffleAnswers: false,
    maxAttempts: 3,
    isPublished: false,
    questions: []
  });

  const [questionDialog, setQuestionDialog] = useState({
    open: false,
    question: null,
    index: null
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    questionIndex: null
  });

  const [previewDialog, setPreviewDialog] = useState(false);

  // Sample courses for dropdown
  const courses = [
    { id: 1, title: 'Deep Learning Fundamentals' },
    { id: 2, title: 'Computer Vision Basics' },
    { id: 3, title: 'Natural Language Processing' }
  ];

  const handleInputChange = (field, value) => {
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddQuestion = () => {
    setQuestionDialog({
      open: true,
      question: {
        type: QUIZ_TYPES.MULTIPLE_CHOICE,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        points: 10
      },
      index: null
    });
  };

  const handleEditQuestion = (question, index) => {
    setQuestionDialog({
      open: true,
      question: { ...question },
      index
    });
  };

  const handleSaveQuestion = () => {
    const { question, index } = questionDialog;
    
    if (index !== null) {
      // Edit existing question
      setQuizData(prev => ({
        ...prev,
        questions: prev.questions.map((q, i) => i === index ? question : q)
      }));
    } else {
      // Add new question
      setQuizData(prev => ({
        ...prev,
        questions: [...prev.questions, { ...question, id: Date.now() }]
      }));
    }

    setQuestionDialog({ open: false, question: null, index: null });
  };

  const handleDeleteQuestion = (index) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
    setDeleteDialog({ open: false, questionIndex: null });
  };

  const handleSaveQuiz = () => {
    console.log('Saving quiz:', quizData);
    // Implementation for saving quiz
    navigate('/tutor/quizzes');
  };

  const getTotalPoints = () => {
    return quizData.questions.reduce((total, question) => total + (question.points || 0), 0);
  };

  const renderQuestionDialog = () => {
    const { question } = questionDialog;
    if (!question) return null;

    return (
      <Dialog 
        open={questionDialog.open} 
        onClose={() => setQuestionDialog({ open: false, question: null, index: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {questionDialog.index !== null ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Question Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Question Type</InputLabel>
                <Select
                  value={question.type}
                  onChange={(e) => setQuestionDialog(prev => ({
                    ...prev,
                    question: { ...prev.question, type: e.target.value }
                  }))}
                  label="Question Type"
                >
                  <MenuItem value={QUIZ_TYPES.MULTIPLE_CHOICE}>Multiple Choice</MenuItem>
                  <MenuItem value={QUIZ_TYPES.TRUE_FALSE}>True/False</MenuItem>
                  <MenuItem value={QUIZ_TYPES.SHORT_ANSWER}>Short Answer</MenuItem>
                  <MenuItem value={QUIZ_TYPES.CODE}>Code</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Points */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Points"
                value={question.points}
                onChange={(e) => setQuestionDialog(prev => ({
                  ...prev,
                  question: { ...prev.question, points: parseInt(e.target.value) }
                }))}
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>

            {/* Question Text */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Question"
                value={question.question}
                onChange={(e) => setQuestionDialog(prev => ({
                  ...prev,
                  question: { ...prev.question, question: e.target.value }
                }))}
                placeholder="Enter your question here..."
              />
            </Grid>

            {/* Answer Options */}
            {(question.type === QUIZ_TYPES.MULTIPLE_CHOICE) && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Answer Options</Typography>
                </Grid>
                {question.options.map((option, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options];
                          newOptions[index] = e.target.value;
                          setQuestionDialog(prev => ({
                            ...prev,
                            question: { ...prev.question, options: newOptions }
                          }));
                        }}
                      />
                      <FormControlLabel
                        control={
                          <input
                            type="radio"
                            checked={question.correctAnswer === index}
                            onChange={() => setQuestionDialog(prev => ({
                              ...prev,
                              question: { ...prev.question, correctAnswer: index }
                            }))}
                          />
                        }
                        label="Correct"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                  </Grid>
                ))}
              </>
            )}

            {/* True/False Options */}
            {question.type === QUIZ_TYPES.TRUE_FALSE && (
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <Typography variant="subtitle1" gutterBottom>Correct Answer</Typography>
                  <FormControlLabel
                    control={
                      <input
                        type="radio"
                        checked={question.correctAnswer === true}
                        onChange={() => setQuestionDialog(prev => ({
                          ...prev,
                          question: { ...prev.question, correctAnswer: true }
                        }))}
                      />
                    }
                    label="True"
                  />
                  <FormControlLabel
                    control={
                      <input
                        type="radio"
                        checked={question.correctAnswer === false}
                        onChange={() => setQuestionDialog(prev => ({
                          ...prev,
                          question: { ...prev.question, correctAnswer: false }
                        }))}
                      />
                    }
                    label="False"
                  />
                </FormControl>
              </Grid>
            )}

            {/* Sample Answer for Text/Code Questions */}
            {(question.type === QUIZ_TYPES.SHORT_ANSWER || question.type === QUIZ_TYPES.CODE) && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={question.type === QUIZ_TYPES.CODE ? 6 : 3}
                  label="Sample Answer"
                  value={question.sampleAnswer || ''}
                  onChange={(e) => setQuestionDialog(prev => ({
                    ...prev,
                    question: { ...prev.question, sampleAnswer: e.target.value }
                  }))}
                  placeholder="Provide a sample correct answer..."
                  sx={question.type === QUIZ_TYPES.CODE ? {
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace'
                    }
                  } : {}}
                />
              </Grid>
            )}

            {/* Explanation */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Explanation (Optional)"
                value={question.explanation}
                onChange={(e) => setQuestionDialog(prev => ({
                  ...prev,
                  question: { ...prev.question, explanation: e.target.value }
                }))}
                placeholder="Explain why this is the correct answer..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionDialog({ open: false, question: null, index: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveQuestion}
            variant="contained"
            disabled={!question.question.trim()}
          >
            {questionDialog.index !== null ? 'Update' : 'Add'} Question
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderQuestionPreview = (question, index) => {
    return (
      <Accordion key={index}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography variant="subtitle1" sx={{ flex: 1 }}>
              Question {index + 1}: {question.question.substring(0, 50)}...
            </Typography>
            <Chip 
              label={`${question.points} pts`} 
              size="small" 
              sx={{ mr: 2 }} 
            />
            <Chip 
              label={question.type.replace('_', ' ')} 
              size="small" 
              variant="outlined" 
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {question.question}
          </Typography>

          {question.type === QUIZ_TYPES.MULTIPLE_CHOICE && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Options:</Typography>
              {question.options.map((option, optionIndex) => (
                <Typography 
                  key={optionIndex} 
                  variant="body2" 
                  sx={{ 
                    color: optionIndex === question.correctAnswer ? 'success.main' : 'inherit',
                    fontWeight: optionIndex === question.correctAnswer ? 'bold' : 'normal'
                  }}
                >
                  {String.fromCharCode(65 + optionIndex)}. {option} 
                  {optionIndex === question.correctAnswer && ' ✓'}
                </Typography>
              ))}
            </Box>
          )}

          {question.type === QUIZ_TYPES.TRUE_FALSE && (
            <Typography variant="body2" sx={{ mb: 2, color: 'success.main', fontWeight: 'bold' }}>
              Correct Answer: {question.correctAnswer ? 'True' : 'False'}
            </Typography>
          )}

          {question.explanation && (
            <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Explanation:</Typography>
              <Typography variant="body2">{question.explanation}</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => handleEditQuestion(question, index)}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialog({ open: true, questionIndex: index })}
            >
              Delete
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box>
      <PageHeader
        title={editMode ? 'Edit Quiz' : 'Create New Quiz'}
        subtitle="Design engaging assessments for your students"
        showBackButton
        backPath="/tutor/quizzes"
        actions={[
          {
            label: 'Preview Quiz',
            icon: <PreviewIcon />,
            onClick: () => setPreviewDialog(true),
            variant: 'outlined',
            disabled: quizData.questions.length === 0
          }
        ]}
      />

      <Grid container spacing={3}>
        {/* Quiz Settings */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quiz Settings</Typography>
              
              <TextField
                fullWidth
                label="Quiz Title"
                value={quizData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                sx={{ mb: 2 }}
                required
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={quizData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Course</InputLabel>
                <Select
                  value={quizData.courseId}
                  onChange={(e) => handleInputChange('courseId', e.target.value)}
                  label="Course"
                >
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={quizData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">min</InputAdornment>
                }}
              />

              <TextField
                fullWidth
                type="number"
                label="Passing Score (%)"
                value={quizData.passingScore}
                onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 0, max: 100 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />

              <TextField
                fullWidth
                type="number"
                label="Max Attempts"
                value={quizData.maxAttempts}
                onChange={(e) => handleInputChange('maxAttempts', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 1, max: 10 }}
              />

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>Options</Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={quizData.allowReview}
                    onChange={(e) => handleInputChange('allowReview', e.target.checked)}
                  />
                }
                label="Allow review after submission"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={quizData.showCorrectAnswers}
                    onChange={(e) => handleInputChange('showCorrectAnswers', e.target.checked)}
                  />
                }
                label="Show correct answers"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={quizData.shuffleQuestions}
                    onChange={(e) => handleInputChange('shuffleQuestions', e.target.checked)}
                  />
                }
                label="Shuffle questions"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={quizData.shuffleAnswers}
                    onChange={(e) => handleInputChange('shuffleAnswers', e.target.checked)}
                  />
                }
                label="Shuffle answer options"
              />
            </CardContent>
          </Card>

          {/* Quiz Summary */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quiz Summary</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <QuizIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {quizData.questions.length} questions
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GradeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {getTotalPoints()} total points
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimerIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {quizData.duration} minutes duration
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Questions */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Questions</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddQuestion}
                >
                  Add Question
                </Button>
              </Box>

              {quizData.questions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <QuizIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" gutterBottom>
                    No questions yet
                  </Typography>
                  <Typography variant="body2">
                    Add your first question to get started
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {quizData.questions.map((question, index) => 
                    renderQuestionPreview(question, index)
                  )}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Save Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/tutor/quizzes')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveQuiz}
              disabled={!quizData.title || quizData.questions.length === 0}
            >
              {editMode ? 'Update Quiz' : 'Create Quiz'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Question Dialog */}
      {renderQuestionDialog()}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, questionIndex: null })}
        onConfirm={() => handleDeleteQuestion(deleteDialog.questionIndex)}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};

export default QuizCreator;
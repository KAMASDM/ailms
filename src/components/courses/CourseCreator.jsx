// src/components/courses/CourseCreator.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
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
  Tab,
  Tabs,
  Paper,
  FormControlLabel,
  Switch,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUpload as UploadIcon,
  PlayArrow as VideoIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  Description as TextIcon
} from '@mui/icons-material';
import { PageHeader, ConfirmDialog, NotificationSnackbar } from '../common';
import { COURSE_LEVELS, COURSE_CATEGORIES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import courseService from '../../services/courseService';

const steps = [
  'Basic Information',
  'Course Content',
  'Pricing & Settings',
  'Review & Publish'
];

const CourseCreator = ({ editMode = false, courseId = null }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [validationErrors, setValidationErrors] = useState([]);

  // Course data state
  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    level: '',
    language: 'English',
    thumbnail: null,
    previewVideo: null,
    tags: [],
    whatYouWillLearn: [''],
    requirements: [''],
    targetAudience: [''],
    curriculum: [],
    price: 0,
    comparePrice: 0,
    isFree: true,
    isPublished: false,
    allowDiscussion: true,
    enableCertificate: true,
    enableQuizzes: true
  });

  // Load course data if in edit mode
  useEffect(() => {
    if (editMode && courseId) {
      loadCourseData();
    }
  }, [editMode, courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const result = await courseService.getCourse(courseId);
      if (result.success) {
        setCourseData({
          ...result.course,
          whatYouWillLearn: result.course.objectives || [''],
          targetAudience: result.course.targetAudience || ['']
        });
      } else {
        showNotification('Failed to load course data', 'error');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      showNotification('Error loading course data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Dialog states
  const [lessonDialog, setLessonDialog] = useState({ open: false, moduleIndex: null, lessonIndex: null });
  const [moduleDialog, setModuleDialog] = useState({ open: false, moduleIndex: null });
  const [currentTag, setCurrentTag] = useState('');

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !courseData.tags.includes(currentTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, {
        id: Date.now(),
        title: '',
        description: '',
        lessons: []
      }]
    }));
  };

  const updateModule = (moduleIndex, moduleData) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((module, index) => 
        index === moduleIndex ? { ...module, ...moduleData } : module
      )
    }));
  };

  const deleteModule = (moduleIndex) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, index) => index !== moduleIndex)
    }));
  };

  const addLesson = (moduleIndex) => {
    const newLesson = {
      id: Date.now(),
      title: '',
      type: 'video', // video, text, quiz, assignment
      duration: 0,
      content: '',
      isPreview: false
    };

    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((module, index) => 
        index === moduleIndex 
          ? { ...module, lessons: [...module.lessons, newLesson] }
          : module
      )
    }));
  };

  const updateLesson = (moduleIndex, lessonIndex, lessonData) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((module, mIndex) => 
        mIndex === moduleIndex 
          ? {
              ...module,
              lessons: module.lessons.map((lesson, lIndex) =>
                lIndex === lessonIndex ? { ...lesson, ...lessonData } : lesson
              )
            }
          : module
      )
    }));
  };

  const deleteLesson = (moduleIndex, lessonIndex) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((module, mIndex) => 
        mIndex === moduleIndex 
          ? {
              ...module,
              lessons: module.lessons.filter((_, lIndex) => lIndex !== lessonIndex)
            }
          : module
      )
    }));
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const validateCourse = () => {
    const validation = courseService.validateCourseData({
      ...courseData,
      objectives: courseData.whatYouWillLearn.filter(item => item.trim()),
      curriculum: courseData.curriculum
    });
    
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  const prepareCourseDataForSave = () => {
    return {
      title: courseData.title.trim(),
      subtitle: courseData.subtitle.trim(),
      description: courseData.description.trim(),
      category: courseData.category,
      level: courseData.level,
      language: courseData.language,
      price: courseData.isFree ? 0 : parseFloat(courseData.price) || 0,
      currency: 'USD',
      tags: courseData.tags.filter(tag => tag.trim()),
      objectives: courseData.whatYouWillLearn.filter(item => item.trim()),
      requirements: courseData.requirements.filter(item => item.trim()),
      targetAudience: courseData.targetAudience.filter(item => item.trim()),
      modules: courseData.curriculum.map(module => ({
        title: module.title,
        description: module.description,
        duration: module.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0),
        lessons: module.lessons.map(lesson => ({
          title: lesson.title,
          type: lesson.type,
          duration: lesson.duration || 0,
          content: lesson.content || '',
          videoUrl: lesson.videoUrl || '',
          resources: lesson.resources || []
        }))
      })),
      thumbnail: courseData.thumbnail,
      previewVideo: courseData.previewVideo,
      allowDiscussion: courseData.allowDiscussion,
      enableCertificate: courseData.enableCertificate,
      enableQuizzes: courseData.enableQuizzes
    };
  };

  const handleSaveDraft = async () => {
    if (!validateCourse()) {
      showNotification('Please fix the validation errors before saving', 'error');
      return;
    }

    try {
      setSaving(true);
      const courseDataToSave = prepareCourseDataForSave();
      
      let result;
      if (editMode && courseId) {
        result = await courseService.updateCourse(courseId, courseDataToSave);
      } else {
        result = await courseService.createCourse(courseDataToSave, user.uid);
        if (result.success) {
          // Navigate to edit mode with the new course ID
          navigate(`/tutor/course/${result.courseId}/edit`);
        }
      }
      
      if (result.success) {
        showNotification('Course saved as draft successfully', 'success');
      } else {
        showNotification(result.error || 'Failed to save course', 'error');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      showNotification('Error saving course', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishCourse = async () => {
    if (!validateCourse()) {
      showNotification('Please fix the validation errors before publishing', 'error');
      return;
    }

    try {
      setSaving(true);
      const courseDataToSave = prepareCourseDataForSave();
      
      let result;
      if (editMode && courseId) {
        // Update course first, then publish
        await courseService.updateCourse(courseId, courseDataToSave);
        result = await courseService.publishCourse(courseId);
      } else {
        // Create course and publish immediately
        const createResult = await courseService.createCourse(courseDataToSave, user.uid);
        if (createResult.success) {
          result = await courseService.publishCourse(createResult.courseId);
        } else {
          result = createResult;
        }
      }
      
      if (result.success) {
        showNotification('Course published successfully! Students can now enroll.', 'success');
        setTimeout(() => {
          navigate('/tutor/courses');
        }, 2000);
      } else {
        showNotification(result.error || 'Failed to publish course', 'error');
      }
    } catch (error) {
      console.error('Error publishing course:', error);
      showNotification('Error publishing course', 'error');
    } finally {
      setSaving(false);
    }
  };

  const renderBasicInformation = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Course Details</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Course Title"
              value={courseData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Complete Guide to Deep Learning"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Course Subtitle"
              value={courseData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="A brief, engaging description of your course"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={courseData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                label="Category"
              >
                {Object.values(COURSE_CATEGORIES).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Level</InputLabel>
              <Select
                value={courseData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                label="Level"
              >
                {Object.values(COURSE_LEVELS).map((level) => (
                  <MenuItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Course Description"
              value={courseData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what students will learn in this course..."
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Tags</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {courseData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add Tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} variant="outlined">Add</Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>What will students learn?</Typography>
            {courseData.whatYouWillLearn.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={item}
                  onChange={(e) => handleArrayInputChange('whatYouWillLearn', index, e.target.value)}
                  placeholder="Learning objective..."
                />
                <IconButton onClick={() => removeArrayItem('whatYouWillLearn', index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => addArrayItem('whatYouWillLearn')}
              variant="outlined"
              size="small"
            >
              Add Learning Objective
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Course Requirements</Typography>
            {courseData.requirements.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={item}
                  onChange={(e) => handleArrayInputChange('requirements', index, e.target.value)}
                  placeholder="Requirement..."
                />
                <IconButton onClick={() => removeArrayItem('requirements', index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => addArrayItem('requirements')}
              variant="outlined"
              size="small"
            >
              Add Requirement
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderCourseContent = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Course Curriculum</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={addModule}
            variant="contained"
          >
            Add Module
          </Button>
        </Box>

        {courseData.curriculum.map((module, moduleIndex) => (
          <Accordion key={module.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography variant="subtitle1" sx={{ flex: 1 }}>
                  {module.title || `Module ${moduleIndex + 1}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  {module.lessons.length} lessons
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Module Title"
                  value={module.title}
                  onChange={(e) => updateModule(moduleIndex, { title: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Module Description"
                  value={module.description}
                  onChange={(e) => updateModule(moduleIndex, { description: e.target.value })}
                  multiline
                  rows={2}
                />
              </Box>

              {/* Lessons */}
              <List>
                {module.lessons.map((lesson, lessonIndex) => (
                  <ListItem key={lesson.id} sx={{ border: '1px solid', borderColor: 'divider', mb: 1, borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      {lesson.type === 'video' && <VideoIcon />}
                      {lesson.type === 'quiz' && <QuizIcon />}
                      {lesson.type === 'assignment' && <AssignmentIcon />}
                      {lesson.type === 'text' && <TextIcon />}
                    </Box>
                    <ListItemText
                      primary={lesson.title || `Lesson ${lessonIndex + 1}`}
                      secondary={`${lesson.type} • ${lesson.duration} min`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => setLessonDialog({ open: true, moduleIndex, lessonIndex })}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setItemToDelete({ type: 'lesson', moduleIndex, lessonIndex });
                          setShowDeleteDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addLesson(moduleIndex)}
                  variant="outlined"
                  size="small"
                >
                  Add Lesson
                </Button>
                <Button
                  color="error"
                  onClick={() => {
                    setItemToDelete({ type: 'module', moduleIndex });
                    setShowDeleteDialog(true);
                  }}
                  size="small"
                >
                  Delete Module
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}

        {courseData.curriculum.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <Typography variant="body1">
              No modules created yet. Add your first module to get started.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderPricingSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Pricing & Settings</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={courseData.isFree}
                  onChange={(e) => handleInputChange('isFree', e.target.checked)}
                />
              }
              label="This is a free course"
            />
          </Grid>

          {!courseData.isFree && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Course Price"
                  value={courseData.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Compare Price (Optional)"
                  value={courseData.comparePrice}
                  onChange={(e) => handleInputChange('comparePrice', Number(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  helperText="Original price to show discount"
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Course Features
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={courseData.allowDiscussion}
                  onChange={(e) => handleInputChange('allowDiscussion', e.target.checked)}
                />
              }
              label="Allow student discussions"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={courseData.enableCertificate}
                  onChange={(e) => handleInputChange('enableCertificate', e.target.checked)}
                />
              }
              label="Provide certificate of completion"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={courseData.enableQuizzes}
                  onChange={(e) => handleInputChange('enableQuizzes', e.target.checked)}
                />
              }
              label="Include quizzes and assessments"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderReviewPublish = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Review Your Course</Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Course Summary</Typography>
          <Typography variant="body2" color="text.secondary">
            Title: {courseData.title || 'Untitled Course'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {courseData.category} • Level: {courseData.level}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modules: {courseData.curriculum.length} • 
            Lessons: {courseData.curriculum.reduce((acc, module) => acc + module.lessons.length, 0)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: {courseData.isFree ? 'Free' : `$${courseData.price}`}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={courseData.isPublished}
                onChange={(e) => handleInputChange('isPublished', e.target.checked)}
              />
            }
            label="Publish course immediately"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          By publishing this course, you agree to our terms and conditions. 
          Students will be able to enroll and access your content.
        </Typography>
      </CardContent>
    </Card>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderCourseContent();
      case 2:
        return renderPricingSettings();
      case 3:
        return renderReviewPublish();
      default:
        return 'Unknown step';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading course data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={editMode ? 'Edit Course' : 'Create New Course'}
        subtitle={editMode ? 'Update your course content and settings' : 'Share your knowledge with the world'}
        showBackButton
        backPath="/tutor/manage-courses"
        actions={[
          {
            label: 'Save Draft',
            onClick: handleSaveDraft,
            variant: 'outlined',
            disabled: saving
          }
        ]}
      />

      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Please fix the following errors:</Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Stepper */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      {getStepContent(activeStep)}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        
        <Box>
          {activeStep === steps.length - 1 ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleSaveDraft}
                size="large"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : null}
              >
                {saving ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button
                variant="contained"
                onClick={handlePublishCourse}
                size="large"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : null}
              >
                {saving ? 'Publishing...' : 'Publish Course'}
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={saving}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          if (itemToDelete?.type === 'module') {
            deleteModule(itemToDelete.moduleIndex);
          } else if (itemToDelete?.type === 'lesson') {
            deleteLesson(itemToDelete.moduleIndex, itemToDelete.lessonIndex);
          }
          setShowDeleteDialog(false);
          setItemToDelete(null);
        }}
        title="Confirm Delete"
        message={`Are you sure you want to delete this ${itemToDelete?.type}?`}
        confirmText="Delete"
        confirmColor="error"
      />

      {/* Notification Snackbar */}
      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Box>
  );
};

export default CourseCreator;
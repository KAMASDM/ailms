// src/components/courses/CourseCreator.jsx
import { useState } from 'react';
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
  InputAdornment
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
import { PageHeader, ConfirmDialog } from '../common';
import { COURSE_LEVELS, COURSE_CATEGORIES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const steps = [
  'Basic Information',
  'Course Content',
  'Pricing & Settings',
  'Review & Publish'
];

const CourseCreator = ({ editMode = false, courseId = null }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const handleSaveDraft = () => {
    console.log('Saving draft:', courseData);
    // Implementation for saving draft
  };

  const handlePublishCourse = () => {
    console.log('Publishing course:', courseData);
    // Implementation for publishing course
    navigate('/tutor/manage-courses');
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
            variant: 'outlined'
          }
        ]}
      />

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
            <Button
              variant="contained"
              onClick={handlePublishCourse}
              size="large"
            >
              {courseData.isPublished ? 'Publish Course' : 'Save as Draft'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
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
    </Box>
  );
};

export default CourseCreator;
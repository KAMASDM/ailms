// src/components/courses/CoursePlayer.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Chip,
  IconButton,
  Collapse,
  Paper,
  Tabs,
  Tab,
  Drawer,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  Rating
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
  ExpandLess,
  ExpandMore,
  Notes as NotesIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  Description as TextIcon,
  VideoLibrary as VideoIcon,
  MenuBook as MenuIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Speed as SpeedIcon,
  Fullscreen as FullscreenIcon,
  VolumeUp as VolumeIcon
} from '@mui/icons-material';
import { PageHeader } from '../common';
import { formatDuration } from '../../utils/helpers';

const DRAWER_WIDTH = 360;

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [expandedModules, setExpandedModules] = useState(new Set([0])); // First module expanded by default
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [bookmarkedLessons, setBookmarkedLessons] = useState(new Set());
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    // Mock data - replace with actual API call
    const mockCourse = {
      id: id,
      title: 'Deep Learning Fundamentals',
      instructor: {
        name: 'Dr. Sarah Chen',
        avatar: '/api/placeholder/50/50'
      },
      curriculum: [
        {
          id: 1,
          title: 'Introduction to Deep Learning',
          lessons: [
            { 
              id: 1, 
              title: 'What is Deep Learning?', 
              duration: 15, 
              type: 'video',
              videoUrl: '/api/placeholder/video/intro.mp4',
              content: 'Introduction to deep learning concepts...'
            },
            { 
              id: 2, 
              title: 'Neural Network Basics', 
              duration: 20, 
              type: 'video',
              videoUrl: '/api/placeholder/video/basics.mp4',
              content: 'Understanding neural networks...'
            },
            { 
              id: 3, 
              title: 'Environment Setup', 
              duration: 25, 
              type: 'text',
              content: 'Setting up your development environment for deep learning...'
            },
            { 
              id: 4, 
              title: 'Knowledge Check', 
              duration: 10, 
              type: 'quiz',
              questions: [
                {
                  question: 'What is a neural network?',
                  options: ['A', 'B', 'C', 'D'],
                  correct: 0
                }
              ]
            }
          ]
        },
        {
          id: 2,
          title: 'Neural Network Architectures',
          lessons: [
            { 
              id: 5, 
              title: 'Feedforward Networks', 
              duration: 30, 
              type: 'video',
              videoUrl: '/api/placeholder/video/feedforward.mp4'
            },
            { 
              id: 6, 
              title: 'Activation Functions', 
              duration: 18, 
              type: 'video',
              videoUrl: '/api/placeholder/video/activation.mp4'
            },
            { 
              id: 7, 
              title: 'Backpropagation', 
              duration: 35, 
              type: 'video',
              videoUrl: '/api/placeholder/video/backprop.mp4'
            },
            { 
              id: 8, 
              title: 'Build Your First Network', 
              duration: 45, 
              type: 'assignment',
              content: 'Assignment instructions...'
            }
          ]
        }
      ]
    };

    setCourse(mockCourse);
    
    // Set first lesson as current
    if (mockCourse.curriculum[0]?.lessons[0]) {
      setCurrentLesson(mockCourse.curriculum[0].lessons[0]);
    }

    // Mock completed lessons
    setCompletedLessons(new Set([1, 2]));
  };

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const markLessonComplete = () => {
    if (currentLesson) {
      setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
      // Move to next lesson
      const nextLesson = getNextLesson();
      if (nextLesson) {
        setCurrentLesson(nextLesson);
      }
    }
  };

  const getNextLesson = () => {
    if (!course || !currentLesson) return null;
    
    for (let moduleIndex = 0; moduleIndex < course.curriculum.length; moduleIndex++) {
      const module = course.curriculum[moduleIndex];
      const lessonIndex = module.lessons.findIndex(l => l.id === currentLesson.id);
      
      if (lessonIndex !== -1) {
        // Check if there's a next lesson in current module
        if (lessonIndex < module.lessons.length - 1) {
          return module.lessons[lessonIndex + 1];
        }
        // Check next module
        if (moduleIndex < course.curriculum.length - 1) {
          return course.curriculum[moduleIndex + 1].lessons[0];
        }
      }
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!course || !currentLesson) return null;
    
    for (let moduleIndex = 0; moduleIndex < course.curriculum.length; moduleIndex++) {
      const module = course.curriculum[moduleIndex];
      const lessonIndex = module.lessons.findIndex(l => l.id === currentLesson.id);
      
      if (lessonIndex !== -1) {
        // Check if there's a previous lesson in current module
        if (lessonIndex > 0) {
          return module.lessons[lessonIndex - 1];
        }
        // Check previous module
        if (moduleIndex > 0) {
          const prevModule = course.curriculum[moduleIndex - 1];
          return prevModule.lessons[prevModule.lessons.length - 1];
        }
      }
    }
    return null;
  };

  const toggleModuleExpansion = (moduleIndex) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleIndex)) {
        newSet.delete(moduleIndex);
      } else {
        newSet.add(moduleIndex);
      }
      return newSet;
    });
  };

  const toggleBookmark = () => {
    if (currentLesson) {
      setBookmarkedLessons(prev => {
        const newSet = new Set(prev);
        if (newSet.has(currentLesson.id)) {
          newSet.delete(currentLesson.id);
        } else {
          newSet.add(currentLesson.id);
        }
        return newSet;
      });
    }
  };

  const getProgress = () => {
    if (!course) return 0;
    const totalLessons = course.curriculum.reduce((acc, module) => acc + module.lessons.length, 0);
    return totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;
  };

  const renderLessonContent = () => {
    if (!currentLesson) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
          <Typography variant="h6" color="text.secondary">
            Select a lesson to start learning
          </Typography>
        </Box>
      );
    }

    switch (currentLesson.type) {
      case 'video':
        return (
          <Box>
            {/* Video Player */}
            <Box 
              sx={{ 
                width: '100%', 
                height: 400, 
                bgcolor: 'black', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 1,
                mb: 2
              }}
            >
              <Typography variant="h6" color="white">
                Video Player Placeholder
              </Typography>
            </Box>

            {/* Video Controls */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button startIcon={<SpeedIcon />} size="small">Speed</Button>
              <Button startIcon={<VolumeIcon />} size="small">Volume</Button>
              <Button startIcon={<FullscreenIcon />} size="small">Fullscreen</Button>
            </Box>
          </Box>
        );

      case 'text':
        return (
          <Card>
            <CardContent>
              <Typography variant="body1">
                {currentLesson.content || 'Text content would be displayed here...'}
              </Typography>
            </CardContent>
          </Card>
        );

      case 'quiz':
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quiz: {currentLesson.title}
              </Typography>
              <Typography variant="body1">
                Quiz interface would be implemented here...
              </Typography>
            </CardContent>
          </Card>
        );

      case 'assignment':
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assignment: {currentLesson.title}
              </Typography>
              <Typography variant="body1">
                Assignment interface would be implemented here...
              </Typography>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderCurriculum = () => (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {/* Course Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>{course?.title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={course?.instructor.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {course?.instructor.name}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Progress: {Math.round(getProgress())}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={getProgress()} 
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      </Box>

      {/* Curriculum List */}
      <List dense>
        {course?.curriculum.map((module, moduleIndex) => (
          <Box key={module.id}>
            <ListItemButton onClick={() => toggleModuleExpansion(moduleIndex)}>
              <ListItemText
                primary={module.title}
                secondary={`${module.lessons.length} lessons`}
              />
              {expandedModules.has(moduleIndex) ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={expandedModules.has(moduleIndex)}>
              <List component="div" disablePadding>
                {module.lessons.map((lesson) => {
                  const isCompleted = completedLessons.has(lesson.id);
                  const isCurrent = currentLesson?.id === lesson.id;
                  const isBookmarked = bookmarkedLessons.has(lesson.id);
                  
                  return (
                    <ListItem key={lesson.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleLessonClick(lesson)}
                        selected={isCurrent}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon>
                          {isCompleted ? (
                            <CheckIcon color="success" />
                          ) : lesson.type === 'video' ? (
                            <VideoIcon />
                          ) : lesson.type === 'quiz' ? (
                            <QuizIcon />
                          ) : lesson.type === 'assignment' ? (
                            <AssignmentIcon />
                          ) : (
                            <TextIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={lesson.title}
                          secondary={formatDuration(lesson.duration)}
                        />
                        {isBookmarked && <BookmarkIcon color="primary" sx={{ ml: 1 }} />}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );

  const renderNotesTab = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>My Notes</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Take notes while learning. Your notes are automatically saved.
      </Typography>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your notes here..."
        style={{
          width: '100%',
          height: 200,
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: 8,
          fontFamily: 'inherit',
          resize: 'vertical'
        }}
      />
    </Box>
  );

  if (!course) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Course Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper sx={{ p: 2, borderRadius: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isMobile && (
                <IconButton onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6">
                {currentLesson?.title || 'Select a lesson'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={toggleBookmark}>
                {currentLesson && bookmarkedLessons.has(currentLesson.id) ? 
                  <BookmarkIcon color="primary" /> : 
                  <BookmarkBorderIcon />
                }
              </IconButton>
              
              {!completedLessons.has(currentLesson?.id) && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={markLessonComplete}
                  disabled={!currentLesson}
                >
                  Mark Complete
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Lesson Content */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          {renderLessonContent()}
        </Box>

        {/* Navigation */}
        <Paper sx={{ p: 2, borderRadius: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              startIcon={<PlayIcon sx={{ transform: 'rotate(180deg)' }} />}
              onClick={() => {
                const prevLesson = getPreviousLesson();
                if (prevLesson) setCurrentLesson(prevLesson);
              }}
              disabled={!getPreviousLesson()}
            >
              Previous
            </Button>
            
            <Button
              endIcon={<PlayIcon />}
              variant="contained"
              onClick={() => {
                const nextLesson = getNextLesson();
                if (nextLesson) setCurrentLesson(nextLesson);
              }}
              disabled={!getNextLesson()}
            >
              Next
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            position: 'relative',
            height: '100%'
          }
        }}
      >
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Curriculum" />
          <Tab label="Notes" />
        </Tabs>
        
        {activeTab === 0 && renderCurriculum()}
        {activeTab === 1 && renderNotesTab()}
      </Drawer>
    </Box>
  );
};

export default CoursePlayer;
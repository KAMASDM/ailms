// src/components/recommendations/AIRecommendations.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tab,
  Tabs,
  Paper,
  Alert,
  LinearProgress,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Psychology as AIIcon,
  School as CourseIcon,
  Quiz as QuizIcon,
  Timeline as PathIcon,
  TrendingUp as TrendingIcon,
  Lightbulb as InsightIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  ThumbUp as LikeIcon,
  ThumbDown as DislikeIcon,
  ExpandMore as ExpandIcon,
  PlayArrow as StartIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { PageHeader } from '../common';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AIRecommendations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [insights, setInsights] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [explanationDialog, setExplanationDialog] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // Mock AI recommendations data - replace with actual API call
      const mockRecommendations = [
        {
          id: 1,
          type: 'course',
          title: 'Advanced Neural Networks',
          description: 'Deep dive into advanced neural network architectures including RNNs and LSTMs',
          thumbnail: '/api/placeholder/300/200',
          instructor: {
            name: 'Dr. Alex Thompson',
            avatar: '/api/placeholder/40/40'
          },
          rating: 4.8,
          duration: 480, // minutes
          level: 'Advanced',
          reason: 'Based on your excellent performance in Deep Learning Fundamentals',
          confidence: 92,
          tags: ['Neural Networks', 'RNN', 'LSTM'],
          estimatedCompletionTime: '2 weeks',
          prerequisites: ['Deep Learning Fundamentals'],
          aiExplanation: 'You showed strong understanding of basic neural networks. Your quiz scores indicate readiness for advanced concepts like sequence modeling.'
        },
        {
          id: 2,
          type: 'course',
          title: 'Reinforcement Learning Basics',
          description: 'Introduction to RL algorithms and their applications',
          thumbnail: '/api/placeholder/300/200',
          instructor: {
            name: 'Prof. Maria Garcia',
            avatar: '/api/placeholder/40/40'
          },
          rating: 4.6,
          duration: 360,
          level: 'Intermediate',
          reason: 'Popular among students with similar learning patterns',
          confidence: 78,
          tags: ['Reinforcement Learning', 'Q-Learning', 'Policy'],
          estimatedCompletionTime: '3 weeks',
          prerequisites: ['Machine Learning Basics'],
          aiExplanation: 'Students with your background often find RL engaging. Your mathematical foundation is solid for this topic.'
        },
        {
          id: 3,
          type: 'quiz',
          title: 'CNN Architecture Challenge',
          description: 'Test your understanding of convolutional neural networks',
          difficulty: 'Medium',
          questions: 15,
          estimatedTime: 30,
          reason: 'Identified knowledge gap in computer vision concepts',
          confidence: 85,
          tags: ['CNN', 'Computer Vision'],
          aiExplanation: 'Your recent performance suggests reviewing CNN concepts would strengthen your foundation before advancing.'
        },
        {
          id: 4,
          type: 'skill',
          title: 'Python for Data Science',
          description: 'Strengthen your Python programming skills for ML applications',
          provider: 'DataCamp',
          duration: 240,
          reason: 'Programming skills need enhancement for upcoming projects',
          confidence: 89,
          tags: ['Python', 'Data Science', 'Programming'],
          aiExplanation: 'Analysis of your coding assignments shows room for improvement in Python proficiency for data manipulation.'
        }
      ];

      const mockPaths = [
        {
          id: 1,
          title: 'Computer Vision Specialist',
          description: 'Become an expert in computer vision and image processing',
          totalCourses: 6,
          completedCourses: 2,
          estimatedDuration: '4 months',
          difficulty: 'Advanced',
          courses: [
            { id: 1, title: 'Image Processing Fundamentals', completed: true },
            { id: 2, title: 'Convolutional Neural Networks', completed: true },
            { id: 3, title: 'Object Detection', completed: false },
            { id: 4, title: 'Image Segmentation', completed: false },
            { id: 5, title: 'Generative Models for Images', completed: false },
            { id: 6, title: 'Computer Vision Capstone', completed: false }
          ],
          skills: ['OpenCV', 'TensorFlow', 'PyTorch', 'YOLO', 'R-CNN'],
          careerOutcomes: ['Computer Vision Engineer', 'AI Researcher', 'ML Engineer']
        },
        {
          id: 2,
          title: 'NLP Engineer Track',
          description: 'Master natural language processing and text analytics',
          totalCourses: 5,
          completedCourses: 0,
          estimatedDuration: '3 months',
          difficulty: 'Intermediate',
          courses: [
            { id: 1, title: 'Text Processing Basics', completed: false },
            { id: 2, title: 'Word Embeddings', completed: false },
            { id: 3, title: 'Transformer Models', completed: false },
            { id: 4, title: 'Named Entity Recognition', completed: false },
            { id: 5, title: 'NLP Project', completed: false }
          ],
          skills: ['NLTK', 'spaCy', 'Transformers', 'BERT', 'GPT'],
          careerOutcomes: ['NLP Engineer', 'Data Scientist', 'AI Product Manager']
        }
      ];

      const mockInsights = [
        {
          id: 1,
          type: 'performance',
          title: 'Strong Mathematical Foundation',
          description: 'Your quiz scores in mathematical concepts are consistently above 90%',
          icon: '📊',
          actionable: true,
          suggestion: 'Consider taking advanced mathematical ML courses',
          confidence: 95
        },
        {
          id: 2,
          type: 'learning_pattern',
          title: 'Visual Learner Detected',
          description: 'You spend 60% more time on video content compared to text',
          icon: '👁️',
          actionable: true,
          suggestion: 'Look for courses with rich visual content and animations',
          confidence: 87
        },
        {
          id: 3,
          type: 'progress',
          title: 'Consistent Study Schedule',
          description: 'You maintain regular study sessions, typically 2-3 hours in the evening',
          icon: '⏰',
          actionable: false,
          suggestion: 'Keep up the great routine!',
          confidence: 92
        },
        {
          id: 4,
          type: 'weakness',
          title: 'Implementation Gap',
          description: 'Theory scores are high, but coding assignments take longer to complete',
          icon: '💻',
          actionable: true,
          suggestion: 'Focus on hands-on coding practice and projects',
          confidence: 83
        }
      ];

      setRecommendations(mockRecommendations);
      setLearningPaths(mockPaths);
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = (id) => {
    setBookmarkedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleFeedback = (id, isPositive) => {
    // Send feedback to AI system
    console.log(`Feedback for ${id}: ${isPositive ? 'positive' : 'negative'}`);
  };

  const handleStartRecommendation = (recommendation) => {
    if (recommendation.type === 'course') {
      navigate(`/course/${recommendation.id}`);
    } else if (recommendation.type === 'quiz') {
      navigate(`/quiz/${recommendation.id}`);
    } else if (recommendation.type === 'skill') {
      // Navigate to external platform or skill assessment
      window.open(recommendation.url, '_blank');
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 75) return 'warning';
    return 'error';
  };

  const renderRecommendationCard = (recommendation) => (
    <Card key={recommendation.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Chip 
            label={recommendation.type.toUpperCase()}
            color="primary"
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip
              label={`${recommendation.confidence}% match`}
              color={getConfidenceColor(recommendation.confidence)}
              size="small"
            />
            <IconButton 
              size="small" 
              onClick={() => handleBookmark(recommendation.id)}
            >
              {bookmarkedItems.has(recommendation.id) ? <BookmarkedIcon /> : <BookmarkIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Typography variant="h6" gutterBottom>
          {recommendation.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {recommendation.description}
        </Typography>

        {/* Metadata */}
        {recommendation.instructor && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={recommendation.instructor.avatar} sx={{ width: 24, height: 24, mr: 1 }}>
              {recommendation.instructor.name.charAt(0)}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {recommendation.instructor.name}
            </Typography>
            {recommendation.rating && (
              <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                <Rating value={recommendation.rating} readOnly size="small" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  ({recommendation.rating})
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Tags */}
        <Box sx={{ mb: 2 }}>
          {recommendation.tags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>

        {/* AI Reason */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Why recommended:</strong> {recommendation.reason}
          </Typography>
        </Alert>

        {/* Additional Info */}
        {recommendation.estimatedCompletionTime && (
          <Typography variant="caption" color="text.secondary" display="block">
            Estimated time: {recommendation.estimatedCompletionTime}
          </Typography>
        )}
        
        {recommendation.level && (
          <Typography variant="caption" color="text.secondary" display="block">
            Level: {recommendation.level}
          </Typography>
        )}
      </CardContent>

      {/* Actions */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Button
            variant="contained"
            startIcon={<StartIcon />}
            onClick={() => handleStartRecommendation(recommendation)}
            fullWidth
          >
            Start Now
          </Button>
          <IconButton 
            onClick={() => {
              setSelectedRecommendation(recommendation);
              setExplanationDialog(true);
            }}
          >
            <InfoIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => handleFeedback(recommendation.id, true)}
          >
            <LikeIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleFeedback(recommendation.id, false)}
          >
            <DislikeIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );

  const renderLearningPath = (path) => (
    <Card key={path.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {path.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {path.description}
            </Typography>
            <Chip label={path.difficulty} color="primary" size="small" />
          </Box>
          <IconButton onClick={() => handleBookmark(path.id)}>
            {bookmarkedItems.has(path.id) ? <BookmarkedIcon /> : <BookmarkIcon />}
          </IconButton>
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2">
              {path.completedCourses}/{path.totalCourses} courses
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(path.completedCourses / path.totalCourses) * 100}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        {/* Courses */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Typography variant="subtitle2">View Courses</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {path.courses.map((course, index) => (
                <ListItem key={course.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: course.completed ? 'success.main' : 'grey.300',
                      width: 24, 
                      height: 24 
                    }}>
                      {index + 1}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={course.title}
                    sx={{ 
                      textDecoration: course.completed ? 'line-through' : 'none',
                      opacity: course.completed ? 0.7 : 1
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Skills & Outcomes */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Skills You'll Learn:</Typography>
          <Box sx={{ mb: 2 }}>
            {path.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>Career Outcomes:</Typography>
          <Typography variant="body2" color="text.secondary">
            {path.careerOutcomes.join(', ')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button variant="contained" startIcon={<StartIcon />}>
            Continue Path
          </Button>
          <Button variant="outlined">
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderInsight = (insight) => (
    <Card key={insight.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Typography variant="h4">{insight.icon}</Typography>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {insight.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {insight.description}
            </Typography>
            {insight.actionable && (
              <Alert severity="success" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Suggestion:</strong> {insight.suggestion}
                </Typography>
              </Alert>
            )}
            <Chip
              label={`${insight.confidence}% confidence`}
              color={getConfidenceColor(insight.confidence)}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box>
        <PageHeader
          title="AI Recommendations"
          subtitle="Personalized learning recommendations powered by AI"
        />
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="AI Recommendations"
        subtitle="Personalized learning recommendations powered by AI"
      />

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
          <Tab icon={<AIIcon />} label="Recommendations" />
          <Tab icon={<PathIcon />} label="Learning Paths" />
          <Tab icon={<InsightIcon />} label="Insights" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {recommendations.map((recommendation) => (
            <Grid item xs={12} md={6} lg={4} key={recommendation.id}>
              {renderRecommendationCard(recommendation)}
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Box>
          {learningPaths.map(renderLearningPath)}
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          {insights.map(renderInsight)}
        </Box>
      )}

      {/* Explanation Dialog */}
      <Dialog
        open={explanationDialog}
        onClose={() => setExplanationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>AI Recommendation Explanation</DialogTitle>
        <DialogContent>
          {selectedRecommendation && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedRecommendation.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedRecommendation.aiExplanation}
              </Typography>
              
              {selectedRecommendation.prerequisites && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Prerequisites:
                  </Typography>
                  <Box>
                    {selectedRecommendation.prerequisites.map((prereq, index) => (
                      <Chip
                        key={index}
                        label={prereq}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              <Alert severity="info">
                <Typography variant="body2">
                  This recommendation is based on your learning history, performance patterns, 
                  and goals. The AI considers your strengths, areas for improvement, and career interests.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExplanationDialog(false)}>Close</Button>
          {selectedRecommendation && (
            <Button 
              variant="contained"
              onClick={() => {
                handleStartRecommendation(selectedRecommendation);
                setExplanationDialog(false);
              }}
            >
              Start Learning
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIRecommendations;
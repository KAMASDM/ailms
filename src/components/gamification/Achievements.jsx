// src/components/gamification/Achievements.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  School as SchoolIcon,
  Speed as SpeedIcon,
  Favorite as HeartIcon,
  Timeline as ProgressIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { PageHeader } from '../common';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux';
import gamificationService from '../../services/gamificationService';

const Achievements = () => {
  const { user } = useAuth();
  const userProfile = useSelector(state => state.user.profile);
  const [activeTab, setActiveTab] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [shareDialog, setShareDialog] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      // Load real achievements data from Firebase
      const result = await gamificationService.getUserAchievements(user.uid);
      
      if (result.success) {
        const allAchievements = [...result.achievements.earned, ...result.achievements.available];
        setAchievements(allAchievements);
      } else {
        console.error('Failed to load achievements:', result.error);
        // Fallback to mock data for development
        const mockAchievements = [
      {
        id: 1,
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎓',
        category: 'learning',
        rarity: 'common',
        points: 10,
        earned: true,
        earnedAt: new Date('2024-01-15'),
        progress: 100,
        total: 1,
        requirements: ['Complete 1 lesson']
      },
      {
        id: 2,
        name: 'Learning Streak',
        description: 'Study for 7 consecutive days',
        icon: '🔥',
        category: 'consistency',
        rarity: 'uncommon',
        points: 50,
        earned: true,
        earnedAt: new Date('2024-01-22'),
        progress: 100,
        total: 7,
        requirements: ['Study for 7 consecutive days']
      },
      {
        id: 3,
        name: 'Quiz Master',
        description: 'Score 100% on 5 quizzes',
        icon: '🧠',
        category: 'performance',
        rarity: 'rare',
        points: 100,
        earned: false,
        earnedAt: null,
        progress: 60,
        total: 5,
        requirements: ['Score 100% on 5 different quizzes']
      },
      {
        id: 4,
        name: 'Speed Learner',
        description: 'Complete a course in under 24 hours',
        icon: '⚡',
        category: 'speed',
        rarity: 'epic',
        points: 200,
        earned: false,
        earnedAt: null,
        progress: 0,
        total: 1,
        requirements: ['Complete any course within 24 hours of enrollment']
      },
      {
        id: 5,
        name: 'AI Pioneer',
        description: 'Complete 3 AI-related courses',
        icon: '🤖',
        category: 'expertise',
        rarity: 'legendary',
        points: 500,
        earned: false,
        earnedAt: null,
        progress: 33,
        total: 3,
        requirements: ['Complete 3 courses in AI category']
      },
      {
        id: 6,
        name: 'Helpful Friend',
        description: 'Help 10 other students in discussions',
        icon: '🤝',
        category: 'community',
        rarity: 'uncommon',
        points: 75,
        earned: false,
        earnedAt: null,
        progress: 30,
        total: 10,
        requirements: ['Provide helpful answers in 10 course discussions']
      },
      {
        id: 7,
        name: 'Perfect Score',
        description: 'Get 100% on your first quiz attempt',
        icon: '💯',
        category: 'performance',
        rarity: 'rare',
        points: 150,
        earned: true,
        earnedAt: new Date('2024-01-18'),
        progress: 100,
        total: 1,
        requirements: ['Score 100% on any quiz on first attempt']
      },
      {
        id: 8,
        name: 'Night Owl',
        description: 'Study between 11 PM and 5 AM for 5 sessions',
        icon: '🦉',
        category: 'dedication',
        rarity: 'uncommon',
        points: 60,
        earned: false,
        earnedAt: null,
        progress: 40,
        total: 5,
        requirements: ['Complete 5 study sessions between 11 PM and 5 AM']
      }
    ];

    setAchievements(mockAchievements);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#9E9E9E';
      case 'uncommon': return '#4CAF50';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'learning': return <SchoolIcon />;
      case 'consistency': return <FireIcon />;
      case 'performance': return <StarIcon />;
      case 'speed': return <SpeedIcon />;
      case 'expertise': return <TrophyIcon />;
      case 'community': return <HeartIcon />;
      case 'dedication': return <ProgressIcon />;
      default: return <TrophyIcon />;
    }
  };

  const getFilteredAchievements = () => {
    switch (activeTab) {
      case 0: // All
        return achievements;
      case 1: // Earned
        return achievements.filter(achievement => achievement.earned);
      case 2: // In Progress
        return achievements.filter(achievement => !achievement.earned && achievement.progress > 0);
      case 3: // Locked
        return achievements.filter(achievement => !achievement.earned && achievement.progress === 0);
      default:
        return achievements;
    }
  };

  const getTotalStats = () => {
    const earned = achievements.filter(a => a.earned).length;
    const total = achievements.length;
    const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0);
    
    return { earned, total, totalPoints };
  };

  const handleShare = () => {
    const stats = getTotalStats();
    const shareText = `I've earned ${stats.earned} achievements and ${stats.totalPoints} points on AI Learn! 🎓✨`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Learning Achievements',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // Show notification that text was copied
    }
    setShareDialog(false);
  };

  const renderAchievementCard = (achievement) => (
    <Card 
      key={achievement.id}
      sx={{ 
        height: '100%',
        opacity: achievement.earned ? 1 : 0.7,
        border: achievement.earned ? 2 : 1,
        borderColor: achievement.earned ? getRarityColor(achievement.rarity) : 'divider',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
      onClick={() => setSelectedAchievement(achievement)}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        {/* Achievement Icon */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: '2rem',
              bgcolor: achievement.earned ? getRarityColor(achievement.rarity) : 'grey.300',
              mx: 'auto',
              mb: 1
            }}
          >
            {achievement.earned ? achievement.icon : <LockIcon />}
          </Avatar>
          
          {achievement.earned && (
            <Chip
              label={achievement.rarity}
              size="small"
              sx={{
                position: 'absolute',
                top: -8,
                right: '50%',
                transform: 'translateX(50%)',
                bgcolor: getRarityColor(achievement.rarity),
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.6rem'
              }}
            />
          )}
        </Box>

        {/* Achievement Info */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {achievement.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {achievement.description}
        </Typography>

        {/* Progress */}
        {!achievement.earned && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Progress</Typography>
              <Typography variant="body2">
                {Math.floor((achievement.progress / 100) * achievement.total)}/{achievement.total}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={achievement.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getRarityColor(achievement.rarity)
                }
              }}
            />
          </Box>
        )}

        {/* Points */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
          <Typography variant="body2" fontWeight="bold">
            {achievement.points} points
          </Typography>
        </Box>

        {/* Earned Date */}
        {achievement.earned && achievement.earnedAt && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Earned {formatDate(achievement.earnedAt)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const stats = getTotalStats();

  return (
    <Box>
      <PageHeader
        title="Achievements"
        subtitle="Track your learning milestones and unlock rewards"
        actions={[
          {
            label: 'Share Progress',
            icon: <ShareIcon />,
            onClick: () => setShareDialog(true),
            variant: 'outlined'
          }
        ]}
      />

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrophyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.earned}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Achievements Earned
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <StarIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.totalPoints}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ProgressIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {Math.round((stats.earned / stats.total) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completion Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
          <Tab label="All" />
          <Tab label="Earned" />
          <Tab label="In Progress" />
          <Tab label="Locked" />
        </Tabs>
      </Paper>

      {/* Achievements Grid */}
      <Grid container spacing={3}>
        {getFilteredAchievements().map((achievement) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={achievement.id}>
            {renderAchievementCard(achievement)}
          </Grid>
        ))}
      </Grid>

      {/* Achievement Detail Dialog */}
      <Dialog
        open={Boolean(selectedAchievement)}
        onClose={() => setSelectedAchievement(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedAchievement && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: selectedAchievement.earned ? getRarityColor(selectedAchievement.rarity) : 'grey.300',
                    mr: 2
                  }}
                >
                  {selectedAchievement.earned ? selectedAchievement.icon : <LockIcon />}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedAchievement.name}</Typography>
                  <Chip
                    label={selectedAchievement.rarity}
                    size="small"
                    sx={{
                      bgcolor: getRarityColor(selectedAchievement.rarity),
                      color: 'white',
                      textTransform: 'uppercase',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedAchievement(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedAchievement.description}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Requirements:
                </Typography>
                <List dense>
                  {selectedAchievement.requirements.map((req, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={req} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {!selectedAchievement.earned && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Progress:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: '100%', mr: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={selectedAchievement.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAchievement.progress}%
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {selectedAchievement.points} points
                  </Typography>
                </Box>

                {selectedAchievement.earned && (
                  <Typography variant="body2" color="text.secondary">
                    Earned {formatDate(selectedAchievement.earnedAt)}
                  </Typography>
                )}
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setSelectedAchievement(null)}>
                Close
              </Button>
              {selectedAchievement.earned && (
                <Button variant="contained" startIcon={<ShareIcon />}>
                  Share Achievement
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialog} onClose={() => setShareDialog(false)}>
        <DialogTitle>Share Your Progress</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Share your learning achievements with friends and family!
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
            <Typography variant="body2">
              I've earned {stats.earned} achievements and {stats.totalPoints} points on AI Learn! 🎓✨
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleShare}>
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Achievements;
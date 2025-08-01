// src/components/gamification/Leaderboard.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  LocalFireDepartment as FireIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';
import { PageHeader } from '../common';
import { useAuth } from '../../hooks/useAuth';
import gamificationService from '../../services/gamificationService';

const Leaderboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [timeframe, setTimeframe] = useState('week');
  const [category, setCategory] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab, timeframe, category]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Load real leaderboard data from Firebase
      const categoryMap = {
        0: 'points',
        1: 'courses', 
        2: 'streaks'
      };
      
      const leaderboardResult = await gamificationService.getLeaderboard(timeframe, categoryMap[activeTab] || 'points', 50);
      const userRankResult = await gamificationService.getUserRank(user.uid, categoryMap[activeTab] || 'points');
      
      if (leaderboardResult.success) {
        setLeaderboardData(leaderboardResult.leaderboard);
      }
      
      if (userRankResult.success) {
        setUserRank(userRankResult.rank);
      }
      
      if (!leaderboardResult.success) {
        console.error('Failed to load leaderboard:', leaderboardResult.error);
        // Fallback to mock data for development
      const mockData = {
        points: [
          {
            id: 1,
            name: 'Alice Johnson',
            avatar: '/api/placeholder/40/40',
            points: 2450,
            rank: 1,
            change: '+2',
            streak: 15,
            coursesCompleted: 8,
            level: 'Advanced',
            badges: ['Speed Learner', 'Quiz Master', 'Consistent']
          },
          {
            id: 2,
            name: 'Bob Smith',
            avatar: '/api/placeholder/40/40',
            points: 2380,
            rank: 2,
            change: '0',
            streak: 12,
            coursesCompleted: 7,
            level: 'Advanced',
            badges: ['First Course', 'Night Owl']
          },
          {
            id: 3,
            name: 'Carol Davis',
            avatar: '/api/placeholder/40/40',
            points: 2250,
            rank: 3,
            change: '+1',
            streak: 8,
            coursesCompleted: 6,
            level: 'Intermediate',
            badges: ['Helpful Friend', 'Perfect Score']
          },
          {
            id: 4,
            name: 'David Wilson',
            avatar: '/api/placeholder/40/40',
            points: 2100,
            rank: 4,
            change: '-1',
            streak: 5,
            coursesCompleted: 5,
            level: 'Intermediate',
            badges: ['Learning Streak']
          },
          {
            id: 5,
            name: 'Eva Brown',
            avatar: '/api/placeholder/40/40',
            points: 1950,
            rank: 5,
            change: '+3',
            streak: 20,
            coursesCompleted: 4,
            level: 'Intermediate',
            badges: ['Fire Starter', 'Dedicated']
          },
          {
            id: 6,
            name: user?.displayName || 'You',
            avatar: user?.photoURL || '/api/placeholder/40/40',
            points: 1850,
            rank: 6,
            change: '+1',
            streak: 7,
            coursesCompleted: 4,
            level: 'Intermediate',
            badges: ['First Steps', 'Quiz Taker'],
            isCurrentUser: true
          }
        ],
        streak: [
          {
            id: 1,
            name: 'Eva Brown',
            avatar: '/api/placeholder/40/40',
            streak: 20,
            rank: 1,
            points: 1950
          },
          {
            id: 2,
            name: 'Alice Johnson',
            avatar: '/api/placeholder/40/40',
            streak: 15,
            rank: 2,
            points: 2450
          },
          {
            id: 3,
            name: 'Bob Smith',
            avatar: '/api/placeholder/40/40',
            streak: 12,
            rank: 3,
            points: 2380
          },
          {
            id: 4,
            name: 'Carol Davis',
            avatar: '/api/placeholder/40/40',
            streak: 8,
            rank: 4,
            points: 2250
          },
          {
            id: 5,
            name: user?.displayName || 'You',
            avatar: user?.photoURL || '/api/placeholder/40/40',
            streak: 7,
            rank: 5,
            points: 1850,
            isCurrentUser: true
          }
        ],
        courses: [
          {
            id: 1,
            name: 'Alice Johnson',
            avatar: '/api/placeholder/40/40',
            coursesCompleted: 8,
            rank: 1,
            points: 2450
          },
          {
            id: 2,
            name: 'Bob Smith',
            avatar: '/api/placeholder/40/40',
            coursesCompleted: 7,
            rank: 2,
            points: 2380
          },
          {
            id: 3,
            name: 'Carol Davis',
            avatar: '/api/placeholder/40/40',
            coursesCompleted: 6,
            rank: 3,
            points: 2250
          },
          {
            id: 4,
            name: 'David Wilson',
            avatar: '/api/placeholder/40/40',
            coursesCompleted: 5,
            rank: 4,
            points: 2100
          },
          {
            id: 5,
            name: user?.displayName || 'You',
            avatar: user?.photoURL || '/api/placeholder/40/40',
            coursesCompleted: 4,
            rank: 5,
            points: 1850,
            isCurrentUser: true
          }
        ]
      };

      const tabKeys = ['points', 'streak', 'courses'];
      const currentData = mockData[tabKeys[activeTab]];
      
      setLeaderboardData(currentData);
      
      // Find current user's rank
      const currentUserEntry = currentData.find(entry => entry.isCurrentUser);
      setUserRank(currentUserEntry);
      }

    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return 'transparent';
    }
  };

  const getChangeIcon = (change) => {
    if (change.startsWith('+')) {
      return { icon: '↗️', color: 'success.main' };
    } else if (change.startsWith('-')) {
      return { icon: '↘️', color: 'error.main' };
    } else {
      return { icon: '→', color: 'text.secondary' };
    }
  };

  const getTabLabel = (index) => {
    switch (index) {
      case 0: return 'Points';
      case 1: return 'Streak';
      case 2: return 'Courses';
      default: return 'Points';
    }
  };

  const getMetricValue = (entry, tabIndex) => {
    switch (tabIndex) {
      case 0: return `${entry.points} pts`;
      case 1: return `${entry.streak} days`;
      case 2: return `${entry.coursesCompleted} courses`;
      default: return '';
    }
  };

  const getMetricIcon = (tabIndex) => {
    switch (tabIndex) {
      case 0: return <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
      case 1: return <FireIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      case 2: return <SchoolIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
      default: return null;
    }
  };

  const renderLeaderboardItem = (entry, index) => (
    <ListItem 
      key={entry.id}
      sx={{
        bgcolor: entry.isCurrentUser ? 'primary.light' : 'transparent',
        borderRadius: 1,
        mb: 1,
        border: entry.isCurrentUser ? 2 : 1,
        borderColor: entry.isCurrentUser ? 'primary.main' : 'divider'
      }}
    >
      <ListItemAvatar>
        <Box sx={{ position: 'relative' }}>
          <Avatar 
            src={entry.avatar}
            sx={{ 
              width: 48, 
              height: 48,
              border: entry.rank <= 3 ? 3 : 0,
              borderColor: getRankColor(entry.rank)
            }}
          >
            {entry.name.charAt(0)}
          </Avatar>
          {entry.rank <= 3 && (
            <Box
              sx={{
                position: 'absolute',
                top: -5,
                right: -5,
                fontSize: '1.2rem'
              }}
            >
              {getRankIcon(entry.rank)}
            </Box>
          )}
        </Box>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight={entry.isCurrentUser ? 'bold' : 'medium'}>
              {entry.name}
              {entry.isCurrentUser && (
                <Chip label="You" size="small" color="primary" sx={{ ml: 1 }} />
              )}
            </Typography>
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {getMetricIcon(activeTab)}
              <Typography variant="body2" fontWeight="bold">
                {getMetricValue(entry, activeTab)}
              </Typography>
            </Box>
            
            {entry.level && (
              <Chip label={entry.level} size="small" variant="outlined" />
            )}
            
            {entry.change && activeTab === 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography 
                  variant="caption" 
                  sx={{ color: getChangeIcon(entry.change).color }}
                >
                  {getChangeIcon(entry.change).icon} {entry.change}
                </Typography>
              </Box>
            )}
          </Box>
        }
      />

      <ListItemSecondaryAction>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            #{entry.rank}
          </Typography>
        </Box>
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <Box>
      <PageHeader
        title="Leaderboard"
        subtitle="See how you rank against other learners"
      />

      {/* User's Current Rank Card */}
      {userRank && (
        <Card sx={{ mb: 3, bgcolor: 'primary.light', border: 2, borderColor: 'primary.main' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Your Current Rank
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar 
                  src={userRank.avatar} 
                  sx={{ width: 60, height: 60 }}
                >
                  {userRank.name.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" fontWeight="bold">
                  #{userRank.rank}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {getMetricValue(userRank, activeTab)}
                </Typography>
              </Grid>
              <Grid item>
                {userRank.change && activeTab === 0 && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      This week
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ color: getChangeIcon(userRank.change).color }}
                    >
                      {getChangeIcon(userRank.change).icon} {userRank.change}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                label="Timeframe"
              >
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Courses</MenuItem>
                <MenuItem value="ai">AI & Machine Learning</MenuItem>
                <MenuItem value="cv">Computer Vision</MenuItem>
                <MenuItem value="nlp">Natural Language Processing</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
          <Tab 
            icon={<StarIcon />} 
            label="Points" 
            iconPosition="start"
          />
          <Tab 
            icon={<FireIcon />} 
            label="Streak" 
            iconPosition="start"
          />
          <Tab 
            icon={<SchoolIcon />} 
            label="Courses" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Leaderboard */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TrophyIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">
              Top Learners - {getTabLabel(activeTab)}
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ py: 4 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Loading leaderboard...
              </Typography>
            </Box>
          ) : (
            <List>
              {leaderboardData.map((entry, index) => renderLeaderboardItem(entry, index))}
            </List>
          )}

          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Rankings update every hour
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<GroupsIcon />}
              onClick={() => {/* Navigate to all users */}}
            >
              View Full Leaderboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Leaderboard;
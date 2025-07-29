// src/components/live/LiveSessionsList.jsx
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
  Tabs,
  Tab,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Badge
} from '@mui/material';
import {
  PlayArrow as JoinIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Live as LiveIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Videocam as VideoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Notifications as NotifyIcon,
  EventNote as CalendarIcon
} from '@mui/icons-material';
import { PageHeader } from '../common';
import { formatDate, formatDuration } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LiveSessionsList = ({ variant = 'student' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [createDialog, setCreateDialog] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    courseId: '',
    scheduledFor: '',
    duration: 60,
    maxParticipants: 50
  });

  useEffect(() => {
    loadSessions();
  }, [variant]);

  const loadSessions = async () => {
    // Mock sessions data - replace with actual API call
    const mockSessions = [
      {
        id: 1,
        title: 'Deep Learning Q&A Session',
        description: 'Interactive session covering neural networks and backpropagation',
        instructor: {
          id: 'tutor1',
          name: 'Dr. Sarah Chen',
          avatar: '/api/placeholder/40/40'
        },
        course: {
          id: 1,
          name: 'Deep Learning Fundamentals'
        },
        scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 60, // minutes
        status: 'scheduled',
        participantCount: 0,
        maxParticipants: 50,
        isRegistered: false,
        recordingUrl: null,
        createdAt: new Date('2024-01-20')
      },
      {
        id: 2,
        title: 'Computer Vision Workshop',
        description: 'Hands-on workshop building a CNN from scratch',
        instructor: {
          id: 'tutor2',
          name: 'Prof. Mike Johnson',
          avatar: '/api/placeholder/40/40'
        },
        course: {
          id: 2,
          name: 'Computer Vision Basics'
        },
        scheduledFor: new Date(), // Now (live)
        duration: 90,
        status: 'live',
        participantCount: 23,
        maxParticipants: 30,
        isRegistered: true,
        recordingUrl: null,
        createdAt: new Date('2024-01-18')
      },
      {
        id: 3,
        title: 'ML Ethics Discussion',
        description: 'Discussion on bias in machine learning models',
        instructor: {
          id: 'tutor3',
          name: 'Dr. Emily Davis',
          avatar: '/api/placeholder/40/40'
        },
        course: {
          id: 3,
          name: 'AI Ethics'
        },
        scheduledFor: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        duration: 45,
        status: 'completed',
        participantCount: 15,
        maxParticipants: 25,
        isRegistered: true,
        recordingUrl: '/recordings/ml-ethics-discussion.mp4',
        createdAt: new Date('2024-01-15')
      }
    ];

    setSessions(mockSessions);
  };

  const handleCreateSession = () => {
    const session = {
      id: Date.now(),
      ...newSession,
      instructor: {
        id: user?.uid,
        name: user?.displayName,
        avatar: user?.photoURL
      },
      status: 'scheduled',
      participantCount: 0,
      isRegistered: false,
      recordingUrl: null,
      createdAt: new Date(),
      scheduledFor: new Date(newSession.scheduledFor)
    };

    setSessions(prev => [...prev, session]);
    setCreateDialog(false);
    setNewSession({
      title: '',
      description: '',
      courseId: '',
      scheduledFor: '',
      duration: 60,
      maxParticipants: 50
    });
  };

  const handleJoinSession = (session) => {
    navigate(`/live-session/${session.id}`);
  };

  const handleRegisterForSession = (sessionId) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, isRegistered: !session.isRegistered }
        : session
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'error';
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live': return <LiveIcon />;
      case 'scheduled': return <ScheduleIcon />;
      case 'completed': return <HistoryIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const getFilteredSessions = () => {
    switch (activeTab) {
      case 0: // All
        return sessions;
      case 1: // Live
        return sessions.filter(s => s.status === 'live');
      case 2: // Scheduled
        return sessions.filter(s => s.status === 'scheduled');
      case 3: // Completed
        return sessions.filter(s => s.status === 'completed');
      default:
        return sessions;
    }
  };

  const renderSessionCard = (session) => (
    <Card key={session.id} sx={{ height: '100%' }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getStatusIcon(session.status)}
            <Chip
              label={session.status.toUpperCase()}
              color={getStatusColor(session.status)}
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>
          
          {session.status === 'live' && (
            <Badge color="error" variant="dot">
              <LiveIcon color="error" />
            </Badge>
          )}
        </Box>

        {/* Content */}
        <Typography variant="h6" gutterBottom>
          {session.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {session.description}
        </Typography>

        {/* Course Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={session.instructor.avatar} sx={{ width: 32, height: 32, mr: 1 }}>
            {session.instructor.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {session.instructor.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {session.course.name}
            </Typography>
          </Box>
        </Box>

        {/* Session Details */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <CalendarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
            {formatDate(session.scheduledFor)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Duration: {session.duration} minutes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <PeopleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
            {session.participantCount}/{session.maxParticipants} participants
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {session.status === 'live' && (
            <Button
              variant="contained"
              color="error"
              startIcon={<JoinIcon />}
              onClick={() => handleJoinSession(session)}
              fullWidth
            >
              Join Live
            </Button>
          )}
          
          {session.status === 'scheduled' && (
            <>
              {session.isRegistered ? (
                <Button
                  variant="contained"
                  onClick={() => handleRegisterForSession(session.id)}
                  fullWidth
                >
                  Registered
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => handleRegisterForSession(session.id)}
                  fullWidth
                >
                  Register
                </Button>
              )}
            </>
          )}
          
          {session.status === 'completed' && session.recordingUrl && (
            <Button
              variant="outlined"
              startIcon={<VideoIcon />}
              onClick={() => navigate(session.recordingUrl)}
              fullWidth
            >
              Watch Recording
            </Button>
          )}

          {variant === 'tutor' && (
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <IconButton size="small">
                <EditIcon />
              </IconButton>
              <IconButton size="small">
                <DeleteIcon />
              </IconButton>
              <IconButton size="small">
                <NotifyIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <PageHeader
        title="Live Sessions"
        subtitle={variant === 'tutor' ? 'Manage your live teaching sessions' : 'Join live learning sessions'}
        actions={variant === 'tutor' ? [
          {
            label: 'Create Session',
            icon: <AddIcon />,
            onClick: () => setCreateDialog(true),
            variant: 'contained'
          }
        ] : []}
      />

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
          <Tab label="All" />
          <Tab label="Live Now" />
          <Tab label="Scheduled" />
          <Tab label="Completed" />
        </Tabs>
      </Paper>

      {/* Sessions Grid */}
      {getFilteredSessions().length === 0 ? (
        <Alert severity="info">
          <Typography variant="body1" gutterBottom>
            No sessions found for this category.
          </Typography>
          <Typography variant="body2">
            {variant === 'tutor' 
              ? 'Create your first live session to engage with students in real-time.'
              : 'Check back later for upcoming live sessions or browse recordings.'
            }
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {getFilteredSessions().map((session) => (
            <Grid item xs={12} md={6} lg={4} key={session.id}>
              {renderSessionCard(session)}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Session Dialog */}
      {variant === 'tutor' && (
        <Dialog
          open={createDialog}
          onClose={() => setCreateDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create Live Session</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Session Title"
              value={newSession.title}
              onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
              sx={{ mb: 2, mt: 1 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={newSession.description}
              onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Course</InputLabel>
              <Select
                value={newSession.courseId}
                onChange={(e) => setNewSession(prev => ({ ...prev, courseId: e.target.value }))}
                label="Course"
              >
                <MenuItem value="1">Deep Learning Fundamentals</MenuItem>
                <MenuItem value="2">Computer Vision Basics</MenuItem>
                <MenuItem value="3">AI Ethics</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="datetime-local"
              label="Scheduled For"
              value={newSession.scheduledFor}
              onChange={(e) => setNewSession(prev => ({ ...prev, scheduledFor: e.target.value }))}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              type="number"
              label="Duration (minutes)"
              value={newSession.duration}
              onChange={(e) => setNewSession(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="number"
              label="Max Participants"
              value={newSession.maxParticipants}
              onChange={(e) => setNewSession(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateSession}
              variant="contained"
              disabled={!newSession.title || !newSession.scheduledFor}
            >
              Create Session
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default LiveSessionsList;
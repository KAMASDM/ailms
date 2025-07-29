// src/components/live/LiveSession.jsx
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Badge,
  Slider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import {
  Videocam as VideoIcon,
  VideocamOff as VideoOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  VolumeUp as VolumeIcon,
  Send as SendIcon,
  PanTool as HandIcon,
  Close as CloseIcon,
  CallEnd as EndCallIcon
} from '@mui/icons-material';
import { PageHeader } from '../common';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const LiveSession = ({ sessionId, isHost = false, onEnd }) => {
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadSessionData();
    initializeWebRTC();
    
    return () => {
      // Cleanup
      cleanupWebRTC();
    };
  }, [sessionId]);

  useEffect(() => {
    scrollChatToBottom();
  }, [chatMessages]);

  const loadSessionData = async () => {
    // Mock session data - replace with actual API call
    const mockSessionData = {
      id: sessionId,
      title: 'Deep Learning Q&A Session',
      instructor: {
        id: 'tutor1',
        name: 'Dr. Sarah Chen',
        avatar: '/api/placeholder/40/40'
      },
      course: {
        id: 1,
        name: 'Deep Learning Fundamentals'
      },
      startTime: new Date(),
      duration: 3600, // 1 hour
      description: 'Interactive Q&A session covering neural networks and backpropagation',
      isRecording: true
    };

    const mockParticipants = [
      {
        id: 'tutor1',
        name: 'Dr. Sarah Chen',
        avatar: '/api/placeholder/40/40',
        role: 'instructor',
        isVideoOn: true,
        isAudioOn: true,
        isHandRaised: false,
        joinedAt: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: user?.uid,
        name: user?.displayName || 'You',
        avatar: user?.photoURL,
        role: 'student',
        isVideoOn: isVideoOn,
        isAudioOn: isAudioOn,
        isHandRaised: isHandRaised,
        joinedAt: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: 'student1',
        name: 'Alice Johnson',
        avatar: '/api/placeholder/40/40',
        role: 'student',
        isVideoOn: false,
        isAudioOn: true,
        isHandRaised: true,
        joinedAt: new Date(Date.now() - 25 * 60 * 1000)
      },
      {
        id: 'student2',
        name: 'Bob Smith',
        avatar: '/api/placeholder/40/40',
        role: 'student',
        isVideoOn: true,
        isAudioOn: false,
        isHandRaised: false,
        joinedAt: new Date(Date.now() - 20 * 60 * 1000)
      }
    ];

    const mockChatMessages = [
      {
        id: 1,
        senderId: 'tutor1',
        senderName: 'Dr. Sarah Chen',
        content: 'Welcome everyone! Feel free to ask questions in the chat.',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        type: 'message'
      },
      {
        id: 2,
        senderId: 'student1',
        senderName: 'Alice Johnson',
        content: 'Could you explain the vanishing gradient problem?',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: 'message'
      },
      {
        id: 3,
        senderId: 'system',
        senderName: 'System',
        content: 'Bob Smith joined the session',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        type: 'system'
      }
    ];

    setSessionData(mockSessionData);
    setParticipants(mockParticipants);
    setChatMessages(mockChatMessages);
  };

  const initializeWebRTC = async () => {
    try {
      // Initialize WebRTC connection
      // This would include getting user media, setting up peer connections, etc.
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: isVideoOn, 
        audio: isAudioOn 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const cleanupWebRTC = () => {
    // Clean up WebRTC connections and media streams
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const scrollChatToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        senderId: user?.uid,
        senderName: user?.displayName || 'You',
        content: newMessage,
        timestamp: new Date(),
        type: 'message'
      };

      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // Update WebRTC stream
  };

  const handleToggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    // Update WebRTC stream
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // Implement screen sharing
  };

  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    // Send hand raise signal to other participants
  };

  const handleEndSession = () => {
    if (onEnd) {
      onEnd();
    }
  };

  const renderParticipantVideo = (participant, isMain = false) => (
    <Box
      key={participant.id}
      sx={{
        position: 'relative',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'black',
        aspectRatio: isMain ? '16/9' : '4/3',
        minHeight: isMain ? 300 : 120
      }}
    >
      {participant.isVideoOn ? (
        <video
          ref={participant.id === user?.uid ? videoRef : null}
          autoPlay
          muted={participant.id === user?.uid}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      ) : (
        <Box sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.800'
        }}>
          <Avatar src={participant.avatar} sx={{ width: 60, height: 60 }}>
            {participant.name.charAt(0)}
          </Avatar>
        </Box>
      )}

      {/* Participant Info Overlay */}
      <Box sx={{
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Chip
          label={participant.name}
          size="small"
          sx={{
            bgcolor: 'rgba(0,0,0,0.7)',
            color: 'white',
            maxWidth: '70%'
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {!participant.isAudioOn && (
            <MicOffIcon sx={{ color: 'error.main', fontSize: 20 }} />
          )}
          {participant.isHandRaised && (
            <HandIcon sx={{ color: 'warning.main', fontSize: 20 }} />
          )}
          {participant.role === 'instructor' && (
            <Chip label="Host" size="small" color="primary" />
          )}
        </Box>
      </Box>
    </Box>
  );

  const renderChatMessage = (message) => (
    <ListItem key={message.id} dense>
      {message.type === 'system' ? (
        <ListItemText
          primary={
            <Typography variant="caption" color="text.secondary" fontStyle="italic">
              {message.content}
            </Typography>
          }
        />
      ) : (
        <>
          <ListItemAvatar>
            <Avatar sx={{ width: 24, height: 24 }}>
              {message.senderName.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box>
                <Typography variant="caption" color="primary" fontWeight="medium">
                  {message.senderName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {formatDate(message.timestamp, 'time')}
                </Typography>
              </Box>
            }
            secondary={
              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                {message.content}
              </Typography>
            }
          />
        </>
      )}
    </ListItem>
  );

  if (!sessionData) {
    return <Typography>Loading session...</Typography>;
  }

  const mainSpeaker = participants.find(p => p.role === 'instructor') || participants[0];
  const otherParticipants = participants.filter(p => p.id !== mainSpeaker.id);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">{sessionData.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {sessionData.course.name} • {participants.length} participants
              {sessionData.isRecording && (
                <Chip label="Recording" color="error" size="small" sx={{ ml: 1 }} />
              )}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<PeopleIcon />}
              onClick={() => setShowParticipants(!showParticipants)}
              variant={showParticipants ? 'contained' : 'outlined'}
            >
              {participants.length}
            </Button>
            <Button
              startIcon={<ChatIcon />}
              onClick={() => setShowChat(!showChat)}
              variant={showChat ? 'contained' : 'outlined'}
            >
              Chat
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex' }}>
        {/* Video Area */}
        <Box sx={{ flex: 1, p: 2 }}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            {/* Main Speaker */}
            <Grid item xs={12} md={showChat || showParticipants ? 8 : 12}>
              {renderParticipantVideo(mainSpeaker, true)}
            </Grid>

            {/* Other Participants */}
            {otherParticipants.length > 0 && (
              <Grid item xs={12} md={showChat || showParticipants ? 4 : 12}>
                <Grid container spacing={1} sx={{ height: '100%' }}>
                  {otherParticipants.slice(0, 6).map((participant) => (
                    <Grid item xs={6} key={participant.id}>
                      {renderParticipantVideo(participant)}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Chat/Participants Sidebar */}
        {(showChat || showParticipants) && (
          <Paper sx={{ width: 300, display: 'flex', flexDirection: 'column' }}>
            {showParticipants && (
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>
                  Participants ({participants.length})
                </Typography>
                <List dense>
                  {participants.map((participant) => (
                    <ListItem key={participant.id}>
                      <ListItemAvatar>
                        <Badge
                          badgeContent={
                            participant.isHandRaised ? <HandIcon sx={{ fontSize: 12 }} /> : null
                          }
                          color="warning"
                        >
                          <Avatar src={participant.avatar} sx={{ width: 32, height: 32 }}>
                            {participant.name.charAt(0)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={participant.name}
                        secondary={participant.role}
                      />
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {!participant.isVideoOn && (
                          <VideocamOff sx={{ fontSize: 16, color: 'text.secondary' }} />
                        )}
                        {!participant.isAudioOn && (
                          <MicOff sx={{ fontSize: 16, color: 'text.secondary' }} />
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {showChat && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  Chat
                </Typography>
                
                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  <List dense>
                    {chatMessages.map(renderChatMessage)}
                    <div ref={chatEndRef} />
                  </List>
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton size="small" onClick={handleSendMessage}>
                          <SendIcon />
                        </IconButton>
                      )
                    }}
                  />
                </Box>
              </Box>
            )}
          </Paper>
        )}
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <Tooltip title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}>
            <IconButton
              onClick={handleToggleVideo}
              color={isVideoOn ? 'default' : 'error'}
              sx={{ bgcolor: isVideoOn ? 'action.hover' : 'error.main' }}
            >
              {isVideoOn ? <VideoIcon /> : <VideoOffIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title={isAudioOn ? 'Mute' : 'Unmute'}>
            <IconButton
              onClick={handleToggleAudio}
              color={isAudioOn ? 'default' : 'error'}
              sx={{ bgcolor: isAudioOn ? 'action.hover' : 'error.main' }}
            >
              {isAudioOn ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
            <IconButton
              onClick={handleToggleScreenShare}
              color={isScreenSharing ? 'primary' : 'default'}
            >
              {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title={isHandRaised ? 'Lower hand' : 'Raise hand'}>
            <IconButton
              onClick={handleRaiseHand}
              color={isHandRaised ? 'warning' : 'default'}
            >
              <HandIcon />
            </IconButton>
          </Tooltip>

          {/* Volume Control */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
            <VolumeIcon sx={{ mr: 1 }} />
            <Slider
              value={volume}
              onChange={(e, value) => setVolume(value)}
              size="small"
              sx={{ flex: 1 }}
            />
          </Box>

          <IconButton onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </IconButton>

          <Button
            variant="contained"
            color="error"
            startIcon={<EndCallIcon />}
            onClick={handleEndSession}
          >
            Leave
          </Button>
        </Box>
      </Paper>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Session Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Audio and video settings would be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LiveSession;
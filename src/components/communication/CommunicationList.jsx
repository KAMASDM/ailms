// src/components/communication/CommunicationList.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Badge,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Chat as ChatIcon,
  VideoCall as VideoIcon,
  Group as GroupIcon,
  NotificationsOff as MuteIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Circle as OnlineIcon
} from '@mui/icons-material';
import { PageHeader, SearchInput } from '../common';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import ChatInterface from './ChatInterface';

const CommunicationList = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatDialog, setNewChatDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    // Mock conversations data - replace with actual API call
    const mockConversations = [
      {
        id: 1,
        type: 'direct',
        participants: [
          {
            id: 'tutor1',
            name: 'Dr. Sarah Chen',
            avatar: '/api/placeholder/40/40',
            role: 'tutor',
            status: 'online'
          },
          {
            id: user?.uid,
            name: user?.displayName,
            avatar: user?.photoURL,
            role: 'student',
            status: 'online'
          }
        ],
        lastMessage: {
          content: 'Thank you! This is very helpful.',
          senderId: user?.uid,
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          type: 'text'
        },
        unreadCount: 0,
        isMuted: false,
        courseContext: {
          id: 1,
          name: 'Deep Learning Fundamentals'
        }
      },
      {
        id: 2,
        type: 'group',
        name: 'Deep Learning Study Group',
        participants: [
          {
            id: 'student1',
            name: 'Alice Johnson',
            avatar: '/api/placeholder/40/40',
            role: 'student'
          },
          {
            id: 'student2',
            name: 'Bob Smith',
            avatar: '/api/placeholder/40/40',
            role: 'student'
          },
          {
            id: user?.uid,
            name: user?.displayName,
            avatar: user?.photoURL,
            role: 'student'
          }
        ],
        lastMessage: {
          content: 'Anyone working on assignment 3?',
          senderId: 'student1',
          senderName: 'Alice Johnson',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: 'text'
        },
        unreadCount: 2,
        isMuted: false,
        courseContext: {
          id: 1,
          name: 'Deep Learning Fundamentals'
        }
      },
      {
        id: 3,
        type: 'direct',
        participants: [
          {
            id: 'tutor2',
            name: 'Prof. Mike Johnson',
            avatar: '/api/placeholder/40/40',
            role: 'tutor',
            status: 'away'
          },
          {
            id: user?.uid,
            name: user?.displayName,
            avatar: user?.photoURL,
            role: 'student',
            status: 'online'
          }
        ],
        lastMessage: {
          content: 'I\'ll review your project and get back to you.',
          senderId: 'tutor2',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          type: 'text'
        },
        unreadCount: 1,
        isMuted: false,
        courseContext: {
          id: 2,
          name: 'Computer Vision Basics'
        }
      }
    ];

    setConversations(mockConversations);
  };

  const handleMenuClick = (event, conversation) => {
    setMenuAnchor(event.currentTarget);
    setSelectedConversation(conversation);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedConversation(null);
  };

  const handleMuteConversation = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isMuted: !conv.isMuted }
        : conv
    ));
    handleMenuClose();
  };

  const handleDeleteConversation = (conversationId) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    handleMenuClose();
  };

  const getConversationTitle = (conversation) => {
    if (conversation.type === 'group') {
      return conversation.name;
    } else {
      const otherParticipant = conversation.participants.find(p => p.id !== user?.uid);
      return otherParticipant?.name || 'Unknown';
    }
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.type === 'group') {
      return <GroupIcon />;
    } else {
      const otherParticipant = conversation.participants.find(p => p.id !== user?.uid);
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            otherParticipant?.status === 'online' ? (
              <OnlineIcon sx={{ fontSize: 12, color: 'success.main' }} />
            ) : null
          }
        >
          <Avatar src={otherParticipant?.avatar}>
            {otherParticipant?.name?.charAt(0)}
          </Avatar>
        </Badge>
      );
    }
  };

  const getLastMessagePreview = (message) => {
    if (message.type === 'file') {
      return '📎 File attachment';
    }
    return message.content;
  };

  const filteredConversations = conversations.filter(conv => {
    const title = getConversationTitle(conv).toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = query === '' || title.includes(query);
    const matchesTab = activeTab === 0 || // All
      (activeTab === 1 && conv.type === 'direct') || // Direct
      (activeTab === 2 && conv.type === 'group') || // Groups
      (activeTab === 3 && conv.unreadCount > 0); // Unread

    return matchesSearch && matchesTab;
  });

  const renderConversationItem = (conversation) => (
    <ListItem
      key={conversation.id}
      button
      onClick={() => setSelectedChat(conversation)}
      sx={{
        borderRadius: 1,
        mb: 0.5,
        bgcolor: selectedChat?.id === conversation.id ? 'action.selected' : 'transparent',
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
    >
      <ListItemAvatar>
        {getConversationAvatar(conversation)}
      </ListItemAvatar>

      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={conversation.unreadCount > 0 ? 'bold' : 'medium'}
              sx={{ flex: 1 }}
            >
              {getConversationTitle(conversation)}
            </Typography>
            {conversation.isMuted && (
              <MuteIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            )}
            {conversation.unreadCount > 0 && (
              <Badge badgeContent={conversation.unreadCount} color="primary" />
            )}
          </Box>
        }
        secondary={
          <Box>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {conversation.lastMessage?.senderName && conversation.type === 'group' && 
                `${conversation.lastMessage.senderName}: `
              }
              {getLastMessagePreview(conversation.lastMessage)}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDate(conversation.lastMessage?.timestamp)}
              </Typography>
              {conversation.courseContext && (
                <Chip 
                  label={conversation.courseContext.name}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.6rem', height: 16 }}
                />
              )}
            </Box>
          </Box>
        }
      />

      <ListItemSecondaryAction>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleMenuClick(e, conversation);
          }}
        >
          <MoreIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <Box>
      <PageHeader
        title="Communication"
        subtitle="Chat with instructors and fellow students"
        actions={[
          {
            label: 'New Chat',
            icon: <AddIcon />,
            onClick: () => setNewChatDialog(true),
            variant: 'contained'
          }
        ]}
      />

      <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ pb: 1 }}>
              {/* Search */}
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search conversations..."
                sx={{ mb: 2 }}
              />

              {/* Tabs */}
              <Tabs 
                value={activeTab} 
                onChange={(e, value) => setActiveTab(value)}
                variant="fullWidth"
                sx={{ mb: 2 }}
              >
                <Tab label="All" />
                <Tab label="Direct" />
                <Tab label="Groups" />
                <Tab label="Unread" />
              </Tabs>
            </CardContent>

            {/* Conversations List */}
            <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
              <List dense>
                {filteredConversations.map(renderConversationItem)}
              </List>
            </Box>
          </Card>
        </Grid>

        {/* Chat Interface */}
        <Grid item xs={12} md={8}>
          {selectedChat ? (
            <ChatInterface
              chatId={selectedChat.id}
              participants={selectedChat.participants}
              onClose={() => setSelectedChat(null)}
            />
          ) : (
            <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <ChatIcon sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography variant="body2">
                  Choose a chat from the list to start messaging
                </Typography>
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMuteConversation(selectedConversation?.id)}>
          <MuteIcon sx={{ mr: 1 }} />
          {selectedConversation?.isMuted ? 'Unmute' : 'Mute'} Notifications
        </MenuItem>
        <MenuItem onClick={() => handleDeleteConversation(selectedConversation?.id)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Conversation
        </MenuItem>
      </Menu>

      {/* New Chat Dialog */}
      <Dialog
        open={newChatDialog}
        onClose={() => setNewChatDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Start New Chat</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Search for students or instructors to start a conversation.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search users..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          {/* User search results would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewChatDialog(false)}>Cancel</Button>
          <Button variant="contained">Start Chat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunicationList;
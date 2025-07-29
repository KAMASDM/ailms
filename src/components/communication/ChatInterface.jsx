// src/components/communication/ChatInterface.jsx
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  InputAdornment
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert as MoreIcon,
  VideoCall as VideoIcon,
  Phone as PhoneIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const ChatInterface = ({ chatId, participants = [], onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    // Mock messages data - replace with actual API call
    const mockMessages = [
      {
        id: 1,
        senderId: 'tutor1',
        senderName: 'Dr. Sarah Chen',
        senderAvatar: '/api/placeholder/40/40',
        content: 'Hello! Welcome to the Deep Learning course. How can I help you today?',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        type: 'text',
        isOwn: false
      },
      {
        id: 2,
        senderId: user?.uid,
        senderName: user?.displayName,
        senderAvatar: user?.photoURL,
        content: 'Hi Dr. Chen! I have a question about backpropagation. Could you explain the chain rule in more detail?',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        type: 'text',
        isOwn: true
      },
      {
        id: 3,
        senderId: 'tutor1',
        senderName: 'Dr. Sarah Chen',
        senderAvatar: '/api/placeholder/40/40',
        content: 'Of course! The chain rule is fundamental to understanding how gradients flow backwards through the network. Let me share a resource that explains it well.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: 'text',
        isOwn: false
      },
      {
        id: 4,
        senderId: 'tutor1',
        senderName: 'Dr. Sarah Chen',
        senderAvatar: '/api/placeholder/40/40',
        content: 'backpropagation_explained.pdf',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        type: 'file',
        isOwn: false,
        fileData: {
          name: 'backpropagation_explained.pdf',
          size: '2.3 MB',
          type: 'application/pdf'
        }
      },
      {
        id: 5,
        senderId: user?.uid,
        senderName: user?.displayName,
        senderAvatar: user?.photoURL,
        content: 'Thank you! This is very helpful. I understand it much better now.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        type: 'text',
        isOwn: true
      }
    ];

    setMessages(mockMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        senderId: user?.uid,
        senderName: user?.displayName,
        senderAvatar: user?.photoURL,
        content: newMessage,
        timestamp: new Date(),
        type: 'text',
        isOwn: true
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simulate typing indicator and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Add auto-response for demo
        const autoResponse = {
          id: Date.now() + 1,
          senderId: 'tutor1',
          senderName: 'Dr. Sarah Chen',
          senderAvatar: '/api/placeholder/40/40',
          content: 'Got it! Let me know if you have any other questions.',
          timestamp: new Date(),
          type: 'text',
          isOwn: false
        };
        setMessages(prev => [...prev, autoResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileMessage = {
        id: Date.now(),
        senderId: user?.uid,
        senderName: user?.displayName,
        senderAvatar: user?.photoURL,
        content: file.name,
        timestamp: new Date(),
        type: 'file',
        isOwn: true,
        fileData: {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          type: file.type
        }
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  const renderMessage = (message) => {
    const isFile = message.type === 'file';
    
    return (
      <ListItem
        key={message.id}
        sx={{
          flexDirection: message.isOwn ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          py: 1
        }}
      >
        <ListItemAvatar sx={{ 
          minWidth: 'auto',
          mx: 1,
          alignSelf: 'flex-end'
        }}>
          <Avatar src={message.senderAvatar} sx={{ width: 32, height: 32 }}>
            {message.senderName?.charAt(0)}
          </Avatar>
        </ListItemAvatar>

        <Box
          sx={{
            maxWidth: '70%',
            bgcolor: message.isOwn ? 'primary.main' : 'grey.100',
            color: message.isOwn ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
            p: 1.5,
            wordBreak: 'break-word'
          }}
        >
          {!message.isOwn && (
            <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
              {message.senderName}
            </Typography>
          )}
          
          {isFile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachIcon />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {message.fileData?.name}
                </Typography>
                <Typography variant="caption">
                  {message.fileData?.size}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {message.content}
            </Typography>
          )}

          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              mt: 0.5, 
              opacity: 0.7,
              textAlign: message.isOwn ? 'right' : 'left'
            }}
          >
            {formatDate(message.timestamp, 'time')}
          </Typography>
        </Box>
      </ListItem>
    );
  };

  const otherParticipant = participants.find(p => p.id !== user?.uid);

  return (
    <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={otherParticipant?.avatar} sx={{ mr: 2 }}>
            {otherParticipant?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {otherParticipant?.name || 'Chat'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {otherParticipant?.status || 'Online'}
            </Typography>
          </Box>
        </Box>

        <Box>
          <IconButton onClick={() => setSearchOpen(true)}>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <VideoIcon />
          </IconButton>
          <IconButton>
            <PhoneIcon />
          </IconButton>
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreIcon />
          </IconButton>
          {onClose && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <List sx={{ flex: 1, py: 1 }}>
          {messages.map(renderMessage)}
          
          {/* Typing Indicator */}
          {isTyping && (
            <ListItem>
              <ListItemAvatar>
                <Avatar src={otherParticipant?.avatar} sx={{ width: 32, height: 32 }}>
                  {otherParticipant?.name?.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ 
                bgcolor: 'grey.100', 
                borderRadius: 2, 
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <Typography variant="body2" color="text.secondary">
                  Typing
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[0, 1, 2].map(i => (
                    <Box
                      key={i}
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: 'text.secondary',
                        animation: 'pulse 1.5s infinite',
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </ListItem>
          )}
          
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Message Input */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton component="label" size="small">
                  <AttachIcon />
                  <input
                    type="file"
                    hidden
                    onChange={handleFileUpload}
                    accept="*/*"
                  />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <EmojiIcon />
                </IconButton>
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Chat Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          View Profile
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          Mute Notifications
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          Clear Chat
        </MenuItem>
      </Menu>

      {/* Search Dialog */}
      <Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Search Messages</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search in conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          {/* Search results would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ChatInterface;
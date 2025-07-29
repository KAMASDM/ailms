// src/components/bookmarks/BookmarkManager.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Folder as FolderIcon,
  School as CourseIcon,
  Quiz as QuizIcon,
  PlayArrow as LessonIcon,
  MoreVert as MoreIcon,
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { PageHeader, SearchInput } from '../common';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const BookmarkManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [createCollectionDialog, setCreateCollectionDialog] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    loadBookmarks();
    loadCollections();
  }, []);

  const loadBookmarks = async () => {
    // Mock bookmarks data - replace with actual API call
    const mockBookmarks = [
      {
        id: 1,
        type: 'course',
        title: 'Deep Learning Fundamentals',
        description: 'Learn the basics of neural networks and deep learning',
        url: '/course/1',
        thumbnail: '/api/placeholder/300/200',
        addedAt: new Date('2024-01-20'),
        collectionId: 1,
        metadata: {
          instructor: 'Dr. Sarah Chen',
          duration: '8 hours',
          level: 'Beginner'
        }
      },
      {
        id: 2,
        type: 'lesson',
        title: 'Introduction to Neural Networks',
        description: 'Understanding the basic concepts of neural networks',
        url: '/course/1/lesson/3',
        thumbnail: '/api/placeholder/300/200',
        addedAt: new Date('2024-01-18'),
        collectionId: null,
        metadata: {
          course: 'Deep Learning Fundamentals',
          duration: '25 minutes',
          progress: 75
        }
      },
      {
        id: 3,
        type: 'quiz',
        title: 'Machine Learning Basics Quiz',
        description: 'Test your understanding of ML fundamentals',
        url: '/quiz/2',
        thumbnail: null,
        addedAt: new Date('2024-01-15'),
        collectionId: 2,
        metadata: {
          questions: 15,
          timeLimit: '30 minutes',
          bestScore: 92
        }
      },
      {
        id: 4,
        type: 'course',
        title: 'Computer Vision with CNNs',
        description: 'Master computer vision using convolutional neural networks',
        url: '/course/2',
        thumbnail: '/api/placeholder/300/200',
        addedAt: new Date('2024-01-12'),
        collectionId: 1,
        metadata: {
          instructor: 'Prof. Mike Johnson',
          duration: '12 hours',
          level: 'Intermediate'
        }
      }
    ];

    setBookmarks(mockBookmarks);
  };

  const loadCollections = async () => {
    // Mock collections data
    const mockCollections = [
      {
        id: 1,
        name: 'AI Fundamentals',
        description: 'Core AI and ML courses',
        itemCount: 2,
        createdAt: new Date('2024-01-10'),
        color: '#1976d2'
      },
      {
        id: 2,
        name: 'Practice Quizzes',
        description: 'Saved quizzes for practice',
        itemCount: 1,
        createdAt: new Date('2024-01-15'),
        color: '#dc004e'
      }
    ];

    setCollections(mockCollections);
  };

  const handleMenuClick = (event, bookmark) => {
    setMenuAnchor(event.currentTarget);
    setSelectedBookmark(bookmark);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedBookmark(null);
  };

  const handleRemoveBookmark = (bookmarkId) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    handleMenuClose();
  };

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection = {
        id: Date.now(),
        name: newCollectionName,
        description: '',
        itemCount: 0,
        createdAt: new Date(),
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      };
      setCollections(prev => [...prev, newCollection]);
      setNewCollectionName('');
      setCreateCollectionDialog(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'course':
        return <CourseIcon />;
      case 'lesson':
        return <LessonIcon />;
      case 'quiz':
        return <QuizIcon />;
      default:
        return <BookmarkIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'course':
        return 'primary';
      case 'lesson':
        return 'success';
      case 'quiz':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = searchQuery === '' || 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 0 || // All
      (activeTab === 1 && bookmark.type === 'course') || // Courses
      (activeTab === 2 && bookmark.type === 'lesson') || // Lessons
      (activeTab === 3 && bookmark.type === 'quiz'); // Quizzes

    return matchesSearch && matchesTab;
  });

  const renderBookmarkCard = (bookmark) => (
    <Card
      key={bookmark.id}
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
      onClick={() => navigate(bookmark.url)}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: `${getTypeColor(bookmark.type)}.light`, mr: 1 }}>
              {getTypeIcon(bookmark.type)}
            </Avatar>
            <Chip
              label={bookmark.type}
              size="small"
              color={getTypeColor(bookmark.type)}
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick(e, bookmark);
            }}
          >
            <MoreIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Typography variant="h6" gutterBottom sx={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {bookmark.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {bookmark.description}
        </Typography>

        {/* Metadata */}
        <Box sx={{ mb: 2 }}>
          {bookmark.metadata && Object.entries(bookmark.metadata).map(([key, value]) => (
            <Typography key={key} variant="caption" display="block" color="text.secondary">
              {key}: {value}
            </Typography>
          ))}
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Saved {formatDate(bookmark.addedAt)}
          </Typography>
          <BookmarkIcon color="primary" />
        </Box>
      </CardContent>
    </Card>
  );

  const renderCollectionItem = (collection) => (
    <ListItem key={collection.id}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: collection.color }}>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={collection.name}
        secondary={`${collection.itemCount} items • Created ${formatDate(collection.createdAt)}`}
      />
      <ListItemSecondaryAction>
        <IconButton>
          <MoreIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <Box>
      <PageHeader
        title="Bookmarks"
        subtitle="Access your saved courses, lessons, and quizzes"
        actions={[
          {
            label: 'Create Collection',
            icon: <AddIcon />,
            onClick: () => setCreateCollectionDialog(true),
            variant: 'outlined'
          }
        ]}
      />

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search bookmarks..."
        />
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
          <Tab label={`All (${bookmarks.length})`} />
          <Tab label={`Courses (${bookmarks.filter(b => b.type === 'course').length})`} />
          <Tab label={`Lessons (${bookmarks.filter(b => b.type === 'lesson').length})`} />
          <Tab label={`Quizzes (${bookmarks.filter(b => b.type === 'quiz').length})`} />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {/* Collections Sidebar */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Collections
              </Typography>
              
              {collections.length === 0 ? (
                <Alert severity="info">
                  <Typography variant="body2">
                    Create collections to organize your bookmarks
                  </Typography>
                </Alert>
              ) : (
                <List dense>
                  {collections.map(renderCollectionItem)}
                </List>
              )}

              <Button
                fullWidth
                startIcon={<AddIcon />}
                onClick={() => setCreateCollectionDialog(true)}
                sx={{ mt: 2 }}
              >
                New Collection
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Bookmarks Grid */}
        <Grid item xs={12} md={9}>
          {filteredBookmarks.length === 0 ? (
            <Alert severity="info">
              <Typography variant="body1" gutterBottom>
                {searchQuery ? 'No bookmarks match your search.' : 'No bookmarks found.'}
              </Typography>
              <Typography variant="body2">
                {searchQuery 
                  ? 'Try adjusting your search terms.' 
                  : 'Start bookmarking courses, lessons, and quizzes to access them quickly!'
                }
              </Typography>
              {!searchQuery && (
                <Button
                  variant="contained"
                  onClick={() => navigate('/courses')}
                  sx={{ mt: 2 }}
                >
                  Browse Courses
                </Button>
              )}
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {filteredBookmarks.map((bookmark) => (
                <Grid item xs={12} sm={6} md={4} key={bookmark.id}>
                  {renderBookmarkCard(bookmark)}
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(selectedBookmark?.url);
          handleMenuClose();
        }}>
          Open
        </MenuItem>
        <MenuItem onClick={() => {
          // Implementation for sharing
          handleMenuClose();
        }}>
          <ShareIcon sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={() => handleRemoveBookmark(selectedBookmark?.id)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Remove Bookmark
        </MenuItem>
      </Menu>

      {/* Create Collection Dialog */}
      <Dialog
        open={createCollectionDialog}
        onClose={() => setCreateCollectionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Collection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            fullWidth
            variant="outlined"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateCollection();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateCollectionDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateCollection} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookmarkManager;
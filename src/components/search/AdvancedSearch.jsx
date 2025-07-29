// src/components/search/AdvancedSearch.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Paper,
  Divider,
  Alert,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Bookmark as BookmarkIcon,
  Star as StarIcon,
  School as CourseIcon,
  Quiz as QuizIcon,
  Person as InstructorIcon,
  ExpandMore as ExpandIcon,
  Tune as TuneIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { PageHeader, SearchInput } from '../common';
import { formatDate, formatDuration } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useDebouncedSearch } from '../../hooks/useDebounce';

const AdvancedSearch = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all', // all, courses, quizzes, instructors
    level: 'all', // all, beginner, intermediate, advanced
    duration: [0, 600], // minutes
    rating: 0,
    category: 'all',
    price: 'all', // all, free, paid
    language: 'all',
    features: [] // certification, hands-on, projects, etc.
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const { debouncedSearchTerm, isSearching } = useDebouncedSearch(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, filters]);

  useEffect(() => {
    loadSearchHistory();
    loadSuggestions();
  }, []);

  const loadSearchHistory = () => {
    // Mock search history - replace with actual localStorage or API
    const mockHistory = [
      'deep learning',
      'computer vision',
      'neural networks',
      'machine learning basics',
      'python programming'
    ];
    setSearchHistory(mockHistory);
  };

  const loadSuggestions = () => {
    // Mock search suggestions based on user behavior
    const mockSuggestions = [
      'Advanced CNN architectures',
      'Natural language processing',
      'Reinforcement learning basics',
      'Data preprocessing techniques',
      'Model optimization strategies'
    ];
    setSuggestions(mockSuggestions);
  };

  const performSearch = async (query) => {
    setLoading(true);
    try {
      // Mock search results - replace with actual API call
      const mockResults = [
        {
          id: 1,
          type: 'course',
          title: 'Deep Learning Fundamentals',
          description: 'Comprehensive introduction to neural networks and deep learning concepts',
          thumbnail: '/api/placeholder/300/200',
          instructor: {
            id: 'tutor1',
            name: 'Dr. Sarah Chen',
            avatar: '/api/placeholder/40/40',
            rating: 4.8
          },
          rating: 4.9,
          reviewsCount: 245,
          studentsCount: 1543,
          duration: 480, // minutes
          level: 'Beginner',
          category: 'AI & Machine Learning',
          price: 99,
          language: 'English',
          features: ['Certification', 'Hands-on Projects', 'Lifetime Access'],
          lastUpdated: new Date('2024-01-15'),
          highlights: ['neural networks', 'deep learning'],
          relevanceScore: 95
        },
        {
          id: 2,
          type: 'course',
          title: 'Computer Vision with OpenCV',
          description: 'Learn computer vision techniques using OpenCV and Python',
          thumbnail: '/api/placeholder/300/200',
          instructor: {
            id: 'tutor2',
            name: 'Prof. Mike Johnson',
            avatar: '/api/placeholder/40/40',
            rating: 4.7
          },
          rating: 4.6,
          reviewsCount: 189,
          studentsCount: 892,
          duration: 360,
          level: 'Intermediate',
          category: 'Computer Vision',
          price: 79,
          language: 'English',
          features: ['Certification', 'Code Repository'],
          lastUpdated: new Date('2024-01-10'),
          highlights: ['computer vision', 'OpenCV'],
          relevanceScore: 87
        },
        {
          id: 3,
          type: 'quiz',
          title: 'Neural Networks Fundamentals Quiz',
          description: 'Test your understanding of basic neural network concepts',
          difficulty: 'Medium',
          questions: 20,
          estimatedTime: 30,
          category: 'Deep Learning',
          attempts: 1247,
          averageScore: 78,
          highlights: ['neural networks', 'fundamentals'],
          relevanceScore: 82
        },
        {
          id: 4,
          type: 'instructor',
          title: 'Dr. Sarah Chen',
          description: 'PhD in Machine Learning, 10+ years experience in AI research',
          avatar: '/api/placeholder/80/80',
          specializations: ['Deep Learning', 'Neural Networks', 'AI Research'],
          coursesCount: 8,
          studentsCount: 5420,
          rating: 4.8,
          bio: 'Leading AI researcher with expertise in deep learning and neural network architectures',
          highlights: ['AI research', 'deep learning'],
          relevanceScore: 75
        }
      ];

      // Filter results based on current filters
      const filteredResults = mockResults.filter(result => {
        if (filters.type !== 'all' && result.type !== filters.type) return false;
        if (filters.level !== 'all' && result.level && result.level.toLowerCase() !== filters.level) return false;
        if (result.duration && (result.duration < filters.duration[0] || result.duration > filters.duration[1])) return false;
        if (filters.rating > 0 && result.rating && result.rating < filters.rating) return false;
        if (filters.category !== 'all' && result.category && result.category !== filters.category) return false;
        if (filters.price === 'free' && result.price && result.price > 0) return false;
        if (filters.price === 'paid' && (!result.price || result.price === 0)) return false;
        
        return true;
      });

      setSearchResults(filteredResults);
      
      // Add to search history
      if (query && !searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      level: 'all',
      duration: [0, 600],
      rating: 0,
      category: 'all',
      price: 'all',
      language: 'all',
      features: []
    });
  };

  const handleResultClick = (result) => {
    if (result.type === 'course') {
      navigate(`/course/${result.id}`);
    } else if (result.type === 'quiz') {
      navigate(`/quiz/${result.id}`);
    } else if (result.type === 'instructor') {
      navigate(`/instructor/${result.id}`);
    }
  };

  const renderSearchResult = (result) => {
    const getResultIcon = () => {
      switch (result.type) {
        case 'course': return <CourseIcon color="primary" />;
        case 'quiz': return <QuizIcon color="secondary" />;
        case 'instructor': return <InstructorIcon color="success" />;
        default: return <SearchIcon />;
      }
    };

    return (
      <Card 
        key={result.id} 
        sx={{ 
          mb: 2, 
          cursor: 'pointer',
          '&:hover': { boxShadow: 3 }
        }}
        onClick={() => handleResultClick(result)}
      >
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Icon/Avatar */}
            <Box sx={{ minWidth: 60 }}>
              {result.type === 'instructor' ? (
                <Avatar src={result.avatar} sx={{ width: 60, height: 60 }}>
                  {result.title.charAt(0)}
                </Avatar>
              ) : (
                <Paper sx={{ 
                  width: 60, 
                  height: 60, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'grey.100'
                }}>
                  {getResultIcon()}
                </Paper>
              )}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {result.title}
                  </Typography>
                  <Chip 
                    label={result.type.toUpperCase()}
                    size="small"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  {result.level && (
                    <Chip 
                      label={result.level}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    {result.relevanceScore}% match
                  </Typography>
                  <IconButton size="small">
                    <BookmarkIcon />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {result.description}
              </Typography>

              {/* Highlights */}
              {result.highlights && (
                <Box sx={{ mb: 1 }}>
                  {result.highlights.map((highlight, index) => (
                    <Chip
                      key={index}
                      label={highlight}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, bgcolor: 'primary.light', color: 'primary.dark' }}
                    />
                  ))}
                </Box>
              )}

              {/* Metadata */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                {result.instructor && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={result.instructor.avatar} sx={{ width: 20, height: 20, mr: 0.5 }}>
                      {result.instructor.name.charAt(0)}
                    </Avatar>
                    <Typography variant="caption">
                      {result.instructor.name}
                    </Typography>
                  </Box>
                )}

                {result.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                    <Typography variant="caption">
                      {result.rating} ({result.reviewsCount} reviews)
                    </Typography>
                  </Box>
                )}

                {result.duration && (
                  <Typography variant="caption" color="text.secondary">
                    {formatDuration(result.duration)}
                  </Typography>
                )}

                {result.price !== undefined && (
                  <Typography variant="caption" color="primary.main" fontWeight="bold">
                    {result.price === 0 ? 'Free' : `$${result.price}`}
                  </Typography>
                )}

                {result.studentsCount && (
                  <Typography variant="caption" color="text.secondary">
                    {result.studentsCount.toLocaleString()} students
                  </Typography>
                )}
              </Box>

              {/* Features */}
              {result.features && (
                <Box sx={{ mt: 1 }}>
                  {result.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderFilters = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <Button startIcon={<ClearIcon />} onClick={clearFilters}>
            Clear All
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Content Type */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                label="Type"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="course">Courses</MenuItem>
                <MenuItem value="quiz">Quizzes</MenuItem>
                <MenuItem value="instructor">Instructors</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Level */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Level</InputLabel>
              <Select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                label="Level"
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="AI & Machine Learning">AI & Machine Learning</MenuItem>
                <MenuItem value="Computer Vision">Computer Vision</MenuItem>
                <MenuItem value="Natural Language Processing">NLP</MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Price */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Price</InputLabel>
              <Select
                value={filters.price}
                onChange={(e) => handleFilterChange('price', e.target.value)}
                label="Price"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Duration */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>
              Duration (hours)
            </Typography>
            <Slider
              value={[filters.duration[0] / 60, filters.duration[1] / 60]}
              onChange={(e, value) => handleFilterChange('duration', [value[0] * 60, value[1] * 60])}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.5}
              marks={[
                { value: 0, label: '0h' },
                { value: 2, label: '2h' },
                { value: 5, label: '5h' },
                { value: 10, label: '10h+' }
              ]}
            />
          </Grid>

          {/* Rating */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>
              Minimum Rating
            </Typography>
            <Slider
              value={filters.rating}
              onChange={(e, value) => handleFilterChange('rating', value)}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={0.5}
              marks={[
                { value: 0, label: 'Any' },
                { value: 3, label: '3+' },
                { value: 4, label: '4+' },
                { value: 4.5, label: '4.5+' }
              ]}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <PageHeader
        title="Search"
        subtitle="Find courses, quizzes, and learning materials"
      />

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search for courses, topics, or instructors..."
            fullWidth
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowFilters(!showFilters)}>
                    <TuneIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Search Suggestions */}
          {!searchQuery && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Popular Searches:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {suggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    clickable
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Search History */}
          {!searchQuery && searchHistory.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Recent Searches:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {searchHistory.map((query, index) => (
                  <Chip
                    key={index}
                    icon={<HistoryIcon />}
                    label={query}
                    onClick={() => setSearchQuery(query)}
                    clickable
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      {showFilters && renderFilters()}

      {/* Search Results */}
      <Box>
        {loading || isSearching ? (
          <Box>
            {[1, 2, 3].map((i) => (
              <Card key={i} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton variant="rectangular" width={60} height={60} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={28} />
                      <Skeleton variant="text" width="40%" height={20} />
                      <Skeleton variant="text" width="80%" height={20} />
                      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                        <Skeleton variant="rounded" width={60} height={24} />
                        <Skeleton variant="rounded" width={80} height={24} />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : searchResults.length > 0 ? (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Found {searchResults.length} results for "{searchQuery}"
            </Typography>
            {searchResults.map(renderSearchResult)}
          </Box>
        ) : searchQuery ? (
          <Alert severity="info">
            <Typography variant="body1" gutterBottom>
              No results found for "{searchQuery}"
            </Typography>
            <Typography variant="body2">
              Try adjusting your search terms or filters.
            </Typography>
          </Alert>
        ) : (
          <Alert severity="info">
            <Typography variant="body1">
              Enter a search term to find courses, quizzes, and instructors.
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default AdvancedSearch;
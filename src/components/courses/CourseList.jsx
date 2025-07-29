// src/components/courses/CourseList.jsx
import { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Pagination,
  Button,
  Paper,
  Skeleton
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Sort as SortIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon
} from '@mui/icons-material';
import CourseCard from './CourseCard';
import { SearchInput } from '../common';
import { COURSE_LEVELS, COURSE_CATEGORIES } from '../../utils/constants';
import { useDebounce } from '../../hooks/useDebounce';

const CourseList = ({
  courses = [],
  loading = false,
  title = "Courses",
  variant = 'default', // 'default', 'enrolled', 'created'
  showFilters = true,
  showSearch = true,
  itemsPerPage = 12,
  onCourseEnroll,
  onCourseBookmark,
  bookmarkedCourses = []
}) => {
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, debouncedSearchTerm, sortBy, filterLevel, filterCategory, filterPrice]);

  const filterAndSortCourses = () => {
    let filtered = [...courses];

    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        course.instructor?.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Apply level filter
    if (filterLevel) {
      filtered = filtered.filter(course => course.level === filterLevel);
    }

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(course => course.category === filterCategory);
    }

    // Apply price filter
    if (filterPrice) {
      switch (filterPrice) {
        case 'free':
          filtered = filtered.filter(course => course.price === 0);
          break;
        case 'paid':
          filtered = filtered.filter(course => course.price > 0);
          break;
        case 'under50':
          filtered = filtered.filter(course => course.price > 0 && course.price < 50);
          break;
        case 'under100':
          filtered = filtered.filter(course => course.price >= 50 && course.price < 100);
          break;
        case 'over100':
          filtered = filtered.filter(course => course.price >= 100);
          break;
        default:
          break;
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'students':
        filtered.sort((a, b) => (b.studentsCount || 0) - (a.studentsCount || 0));
        break;
      case 'price_low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        break;
    }

    setFilteredCourses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterLevel('');
    setFilterCategory('');
    setFilterPrice('');
    setSortBy('title');
  };

  const hasActiveFilters = searchTerm || filterLevel || filterCategory || filterPrice || sortBy !== 'title';

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
          {hasActiveFilters && (
            <Button size="small" onClick={clearFilters} sx={{ ml: 'auto' }}>
              Clear All
            </Button>
          )}
        </Box>

        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          {showSearch && (
            <Grid item xs={12} md={3}>
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search courses..."
                size="small"
              />
            </Grid>
          )}

          {/* Sort */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="students">Students</MenuItem>
                <MenuItem value="price_low">Price: Low to High</MenuItem>
                <MenuItem value="price_high">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Level Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Level</InputLabel>
              <Select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                label="Level"
              >
                <MenuItem value="">All Levels</MenuItem>
                {Object.values(COURSE_LEVELS).map((level) => (
                  <MenuItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {Object.values(COURSE_CATEGORIES).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Price Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Price</InputLabel>
              <Select
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
                label="Price"
              >
                <MenuItem value="">All Prices</MenuItem>
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="under50">Under $50</MenuItem>
                <MenuItem value="under100">$50 - $100</MenuItem>
                <MenuItem value="over100">Over $100</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* View Mode Toggle */}
          <Grid item xs={12} md={1}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                size="small"
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('grid')}
                sx={{ minWidth: 'auto', p: 1, mr: 1 }}
              >
                <GridViewIcon />
              </Button>
              <Button
                size="small"
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('list')}
                sx={{ minWidth: 'auto', p: 1 }}
              >
                <ListViewIcon />
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Active Filters */}
        {hasActiveFilters && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {searchTerm && (
                <Chip
                  label={`Search: ${searchTerm}`}
                  onDelete={() => setSearchTerm('')}
                  size="small"
                />
              )}
              {filterLevel && (
                <Chip
                  label={`Level: ${filterLevel}`}
                  onDelete={() => setFilterLevel('')}
                  size="small"
                />
              )}
              {filterCategory && (
                <Chip
                  label={`Category: ${filterCategory}`}
                  onDelete={() => setFilterCategory('')}
                  size="small"
                />
              )}
              {filterPrice && (
                <Chip
                  label={`Price: ${filterPrice}`}
                  onDelete={() => setFilterPrice('')}
                  size="small"
                />
              )}
            </Stack>
          </Box>
        )}
      </Paper>
    );
  };

  const renderCourseGrid = () => {
    if (loading) {
      return (
        <Grid container spacing={3}>
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      );
    }

    if (paginatedCourses.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No courses found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search criteria or filters
          </Typography>
          {hasActiveFilters && (
            <Button onClick={clearFilters} sx={{ mt: 2 }}>
              Clear Filters
            </Button>
          )}
        </Box>
      );
    }

    const gridSize = viewMode === 'grid' ? { xs: 12, sm: 6, md: 4, lg: 3 } : { xs: 12 };

    return (
      <Grid container spacing={3}>
        {paginatedCourses.map((course) => (
          <Grid item {...gridSize} key={course.id}>
            <CourseCard
              course={course}
              isEnrolled={variant === 'enrolled'}
              showProgress={variant === 'enrolled'}
              variant={variant}
              onEnroll={onCourseEnroll}
              onBookmark={onCourseBookmark}
              isBookmarked={bookmarkedCourses.includes(course.id)}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
        </Typography>
      </Box>

      {/* Filters */}
      {renderFilters()}

      {/* Course Grid */}
      {renderCourseGrid()}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default CourseList;
// src/components/courses/CourseCard.jsx
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
  IconButton,
  Rating,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Star as StarIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDuration, capitalizeFirst } from '../../utils/helpers';
import { COURSE_LEVELS } from '../../utils/constants';

const CourseCard = ({
  course,
  isEnrolled = false,
  showProgress = false,
  onEnroll,
  onBookmark,
  isBookmarked = false,
  variant = 'default' // 'default', 'enrolled', 'created'
}) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const navigate = useNavigate();

  const handleEnroll = (e) => {
    e.stopPropagation();
    if (onEnroll) {
      onEnroll(course.id);
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
    if (onBookmark) {
      onBookmark(course.id, !bookmarked);
    }
  };

  const handleCardClick = () => {
    if (isEnrolled) {
      navigate(`/course/${course.id}/learn`);
    } else {
      navigate(`/course/${course.id}`);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case COURSE_LEVELS.BEGINNER:
        return 'success';
      case COURSE_LEVELS.INTERMEDIATE:
        return 'warning';
      case COURSE_LEVELS.ADVANCED:
        return 'error';
      case COURSE_LEVELS.EXPERT:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getActionButton = () => {
    if (variant === 'created') {
      return (
        <Button 
          variant="contained" 
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/tutor/course/${course.id}/edit`);
          }}
        >
          Edit Course
        </Button>
      );
    }

    if (isEnrolled) {
      return (
        <Button 
          variant="contained" 
          startIcon={<PlayIcon />}
          size="small"
          onClick={handleCardClick}
        >
          Continue
        </Button>
      );
    }

    return (
      <Button 
        variant="contained" 
        size="small"
        onClick={handleEnroll}
      >
        {course.price > 0 ? `$${course.price}` : 'Enroll Free'}
      </Button>
    );
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
      onClick={handleCardClick}
    >
      {/* Course Image */}
      <CardMedia
        component="img"
        height="160"
        image={course.thumbnail || '/api/placeholder/300/160'}
        alt={course.title}
        sx={{ 
          objectFit: 'cover',
          backgroundColor: 'grey.100'
        }}
      />

      <CardContent sx={{ 
        flexGrow: 1, 
        p: { xs: 1.5, sm: 2 },
        '&:last-child': { pb: { xs: 1.5, sm: 2 } }
      }}>
        {/* Header with bookmark */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Category and Level */}
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={course.category} 
                size="small" 
                variant="outlined"
              />
              <Chip 
                label={capitalizeFirst(course.level)} 
                size="small" 
                color={getLevelColor(course.level)}
              />
            </Box>

            {/* Title */}
            <Typography 
              variant="h6" 
              component="h3"
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.25rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
                mb: { xs: 0.5, sm: 1 }
              }}
            >
              {course.title}
            </Typography>
          </Box>

          {/* Bookmark button */}
          <Tooltip title={bookmarked ? 'Remove bookmark' : 'Bookmark course'}>
            <IconButton 
              size="small" 
              onClick={handleBookmark}
              sx={{ ml: 1, flexShrink: 0 }}
            >
              {bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Description */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2
          }}
        >
          {course.description}
        </Typography>

        {/* Progress bar for enrolled courses */}
        {showProgress && course.progress !== undefined && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {course.progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={course.progress}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        {/* Course metadata */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: { xs: 1, sm: 2 }, 
          mb: { xs: 1.5, sm: 2 }, 
          color: 'text.secondary' 
        }}>
          {/* Duration */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimeIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              {formatDuration(course.duration)}
            </Typography>
          </Box>

          {/* Students count */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              {course.studentsCount || 0} students
            </Typography>
          </Box>

          {/* Lessons count */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              {course.lessonsCount || 0} lessons
            </Typography>
          </Box>
        </Box>

        {/* Rating */}
        {course.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating 
              value={course.rating} 
              precision={0.1} 
              size="small" 
              readOnly 
            />
            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
              {course.rating} ({course.reviewsCount || 0} reviews)
            </Typography>
          </Box>
        )}

        {/* Instructor */}
        {course.instructor && course.instructor.name && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              src={course.instructor.avatar} 
              sx={{ width: 24, height: 24, mr: 1 }}
            >
              {course.instructor.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {course.instructor.name}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          {getActionButton()}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {course.price > 0 && !isEnrolled && variant !== 'created' && (
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                color="primary"
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                ${course.price}
              </Typography>
            )}
            
            {course.originalPrice && course.originalPrice > course.price && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    textDecoration: 'line-through', 
                    color: 'text.secondary',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  ${course.originalPrice}
                </Typography>
                <Chip 
                  label={`${Math.round((1 - course.price / course.originalPrice) * 100)}% OFF`}
                  size="small"
                  color="error"
                  sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};

export default CourseCard;
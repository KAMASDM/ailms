// src/components/dashboard/DashboardStats.jsx
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend = null, // { direction: 'up' | 'down' | 'neutral', value: number, period: string }
  progress = null, // { value: number, max: number }
  format = 'number' // 'number', 'currency', 'percentage'
}) => {
  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'down':
        return <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      default:
        return <RemoveIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text.secondary';
    
    switch (trend.direction) {
      case 'up':
        return 'success.main';
      case 'down':
        return 'error.main';
      default:
        return 'text.secondary';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, mr: 2 }}>
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {formatValue(value)}
            </Typography>
          </Box>
        </Box>

        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {getTrendIcon()}
            <Typography 
              variant="body2" 
              color={getTrendColor()}
              sx={{ ml: 0.5 }}
            >
              {trend.value > 0 ? '+' : ''}{trend.value}% {trend.period}
            </Typography>
          </Box>
        )}

        {progress && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress.value} / {progress.max}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(progress.value / progress.max) * 100}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardStats = ({ stats, type = 'student' }) => {
  if (type === 'student') {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Courses Enrolled"
            value={stats.coursesEnrolled || 0}
            icon="📚"
            color="primary"
            trend={stats.enrollmentTrend}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Courses Completed"
            value={stats.coursesCompleted || 0}
            icon="🎓"
            color="success"
            progress={{
              value: stats.coursesCompleted || 0,
              max: stats.coursesEnrolled || 1
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Points"
            value={stats.totalPoints || 0}
            icon="⭐"
            color="warning"
            trend={stats.pointsTrend}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Learning Streak"
            value={stats.streakDays || 0}
            subtitle="days in a row"
            icon="🔥"
            color="error"
            trend={stats.streakTrend}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Badges Earned"
            value={stats.badgesEarned || 0}
            icon="🏆"
            color="secondary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Score"
            value={stats.averageScore || 0}
            format="percentage"
            icon="📊"
            color="info"
            trend={stats.scoreTrend}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Study Hours"
            value={stats.studyHours || 0}
            subtitle="this month"
            icon="⏱️"
            color="primary"
            trend={stats.studyTimeTrend}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Assignments Due"
            value={stats.assignmentsDue || 0}
            subtitle="next 7 days"
            icon="📋"
            color="warning"
          />
        </Grid>
      </Grid>
    );
  }

  // Tutor stats
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          icon="👥"
          color="primary"
          trend={stats.studentsTrend}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Active Courses"
          value={stats.activeCourses || 0}
          icon="📚"
          color="secondary"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue || 0}
          format="currency"
          icon="💰"
          color="success"
          trend={stats.revenueTrend}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Average Rating"
          value={stats.averageRating || 0}
          icon="⭐"
          color="warning"
          trend={stats.ratingTrend}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Course Completions"
          value={stats.courseCompletions || 0}
          subtitle="this month"
          icon="🎯"
          color="success"
          trend={stats.completionsTrend}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="New Enrollments"
          value={stats.newEnrollments || 0}
          subtitle="this month"
          icon="📈"
          color="info"
          trend={stats.enrollmentsTrend}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews || 0}
          icon="💬"
          color="primary"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Monthly Earnings"
          value={stats.monthlyEarnings || 0}
          format="currency"
          icon="📊"
          color="success"
          trend={stats.earningsTrend}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStats;
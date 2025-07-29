// src/components/planning/StudyPlanner.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Paper,
  LinearProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Event as EventIcon,
  School as CourseIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CompleteIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Repeat as RepeatIcon,
  Flag as PriorityIcon
} from '@mui/icons-material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { PageHeader } from '../common';
import { formatDate, formatTime } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

// Note: In a real implementation, you'd install react-big-calendar and moment
// For now, we'll create a simple calendar placeholder
const SimpleCalendar = ({ events, onSelectEvent, onSelectSlot }) => (
  <Box sx={{ 
    height: 400, 
    border: 1, 
    borderColor: 'divider', 
    borderRadius: 1,
    p: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'grey.50'
  }}>
    <Typography variant="body1" color="text.secondary">
      Calendar component would be rendered here
      <br />
      (Install react-big-calendar for full functionality)
    </Typography>
  </Box>
);

const StudyPlanner = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [studyPlans, setStudyPlans] = useState([]);
  const [studyGoals, setStudyGoals] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [createPlanDialog, setCreatePlanDialog] = useState(false);
  const [createGoalDialog, setCreateGoalDialog] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    courseId: '',
    startDate: '',
    endDate: '',
    dailyHours: 1,
    priority: 'medium',
    notifications: true
  });
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'course',
    priority: 'medium',
    isCompleted: false
  });

  useEffect(() => {
    loadStudyData();
  }, []);

  const loadStudyData = async () => {
    // Mock study plans data
    const mockPlans = [
      {
        id: 1,
        title: 'Deep Learning Mastery',
        description: 'Complete deep learning fundamentals course',
        courseId: 1,
        courseName: 'Deep Learning Fundamentals',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        dailyHours: 2,
        priority: 'high',
        notifications: true,
        progress: 65,
        totalTasks: 20,
        completedTasks: 13,
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        title: 'Computer Vision Project',
        description: 'Build CNN for image classification',
        courseId: 2,
        courseName: 'Computer Vision Basics',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        dailyHours: 1.5,
        priority: 'medium',
        notifications: false,
        progress: 0,
        totalTasks: 15,
        completedTasks: 0,
        createdAt: new Date('2024-01-20')
      }
    ];

    const mockGoals = [
      {
        id: 1,
        title: 'Complete Neural Networks Chapter',
        description: 'Finish reading and understand backpropagation',
        targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        category: 'study',
        priority: 'high',
        isCompleted: false,
        createdAt: new Date('2024-01-22')
      },
      {
        id: 2,
        title: 'Score 90% on Quiz 3',
        description: 'Achieve excellent score on deep learning quiz',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        category: 'assessment',
        priority: 'high',
        isCompleted: false,
        createdAt: new Date('2024-01-21')
      },
      {
        id: 3,
        title: 'Submit Final Project',
        description: 'Complete and submit the capstone project',
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        category: 'project',
        priority: 'medium',
        isCompleted: true,
        createdAt: new Date('2024-01-10')
      }
    ];

    const mockEvents = [
      {
        id: 1,
        title: 'Study Session: Neural Networks',
        start: new Date(),
        end: new Date(Date.now() + 2 * 60 * 60 * 1000),
        type: 'study',
        courseId: 1
      },
      {
        id: 2,
        title: 'Quiz: Deep Learning Basics',
        start: new Date(Date.now() + 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        type: 'assessment',
        courseId: 1
      }
    ];

    setStudyPlans(mockPlans);
    setStudyGoals(mockGoals);
    setCalendarEvents(mockEvents);
  };

  const handleCreatePlan = () => {
    const plan = {
      id: Date.now(),
      ...newPlan,
      startDate: new Date(newPlan.startDate),
      endDate: new Date(newPlan.endDate),
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      createdAt: new Date()
    };

    setStudyPlans(prev => [...prev, plan]);
    setCreatePlanDialog(false);
    setNewPlan({
      title: '',
      description: '',
      courseId: '',
      startDate: '',
      endDate: '',
      dailyHours: 1,
      priority: 'medium',
      notifications: true
    });
  };

  const handleCreateGoal = () => {
    const goal = {
      id: Date.now(),
      ...newGoal,
      targetDate: new Date(newGoal.targetDate),
      createdAt: new Date()
    };

    setStudyGoals(prev => [...prev, goal]);
    setCreateGoalDialog(false);
    setNewGoal({
      title: '',
      description: '',
      targetDate: '',
      category: 'course',
      priority: 'medium',
      isCompleted: false
    });
  };

  const handleToggleGoal = (goalId) => {
    setStudyGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, isCompleted: !goal.isCompleted }
        : goal
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'course': return <CourseIcon />;
      case 'study': return <ScheduleIcon />;
      case 'assessment': return <QuizIcon />;
      case 'project': return <AssignmentIcon />;
      default: return <EventIcon />;
    }
  };

  const renderStudyPlan = (plan) => (
    <Card key={plan.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {plan.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {plan.description}
            </Typography>
            <Chip 
              label={plan.courseName} 
              size="small" 
              variant="outlined" 
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={plan.priority} 
              color={getPriorityColor(plan.priority)}
              size="small"
            />
            {plan.notifications && (
              <NotificationIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            )}
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2">
              {plan.completedTasks}/{plan.totalTasks} tasks ({plan.progress}%)
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={plan.progress} 
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {plan.dailyHours}h/day
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" startIcon={<EditIcon />}>
            Edit
          </Button>
          <Button size="small" startIcon={<ScheduleIcon />}>
            Schedule
          </Button>
          <IconButton size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  const renderStudyGoal = (goal) => (
    <ListItem key={goal.id}>
      <ListItemIcon>
        <Checkbox
          checked={goal.isCompleted}
          onChange={() => handleToggleGoal(goal.id)}
        />
      </ListItemIcon>
      
      <ListItemIcon>
        {getCategoryIcon(goal.category)}
      </ListItemIcon>

      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                textDecoration: goal.isCompleted ? 'line-through' : 'none',
                opacity: goal.isCompleted ? 0.6 : 1
              }}
            >
              {goal.title}
            </Typography>
            <Chip 
              label={goal.priority}
              color={getPriorityColor(goal.priority)}
              size="small"
            />
          </Box>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary">
              {goal.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Due: {formatDate(goal.targetDate)}
            </Typography>
          </Box>
        }
      />

      <ListItemSecondaryAction>
        <IconButton size="small">
          <EditIcon />
        </IconButton>
        <IconButton size="small">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <Box>
      <PageHeader
        title="Study Planner"
        subtitle="Plan your learning schedule and track your goals"
        actions={[
          {
            label: 'Add Plan',
            icon: <AddIcon />,
            onClick: () => setCreatePlanDialog(true),
            variant: 'outlined'
          },
          {
            label: 'Add Goal',
            icon: <AddIcon />,
            onClick: () => setCreateGoalDialog(true),
            variant: 'contained'
          }
        ]}
      />

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
          <Tab label="Overview" />
          <Tab label="Study Plans" />
          <Tab label="Goals" />
          <Tab label="Calendar" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {studyPlans.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Plans
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CompleteIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {studyGoals.filter(g => g.isCompleted).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Goals Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <EventIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {calendarEvents.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Scheduled Events
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Goals */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Goals
                </Typography>
                <List>
                  {studyGoals
                    .filter(goal => !goal.isCompleted)
                    .slice(0, 3)
                    .map(renderStudyGoal)}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Study Progress
                </Typography>
                {studyPlans.slice(0, 2).map(renderStudyPlan)}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Box>
          {studyPlans.length === 0 ? (
            <Alert severity="info">
              <Typography variant="body1" gutterBottom>
                No study plans yet.
              </Typography>
              <Typography variant="body2">
                Create your first study plan to organize your learning schedule.
              </Typography>
            </Alert>
          ) : (
            studyPlans.map(renderStudyPlan)
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Study Goals
            </Typography>
            {studyGoals.length === 0 ? (
              <Alert severity="info">
                No goals set yet. Add some goals to track your progress!
              </Alert>
            ) : (
              <List>
                {studyGoals.map(renderStudyGoal)}
              </List>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Study Calendar
            </Typography>
            <SimpleCalendar 
              events={calendarEvents}
              onSelectEvent={(event) => console.log('Selected event:', event)}
              onSelectSlot={(slot) => console.log('Selected slot:', slot)}
            />
          </CardContent>
        </Card>
      )}

      {/* Create Plan Dialog */}
      <Dialog
        open={createPlanDialog}
        onClose={() => setCreatePlanDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Study Plan</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Plan Title"
            value={newPlan.title}
            onChange={(e) => setNewPlan(prev => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 2, mt: 1 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={newPlan.description}
            onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Course</InputLabel>
            <Select
              value={newPlan.courseId}
              onChange={(e) => setNewPlan(prev => ({ ...prev, courseId: e.target.value }))}
              label="Course"
            >
              <MenuItem value="1">Deep Learning Fundamentals</MenuItem>
              <MenuItem value="2">Computer Vision Basics</MenuItem>
              <MenuItem value="3">NLP Basics</MenuItem>
            </Select>
          </FormControl>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={newPlan.startDate}
                onChange={(e) => setNewPlan(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={newPlan.endDate}
                onChange={(e) => setNewPlan(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Daily Hours"
                value={newPlan.dailyHours}
                onChange={(e) => setNewPlan(prev => ({ ...prev, dailyHours: parseFloat(e.target.value) }))}
                inputProps={{ min: 0.5, max: 12, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newPlan.priority}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, priority: e.target.value }))}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Switch
                checked={newPlan.notifications}
                onChange={(e) => setNewPlan(prev => ({ ...prev, notifications: e.target.checked }))}
              />
            }
            label="Enable Notifications"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreatePlanDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreatePlan}
            variant="contained"
            disabled={!newPlan.title || !newPlan.startDate || !newPlan.endDate}
          >
            Create Plan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Goal Dialog */}
      <Dialog
        open={createGoalDialog}
        onClose={() => setCreateGoalDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Study Goal</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Goal Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 2, mt: 1 }}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Description"
            value={newGoal.description}
            onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="date"
            label="Target Date"
            value={newGoal.targetDate}
            onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                  label="Category"
                >
                  <MenuItem value="course">Course</MenuItem>
                  <MenuItem value="study">Study</MenuItem>
                  <MenuItem value="assessment">Assessment</MenuItem>
                  <MenuItem value="project">Project</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateGoalDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateGoal}
            variant="contained"
            disabled={!newGoal.title || !newGoal.targetDate}
          >
            Add Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyPlanner;
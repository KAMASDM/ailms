// src/components/settings/UserSettings.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  Alert,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon,
  Language as LanguageIcon,
  Storage as DataIcon,
  CameraAlt as CameraIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { PageHeader } from '../common';
import { useAuth } from '../../hooks/useAuth';

const UserSettings = ({ variant = 'student' }) => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
    linkedIn: '',
    twitter: '',
    specializations: [],
    experience: '',
    education: ''
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    quizReminders: true,
    achievementAlerts: true,
    communityMessages: true,
    weeklyDigest: true,
    marketingEmails: false
  });

  // Privacy & Security Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', // public, friends, private
    showProgress: true,
    showAchievements: true,
    allowMessages: true,
    twoFactorAuth: false,
    sessionTimeout: 60, // minutes
    dataSharing: false
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: 'system', // light, dark, system
    language: 'en',
    fontSize: 'medium', // small, medium, large
    reducedMotion: false,
    compactMode: false
  });

  // Learning Preferences (Student specific)
  const [learningPrefs, setLearningPrefs] = useState({
    defaultVideoSpeed: 1.0,
    autoplay: true,
    showTranscripts: true,
    practiceReminders: true,
    studyGoalHours: 2,
    preferredStudyTime: 'evening',
    difficultyPreference: 'adaptive'
  });

  // Teaching Preferences (Tutor specific)
  const [teachingPrefs, setTeachingPrefs] = useState({
    allowStudentMessages: true,
    autoApproveEnrollments: false,
    sendCourseUpdates: true,
    weeklyAnalytics: true,
    studentProgressAlerts: true,
    paymentNotifications: true
  });

  useEffect(() => {
    loadUserSettings();
  }, [user]);

  const loadUserSettings = async () => {
    // Mock loading user settings - replace with actual API call
    try {
      // Load saved settings from localStorage or API
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setNotifications(prev => ({ ...prev, ...settings.notifications }));
        setPrivacy(prev => ({ ...prev, ...settings.privacy }));
        setAppearance(prev => ({ ...prev, ...settings.appearance }));
        setLearningPrefs(prev => ({ ...prev, ...settings.learningPrefs }));
        setTeachingPrefs(prev => ({ ...prev, ...settings.teachingPrefs }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async (category) => {
    setLoading(true);
    try {
      const settings = {
        notifications,
        privacy,
        appearance,
        learningPrefs,
        teachingPrefs
      };

      // Save to localStorage and/or API
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      await updateProfile(profileData);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage('Error updating profile. Please try again.');
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle avatar upload
      console.log('Avatar file selected:', file);
    }
  };

  const renderProfileSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                src={user?.photoURL}
                sx={{ width: 120, height: 120, mx: 'auto' }}
              >
                {user?.displayName?.charAt(0)}
              </Avatar>
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <CameraIcon />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </IconButton>
            </Box>
            <Typography variant="h6">{user?.displayName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={profileData.linkedIn}
                  onChange={(e) => setProfileData(prev => ({ ...prev, linkedIn: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Twitter"
                  value={profileData.twitter}
                  onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
                />
              </Grid>
              
              {variant === 'tutor' && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Experience"
                      value={profileData.experience}
                      onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="Describe your teaching/professional experience..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Education"
                      value={profileData.education}
                      onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleProfileSave}
                disabled={loading}
              >
                Save Profile
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderNotificationSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notification Preferences
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive notifications via email"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={notifications.emailNotifications}
                onChange={(e) => setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Push Notifications"
              secondary="Browser push notifications"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={notifications.pushNotifications}
                onChange={(e) => setNotifications(prev => ({ ...prev, pushNotifications: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Course Updates"
              secondary="New lessons and course announcements"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={notifications.courseUpdates}
                onChange={(e) => setNotifications(prev => ({ ...prev, courseUpdates: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Quiz Reminders"
              secondary="Upcoming quiz and deadline reminders"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={notifications.quizReminders}
                onChange={(e) => setNotifications(prev => ({ ...prev, quizReminders: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Achievement Alerts"
              secondary="New badges and milestone notifications"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={notifications.achievementAlerts}
                onChange={(e) => setNotifications(prev => ({ ...prev, achievementAlerts: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Community Messages"
              secondary="Direct messages and mentions"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={notifications.communityMessages}
                onChange={(e) => setNotifications(prev => ({ ...prev, communityMessages: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Weekly Digest"
              secondary="Weekly summary of your progress"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={notifications.weeklyDigest}
                onChange={(e) => setNotifications(prev => ({ ...prev, weeklyDigest: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Marketing Emails"
              secondary="Product updates and promotional content"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={notifications.marketingEmails}
                onChange={(e) => setNotifications(prev => ({ ...prev, marketingEmails: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => handleSaveSettings('notifications')}
            disabled={loading}
          >
            Save Notification Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderPrivacySettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Privacy & Security
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Profile Visibility</InputLabel>
              <Select
                value={privacy.profileVisibility}
                onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                label="Profile Visibility"
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="friends">Friends Only</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Session Timeout (minutes)
            </Typography>
            <Slider
              value={privacy.sessionTimeout}
              onChange={(e, value) => setPrivacy(prev => ({ ...prev, sessionTimeout: value }))}
              min={15}
              max={480}
              step={15}
              valueLabelDisplay="auto"
              marks={[
                { value: 15, label: '15m' },
                { value: 60, label: '1h' },
                { value: 240, label: '4h' },
                { value: 480, label: '8h' }
              ]}
            />
          </Grid>
        </Grid>

        <List>
          <ListItem>
            <ListItemText
              primary="Show Learning Progress"
              secondary="Allow others to see your course progress"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={privacy.showProgress}
                onChange={(e) => setPrivacy(prev => ({ ...prev, showProgress: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Show Achievements"
              secondary="Display your badges and achievements publicly"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={privacy.showAchievements}
                onChange={(e) => setPrivacy(prev => ({ ...prev, showAchievements: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Allow Direct Messages"
              secondary="Let other users send you messages"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={privacy.allowMessages}
                onChange={(e) => setPrivacy(prev => ({ ...prev, allowMessages: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Two-Factor Authentication"
              secondary="Add an extra layer of security to your account"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={privacy.twoFactorAuth}
                onChange={(e) => setPrivacy(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Data Sharing for Research"
              secondary="Allow anonymous usage data to improve the platform"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={privacy.dataSharing}
                onChange={(e) => setPrivacy(prev => ({ ...prev, dataSharing: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => handleSaveSettings('privacy')}
            disabled={loading}
          >
            Save Privacy Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderAppearanceSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Appearance & Accessibility
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select
                value={appearance.theme}
                onChange={(e) => setAppearance(prev => ({ ...prev, theme: e.target.value }))}
                label="Theme"
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={appearance.language}
                onChange={(e) => setAppearance(prev => ({ ...prev, language: e.target.value }))}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="de">Deutsch</MenuItem>
                <MenuItem value="zh">中文</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Font Size</InputLabel>
              <Select
                value={appearance.fontSize}
                onChange={(e) => setAppearance(prev => ({ ...prev, fontSize: e.target.value }))}
                label="Font Size"
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <List>
          <ListItem>
            <ListItemText
              primary="Reduced Motion"
              secondary="Minimize animations and transitions"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={appearance.reducedMotion}
                onChange={(e) => setAppearance(prev => ({ ...prev, reducedMotion: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Compact Mode"
              secondary="Use more compact layouts to fit more content"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={appearance.compactMode}
                onChange={(e) => setAppearance(prev => ({ ...prev, compactMode: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => handleSaveSettings('appearance')}
            disabled={loading}
          >
            Save Appearance Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderLearningSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Learning Preferences
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Default Video Playback Speed
            </Typography>
            <Slider
              value={learningPrefs.defaultVideoSpeed}
              onChange={(e, value) => setLearningPrefs(prev => ({ ...prev, defaultVideoSpeed: value }))}
              min={0.5}
              max={2.0}
              step={0.25}
              valueLabelDisplay="auto"
              marks={[
                { value: 0.5, label: '0.5x' },
                { value: 1.0, label: '1x' },
                { value: 1.5, label: '1.5x' },
                { value: 2.0, label: '2x' }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Daily Study Goal (hours)
            </Typography>
            <Slider
              value={learningPrefs.studyGoalHours}
              onChange={(e, value) => setLearningPrefs(prev => ({ ...prev, studyGoalHours: value }))}
              min={0.5}
              max={8}
              step={0.5}
              valueLabelDisplay="auto"
              marks={[
                { value: 1, label: '1h' },
                { value: 2, label: '2h' },
                { value: 4, label: '4h' },
                { value: 8, label: '8h' }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Preferred Study Time</InputLabel>
              <Select
                value={learningPrefs.preferredStudyTime}
                onChange={(e) => setLearningPrefs(prev => ({ ...prev, preferredStudyTime: e.target.value }))}
                label="Preferred Study Time"
              >
                <MenuItem value="morning">Morning (6-12 PM)</MenuItem>
                <MenuItem value="afternoon">Afternoon (12-6 PM)</MenuItem>
                <MenuItem value="evening">Evening (6-10 PM)</MenuItem>
                <MenuItem value="night">Night (10 PM-2 AM)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Difficulty Preference</InputLabel>
              <Select
                value={learningPrefs.difficultyPreference}
                onChange={(e) => setLearningPrefs(prev => ({ ...prev, difficultyPreference: e.target.value }))}
                label="Difficulty Preference"
              >
                <MenuItem value="easy">Start Easy</MenuItem>
                <MenuItem value="adaptive">Adaptive</MenuItem>
                <MenuItem value="challenging">Challenging</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <List>
          <ListItem>
            <ListItemText
              primary="Auto-play Next Video"
              secondary="Automatically play the next lesson"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={learningPrefs.autoplay}
                onChange={(e) => setLearningPrefs(prev => ({ ...prev, autoplay: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Show Video Transcripts"
              secondary="Display transcripts while watching videos"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={learningPrefs.showTranscripts}
                onChange={(e) => setLearningPrefs(prev => ({ ...prev, showTranscripts: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Practice Reminders"
              secondary="Send reminders to practice what you've learned"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={learningPrefs.practiceReminders}
                onChange={(e) => setLearningPrefs(prev => ({ ...prev, practiceReminders: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => handleSaveSettings('learning')}
            disabled={loading}
          >
            Save Learning Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderTeachingSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Teaching Preferences
        </Typography>

        <List>
          <ListItem>
            <ListItemText
              primary="Allow Student Messages"
              secondary="Let students send you direct messages"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={teachingPrefs.allowStudentMessages}
                onChange={(e) => setTeachingPrefs(prev => ({ ...prev, allowStudentMessages: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Auto-approve Enrollments"
              secondary="Automatically approve student enrollments"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={teachingPrefs.autoApproveEnrollments}
                onChange={(e) => setTeachingPrefs(prev => ({ ...prev, autoApproveEnrollments: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Send Course Updates"
              secondary="Notify students when you update course content"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={teachingPrefs.sendCourseUpdates}
                onChange={(e) => setTeachingPrefs(prev => ({ ...prev, sendCourseUpdates: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Weekly Analytics Reports"
              secondary="Receive weekly reports on course performance"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={teachingPrefs.weeklyAnalytics}
                onChange={(e) => setTeachingPrefs(prev => ({ ...prev, weeklyAnalytics: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Student Progress Alerts"
              secondary="Get notified when students complete milestones"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={teachingPrefs.studentProgressAlerts}
                onChange={(e) => setTeachingPrefs(prev => ({ ...prev, studentProgressAlerts: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Payment Notifications"
              secondary="Receive notifications for earnings and payments"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={teachingPrefs.paymentNotifications}
                onChange={(e) => setTeachingPrefs(prev => ({ ...prev, paymentNotifications: e.target.checked }))}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => handleSaveSettings('teaching')}
            disabled={loading}
          >
            Save Teaching Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderDataSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Data & Account Management
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Manage your data and account preferences. Some actions cannot be undone.
        </Alert>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<DataIcon />}
            >
              Download My Data
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<DeleteIcon />}
            >
              Clear Learning History
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CancelIcon />}
            >
              Deactivate Account
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteAccountDialog(true)}
            >
              Delete Account
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const getTabLabel = (index) => {
    const labels = ['Profile', 'Notifications', 'Privacy', 'Appearance'];
    if (variant === 'student') {
      labels.push('Learning', 'Data');
    } else {
      labels.push('Teaching', 'Data');
    }
    return labels[index];
  };

  const getTabIcon = (index) => {
    const icons = [<PersonIcon />, <NotificationIcon />, <SecurityIcon />, <ThemeIcon />];
    if (variant === 'student') {
      icons.push(<LanguageIcon />, <DataIcon />);
    } else {
      icons.push(<LanguageIcon />, <DataIcon />);
    }
    return icons[index];
  };

  return (
    <Box>
      <PageHeader
        title="Settings"
        subtitle={`Manage your ${variant} account settings and preferences`}
      />

      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} variant="scrollable">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Tab
              key={index}
              icon={getTabIcon(index)}
              label={getTabLabel(index)}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {activeTab === 0 && renderProfileSettings()}
        {activeTab === 1 && renderNotificationSettings()}
        {activeTab === 2 && renderPrivacySettings()}
        {activeTab === 3 && renderAppearanceSettings()}
        {activeTab === 4 && (variant === 'student' ? renderLearningSettings() : renderTeachingSettings())}
        {activeTab === 5 && renderDataSettings()}
      </Box>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteAccountDialog}
        onClose={() => setDeleteAccountDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>Warning:</strong> This action cannot be undone.
          </Alert>
          <Typography variant="body1" gutterBottom>
            Deleting your account will permanently remove:
          </Typography>
          <ul>
            <li>Your profile and account information</li>
            <li>All course progress and achievements</li>
            <li>Saved bookmarks and preferences</li>
            <li>Messages and communication history</li>
            {variant === 'tutor' && <li>Created courses and student data</li>}
          </ul>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Type "DELETE" to confirm account deletion:
          </Typography>
          <TextField
            fullWidth
            placeholder="Type DELETE to confirm"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountDialog(false)}>
            Cancel
          </Button>
          <Button color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserSettings;
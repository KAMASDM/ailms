// src/hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import userService from '../services/userService';

export const useUserProfile = (userId = null) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useSelector(state => state.auth);
  
  const targetUserId = userId || currentUser?.uid;

  const fetchProfile = useCallback(async () => {
    if (!targetUserId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await userService.getUserProfile(targetUserId);
      
      if (result.success) {
        setProfile(result.user);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refetch = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch
  };
};

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.updateUserProfile(user.uid, updates);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const uploadProfilePicture = useCallback(async (file) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.uploadProfilePicture(user.uid, file);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateEmail = useCallback(async (newEmail) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.updateUserEmail(newEmail);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.updateUserPassword(newPassword);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateProfile,
    uploadProfilePicture,
    updateEmail,
    updatePassword,
    loading,
    error
  };
};

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  const fetchBookmarks = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await userService.getBookmarks(user.uid);
      
      if (result.success) {
        setBookmarks(result.bookmarks);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const addBookmark = useCallback(async (courseId, type = 'course') => {
    try {
      setError(null);
      const result = await userService.addBookmark(user.uid, courseId, type);
      
      if (result.success) {
        fetchBookmarks(); // Refresh bookmarks
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [user, fetchBookmarks]);

  const removeBookmark = useCallback(async (courseId) => {
    try {
      setError(null);
      const result = await userService.removeBookmark(user.uid, courseId);
      
      if (result.success) {
        fetchBookmarks(); // Refresh bookmarks
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [user, fetchBookmarks]);

  const isBookmarked = useCallback((courseId) => {
    return bookmarks.some(bookmark => bookmark.id === courseId);
  }, [bookmarks]);

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    removeBookmark,
    isBookmarked,
    refetch: fetchBookmarks
  };
};

export const useNotifications = (limit = 20) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useSelector(state => state.auth);

  const fetchNotifications = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await userService.getNotifications(user.uid, limit);
      
      if (result.success) {
        setNotifications(result.notifications);
        setUnreadCount(result.notifications.filter(n => !n.read).length);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      setError(null);
      const result = await userService.markNotificationAsRead(notificationId);
      
      if (result.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      setError(null);
      const result = await userService.markAllNotificationsAsRead(user.uid);
      
      if (result.success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};

export const useUserProgress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  const updateStreak = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.updateLearningStreak(user.uid);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addPoints = useCallback(async (points, reason) => {
    try {
      setError(null);
      
      const result = await userService.addPoints(user.uid, points, reason);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [user]);

  const addBadge = useCallback(async (badge) => {
    try {
      setError(null);
      
      const result = await userService.addBadge(user.uid, badge);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [user]);

  return {
    updateStreak,
    addPoints,
    addBadge,
    loading,
    error
  };
};

export const useUserSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  const fetchSettings = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await userService.getSettings(user.uid);
      
      if (result.success) {
        setSettings(result.settings);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (newSettings) => {
    try {
      setError(null);
      const result = await userService.updateSettings(user.uid, newSettings);
      
      if (result.success) {
        setSettings(newSettings);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [user]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
};

export const useUserStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  const fetchStats = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await userService.getUserStats(user.uid);
      
      if (result.success) {
        setStats(result.stats);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

export const useLeaderboard = (limit = 10) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await userService.getLeaderboard(limit);
      
      if (result.success) {
        setLeaderboard(result.leaderboard);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    loading,
    error,
    refetch: fetchLeaderboard
  };
};

export const useSearchUsers = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchUsers = useCallback(async (searchTerm, userType = null, limit = 20) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.searchUsers(searchTerm, userType, limit);
      
      if (result.success) {
        setResults(result.users);
      } else {
        setError(result.error);
        setResults([]);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      setResults([]);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchUsers,
    results,
    loading,
    error
  };
};
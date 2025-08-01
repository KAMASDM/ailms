// src/services/userService.js
import {
  doc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile, updateEmail, updatePassword, sendEmailVerification } from 'firebase/auth';
import { db, storage, auth } from './firebase';

class UserService {
  constructor() {
    this.usersCollection = 'users';
    this.bookmarksCollection = 'bookmarks';
    this.notificationsCollection = 'notifications';
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const userRef = doc(db, this.usersCollection, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Update Firebase Auth profile if needed
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === userId) {
        const authUpdates = {};
        if (updates.displayName) {
          authUpdates.displayName = updates.displayName;
        }
        if (updates.photoURL) {
          authUpdates.photoURL = updates.photoURL;
        }
        
        if (Object.keys(authUpdates).length > 0) {
          await updateProfile(currentUser, authUpdates);
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, this.usersCollection, userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Convert timestamps
        if (userData.createdAt?.toDate) {
          userData.createdAt = userData.createdAt.toDate().toISOString();
        }
        if (userData.updatedAt?.toDate) {
          userData.updatedAt = userData.updatedAt.toDate().toISOString();
        }
        return { success: true, user: { id: userDoc.id, ...userData } };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Upload profile picture
  async uploadProfilePicture(userId, file) {
    try {
      const storageRef = ref(storage, `users/${userId}/profile/${Date.now()}_${file.name}`);
      
      // Set metadata for storage rules
      const metadata = {
        customMetadata: {
          userId: userId,
          uploadedAt: new Date().toISOString()
        }
      };
      
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update user profile with new photo URL
      await this.updateUserProfile(userId, { photoURL: downloadURL });
      
      return { success: true, url: downloadURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update email
  async updateUserEmail(newEmail) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      await updateEmail(currentUser, newEmail);
      
      // Update in Firestore
      await this.updateUserProfile(currentUser.uid, { email: newEmail });
      
      // Send verification email
      await sendEmailVerification(currentUser);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update password
  async updateUserPassword(newPassword) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      await updatePassword(currentUser, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Bookmark management
  async addBookmark(userId, courseId, type = 'course') {
    try {
      const userRef = doc(db, this.usersCollection, userId);
      await updateDoc(userRef, {
        [`progress.bookmarks`]: arrayUnion({
          id: courseId,
          type,
          addedAt: new Date().toISOString()
        })
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async removeBookmark(userId, courseId) {
    try {
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile.success) {
        return userProfile;
      }

      const bookmarks = userProfile.user.progress?.bookmarks || [];
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== courseId);

      const userRef = doc(db, this.usersCollection, userId);
      await updateDoc(userRef, {
        'progress.bookmarks': updatedBookmarks
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getBookmarks(userId) {
    try {
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile.success) {
        return userProfile;
      }

      const bookmarks = userProfile.user.progress?.bookmarks || [];
      return { success: true, bookmarks };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Notifications management
  async createNotification(userId, notification) {
    try {
      const notificationData = {
        userId,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info', // info, success, warning, error
        read: false,
        createdAt: serverTimestamp(),
        data: notification.data || null // Additional data like courseId, quizId, etc.
      };

      await addDoc(collection(db, this.notificationsCollection), notificationData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getNotifications(userId, limit = 20) {
    try {
      const notificationsQuery = query(
        collection(db, this.notificationsCollection),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(notificationsQuery);
      const notifications = snapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        if (data.createdAt?.toDate) {
          data.createdAt = data.createdAt.toDate().toISOString();
        }
        return data;
      });

      return { success: true, notifications };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const notificationRef = doc(db, this.notificationsCollection, notificationId);
      await updateDoc(notificationRef, { read: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async markAllNotificationsAsRead(userId) {
    try {
      const notificationsQuery = query(
        collection(db, this.notificationsCollection),
        where('userId', '==', userId),
        where('read', '==', false)
      );

      const snapshot = await getDocs(notificationsQuery);
      const updatePromises = snapshot.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      );

      await Promise.all(updatePromises);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Progress tracking
  async updateLearningStreak(userId) {
    try {
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile.success) {
        return userProfile;
      }

      const user = userProfile.user;
      const today = new Date().toDateString();
      const lastActivity = user.progress?.lastActivity;
      const currentStreak = user.progress?.streakDays || 0;

      let newStreak = currentStreak;

      if (lastActivity) {
        const lastActivityDate = new Date(lastActivity).toDateString();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

        if (lastActivityDate === today) {
          // Already counted today
          return { success: true, streak: currentStreak };
        } else if (lastActivityDate === yesterday) {
          // Consecutive day
          newStreak = currentStreak + 1;
        } else {
          // Streak broken
          newStreak = 1;
        }
      } else {
        // First activity
        newStreak = 1;
      }

      await this.updateUserProfile(userId, {
        'progress.streakDays': newStreak,
        'progress.lastActivity': today
      });

      return { success: true, streak: newStreak };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async addPoints(userId, points, reason = 'Activity completed') {
    try {
      const userRef = doc(db, this.usersCollection, userId);
      await updateDoc(userRef, {
        'progress.totalPoints': increment(points)
      });

      // Create notification
      await this.createNotification(userId, {
        title: 'Points Earned!',
        message: `You earned ${points} points for ${reason}`,
        type: 'success'
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async addBadge(userId, badge) {
    try {
      const userRef = doc(db, this.usersCollection, userId);
      await updateDoc(userRef, {
        'progress.badges': arrayUnion({
          ...badge,
          earnedAt: new Date().toISOString()
        })
      });

      // Create notification
      await this.createNotification(userId, {
        title: 'New Badge Earned!',
        message: `Congratulations! You earned the "${badge.name}" badge`,
        type: 'success',
        data: { badge }
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Settings management
  async updateSettings(userId, settings) {
    try {
      const userRef = doc(db, this.usersCollection, userId);
      await updateDoc(userRef, {
        'preferences': {
          ...settings,
          updatedAt: new Date().toISOString()
        }
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getSettings(userId) {
    try {
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile.success) {
        return userProfile;
      }

      const settings = userProfile.user.preferences || {
        notifications: true,
        darkMode: false,
        language: 'en',
        emailNotifications: true,
        pushNotifications: true,
        studyReminders: true
      };

      return { success: true, settings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Search users (for tutors or admin features)
  async searchUsers(searchTerm, userType = null, limit = 20) {
    try {
      let q = collection(db, this.usersCollection);
      const conditions = [];

      if (userType) {
        conditions.push(where('userType', '==', userType));
      }

      if (conditions.length > 0) {
        q = query(q, ...conditions, orderBy('displayName'), limit(limit));
      } else {
        q = query(q, orderBy('displayName'), limit(limit));
      }

      const snapshot = await getDocs(q);
      let users = snapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        // Remove sensitive data
        delete data.preferences;
        delete data.progress;
        return data;
      });

      // Client-side filtering for name search (Firestore limitation)
      if (searchTerm) {
        users = users.filter(user => 
          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return { success: true, users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get user stats for dashboard
  async getUserStats(userId) {
    try {
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile.success) {
        return userProfile;
      }

      const user = userProfile.user;
      const progress = user.progress || {};

      const stats = {
        totalPoints: progress.totalPoints || 0,
        streakDays: progress.streakDays || 0,
        coursesEnrolled: progress.coursesEnrolled?.length || 0,
        coursesCompleted: progress.coursesCompleted?.length || 0,
        badges: progress.badges?.length || 0,
        lastActivity: progress.lastActivity || null
      };

      return { success: true, stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Leaderboard
  async getLeaderboard(limit = 10) {
    try {
      const usersQuery = query(
        collection(db, this.usersCollection),
        orderBy('progress.totalPoints', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(usersQuery);
      const leaderboard = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          rank: index + 1,
          userId: doc.id,
          displayName: data.displayName,
          photoURL: data.photoURL,
          totalPoints: data.progress?.totalPoints || 0,
          badges: data.progress?.badges?.length || 0
        };
      });

      return { success: true, leaderboard };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new UserService();
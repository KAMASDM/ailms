// src/services/gamificationService.js
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  arrayUnion
} from 'firebase/firestore';
import { db } from './firebase';

class GamificationService {
  constructor() {
    this.collections = {
      achievements: 'achievements',
      userAchievements: 'user_achievements',
      leaderboard: 'leaderboard',
      points: 'user_points',
      badges: 'badges',
      streaks: 'user_streaks',
      users: 'users',
      enrollments: 'enrollments',
      quizAttempts: 'quiz_attempts'
    };

    this.achievementTypes = {
      FIRST_COURSE: 'first_course',
      STREAK_7: 'streak_7',
      STREAK_30: 'streak_30',
      QUIZ_MASTER: 'quiz_master',
      FAST_LEARNER: 'fast_learner',
      DEDICATED_LEARNER: 'dedicated_learner',
      COURSE_COMPLETE: 'course_complete',
      TOP_PERFORMER: 'top_performer',
      PERFECT_SCORE: 'perfect_score',
      EARLY_BIRD: 'early_bird',
      NIGHT_OWL: 'night_owl',
      SOCIAL_LEARNER: 'social_learner'
    };

    this.pointValues = {
      COURSE_ENROLLMENT: 10,
      LESSON_COMPLETE: 5,
      QUIZ_COMPLETE: 15,
      QUIZ_PERFECT: 25,
      COURSE_COMPLETE: 100,
      ACHIEVEMENT_UNLOCK: 50,
      DAILY_STREAK: 5,
      ASSIGNMENT_SUBMIT: 20
    };
  }

  // ===================
  // ACHIEVEMENTS
  // ===================

  // Get user achievements
  async getUserAchievements(userId) {
    try {
      const userAchievementsQuery = query(
        collection(db, this.collections.userAchievements),
        where('userId', '==', userId),
        orderBy('earnedAt', 'desc')
      );
      const snapshot = await getDocs(userAchievementsQuery);
      const userAchievements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get all available achievements
      const allAchievementsSnapshot = await getDocs(collection(db, this.collections.achievements));
      const allAchievements = allAchievementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Combine earned and available achievements
      const earnedIds = userAchievements.map(ua => ua.achievementId);
      const availableAchievements = allAchievements.filter(a => !earnedIds.includes(a.id));

      const achievements = {
        earned: userAchievements.map(ua => {
          const achievement = allAchievements.find(a => a.id === ua.achievementId);
          return { ...achievement, ...ua, isEarned: true };
        }),
        available: availableAchievements.map(a => ({ ...a, isEarned: false }))
      };

      return { success: true, achievements };
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return { success: false, error: error.message };
    }
  }

  // Award achievement to user
  async awardAchievement(userId, achievementType, metadata = {}) {
    try {
      // Check if user already has this achievement
      const existingQuery = query(
        collection(db, this.collections.userAchievements),
        where('userId', '==', userId),
        where('achievementType', '==', achievementType)
      );
      const existingSnapshot = await getDocs(existingQuery);
      
      if (!existingSnapshot.empty) {
        return { success: false, error: 'Achievement already earned' };
      }

      // Get achievement details
      const achievementQuery = query(
        collection(db, this.collections.achievements),
        where('type', '==', achievementType)
      );
      const achievementSnapshot = await getDocs(achievementQuery);
      
      if (achievementSnapshot.empty) {
        return { success: false, error: 'Achievement not found' };
      }

      const achievement = achievementSnapshot.docs[0].data();
      
      // Award the achievement
      const userAchievementData = {
        userId,
        achievementId: achievementSnapshot.docs[0].id,
        achievementType,
        earnedAt: serverTimestamp(),
        metadata
      };

      await addDoc(collection(db, this.collections.userAchievements), userAchievementData);

      // Award points for the achievement
      await this.awardPoints(userId, this.pointValues.ACHIEVEMENT_UNLOCK, 'Achievement unlocked');

      return { success: true, achievement: { ...achievement, ...userAchievementData } };
    } catch (error) {
      console.error('Error awarding achievement:', error);
      return { success: false, error: error.message };
    }
  }

  // Check and award achievements based on user activity
  async checkAchievements(userId, activityType, activityData = {}) {
    try {
      const achievements = [];

      switch (activityType) {
        case 'course_enrollment':
          achievements.push(...await this.checkCourseEnrollmentAchievements(userId, activityData));
          break;
        case 'course_completion':
          achievements.push(...await this.checkCourseCompletionAchievements(userId, activityData));
          break;
        case 'quiz_completion':
          achievements.push(...await this.checkQuizAchievements(userId, activityData));
          break;
        case 'study_streak':
          achievements.push(...await this.checkStreakAchievements(userId, activityData));
          break;
      }

      return { success: true, achievements };
    } catch (error) {
      console.error('Error checking achievements:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // POINTS SYSTEM
  // ===================

  // Award points to user
  async awardPoints(userId, points, reason) {
    try {
      const userPointsRef = doc(db, this.collections.points, userId);
      
      // Check if user points document exists
      const userPointsDoc = await getDoc(userPointsRef);
      
      if (userPointsDoc.exists()) {
        await updateDoc(userPointsRef, {
          totalPoints: increment(points),
          lastUpdated: serverTimestamp(),
          recentActivities: arrayUnion({
            points,
            reason,
            timestamp: new Date()
          })
        });
      } else {
        // Create new points document
        await setDoc(userPointsRef, {
          userId,
          totalPoints: points,
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          recentActivities: [{
            points,
            reason,
            timestamp: new Date()
          }]
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error awarding points:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user points
  async getUserPoints(userId) {
    try {
      const userPointsRef = doc(db, this.collections.points, userId);
      const userPointsDoc = await getDoc(userPointsRef);
      
      if (userPointsDoc.exists()) {
        return { success: true, points: userPointsDoc.data() };
      } else {
        return { success: true, points: { totalPoints: 0, recentActivities: [] } };
      }
    } catch (error) {
      console.error('Error getting user points:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // LEADERBOARD
  // ===================

  // Get leaderboard
  async getLeaderboard(timeframe = 'all', category = 'points', limitCount = 50) {
    try {
      let leaderboardQuery;
      
      switch (category) {
        case 'points':
          leaderboardQuery = query(
            collection(db, this.collections.points),
            orderBy('totalPoints', 'desc'),
            limit(limitCount)
          );
          break;
        case 'courses':
          // This would require aggregating course completion data
          leaderboardQuery = query(
            collection(db, this.collections.users),
            orderBy('progress.coursesCompleted', 'desc'),
            limit(limitCount)
          );
          break;
        case 'streaks':
          leaderboardQuery = query(
            collection(db, this.collections.streaks),
            where('isActive', '==', true),
            orderBy('currentStreak', 'desc'),
            limit(limitCount)
          );
          break;
        default:
          leaderboardQuery = query(
            collection(db, this.collections.points),
            orderBy('totalPoints', 'desc'),
            limit(limitCount)
          );
      }

      const snapshot = await getDocs(leaderboardQuery);
      const leaderboardData = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data()
      }));

      return { success: true, leaderboard: leaderboardData };
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user's rank
  async getUserRank(userId, category = 'points') {
    try {
      // Get all users ordered by the category
      let query_ref;
      
      switch (category) {
        case 'points':
          query_ref = query(
            collection(db, this.collections.points),
            orderBy('totalPoints', 'desc')
          );
          break;
        default:
          query_ref = query(
            collection(db, this.collections.points),
            orderBy('totalPoints', 'desc')
          );
      }

      const snapshot = await getDocs(query_ref);
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const userIndex = users.findIndex(user => user.userId === userId || user.id === userId);
      const rank = userIndex >= 0 ? userIndex + 1 : null;
      
      return { success: true, rank, totalUsers: users.length };
    } catch (error) {
      console.error('Error getting user rank:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // STREAKS
  // ===================

  // Update user streak
  async updateStreak(userId) {
    try {
      const streakRef = doc(db, this.collections.streaks, userId);
      const streakDoc = await getDoc(streakRef);
      
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      if (streakDoc.exists()) {
        const streakData = streakDoc.data();
        const lastActiveDate = streakData.lastActiveDate ? new Date(streakData.lastActiveDate.toDate()).toDateString() : null;
        
        if (lastActiveDate === today) {
          // Already logged today
          return { success: true, streak: streakData };
        } else if (lastActiveDate === yesterday) {
          // Continue streak
          const newStreak = (streakData.currentStreak || 0) + 1;
          const updatedData = {
            currentStreak: newStreak,
            maxStreak: Math.max(newStreak, streakData.maxStreak || 0),
            lastActiveDate: serverTimestamp(),
            isActive: true
          };
          
          await updateDoc(streakRef, updatedData);
          
          // Award streak achievements
          if (newStreak === 7) {
            await this.awardAchievement(userId, this.achievementTypes.STREAK_7);
          } else if (newStreak === 30) {
            await this.awardAchievement(userId, this.achievementTypes.STREAK_30);
          }
          
          // Award daily points
          await this.awardPoints(userId, this.pointValues.DAILY_STREAK, 'Daily streak');
          
          return { success: true, streak: { ...streakData, ...updatedData } };
        } else {
          // Reset streak
          const updatedData = {
            currentStreak: 1,
            lastActiveDate: serverTimestamp(),
            isActive: true
          };
          
          await updateDoc(streakRef, updatedData);
          return { success: true, streak: { ...streakData, ...updatedData } };
        }
      } else {
        // Create new streak
        const streakData = {
          userId,
          currentStreak: 1,
          maxStreak: 1,
          lastActiveDate: serverTimestamp(),
          isActive: true,
          createdAt: serverTimestamp()
        };
        
        await setDoc(streakRef, streakData);
        return { success: true, streak: streakData };
      }
    } catch (error) {
      console.error('Error updating streak:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // ACHIEVEMENT CHECKERS
  // ===================

  async checkCourseEnrollmentAchievements(userId, activityData) {
    const achievements = [];
    
    // Check for first course enrollment
    const enrollmentsQuery = query(
      collection(db, this.collections.enrollments),
      where('studentId', '==', userId)
    );
    const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
    
    if (enrollmentsSnapshot.size === 1) {
      // First course enrollment
      const result = await this.awardAchievement(userId, this.achievementTypes.FIRST_COURSE);
      if (result.success) {
        achievements.push(result.achievement);
      }
    }
    
    return achievements;
  }

  async checkCourseCompletionAchievements(userId, activityData) {
    const achievements = [];
    
    // Course completion achievement
    const result = await this.awardAchievement(userId, this.achievementTypes.COURSE_COMPLETE, {
      courseId: activityData.courseId,
      courseName: activityData.courseName
    });
    
    if (result.success) {
      achievements.push(result.achievement);
    }
    
    return achievements;
  }

  async checkQuizAchievements(userId, activityData) {
    const achievements = [];
    
    // Check for perfect score
    if (activityData.score === 100) {
      const result = await this.awardAchievement(userId, this.achievementTypes.PERFECT_SCORE);
      if (result.success) {
        achievements.push(result.achievement);
      }
    }
    
    // Check for quiz master (5 quizzes completed)
    const quizAttemptsQuery = query(
      collection(db, this.collections.quizAttempts),
      where('studentId', '==', userId)
    );
    const quizAttemptsSnapshot = await getDocs(quizAttemptsQuery);
    
    if (quizAttemptsSnapshot.size >= 5) {
      const result = await this.awardAchievement(userId, this.achievementTypes.QUIZ_MASTER);
      if (result.success) {
        achievements.push(result.achievement);
      }
    }
    
    return achievements;
  }

  async checkStreakAchievements(userId, activityData) {
    // Streak achievements are handled in updateStreak method
    return [];
  }

  // ===================
  // INITIALIZATION
  // ===================

  // Initialize default achievements
  async initializeAchievements() {
    try {
      const achievements = [
        {
          type: this.achievementTypes.FIRST_COURSE,
          name: 'First Steps',
          description: 'Enroll in your first course',
          icon: '🎯',
          category: 'Getting Started',
          points: 50
        },
        {
          type: this.achievementTypes.STREAK_7,
          name: 'Week Warrior',
          description: 'Study for 7 consecutive days',
          icon: '🔥',
          category: 'Consistency',
          points: 100
        },
        {
          type: this.achievementTypes.STREAK_30,
          name: 'Month Master',
          description: 'Study for 30 consecutive days',
          icon: '⚡',
          category: 'Consistency',
          points: 500
        },
        {
          type: this.achievementTypes.QUIZ_MASTER,
          name: 'Quiz Master',
          description: 'Complete 5 quizzes',
          icon: '🧠',
          category: 'Learning',
          points: 200
        },
        {
          type: this.achievementTypes.COURSE_COMPLETE,
          name: 'Course Completer',
          description: 'Complete your first course',
          icon: '🎓',
          category: 'Achievement',
          points: 300
        },
        {
          type: this.achievementTypes.PERFECT_SCORE,
          name: 'Perfect Score',
          description: 'Get 100% on a quiz',
          icon: '⭐',
          category: 'Excellence',
          points: 150
        }
      ];

      for (const achievement of achievements) {
        // Check if achievement already exists
        const existingQuery = query(
          collection(db, this.collections.achievements),
          where('type', '==', achievement.type)
        );
        const existingSnapshot = await getDocs(existingQuery);
        
        if (existingSnapshot.empty) {
          await addDoc(collection(db, this.collections.achievements), {
            ...achievement,
            createdAt: serverTimestamp()
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error initializing achievements:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new GamificationService();
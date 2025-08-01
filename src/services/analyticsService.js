// src/services/analyticsService.js
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';

class AnalyticsService {
  constructor() {
    this.collections = {
      analytics: 'analytics',
      studySessions: 'study_sessions',
      userProgress: 'user_progress',
      courseAnalytics: 'course_analytics',
      quizAttempts: 'quiz_attempts',
      enrollments: 'enrollments',
      courses: 'courses',
      users: 'users'
    };
  }

  // ===================
  // STUDENT ANALYTICS
  // ===================

  // Get comprehensive student analytics
  async getStudentAnalytics(userId, timeRange = 'month') {
    try {
      const endDate = new Date();
      const startDate = this.getStartDate(timeRange);

      // Get study sessions
      const studySessionsQuery = query(
        collection(db, this.collections.studySessions),
        where('userId', '==', userId),
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate),
        orderBy('createdAt', 'desc')
      );
      const studySessionsSnapshot = await getDocs(studySessionsQuery);
      const studySessions = studySessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get user enrollments and progress
      const enrollmentsQuery = query(
        collection(db, this.collections.enrollments),
        where('studentId', '==', userId)
      );
      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      const enrollments = enrollmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get quiz attempts
      const quizAttemptsQuery = query(
        collection(db, this.collections.quizAttempts),
        where('studentId', '==', userId),
        where('submittedAt', '>=', startDate),
        orderBy('submittedAt', 'desc')
      );
      const quizAttemptsSnapshot = await getDocs(quizAttemptsQuery);
      const quizAttempts = quizAttemptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate analytics
      const analytics = this.calculateStudentAnalytics(studySessions, enrollments, quizAttempts);

      return { success: true, analytics };
    } catch (error) {
      console.error('Error getting student analytics:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate student analytics from raw data
  calculateStudentAnalytics(studySessions, enrollments, quizAttempts) {
    // Overview metrics
    const totalStudyTime = studySessions.reduce((total, session) => total + (session.duration || 0), 0);
    const coursesCompleted = enrollments.filter(e => e.progress === 100).length;
    const coursesInProgress = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
    
    const quizScores = quizAttempts.map(attempt => attempt.score || 0);
    const avgQuizScore = quizScores.length > 0 ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length : 0;
    
    const completionRate = enrollments.length > 0 ? (coursesCompleted / enrollments.length) * 100 : 0;

    // Study time data (daily breakdown)
    const studyTimeData = this.generateStudyTimeData(studySessions);

    // Performance data (weekly breakdown)
    const performanceData = this.generatePerformanceData(quizAttempts, studySessions);

    // Skills radar (based on course categories and quiz performance)
    const skillsRadar = this.generateSkillsRadar(enrollments, quizAttempts);

    // Course progress details
    const courseProgress = enrollments.map(enrollment => ({
      id: enrollment.courseId,
      name: enrollment.courseName || 'Unknown Course',
      progress: enrollment.progress || 0,
      timeSpent: enrollment.timeSpent || 0,
      lastAccessed: enrollment.lastAccessed || enrollment.updatedAt
    }));

    // Learning patterns
    const learningPatterns = this.analyzeLearningPatterns(studySessions);

    return {
      overview: {
        totalStudyTime: Math.round(totalStudyTime),
        coursesCompleted,
        coursesInProgress,
        avgQuizScore: Math.round(avgQuizScore * 10) / 10,
        totalQuizzes: quizAttempts.length,
        totalAssignments: 0, // TODO: Implement assignments
        completionRate: Math.round(completionRate),
        currentStreak: 0, // TODO: Calculate streak
        totalPoints: 0 // TODO: Implement points system
      },
      studyTimeData,
      performanceData,
      skillsRadar,
      courseProgress,
      learningPatterns
    };
  }

  // ===================
  // TUTOR ANALYTICS
  // ===================

  // Get comprehensive tutor analytics
  async getTutorAnalytics(instructorId, timeRange = 'month') {
    try {
      const endDate = new Date();
      const startDate = this.getStartDate(timeRange);

      // Get instructor's courses
      const coursesQuery = query(
        collection(db, this.collections.courses),
        where('instructorId', '==', instructorId)
      );
      const coursesSnapshot = await getDocs(coursesQuery);
      const courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get enrollments for instructor's courses
      const courseIds = courses.map(course => course.id);
      let allEnrollments = [];
      
      if (courseIds.length > 0) {
        // Firestore 'in' queries are limited to 10 items, so we may need multiple queries
        const chunks = this.chunkArray(courseIds, 10);
        
        for (const chunk of chunks) {
          const enrollmentsQuery = query(
            collection(db, this.collections.enrollments),
            where('courseId', 'in', chunk)
          );
          const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
          const enrollments = enrollmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          allEnrollments = [...allEnrollments, ...enrollments];
        }
      }

      // Get quiz attempts for instructor's courses
      let allQuizAttempts = [];
      if (courseIds.length > 0) {
        const chunks = this.chunkArray(courseIds, 10);
        
        for (const chunk of chunks) {
          const attemptsQuery = query(
            collection(db, this.collections.quizAttempts),
            where('courseId', 'in', chunk),
            where('submittedAt', '>=', startDate)
          );
          const attemptsSnapshot = await getDocs(attemptsQuery);
          const attempts = attemptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          allQuizAttempts = [...allQuizAttempts, ...attempts];
        }
      }

      // Calculate analytics
      const analytics = this.calculateTutorAnalytics(courses, allEnrollments, allQuizAttempts, timeRange);

      return { success: true, analytics };
    } catch (error) {
      console.error('Error getting tutor analytics:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate tutor analytics from raw data
  calculateTutorAnalytics(courses, enrollments, quizAttempts, timeRange) {
    const totalStudents = new Set(enrollments.map(e => e.studentId)).size;
    const totalRevenue = enrollments.reduce((total, e) => total + (e.paidAmount || 0), 0);
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.status === 'published').length;
    
    const ratings = courses.flatMap(c => c.reviews || []).map(r => r.rating);
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    
    const completedEnrollments = enrollments.filter(e => e.progress === 100).length;
    const completionRate = enrollments.length > 0 ? (completedEnrollments / enrollments.length) * 100 : 0;

    // Revenue data (monthly breakdown)
    const revenueData = this.generateRevenueData(enrollments, timeRange);

    // Student engagement data
    const studentEngagement = this.generateEngagementData(enrollments, quizAttempts);

    // Course performance
    const coursePerformance = courses.map(course => {
      const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
      const courseQuizAttempts = quizAttempts.filter(a => a.courseId === course.id);
      
      return {
        id: course.id,
        name: course.title,
        students: courseEnrollments.length,
        completed: courseEnrollments.filter(e => e.progress === 100).length,
        avgProgress: courseEnrollments.length > 0 
          ? courseEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / courseEnrollments.length 
          : 0,
        avgQuizScore: courseQuizAttempts.length > 0
          ? courseQuizAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / courseQuizAttempts.length
          : 0,
        revenue: courseEnrollments.reduce((sum, e) => sum + (e.paidAmount || 0), 0)
      };
    });

    return {
      overview: {
        totalStudents,
        totalRevenue: Math.round(totalRevenue),
        totalCourses,
        publishedCourses,
        avgRating: Math.round(avgRating * 10) / 10,
        totalEnrollments: enrollments.length,
        completionRate: Math.round(completionRate),
        monthlyGrowth: 0, // TODO: Calculate growth
        totalReviews: courses.reduce((sum, c) => sum + (c.reviews?.length || 0), 0)
      },
      revenueData,
      studentEngagement,
      coursePerformance
    };
  }

  // ===================
  // HELPER METHODS
  // ===================

  getStartDate(timeRange) {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'quarter':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case 'year':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  generateStudyTimeData(studySessions) {
    const dailyData = {};
    
    studySessions.forEach(session => {
      const date = new Date(session.createdAt.toDate()).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { date, minutes: 0, courses: new Set() };
      }
      dailyData[date].minutes += session.duration || 0;
      dailyData[date].courses.add(session.courseId);
    });

    return Object.values(dailyData).map(day => ({
      ...day,
      courses: day.courses.size
    })).slice(-10); // Last 10 days
  }

  generatePerformanceData(quizAttempts, studySessions) {
    // Group by weeks and calculate averages
    const weeklyData = {};
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      
      const weekQuizzes = quizAttempts.filter(attempt => {
        const attemptDate = new Date(attempt.submittedAt.toDate());
        return attemptDate >= weekStart && attemptDate < weekEnd;
      });
      
      const weekSessions = studySessions.filter(session => {
        const sessionDate = new Date(session.createdAt.toDate());
        return sessionDate >= weekStart && sessionDate < weekEnd;
      });

      weeklyData[`Week ${4 - i}`] = {
        week: `Week ${4 - i}`,
        quizScore: weekQuizzes.length > 0 
          ? weekQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / weekQuizzes.length 
          : 0,
        assignmentScore: 85, // TODO: Implement assignments
        engagement: weekSessions.length > 0 ? Math.min(100, weekSessions.length * 20) : 0
      };
    }

    return Object.values(weeklyData);
  }

  generateSkillsRadar(enrollments, quizAttempts) {
    // Mock skills data - in real implementation, this would be based on course categories and quiz performance
    return [
      { skill: 'Deep Learning', score: 85 },
      { skill: 'Computer Vision', score: 78 },
      { skill: 'NLP', score: 65 },
      { skill: 'ML Basics', score: 92 },
      { skill: 'Math & Stats', score: 70 },
      { skill: 'Programming', score: 88 }
    ];
  }

  analyzeLearningPatterns(studySessions) {
    if (studySessions.length === 0) {
      return {
        bestStudyTime: 'Not enough data',
        avgSessionLength: 0,
        preferredContentType: 'Unknown',
        engagementByDay: []
      };
    }

    // Analyze study time patterns
    const hourlyActivity = {};
    let totalDuration = 0;

    studySessions.forEach(session => {
      const hour = new Date(session.createdAt.toDate()).getHours();
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
      totalDuration += session.duration || 0;
    });

    const bestHour = Object.keys(hourlyActivity).reduce((a, b) => 
      hourlyActivity[a] > hourlyActivity[b] ? a : b
    );

    const avgSessionLength = totalDuration / studySessions.length;

    // Mock engagement by day
    const engagementByDay = [
      { day: 'Mon', engagement: 85 },
      { day: 'Tue', engagement: 78 },
      { day: 'Wed', engagement: 82 },
      { day: 'Thu', engagement: 90 },
      { day: 'Fri', engagement: 75 },
      { day: 'Sat', engagement: 95 },
      { day: 'Sun', engagement: 88 }
    ];

    return {
      bestStudyTime: `${bestHour}:00 - ${parseInt(bestHour) + 1}:00`,
      avgSessionLength: Math.round(avgSessionLength),
      preferredContentType: 'Video Lectures', // TODO: Implement content type tracking
      engagementByDay
    };
  }

  generateRevenueData(enrollments, timeRange) {
    const monthlyData = {};
    
    enrollments.forEach(enrollment => {
      if (enrollment.enrolledAt && enrollment.paidAmount) {
        const month = new Date(enrollment.enrolledAt.toDate()).toISOString().slice(0, 7);
        if (!monthlyData[month]) {
          monthlyData[month] = { month, revenue: 0, enrollments: 0 };
        }
        monthlyData[month].revenue += enrollment.paidAmount;
        monthlyData[month].enrollments += 1;
      }
    });

    return Object.values(monthlyData).slice(-6); // Last 6 months
  }

  generateEngagementData(enrollments, quizAttempts) {
    // Mock engagement data - in real implementation, this would be based on actual activity
    return [
      { week: 'Week 1', active: 85, completed: 12, dropped: 3 },
      { week: 'Week 2', active: 92, completed: 18, dropped: 2 },
      { week: 'Week 3', active: 88, completed: 22, dropped: 4 },
      { week: 'Week 4', active: 95, completed: 28, dropped: 1 }
    ];
  }

  // ===================
  // TRACKING METHODS
  // ===================

  // Track study session
  async trackStudySession(userId, courseId, duration, contentType = 'video') {
    try {
      const sessionData = {
        userId,
        courseId,
        duration, // in minutes
        contentType,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, this.collections.studySessions), sessionData);
      return { success: true };
    } catch (error) {
      console.error('Error tracking study session:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user progress
  async updateUserProgress(userId, courseId, progress, timeSpent) {
    try {
      const progressId = `${userId}_${courseId}`;
      const progressRef = doc(db, this.collections.userProgress, progressId);
      
      await updateDoc(progressRef, {
        progress,
        timeSpent,
        lastUpdated: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating user progress:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new AnalyticsService();
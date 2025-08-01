// src/services/platformService.js
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

class PlatformService {
  constructor() {
    this.collections = {
      platformStats: 'platformStats',
      features: 'platformFeatures',
      testimonials: 'testimonials',
      benefits: 'platformBenefits',
      users: 'users',
      courses: 'courses',
      enrollments: 'enrollments'
    };
  }

  // Get platform statistics
  async getPlatformStats() {
    try {
      // Get real-time stats by counting actual documents
      const [usersSnapshot, coursesSnapshot, enrollmentsSnapshot] = await Promise.all([
        getDocs(collection(db, this.collections.users)),
        getDocs(collection(db, this.collections.courses)),
        getDocs(collection(db, this.collections.enrollments))
      ]);

      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const enrollments = enrollmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate stats
      const totalStudents = users.filter(user => user.userType === 'student').length;
      const totalInstructors = users.filter(user => user.userType === 'tutor' || user.userType === 'instructor').length;
      const totalCourses = courses.length;
      
      // Calculate completion rate
      const completedEnrollments = enrollments.filter(enrollment => enrollment.progress === 100).length;
      const completionRate = enrollments.length > 0 ? Math.round((completedEnrollments / enrollments.length) * 100) : 85;

      return {
        success: true,
        stats: {
          totalStudents,
          totalInstructors,
          totalCourses,
          completionRate,
          totalEnrollments: enrollments.length
        }
      };
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get platform features
  async getPlatformFeatures() {
    try {
      const featuresSnapshot = await getDocs(
        query(
          collection(db, this.collections.features),
          orderBy('order', 'asc')
        )
      );

      const features = featuresSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        success: true,
        features
      };
    } catch (error) {
      console.error('Error fetching platform features:', error);
      return {
        success: false,
        error: error.message,
        features: []
      };
    }
  }

  // Get testimonials
  async getTestimonials() {
    try {
      const testimonialsSnapshot = await getDocs(
        query(
          collection(db, this.collections.testimonials),
          where('approved', '==', true),
          orderBy('createdAt', 'desc'),
          limit(6)
        )
      );

      const testimonials = testimonialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        success: true,
        testimonials
      };
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return {
        success: false,
        error: error.message,
        testimonials: []
      };
    }
  }

  // Get platform benefits
  async getPlatformBenefits() {
    try {
      const benefitsSnapshot = await getDocs(
        query(
          collection(db, this.collections.benefits),
          orderBy('order', 'asc')
        )
      );

      const benefits = benefitsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        success: true,
        benefits
      };
    } catch (error) {
      console.error('Error fetching platform benefits:', error);
      return {
        success: false,
        error: error.message,
        benefits: []
      };
    }
  }

  // Create default platform data (for initial setup)
  async createDefaultPlatformData() {
    try {
      // Default features
      const defaultFeatures = [
        {
          title: 'Expert-Led Courses',
          description: 'Learn from industry professionals with real-world experience in AI and machine learning',
          icon: 'School',
          color: '#1976d2',
          order: 1,
          active: true
        },
        {
          title: 'AI-Powered Learning',
          description: 'Personalized recommendations, intelligent assessments, and adaptive learning paths',
          icon: 'Psychology',
          color: '#9c27b0',
          order: 2,
          active: true
        },
        {
          title: 'Gamified Experience',
          description: 'Earn badges, track progress, compete with peers, and celebrate achievements',
          icon: 'EmojiEvents',
          color: '#4caf50',
          order: 3,
          active: true
        },
        {
          title: 'Real-Time Analytics',
          description: 'Track your learning progress with detailed analytics and performance insights',
          icon: 'TrendingUp',
          color: '#ff9800',
          order: 4,
          active: true
        },
        {
          title: 'Secure Platform',
          description: 'Enterprise-grade security with encrypted data and secure authentication',
          icon: 'Security',
          color: '#f44336',
          order: 5,
          active: true
        },
        {
          title: '24/7 Support',
          description: 'Get help whenever you need it with our dedicated support team and community',
          icon: 'Support',
          color: '#00bcd4',
          order: 6,
          active: true
        }
      ];

      // Default benefits
      const defaultBenefits = [
        { text: 'Learn at your own pace with flexible scheduling', order: 1, active: true },
        { text: 'Access to cutting-edge AI tools and technologies', order: 2, active: true },
        { text: 'Industry-recognized certificates upon completion', order: 3, active: true },
        { text: 'Connect with a global community of AI enthusiasts', order: 4, active: true },
        { text: 'Real-world projects and hands-on experience', order: 5, active: true },
        { text: 'Career support and job placement assistance', order: 6, active: true }
      ];

      // Default testimonials
      const defaultTestimonials = [
        {
          name: 'Sarah Chen',
          role: 'Data Scientist at Google',
          avatar: '',
          rating: 5,
          comment: 'This platform transformed my career. The AI-powered learning approach helped me understand complex concepts quickly.',
          approved: true,
          createdAt: serverTimestamp()
        },
        {
          name: 'Michael Rodriguez',
          role: 'ML Engineer at Meta',
          avatar: '',
          rating: 5,
          comment: 'The hands-on projects and expert guidance made all the difference. Highly recommend for anyone serious about AI.',
          approved: true,
          createdAt: serverTimestamp()
        },
        {
          name: 'Emily Johnson',
          role: 'AI Researcher at OpenAI',
          avatar: '',
          rating: 5,
          comment: 'Incredible platform with world-class content. The gamification aspect kept me motivated throughout my journey.',
          approved: true,
          createdAt: serverTimestamp()
        }
      ];

      // Add features
      const featuresCollection = collection(db, this.collections.features);
      for (const feature of defaultFeatures) {
        await addDoc(featuresCollection, {
          ...feature,
          createdAt: serverTimestamp()
        });
      }

      // Add benefits
      const benefitsCollection = collection(db, this.collections.benefits);
      for (const benefit of defaultBenefits) {
        await addDoc(benefitsCollection, {
          ...benefit,
          createdAt: serverTimestamp()
        });
      }

      // Add testimonials
      const testimonialsCollection = collection(db, this.collections.testimonials);
      for (const testimonial of defaultTestimonials) {
        await addDoc(testimonialsCollection, testimonial);
      }

      return {
        success: true,
        message: 'Default platform data created successfully'
      };
    } catch (error) {
      console.error('Error creating default platform data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add new testimonial
  async addTestimonial(testimonialData) {
    try {
      const docRef = await addDoc(collection(db, this.collections.testimonials), {
        ...testimonialData,
        approved: false, // Needs admin approval
        createdAt: serverTimestamp()
      });

      return {
        success: true,
        id: docRef.id,
        message: 'Testimonial submitted successfully'
      };
    } catch (error) {
      console.error('Error adding testimonial:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user-specific dashboard data
  async getUserDashboardData(userId, userType) {
    try {
      if (userType === 'student') {
        return await this.getStudentDashboardData(userId);
      } else if (userType === 'tutor' || userType === 'instructor') {
        return await this.getTutorDashboardData(userId);
      }
      
      return { success: false, error: 'Invalid user type' };
    } catch (error) {
      console.error('Error fetching user dashboard data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get student-specific dashboard data
  async getStudentDashboardData(userId) {
    try {
      // Get student's enrollments
      const enrollmentsSnapshot = await getDocs(
        query(
          collection(db, this.collections.enrollments),
          where('studentId', '==', userId)
        )
      );

      const enrollments = enrollmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get enrolled courses details
      const courseIds = enrollments.map(e => e.courseId);
      const coursesData = [];
      
      if (courseIds.length > 0) {
        for (const courseId of courseIds) {
          const courseDoc = await getDoc(doc(db, this.collections.courses, courseId));
          if (courseDoc.exists()) {
            coursesData.push({ id: courseDoc.id, ...courseDoc.data() });
          }
        }
      }

      // Calculate progress stats
      const totalCourses = enrollments.length;
      const completedCourses = enrollments.filter(e => e.progress === 100).length;
      const avgProgress = totalCourses > 0 
        ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / totalCourses)
        : 0;

      return {
        success: true,
        data: {
          enrollments,
          courses: coursesData,
          stats: {
            totalCourses,
            completedCourses,
            inProgress: totalCourses - completedCourses,
            avgProgress
          }
        }
      };
    } catch (error) {
      console.error('Error fetching student dashboard data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get tutor-specific dashboard data
  async getTutorDashboardData(userId) {
    try {
      // Get tutor's courses
      const coursesSnapshot = await getDocs(
        query(
          collection(db, this.collections.courses),
          where('instructorId', '==', userId)
        )
      );

      const courses = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get enrollments for tutor's courses
      const courseIds = courses.map(c => c.id);
      let totalStudents = 0;
      let totalRevenue = 0;

      if (courseIds.length > 0) {
        for (const courseId of courseIds) {
          try {
            const enrollmentsSnapshot = await getDocs(
              query(
                collection(db, this.collections.enrollments),
                where('courseId', '==', courseId)
              )
            );
            
            totalStudents += enrollmentsSnapshot.size;
            
            // Calculate revenue (assuming course price is stored in course data)
            const course = courses.find(c => c.id === courseId);
            if (course && course.price) {
              totalRevenue += course.price * enrollmentsSnapshot.size;
            }
          } catch (enrollmentError) {
            console.warn('Error fetching enrollments for course:', courseId, enrollmentError);
            // Continue with other courses
          }
        }
      }

      return {
        success: true,
        data: {
          courses,
          stats: {
            totalCourses: courses.length,
            totalStudents,
            totalRevenue,
            publishedCourses: courses.filter(c => c.status === 'published').length
          }
        }
      };
    } catch (error) {
      console.error('Error fetching tutor dashboard data:', error);
      
      // Return empty data structure instead of error for new tutors
      return {
        success: true,
        data: {
          courses: [],
          stats: {
            totalCourses: 0,
            totalStudents: 0,
            totalRevenue: 0,
            publishedCourses: 0
          }
        }
      };
    }
  }
}

const platformService = new PlatformService();
export default platformService;
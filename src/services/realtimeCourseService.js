// src/services/realtimeCourseService.js
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc,
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

class RealtimeCourseService {
  constructor() {
    this.collections = {
      courses: 'courses',
      enrollments: 'enrollments',
      categories: 'courseCategories'
    };
    this.listeners = new Map();
  }

  // Subscribe to all courses with real-time updates
  subscribeToAllCourses(callback, filters = {}) {
    try {
      let courseQuery = collection(db, this.collections.courses);
      
      // Apply filters - avoid composite index requirements
      const constraints = [];
      const hasWhereFilters = filters.status || filters.category || filters.level;
      
      // If we have where filters, we'll sort client-side to avoid composite index
      if (!hasWhereFilters) {
        // Only use orderBy when we don't have where clauses to avoid composite index
        constraints.push(orderBy('createdAt', 'desc'));
      }
      
      if (filters.limit && !hasWhereFilters) {
        // Only apply limit when we're not filtering client-side
        constraints.push(limit(filters.limit));
      }
      
      if (constraints.length > 0) {
        courseQuery = query(courseQuery, ...constraints);
      }

      const unsubscribe = onSnapshot(courseQuery, (snapshot) => {
        let courses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
        }));
        
        // Apply client-side filtering when necessary
        if (filters.status) {
          courses = courses.filter(course => course.status === filters.status);
        }
        
        if (filters.category) {
          courses = courses.filter(course => course.category === filters.category);
        }
        
        if (filters.level) {
          courses = courses.filter(course => course.level === filters.level);
        }
        
        // Sort client-side when we couldn't use orderBy in query
        if (hasWhereFilters) {
          courses.sort((a, b) => {
            const dateA = a.createdAt || new Date(0);
            const dateB = b.createdAt || new Date(0);
            return dateB.getTime() - dateA.getTime(); // Newest first
          });
        }
        
        // Apply limit client-side if needed
        if (filters.limit && hasWhereFilters) {
          courses = courses.slice(0, filters.limit);
        }
        
        callback({
          success: true,
          courses,
          total: courses.length
        });
      }, (error) => {
        console.error('Error in courses subscription:', error);
        callback({
          success: false,
          error: error.message,
          courses: []
        });
      });

      // Store the unsubscribe function
      const listenerId = 'allCourses_' + Date.now();
      this.listeners.set(listenerId, unsubscribe);
      
      return {
        unsubscribe,
        listenerId
      };
    } catch (error) {
      console.error('Error setting up courses subscription:', error);
      callback({
        success: false,
        error: error.message,
        courses: []
      });
      return { unsubscribe: () => {}, listenerId: null };
    }
  }

  // Subscribe to courses by specific tutor
  subscribeToTutorCourses(tutorId, callback) {
    try {
      const courseQuery = query(
        collection(db, this.collections.courses),
        where('instructorId', '==', tutorId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(courseQuery, async (snapshot) => {
        const courses = [];
        
        for (const docSnap of snapshot.docs) {
          const courseData = {
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
            updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date()
          };

          // Get enrollment count for each course
          try {
            const enrollmentQuery = query(
              collection(db, this.collections.enrollments),
              where('courseId', '==', docSnap.id)
            );
            const enrollmentSnapshot = await getDocs(enrollmentQuery);
            courseData.studentsCount = enrollmentSnapshot.size;
            courseData.revenue = (courseData.price || 0) * enrollmentSnapshot.size;
          } catch (err) {
            console.error('Error fetching enrollment count:', err);
            courseData.studentsCount = 0;
            courseData.revenue = 0;
          }
          
          courses.push(courseData);
        }
        
        callback({
          success: true,
          courses,
          total: courses.length
        });
      }, (error) => {
        console.error('Error in tutor courses subscription:', error);
        callback({
          success: false,
          error: error.message,
          courses: []
        });
      });

      const listenerId = 'tutorCourses_' + tutorId;
      this.listeners.set(listenerId, unsubscribe);
      
      return {
        unsubscribe,
        listenerId
      };
    } catch (error) {
      console.error('Error setting up tutor courses subscription:', error);
      callback({
        success: false,
        error: error.message,
        courses: []
      });
      return { unsubscribe: () => {}, listenerId: null };
    }
  }

  // Subscribe to course categories
  subscribeToCategories(callback) {
    try {
      const categoriesQuery = query(
        collection(db, this.collections.categories),
        orderBy('order', 'asc')
      );

      const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
        const categories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        callback({
          success: true,
          categories
        });
      }, (error) => {
        console.error('Error in categories subscription:', error);
        callback({
          success: false,
          error: error.message,
          categories: []
        });
      });

      const listenerId = 'categories_' + Date.now();
      this.listeners.set(listenerId, unsubscribe);
      
      return {
        unsubscribe,
        listenerId
      };
    } catch (error) {
      console.error('Error setting up categories subscription:', error);
      callback({
        success: false,
        error: error.message,
        categories: []
      });
      return { unsubscribe: () => {}, listenerId: null };
    }
  }

  // Subscribe to single course details
  subscribeToCourse(courseId, callback) {
    try {
      const courseRef = doc(db, this.collections.courses, courseId);

      const unsubscribe = onSnapshot(courseRef, async (docSnap) => {
        if (docSnap.exists()) {
          const courseData = {
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
            updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date()
          };

          // Get real-time enrollment count
          try {
            const enrollmentQuery = query(
              collection(db, this.collections.enrollments),
              where('courseId', '==', courseId)
            );
            const enrollmentSnapshot = await getDocs(enrollmentQuery);
            courseData.studentsCount = enrollmentSnapshot.size;
            
            // Get enrolled students details
            const enrollments = enrollmentSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            courseData.enrollments = enrollments;
          } catch (err) {
            console.error('Error fetching course enrollment data:', err);
            courseData.studentsCount = 0;
            courseData.enrollments = [];
          }

          callback({
            success: true,
            course: courseData
          });
        } else {
          callback({
            success: false,
            error: 'Course not found',
            course: null
          });
        }
      }, (error) => {
        console.error('Error in course subscription:', error);
        callback({
          success: false,
          error: error.message,
          course: null
        });
      });

      const listenerId = 'course_' + courseId;
      this.listeners.set(listenerId, unsubscribe);
      
      return {
        unsubscribe,
        listenerId
      };
    } catch (error) {
      console.error('Error setting up course subscription:', error);
      callback({
        success: false,
        error: error.message,
        course: null
      });
      return { unsubscribe: () => {}, listenerId: null };
    }
  }

  // Subscribe to course statistics
  subscribeToCourseStats(callback) {
    try {
      const coursesQuery = collection(db, this.collections.courses);

      const unsubscribe = onSnapshot(coursesQuery, async (snapshot) => {
        try {
          const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Calculate real-time statistics
          const totalCourses = courses.length;
          const publishedCourses = courses.filter(course => course.status === 'published').length;
          const categories = [...new Set(courses.map(course => course.category).filter(Boolean))];
          
          let totalEnrollments = 0;
          let totalStudents = 0;
          
          try {
            // Get total enrollments across all courses
            const enrollmentsSnapshot = await getDocs(collection(db, this.collections.enrollments));
            totalEnrollments = enrollmentsSnapshot.size;
            
            // Calculate total students (unique)
            const studentIds = new Set();
            enrollmentsSnapshot.docs.forEach(doc => {
              const enrollment = doc.data();
              if (enrollment.studentId) {
                studentIds.add(enrollment.studentId);
              }
            });
            totalStudents = studentIds.size;
          } catch (enrollmentError) {
            console.warn('Error fetching enrollment data:', enrollmentError);
            // Continue with zero values
          }
          
          const stats = {
            totalCourses,
            publishedCourses,
            totalCategories: categories.length,
            totalEnrollments,
            totalStudents,
            averageRating: courses.length > 0 ? (courses.reduce((sum, course) => sum + (course.rating || 4.5), 0) / courses.length) : 4.5
          };

          callback({
            success: true,
            stats
          });
        } catch (error) {
          console.error('Error calculating course stats:', error);
          // Provide default stats instead of failing
          callback({
            success: true,
            stats: {
              totalCourses: 0,
              publishedCourses: 0,
              totalCategories: 0,
              totalEnrollments: 0,
              totalStudents: 0,
              averageRating: 4.5
            }
          });
        }
      }, (error) => {
        console.error('Error in course stats subscription:', error);
        // Provide default stats instead of failing
        callback({
          success: true,
          stats: {
            totalCourses: 0,
            publishedCourses: 0,
            totalCategories: 0,
            totalEnrollments: 0,
            totalStudents: 0,
            averageRating: 4.5
          }
        });
      });

      const listenerId = 'courseStats_' + Date.now();
      this.listeners.set(listenerId, unsubscribe);
      
      return {
        unsubscribe,
        listenerId
      };
    } catch (error) {
      console.error('Error setting up course stats subscription:', error);
      // Provide default stats instead of failing
      callback({
        success: true,
        stats: {
          totalCourses: 0,
          publishedCourses: 0,
          totalCategories: 0,
          totalEnrollments: 0,
          totalStudents: 0,
          averageRating: 4.5
        }
      });
      return { unsubscribe: () => {}, listenerId: null };
    }
  }

  // Create new course
  async createCourse(courseData, tutorId) {
    try {
      const newCourse = {
        ...courseData,
        instructorId: tutorId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        studentsCount: 0,
        status: courseData.status || 'draft'
      };

      const docRef = await addDoc(collection(db, this.collections.courses), newCourse);
      
      return {
        success: true,
        courseId: docRef.id,
        message: 'Course created successfully'
      };
    } catch (error) {
      console.error('Error creating course:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update course
  async updateCourse(courseId, updates) {
    try {
      const courseRef = doc(db, this.collections.courses, courseId);
      await updateDoc(courseRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Course updated successfully'
      };
    } catch (error) {
      console.error('Error updating course:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete course
  async deleteCourse(courseId) {
    try {
      const courseRef = doc(db, this.collections.courses, courseId);
      await deleteDoc(courseRef);

      return {
        success: true,
        message: 'Course deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting course:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enroll in course
  async enrollInCourse(courseId, studentId) {
    try {
      // Check if already enrolled
      const existingEnrollment = query(
        collection(db, this.collections.enrollments),
        where('courseId', '==', courseId),
        where('studentId', '==', studentId)
      );
      
      const snapshot = await getDocs(existingEnrollment);
      if (!snapshot.empty) {
        return {
          success: false,
          error: 'Already enrolled in this course'
        };
      }

      // Create enrollment
      const enrollmentData = {
        courseId,
        studentId,
        enrolledAt: serverTimestamp(),
        progress: 0,
        status: 'active'
      };

      await addDoc(collection(db, this.collections.enrollments), enrollmentData);

      return {
        success: true,
        message: 'Successfully enrolled in course'
      };
    } catch (error) {
      console.error('Error enrolling in course:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Unsubscribe from specific listener
  unsubscribe(listenerId) {
    const unsubscribe = this.listeners.get(listenerId);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(listenerId);
      return true;
    }
    return false;
  }

  // Unsubscribe from all listeners
  unsubscribeAll() {
    this.listeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.listeners.clear();
  }

  // Get search suggestions
  async getSearchSuggestions(searchTerm, limit = 10) {
    try {
      const coursesQuery = query(
        collection(db, this.collections.courses),
        where('status', '==', 'published'),
        orderBy('title'),
        limit(limit)
      );

      const snapshot = await getDocs(coursesQuery);
      const courses = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(course => 
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );

      return {
        success: true,
        suggestions: courses.map(course => ({
          id: course.id,
          title: course.title,
          instructor: course.instructor?.name || 'Unknown',
          thumbnail: course.thumbnail
        }))
      };
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return {
        success: false,
        error: error.message,
        suggestions: []
      };
    }
  }

  // Create sample course data for testing
  async createSampleCourses() {
    try {
      const sampleCourses = [
        {
          title: "Introduction to Machine Learning",
          subtitle: "Learn the fundamentals of ML algorithms and data science",
          description: "A comprehensive introduction to machine learning covering supervised and unsupervised learning, neural networks, and practical applications in real-world scenarios.",
          category: "Machine Learning",
          level: "beginner",
          language: "English",
          price: 99,
          currency: "USD",
          status: "published",
          rating: 4.8,
          totalDuration: 480, // 8 hours in minutes
          instructor: {
            name: "Dr. Sarah Chen",
            bio: "PhD in Computer Science, former Google AI researcher",
            avatar: "",
            email: "sarah.chen@example.com"
          },
          tags: ["machine-learning", "python", "data-science", "beginner"],
          objectives: [
            "Understand core ML algorithms",
            "Implement ML models in Python",
            "Evaluate model performance",
            "Apply ML to real-world problems"
          ],
          requirements: [
            "Basic Python programming knowledge",
            "High school mathematics",
            "No prior ML experience required"
          ],
          modules: [
            {
              title: "Introduction to ML",
              duration: 60,
              lessons: ["What is Machine Learning?", "Types of ML", "ML Workflow"]
            },
            {
              title: "Supervised Learning",
              duration: 120,
              lessons: ["Linear Regression", "Classification", "Decision Trees"]
            },
            {
              title: "Unsupervised Learning",
              duration: 90,
              lessons: ["Clustering", "Dimensionality Reduction", "Association Rules"]
            }
          ],
          studentsCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          title: "Deep Learning with Neural Networks",
          subtitle: "Master deep learning and neural network architectures",
          description: "Dive deep into neural networks, CNNs, RNNs, and modern architectures like Transformers. Build and deploy deep learning models from scratch.",
          category: "Deep Learning",
          level: "intermediate",
          language: "English",
          price: 149,
          currency: "USD",
          status: "published",
          rating: 4.9,
          totalDuration: 720, // 12 hours
          instructor: {
            name: "Prof. Michael Rodriguez",
            bio: "AI Research Lead at Meta, published 50+ papers",
            avatar: "",
            email: "michael.rodriguez@example.com"
          },
          tags: ["deep-learning", "neural-networks", "tensorflow", "pytorch"],
          objectives: [
            "Build neural networks from scratch",
            "Understand CNN and RNN architectures",
            "Implement Transformer models",
            "Deploy models to production"
          ],
          requirements: [
            "Solid Python programming skills",
            "Basic machine learning knowledge",
            "Linear algebra fundamentals"
          ],
          modules: [
            {
              title: "Neural Network Fundamentals",
              duration: 180,
              lessons: ["Perceptrons", "Backpropagation", "Activation Functions"]
            },
            {
              title: "Convolutional Neural Networks",
              duration: 240,
              lessons: ["CNN Architecture", "Image Classification", "Transfer Learning"]
            },
            {
              title: "Advanced Architectures",
              duration: 300,
              lessons: ["RNNs and LSTMs", "Transformer Architecture", "BERT and GPT"]
            }
          ],
          studentsCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          title: "Computer Vision Fundamentals",
          subtitle: "Learn to build AI systems that can see and understand images",
          description: "Comprehensive course on computer vision covering image processing, object detection, facial recognition, and modern CV applications.",
          category: "Computer Vision",
          level: "intermediate",
          language: "English",
          price: 129,
          currency: "USD",
          status: "published",
          rating: 4.7,
          totalDuration: 600, // 10 hours
          instructor: {
            name: "Dr. Emily Johnson",
            bio: "Computer Vision Engineer at OpenAI",
            avatar: "",
            email: "emily.johnson@example.com"
          },
          tags: ["computer-vision", "opencv", "image-processing", "object-detection"],
          objectives: [
            "Process and analyze images",
            "Implement object detection systems",
            "Build facial recognition applications",
            "Create image classification models"
          ],
          requirements: [
            "Python programming experience",
            "Basic machine learning knowledge",
            "Familiarity with NumPy and OpenCV"
          ],
          modules: [
            {
              title: "Image Processing Basics",
              duration: 150,
              lessons: ["Digital Images", "Filtering", "Edge Detection"]
            },
            {
              title: "Feature Detection",
              duration: 180,
              lessons: ["Keypoint Detection", "Feature Matching", "SIFT and SURF"]
            },
            {
              title: "Modern CV Applications",
              duration: 270,
              lessons: ["Object Detection", "Facial Recognition", "Semantic Segmentation"]
            }
          ],
          studentsCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          title: "Natural Language Processing with Python",
          subtitle: "Build AI systems that understand and generate human language",
          description: "Learn to process text data, build chatbots, perform sentiment analysis, and create language models using modern NLP techniques.",
          category: "Natural Language Processing",
          level: "intermediate",
          language: "English",
          price: 119,
          currency: "USD",
          status: "published",
          rating: 4.6,
          totalDuration: 540, // 9 hours
          instructor: {
            name: "Dr. Alex Kim",
            bio: "NLP Research Scientist at Stanford AI Lab",
            avatar: "",
            email: "alex.kim@example.com"
          },
          tags: ["nlp", "text-processing", "chatbots", "sentiment-analysis"],
          objectives: [
            "Process and analyze text data",
            "Build sentiment analysis models",
            "Create chatbots and conversational AI",
            "Implement language models"
          ],
          requirements: [
            "Strong Python programming skills",
            "Basic statistics knowledge",
            "Familiarity with machine learning concepts"
          ],
          modules: [
            {
              title: "Text Processing Fundamentals",
              duration: 120,
              lessons: ["Text Preprocessing", "Tokenization", "Part-of-Speech Tagging"]
            },
            {
              title: "Language Models",
              duration: 180,
              lessons: ["N-gram Models", "Word Embeddings", "Transformer Models"]
            },
            {
              title: "NLP Applications",
              duration: 240,
              lessons: ["Sentiment Analysis", "Named Entity Recognition", "Chatbot Development"]
            }
          ],
          studentsCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          title: "Data Science for Beginners",
          subtitle: "Start your journey in data science and analytics",
          description: "Learn data analysis, visualization, and statistical modeling using Python. Perfect for beginners looking to enter the field of data science.",
          category: "Data Science",
          level: "beginner",
          language: "English",
          price: 79,
          currency: "USD",
          status: "published",
          rating: 4.5,
          totalDuration: 420, // 7 hours
          instructor: {
            name: "Maria Garcia",
            bio: "Senior Data Scientist at Netflix",
            avatar: "",
            email: "maria.garcia@example.com"
          },
          tags: ["data-science", "python", "pandas", "visualization"],
          objectives: [
            "Analyze data using Python",
            "Create compelling visualizations",
            "Perform statistical analysis",
            "Build predictive models"
          ],
          requirements: [
            "Basic Python knowledge helpful but not required",
            "High school mathematics",
            "Curiosity about data and patterns"
          ],
          modules: [
            {
              title: "Data Analysis Basics",
              duration: 120,
              lessons: ["Introduction to Pandas", "Data Cleaning", "Exploratory Data Analysis"]
            },
            {
              title: "Data Visualization",
              duration: 90,
              lessons: ["Matplotlib Basics", "Seaborn for Statistical Plots", "Interactive Visualizations"]
            },
            {
              title: "Statistical Modeling",
              duration: 210,
              lessons: ["Descriptive Statistics", "Hypothesis Testing", "Linear Regression"]
            }
          ],
          studentsCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      ];

      // Add each course to Firestore
      const coursesCollection = collection(db, this.collections.courses);
      const courseIds = [];
      
      for (const courseData of sampleCourses) {
        const docRef = await addDoc(coursesCollection, courseData);
        courseIds.push(docRef.id);
      }

      return {
        success: true,
        message: `Created ${sampleCourses.length} sample courses`,
        courseIds
      };
    } catch (error) {
      console.error('Error creating sample courses:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

const realtimeCourseService = new RealtimeCourseService();
export default realtimeCourseService;
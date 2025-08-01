// src/services/courseService.js
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

class CourseService {
  constructor() {
    this.coursesCollection = 'courses';
    this.enrollmentsCollection = 'enrollments';
    this.progressCollection = 'progress';
  }

  // Create a new course
  async createCourse(courseData, instructorId) {
    try {
      const course = {
        ...courseData,
        instructorId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        studentsCount: 0,
        rating: 0,
        reviews: [],
        status: 'draft', // draft, published, archived
        curriculum: courseData.curriculum || [],
        totalDuration: this.calculateTotalDuration(courseData.curriculum || []),
        level: courseData.level || 'beginner',
        category: courseData.category || 'AI Fundamentals',
        tags: courseData.tags || [],
        price: courseData.price || 0,
        currency: courseData.currency || 'USD',
        language: courseData.language || 'en',
        requirements: courseData.requirements || [],
        objectives: courseData.objectives || [],
        thumbnail: courseData.thumbnail || null,
        videoPreview: courseData.videoPreview || null,
        resources: courseData.resources || []
      };

      const docRef = await addDoc(collection(db, this.coursesCollection), course);
      return { success: true, courseId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update course
  async updateCourse(courseId, updates) {
    try {
      const courseRef = doc(db, this.coursesCollection, courseId);
      await updateDoc(courseRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete course
  async deleteCourse(courseId) {
    try {
      await deleteDoc(doc(db, this.coursesCollection, courseId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get course by ID
  async getCourse(courseId) {
    try {
      const courseDoc = await getDoc(doc(db, this.coursesCollection, courseId));
      if (courseDoc.exists()) {
        const courseData = { id: courseDoc.id, ...courseDoc.data() };
        // Convert timestamps
        if (courseData.createdAt?.toDate) {
          courseData.createdAt = courseData.createdAt.toDate().toISOString();
        }
        if (courseData.updatedAt?.toDate) {
          courseData.updatedAt = courseData.updatedAt.toDate().toISOString();
        }
        return { success: true, course: courseData };
      } else {
        return { success: false, error: 'Course not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get all courses with filters
  async getCourses(filters = {}) {
    try {
      let q = collection(db, this.coursesCollection);
      
      // Apply filters
      const conditions = [];
      
      if (filters.status) {
        conditions.push(where('status', '==', filters.status));
      }
      
      if (filters.category) {
        conditions.push(where('category', '==', filters.category));
      }
      
      if (filters.level) {
        conditions.push(where('level', '==', filters.level));
      }
      
      if (filters.instructorId) {
        conditions.push(where('instructorId', '==', filters.instructorId));
      }

      if (conditions.length > 0) {
        q = query(q, ...conditions);
      }

      // Apply ordering
      if (filters.orderBy) {
        q = query(q, orderBy(filters.orderBy, filters.order || 'desc'));
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }

      // Apply pagination
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      if (filters.startAfter) {
        q = query(q, startAfter(filters.startAfter));
      }

      const snapshot = await getDocs(q);
      const courses = snapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        // Convert timestamps
        if (data.createdAt?.toDate) {
          data.createdAt = data.createdAt.toDate().toISOString();
        }
        if (data.updatedAt?.toDate) {
          data.updatedAt = data.updatedAt.toDate().toISOString();
        }
        return data;
      });

      return { success: true, courses };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check if student is enrolled in course
  async checkEnrollment(studentId, courseId) {
    try {
      const enrollmentQuery = query(
        collection(db, this.enrollmentsCollection),
        where('courseId', '==', courseId),
        where('studentId', '==', studentId)
      );
      const snapshot = await getDocs(enrollmentQuery);
      
      return { 
        success: true, 
        isEnrolled: !snapshot.empty,
        enrollment: snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Enroll student in course (alias for enrollStudent)
  async enrollInCourse(studentId, courseId) {
    return this.enrollStudent(courseId, studentId);
  }

  // Enroll student in course
  async enrollStudent(courseId, studentId) {
    try {
      // Check if already enrolled
      const enrollmentQuery = query(
        collection(db, this.enrollmentsCollection),
        where('courseId', '==', courseId),
        where('studentId', '==', studentId)
      );
      const existingEnrollment = await getDocs(enrollmentQuery);
      
      if (!existingEnrollment.empty) {
        return { success: false, error: 'Student already enrolled in this course' };
      }

      // Create enrollment
      const enrollment = {
        courseId,
        studentId,
        enrolledAt: serverTimestamp(),
        progress: 0,
        completedModules: [],
        lastAccessedAt: serverTimestamp(),
        status: 'active' // active, completed, dropped
      };

      await addDoc(collection(db, this.enrollmentsCollection), enrollment);

      // Update course student count
      const courseRef = doc(db, this.coursesCollection, courseId);
      await updateDoc(courseRef, {
        studentsCount: increment(1)
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get student enrollments
  async getStudentEnrollments(studentId) {
    try {
      const enrollmentQuery = query(
        collection(db, this.enrollmentsCollection),
        where('studentId', '==', studentId),
        orderBy('enrolledAt', 'desc')
      );
      
      const snapshot = await getDocs(enrollmentQuery);
      const enrollments = [];

      for (const doc of snapshot.docs) {
        const enrollmentData = { id: doc.id, ...doc.data() };
        
        // Get course data
        const courseResult = await this.getCourse(enrollmentData.courseId);
        if (courseResult.success) {
          enrollmentData.course = courseResult.course;
        }

        // Convert timestamps
        if (enrollmentData.enrolledAt?.toDate) {
          enrollmentData.enrolledAt = enrollmentData.enrolledAt.toDate().toISOString();
        }
        if (enrollmentData.lastAccessedAt?.toDate) {
          enrollmentData.lastAccessedAt = enrollmentData.lastAccessedAt.toDate().toISOString();
        }

        enrollments.push(enrollmentData);
      }

      return { success: true, enrollments };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update progress
  async updateProgress(courseId, studentId, moduleId, completed = true) {
    try {
      const enrollmentQuery = query(
        collection(db, this.enrollmentsCollection),
        where('courseId', '==', courseId),
        where('studentId', '==', studentId)
      );
      
      const snapshot = await getDocs(enrollmentQuery);
      if (snapshot.empty) {
        return { success: false, error: 'Enrollment not found' };
      }

      const enrollmentDoc = snapshot.docs[0];
      const enrollmentRef = doc(db, this.enrollmentsCollection, enrollmentDoc.id);
      
      if (completed) {
        await updateDoc(enrollmentRef, {
          completedModules: arrayUnion(moduleId),
          lastAccessedAt: serverTimestamp()
        });
      } else {
        await updateDoc(enrollmentRef, {
          completedModules: arrayRemove(moduleId),
          lastAccessedAt: serverTimestamp()
        });
      }

      // Calculate and update overall progress
      const courseResult = await this.getCourse(courseId);
      if (courseResult.success) {
        const course = courseResult.course;
        const enrollmentData = enrollmentDoc.data();
        const completedModules = completed 
          ? [...(enrollmentData.completedModules || []), moduleId]
          : (enrollmentData.completedModules || []).filter(id => id !== moduleId);
        
        const totalModules = course.curriculum ? course.curriculum.length : 0;
        const progress = totalModules > 0 ? Math.round((completedModules.length / totalModules) * 100) : 0;

        await updateDoc(enrollmentRef, { progress });

        // If course is completed, update status
        if (progress === 100) {
          await updateDoc(enrollmentRef, {
            status: 'completed',
            completedAt: serverTimestamp()
          });
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Upload course thumbnail
  async uploadThumbnail(courseId, file, instructorId) {
    try {
      const storageRef = ref(storage, `courses/${courseId}/thumbnails/${Date.now()}_${file.name}`);
      
      // Set metadata for storage rules
      const metadata = {
        customMetadata: {
          instructorId: instructorId,
          courseId: courseId,
          isPublic: 'true', // Thumbnails are public
          uploadedAt: new Date().toISOString()
        }
      };
      
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update course with thumbnail URL
      await this.updateCourse(courseId, { thumbnail: downloadURL });
      
      return { success: true, url: downloadURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Upload course video
  async uploadVideo(courseId, moduleId, file, instructorId, isPreview = false) {
    try {
      const folderPath = isPreview ? 'previews' : 'videos';
      const storageRef = ref(storage, `courses/${courseId}/${folderPath}/${moduleId}_${Date.now()}_${file.name}`);
      
      // Set metadata for storage rules
      const metadata = {
        customMetadata: {
          instructorId: instructorId,
          courseId: courseId,
          moduleId: moduleId,
          isPreview: isPreview.toString(),
          isPublic: isPreview.toString(), // Preview videos are public
          uploadedAt: new Date().toISOString()
        }
      };
      
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { success: true, url: downloadURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Upload course materials (PDFs, documents, etc.)
  async uploadMaterial(courseId, file, instructorId, isPublic = false) {
    try {
      const storageRef = ref(storage, `courses/${courseId}/materials/${Date.now()}_${file.name}`);
      
      // Set metadata for storage rules
      const metadata = {
        customMetadata: {
          instructorId: instructorId,
          courseId: courseId,
          isPublic: isPublic.toString(),
          uploadedAt: new Date().toISOString()
        }
      };
      
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { success: true, url: downloadURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Add review
  async addReview(courseId, studentId, rating, comment) {
    try {
      const courseRef = doc(db, this.coursesCollection, courseId);
      const courseDoc = await getDoc(courseRef);
      
      if (!courseDoc.exists()) {
        return { success: false, error: 'Course not found' };
      }

      const course = courseDoc.data();
      const reviews = course.reviews || [];
      
      // Check if student already reviewed
      const existingReviewIndex = reviews.findIndex(review => review.studentId === studentId);
      
      const newReview = {
        studentId,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };

      if (existingReviewIndex >= 0) {
        reviews[existingReviewIndex] = newReview;
      } else {
        reviews.push(newReview);
      }

      // Calculate new average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviews.length > 0 ? (totalRating / reviews.length) : 0;

      await updateDoc(courseRef, {
        reviews,
        rating: Math.round(averageRating * 10) / 10 // Round to 1 decimal place
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Publish course (change status from draft to published)
  async publishCourse(courseId) {
    try {
      const courseRef = doc(db, this.coursesCollection, courseId);
      await updateDoc(courseRef, {
        status: 'published',
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, message: 'Course published successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Unpublish course (change status from published to draft)
  async unpublishCourse(courseId) {
    try {
      const courseRef = doc(db, this.coursesCollection, courseId);
      await updateDoc(courseRef, {
        status: 'draft',
        updatedAt: serverTimestamp()
      });
      return { success: true, message: 'Course unpublished successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Archive course
  async archiveCourse(courseId) {
    try {
      const courseRef = doc(db, this.coursesCollection, courseId);
      await updateDoc(courseRef, {
        status: 'archived',
        archivedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, message: 'Course archived successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update course status
  async updateCourseStatus(courseId, status) {
    try {
      const courseRef = doc(db, this.coursesCollection, courseId);
      const updateData = {
        status,
        updatedAt: serverTimestamp()
      };

      if (status === 'published') {
        updateData.publishedAt = serverTimestamp();
      } else if (status === 'archived') {
        updateData.archivedAt = serverTimestamp();
      }

      await updateDoc(courseRef, updateData);
      return { success: true, message: `Course ${status} successfully` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Validate course data before creation/update
  validateCourseData(courseData) {
    const errors = [];

    if (!courseData.title || courseData.title.trim().length < 3) {
      errors.push('Course title must be at least 3 characters long');
    }

    if (!courseData.description || courseData.description.trim().length < 10) {
      errors.push('Course description must be at least 10 characters long');
    }

    if (!courseData.category) {
      errors.push('Course category is required');
    }

    if (!courseData.level) {
      errors.push('Course level is required');
    }

    if (courseData.price && (isNaN(courseData.price) || courseData.price < 0)) {
      errors.push('Course price must be a valid positive number');
    }

    if (!courseData.objectives || courseData.objectives.length === 0) {
      errors.push('At least one learning objective is required');
    }

    if (!courseData.curriculum || courseData.curriculum.length === 0) {
      errors.push('At least one curriculum module is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method to calculate total duration
  calculateTotalDuration(curriculum) {
    return curriculum.reduce((total, module) => {
      const moduleDuration = module.lessons ? 
        module.lessons.reduce((lessonTotal, lesson) => lessonTotal + (lesson.duration || 0), 0) :
        (module.duration || 0);
      return total + moduleDuration;
    }, 0);
  }

  // Search courses
  async searchCourses(searchTerm, filters = {}) {
    try {
      // Note: Firestore doesn't support full-text search natively
      // For a production app, you'd want to use Algolia or Elasticsearch
      // This is a basic implementation that searches titles
      
      const allCourses = await this.getCourses(filters);
      if (!allCourses.success) {
        return allCourses;
      }

      const filteredCourses = allCourses.courses.filter(course => {
        return course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               course.category.toLowerCase().includes(searchTerm.toLowerCase());
      });

      return { success: true, courses: filteredCourses };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create a test course for tutors to verify the system works
  async createTestCourse(instructorId) {
    try {
      const testCourse = {
        title: "AI Fundamentals Test Course",
        subtitle: "Learn the basics of artificial intelligence",
        description: "This is a comprehensive test course covering fundamental concepts in artificial intelligence, machine learning, and data science. Perfect for beginners who want to understand how AI works.",
        category: "AI Fundamentals",
        level: "beginner",
        language: "English",
        price: 49,
        currency: "USD",
        tags: ["ai", "machine-learning", "test", "beginner"],
        objectives: [
          "Understand basic AI concepts",
          "Learn about machine learning",
          "Explore real-world AI applications",
          "Build your first AI model"
        ],
        requirements: [
          "Basic computer skills",
          "No prior AI experience needed",
          "Enthusiasm to learn"
        ],
        targetAudience: [
          "Beginners interested in AI",
          "Students exploring AI careers",
          "Professionals looking to understand AI"
        ],
        curriculum: [
          {
            title: "Introduction to AI",
            description: "Overview of artificial intelligence and its applications",
            duration: 90,
            lessons: [
              {
                title: "What is Artificial Intelligence?",
                type: "video",
                duration: 30,
                content: "Introduction to AI concepts and terminology",
                videoUrl: "",
                resources: []
              },
              {
                title: "AI in Daily Life",
                type: "video", 
                duration: 25,
                content: "Examples of AI applications we use every day",
                videoUrl: "",
                resources: []
              },
              {
                title: "History of AI",
                type: "text",
                duration: 35,
                content: "Evolution of artificial intelligence from concept to reality",
                videoUrl: "",
                resources: []
              }
            ]
          },
          {
            title: "Machine Learning Basics",
            description: "Introduction to machine learning concepts and algorithms",
            duration: 120,
            lessons: [
              {
                title: "What is Machine Learning?",
                type: "video",
                duration: 40,
                content: "Understanding machine learning and its types",
                videoUrl: "",
                resources: []
              },
              {
                title: "Supervised vs Unsupervised Learning",
                type: "video",
                duration: 35,
                content: "Comparing different approaches to machine learning",
                videoUrl: "",
                resources: []
              },
              {
                title: "Your First ML Model",
                type: "assignment",
                duration: 45,
                content: "Hands-on exercise building a simple prediction model",
                videoUrl: "",
                resources: []
              }
            ]
          }
        ],
        thumbnail: null,
        previewVideo: null,
        allowDiscussion: true,
        enableCertificate: true,
        enableQuizzes: true
      };

      const result = await this.createCourse(testCourse, instructorId);
      if (result.success) {
        // Automatically publish the test course
        await this.publishCourse(result.courseId);
        return { 
          success: true, 
          courseId: result.courseId,
          message: 'Test course created and published successfully!'
        };
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new CourseService();
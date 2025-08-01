// src/hooks/useCourses.js
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import courseService from '../services/courseService';

export const useCourses = (filters = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await courseService.getCourses(filters);
      
      if (result.success) {
        setCourses(result.courses);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const refetch = useCallback(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch
  };
};

export const useCourse = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await courseService.getCourse(courseId);
      
      if (result.success) {
        setCourse(result.course);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const refetch = useCallback(() => {
    fetchCourse();
  }, [fetchCourse]);

  return {
    course,
    loading,
    error,
    refetch
  };
};

export const useCreateCourse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  const createCourse = useCallback(async (courseData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await courseService.createCourse(courseData, user.uid);
      
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

  return {
    createCourse,
    loading,
    error
  };
};

export const useUpdateCourse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCourse = useCallback(async (courseId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await courseService.updateCourse(courseId, updates);
      
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
    updateCourse,
    loading,
    error
  };
};

export const useEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  const enrollInCourse = useCallback(async (courseId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await courseService.enrollStudent(courseId, user.uid);
      
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

  const updateProgress = useCallback(async (courseId, moduleId, completed = true) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await courseService.updateProgress(courseId, user.uid, moduleId, completed);
      
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

  return {
    enrollInCourse,
    updateProgress,
    loading,
    error
  };
};

export const useStudentEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  const fetchEnrollments = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await courseService.getStudentEnrollments(user.uid);
      
      if (result.success) {
        setEnrollments(result.enrollments);
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
    fetchEnrollments();
  }, [fetchEnrollments]);

  const refetch = useCallback(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return {
    enrollments,
    loading,
    error,
    refetch
  };
};

export const useCourseReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  const addReview = useCallback(async (courseId, rating, comment) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await courseService.addReview(courseId, user.uid, rating, comment);
      
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

  return {
    addReview,
    loading,
    error
  };
};

export const useSearchCourses = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchCourses = useCallback(async (searchTerm, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await courseService.searchCourses(searchTerm, filters);
      
      if (result.success) {
        setResults(result.courses);
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
    searchCourses,
    results,
    loading,
    error
  };
};

export const useCourseUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadThumbnail = useCallback(async (courseId, file) => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);
      
      const result = await courseService.uploadThumbnail(courseId, file);
      
      if (!result.success) {
        setError(result.error);
      } else {
        setUploadProgress(100);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadVideo = useCallback(async (courseId, moduleId, file) => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);
      
      const result = await courseService.uploadVideo(courseId, moduleId, file);
      
      if (!result.success) {
        setError(result.error);
      } else {
        setUploadProgress(100);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    uploadThumbnail,
    uploadVideo,
    uploadProgress,
    uploading,
    error
  };
};
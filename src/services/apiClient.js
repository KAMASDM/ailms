// src/services/apiClient.js
import axios from 'axios';
import { auth } from './firebase';

class ApiClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    this.timeout = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const user = auth.currentUser;
          if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          auth.signOut();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message, details: error.response?.data };
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message, details: error.response?.data };
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message, details: error.response?.data };
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message, details: error.response?.data };
    }
  }

  // Course API methods
  async getCourses(params = {}) {
    return this.get('/courses', { params });
  }

  async getCourse(courseId) {
    return this.get(`/courses/${courseId}`);
  }

  async createCourse(courseData) {
    return this.post('/courses', courseData);
  }

  async updateCourse(courseId, courseData) {
    return this.put(`/courses/${courseId}`, courseData);
  }

  async deleteCourse(courseId) {
    return this.delete(`/courses/${courseId}`);
  }

  async enrollInCourse(courseId) {
    return this.post(`/courses/${courseId}/enroll`);
  }

  // Quiz API methods
  async getQuizzes(courseId = null) {
    const url = courseId ? `/courses/${courseId}/quizzes` : '/quizzes';
    return this.get(url);
  }

  async getQuiz(quizId) {
    return this.get(`/quizzes/${quizId}`);
  }

  async createQuiz(quizData) {
    return this.post('/quizzes', quizData);
  }

  async submitQuizAnswer(quizId, answers) {
    return this.post(`/quizzes/${quizId}/submit`, { answers });
  }

  // User progress API methods
  async getUserProgress() {
    return this.get('/user/progress');
  }

  async updateProgress(progressData) {
    return this.post('/user/progress', progressData);
  }

  // Analytics API methods
  async getAnalytics(type = 'student', timeRange = 'month') {
    return this.get(`/analytics/${type}`, { params: { timeRange } });
  }

  // Achievements API methods
  async getAchievements() {
    return this.get('/achievements');
  }

  async getUserAchievements() {
    return this.get('/user/achievements');
  }

  // Leaderboard API methods
  async getLeaderboard(type = 'points', timeframe = 'week') {
    return this.get('/leaderboard', { params: { type, timeframe } });
  }

  // File upload helper
  async uploadFile(file, type = 'course-material') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await this.client.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Utility methods
  getBaseURL() {
    return this.baseURL;
  }

  setTimeout(timeout) {
    this.client.defaults.timeout = timeout;
  }
}

export default new ApiClient();
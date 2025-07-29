// src/store/coursesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [],
  enrolledCourses: [],
  currentCourse: null,
  categories: [],
  searchResults: [],
  filters: {
    category: '',
    level: '',
    duration: '',
    rating: 0,
    price: 'all'
  },
  loading: false,
  error: null
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
      state.loading = false;
      state.error = null;
    },
    setEnrolledCourses: (state, action) => {
      state.enrolledCourses = action.payload;
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    addCourse: (state, action) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex(course => course.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter(course => course.id !== action.payload);
    },
    enrollInCourse: (state, action) => {
      const course = state.courses.find(course => course.id === action.payload.courseId);
      if (course && !state.enrolledCourses.some(enrolled => enrolled.id === course.id)) {
        state.enrolledCourses.push({
          ...course,
          enrolledAt: new Date().toISOString(),
          progress: 0,
          completedLessons: [],
          currentLesson: 0
        });
      }
    },
    updateCourseProgress: (state, action) => {
      const { courseId, progress, completedLessons, currentLesson } = action.payload;
      const enrolledCourse = state.enrolledCourses.find(course => course.id === courseId);
      if (enrolledCourse) {
        enrolledCourse.progress = progress;
        enrolledCourse.completedLessons = completedLessons;
        enrolledCourse.currentLesson = currentLesson;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCourses: (state) => {
      return initialState;
    }
  }
});

export const {
  setCourses,
  setEnrolledCourses,
  setCurrentCourse,
  setCategories,
  setSearchResults,
  setFilters,
  addCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  updateCourseProgress,
  setLoading,
  setError,
  clearError,
  resetCourses
} = coursesSlice.actions;

export default coursesSlice.reducer;
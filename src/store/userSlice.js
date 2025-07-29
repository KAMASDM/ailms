// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  preferences: {
    notifications: true,
    darkMode: false,
    language: 'en'
  },
  progress: {
    coursesEnrolled: [],
    coursesCompleted: [],
    totalPoints: 0,
    badges: [],
    streakDays: 0
  },
  tutorProfile: null,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    setUserPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setUserProgress: (state, action) => {
      state.progress = { ...state.progress, ...action.payload };
    },
    setTutorProfile: (state, action) => {
      state.tutorProfile = action.payload;
    },
    updatePoints: (state, action) => {
      state.progress.totalPoints += action.payload;
    },
    addBadge: (state, action) => {
      if (!state.progress.badges.includes(action.payload)) {
        state.progress.badges.push(action.payload);
      }
    },
    enrollCourse: (state, action) => {
      if (!state.progress.coursesEnrolled.includes(action.payload)) {
        state.progress.coursesEnrolled.push(action.payload);
      }
    },
    completeCourse: (state, action) => {
      if (!state.progress.coursesCompleted.includes(action.payload)) {
        state.progress.coursesCompleted.push(action.payload);
      }
    },
    updateStreak: (state, action) => {
      state.progress.streakDays = action.payload;
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
    resetUserData: (state) => {
      return initialState;
    }
  }
});

export const {
  setUserProfile,
  setUserPreferences,
  setUserProgress,
  setTutorProfile,
  updatePoints,
  addBadge,
  enrollCourse,
  completeCourse,
  updateStreak,
  setLoading,
  setError,
  clearError,
  resetUserData
} = userSlice.actions;

export default userSlice.reducer;
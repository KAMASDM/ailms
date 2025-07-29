// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import userSlice from './userSlice';
import coursesSlice from './coursesSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    courses: coursesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

// Type aliases removed because they are only valid in TypeScript files.
// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  userType: null // Make sure this is initialized to null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      state.error = null;
    },
    // Add this reducer
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    signOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.userType = null;
    }
  }
});

export const {
  setUser,
  setUserType, // Export the new action
  setLoading,
  setError,
  clearError,
  signOut
} = authSlice.actions;

export default authSlice.reducer;
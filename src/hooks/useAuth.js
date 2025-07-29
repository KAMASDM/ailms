// src/hooks/useAuth.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError, signOut as signOutAction, setUserType } from '../store/authSlice';
import { setUserProfile, resetUserData } from '../store/userSlice';
import authService from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error, userType } = useSelector(state => state.auth);

  useEffect(() => {
    // This listener handles all auth state changes.
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // If a user is found, fetch their profile from Firestore.
          const profileResult = await authService.getUserData(firebaseUser.uid);

          if (profileResult.success) {
            // Dispatch the serializable profile data to the user slice.
            dispatch(setUserProfile(profileResult.userData));
            // Dispatch the user type to the auth slice for role-based routing.
            dispatch(setUserType(profileResult.userData.userType));
            // Finally, dispatch the main user object to the auth slice.
            dispatch(setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            }));
          } else {
            // If fetching the profile fails, dispatch an error.
            throw new Error(profileResult.error);
          }
        } else {
          // If no user is logged in, sign them out completely.
          dispatch(signOutAction());
          dispatch(resetUserData());
        }
      } catch (e) {
        // Catch any errors during the process and dispatch them.
        dispatch(setError(e.message));
      } finally {
        // **Crucially, set loading to false in all cases.**
        // This ensures the loading spinner will always disappear.
        dispatch(setLoading(false));
      }
    });

    // Cleanup the listener on component unmount.
    return () => unsubscribe();
  }, [dispatch]);

  const signIn = async (email, password) => {
    dispatch(setLoading(true));
    const result = await authService.signInWithEmail(email, password);
    if (!result.success) {
      dispatch(setError(result.error));
      dispatch(setLoading(false)); // Stop loading on failure
    }
    return result;
  };

  const signUp = async (email, password, userData) => {
    dispatch(setLoading(true));
    const result = await authService.signUpWithEmail(email, password, userData);
    if (!result.success) {
      dispatch(setError(result.error));
      dispatch(setLoading(false));
    }
    return result;
  };

  const signInWithGoogle = async () => {
    dispatch(setLoading(true));
    const result = await authService.signInWithGoogle();
    if (!result.success) {
      dispatch(setError(result.error));
      dispatch(setLoading(false));
    }
    return result;
  };

  const signOut = async () => {
    dispatch(setLoading(true));
    const result = await authService.signOut();
    if (!result.success) {
      dispatch(setError(result.error));
      dispatch(setLoading(false));
    }
    return result;
  };

  const resetPassword = async (email) => {
    dispatch(setLoading(true));
    const result = await authService.resetPassword(email);
    dispatch(setLoading(false));
    if (!result.success) {
      dispatch(setError(result.error));
    }
    return result;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    userType,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword
  };
};
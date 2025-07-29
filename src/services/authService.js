// src/services/authService.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

class AuthService {
  // Sign in with email and password
  async signInWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign up with email and password
  async signUpWithEmail(email, password, userData) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update user profile
      await updateProfile(user, {
        displayName: userData.displayName
      });

      // Send email verification
      await sendEmailVerification(user);

      // Create user document in Firestore
      await this.createUserDocument(user, userData);

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user document exists, if not create one
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await this.createUserDocument(user, {
          userType: "student", // Default to student
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        });
      }

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create user document in Firestore
  async createUserDocument(user, additionalData) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const userData = {
        uid: user.uid,
        displayName: user.displayName || additionalData.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        userType: additionalData.userType || "student",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profile: {
          bio: "",
          skills: [],
          interests: [],
          level: "beginner"
        },
        preferences: {
          notifications: true,
          darkMode: false,
          language: "en"
        },
        progress: {
          coursesEnrolled: [],
          coursesCompleted: [],
          totalPoints: 0,
          badges: [],
          streakDays: 0
        }
      };

      // Add tutor-specific fields if user is a tutor
      if (additionalData.userType === "tutor") {
        userData.tutorProfile = {
          expertise: [],
          experience: "",
          rating: 0,
          totalStudents: 0,
          coursesCreated: [],
          verified: false
        };
      }

      await setDoc(userRef, userData);
    }
  }

  // Get user data from Firestore
  async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Convert timestamp to a serializable format (ISO string)
        if (userData.createdAt && typeof userData.createdAt.toDate === 'function') {
          userData.createdAt = userData.createdAt.toDate().toISOString();
        }
        if (userData.updatedAt && typeof userData.updatedAt.toDate === 'function') {
            userData.updatedAt = userData.updatedAt.toDate().toISOString();
        }
        return { success: true, userData };
      } else {
        return { success: false, error: "User document not found" };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
}

export default new AuthService();
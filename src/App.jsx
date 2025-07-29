// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './styles/theme';

// Common Components
import { ErrorBoundary, Layout, Loading } from './components/common';

// Authentication Components
import { 
  Login, 
  Register, 
  ForgotPassword, 
  AuthGuard, 
  StudentGuard, 
  TutorGuard, 
  GuestGuard 
} from './components/auth';

// Dashboard Components
import { StudentDashboard, TutorDashboard } from './components/dashboard';

// Course Components
import { 
  CourseList, 
  CourseDetail, 
  CourseCreator, 
  CoursePlayer 
} from './components/courses';

// Quiz Components
import { Quiz, QuizCreator, QuizList } from './components/quizzes';

// Analytics Components
import { StudentAnalytics, TutorAnalytics } from './components/analytics';

// Gamification Components
import { 
  Achievements, 
  Leaderboard, 
  ProgressTracking 
} from './components/gamification';

// Page Components
import {
  HomePage,
  ProfilePage,
  SettingsPage,
  CoursesPage,
  NotFoundPage,
  TutorCoursesPage,
  QuizResultsPage,
  CertificatesPage,
  StudyPlannerPage,
  BookmarksPage,
  SearchPage,
  LiveSessionsPage,
  CommunicationPage,
  RecommendationsPage
} from './pages';

// Protected route wrapper for students
const StudentRoute = ({ children }) => (
  <StudentGuard>
    <Layout>
      {children}
    </Layout>
  </StudentGuard>
);

// Protected route wrapper for tutors
const TutorRoute = ({ children }) => (
  <TutorGuard>
    <Layout>
      {children}
    </Layout>
  </TutorGuard>
);

// General protected route wrapper
const ProtectedRoute = ({ children, requiredUserType = null }) => (
  <AuthGuard requiredUserType={requiredUserType}>
    <Layout>
      {children}
    </Layout>
  </AuthGuard>
);

// Guest route wrapper (for login/register pages)
const GuestRoute = ({ children }) => (
  <GuestGuard>
    <Layout showSidebar={false} maxWidth="xl">
      {children}
    </Layout>
  </GuestGuard>
);

// Public route wrapper
const PublicRoute = ({ children, showSidebar = false }) => (
  <Layout showSidebar={showSidebar} maxWidth="xl">
    {children}
  </Layout>
);

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <HomePage />
                  </PublicRoute>
                } 
              />

              {/* Authentication Routes */}
              <Route 
                path="/login" 
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <GuestRoute>
                    <Register />
                  </GuestRoute>
                } 
              />
              <Route 
                path="/forgot-password" 
                element={
                  <GuestRoute>
                    <ForgotPassword />
                  </GuestRoute>
                } 
              />

              {/* Student Dashboard */}
              <Route 
                path="/dashboard" 
                element={
                  <StudentRoute>
                    <StudentDashboard />
                  </StudentRoute>
                } 
              />

              {/* Student Course Routes */}
              <Route 
                path="/courses" 
                element={
                  <StudentRoute>
                    <CoursesPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/courses/enrolled" 
                element={
                  <StudentRoute>
                    <CoursesPage filter="enrolled" />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/courses/completed" 
                element={
                  <StudentRoute>
                    <CoursesPage filter="completed" />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/course/:id" 
                element={
                  <StudentRoute>
                    <CourseDetail />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/course/:id/learn" 
                element={
                  <StudentRoute>
                    <CoursePlayer />
                  </StudentRoute>
                } 
              />

              {/* Student Quiz Routes */}
              <Route 
                path="/quizzes" 
                element={
                  <StudentRoute>
                    <QuizList />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/quiz/:id" 
                element={
                  <StudentRoute>
                    <Quiz />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/quiz/:id/results" 
                element={
                  <StudentRoute>
                    <QuizResultsPage />
                  </StudentRoute>
                } 
              />

              {/* Student Progress & Analytics */}
              <Route 
                path="/progress" 
                element={
                  <StudentRoute>
                    <ProgressTracking />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <StudentRoute>
                    <StudentAnalytics />
                  </StudentRoute>
                } 
              />

              {/* Gamification Routes */}
              <Route 
                path="/achievements" 
                element={
                  <StudentRoute>
                    <Achievements />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/leaderboard" 
                element={
                  <StudentRoute>
                    <Leaderboard />
                  </StudentRoute>
                } 
              />

              {/* Student Feature Routes */}
              <Route 
                path="/certificates" 
                element={
                  <StudentRoute>
                    <CertificatesPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/planner" 
                element={
                  <StudentRoute>
                    <StudyPlannerPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/bookmarks" 
                element={
                  <StudentRoute>
                    <BookmarksPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/search" 
                element={
                  <StudentRoute>
                    <SearchPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/live" 
                element={
                  <StudentRoute>
                    <LiveSessionsPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/communication" 
                element={
                  <StudentRoute>
                    <CommunicationPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/recommendations" 
                element={
                  <StudentRoute>
                    <RecommendationsPage />
                  </StudentRoute>
                } 
              />

              {/* Tutor Dashboard */}
              <Route 
                path="/tutor/dashboard" 
                element={
                  <TutorRoute>
                    <TutorDashboard />
                  </TutorRoute>
                } 
              />

              {/* Tutor Course Management */}
              <Route 
                path="/tutor/courses" 
                element={
                  <TutorRoute>
                    <TutorCoursesPage />
                  </TutorRoute>
                } 
              />
              <Route 
                path="/tutor/create-course" 
                element={
                  <TutorRoute>
                    <CourseCreator />
                  </TutorRoute>
                } 
              />
              <Route 
                path="/tutor/manage-courses" 
                element={
                  <TutorRoute>
                    <TutorCoursesPage />
                  </TutorRoute>
                } 
              />
              <Route 
                path="/tutor/course/:id" 
                element={
                  <TutorRoute>
                    <CourseDetail variant="tutor" />
                  </TutorRoute>
                } 
              />
              <Route 
                path="/tutor/course/:id/edit" 
                element={
                  <TutorRoute>
                    <CourseCreator editMode={true} />
                  </TutorRoute>
                } 
              />

              {/* Tutor Quiz Management */}
              <Route 
                path="/tutor/quizzes" 
                element={
                  <TutorRoute>
                    <QuizList variant="tutor" />
                  </TutorRoute>
                } 
              />
              <Route 
                path="/tutor/create-quiz" 
                element={
                  <TutorRoute>
                    <QuizCreator />
                  </TutorRoute>
                } 
              />
              <Route 
                path="/tutor/quiz/:id" 
                element={
                  <TutorRoute>
                    <Quiz variant="preview" />
                  </TutorRoute>
                } 
              />
              <Route 
                path="/tutor/quiz/:id/edit" 
                element={
                  <TutorRoute>
                    <QuizCreator editMode={true} />
                  </TutorRoute>
                } 
              />
              <Route 
                path="/tutor/quiz/:id/analytics" 
                element={
                  <TutorRoute>
                    <TutorAnalytics type="quiz" />
                  </TutorRoute>
                } 
              />

              {/* Tutor Analytics & Management */}
              <Route 
                path="/tutor/analytics" 
                element={
                  <TutorRoute>
                    <TutorAnalytics />
                  </TutorRoute>
                } 
              />
              <Route 
                path="/tutor/students" 
                element={
                  <TutorRoute>
                    <div>Students Management Page - To be implemented</div>
                  </TutorRoute>
                } 
              />
              <Route 
                path="/tutor/live" 
                element={
                  <TutorRoute>
                    <LiveSessionsPage variant="tutor" />
                  </TutorRoute>
                } 
              />
              <Route 
                path="/tutor/settings" 
                element={
                  <TutorRoute>
                    <SettingsPage variant="tutor" />
                  </TutorRoute>
                } 
              />

              {/* Shared Protected Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Additional Utility Routes */}
              <Route 
                path="/browse" 
                element={
                  <PublicRoute showSidebar={false}>
                    <CoursesPage variant="public" />
                  </PublicRoute>
                } 
              />

              {/* Error and Fallback Routes */}
              <Route 
                path="/404" 
                element={
                  <PublicRoute>
                    <NotFoundPage />
                  </PublicRoute>
                } 
              />

              {/* Catch-all route - redirect to home or 404 */}
              <Route 
                path="*" 
                element={<Navigate to="/404" replace />} 
              />
            </Routes>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
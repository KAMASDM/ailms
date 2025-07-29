// src/utils/constants.js
export const USER_TYPES = {
  STUDENT: 'student',
  TUTOR: 'tutor'
};

export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

export const COURSE_CATEGORIES = {
  MACHINE_LEARNING: 'Machine Learning',
  DEEP_LEARNING: 'Deep Learning',
  NATURAL_LANGUAGE_PROCESSING: 'Natural Language Processing',
  COMPUTER_VISION: 'Computer Vision',
  REINFORCEMENT_LEARNING: 'Reinforcement Learning',
  AI_ETHICS: 'AI Ethics',
  DATA_SCIENCE: 'Data Science',
  ROBOTICS: 'Robotics',
  NEURAL_NETWORKS: 'Neural Networks',
  AI_FUNDAMENTALS: 'AI Fundamentals'
};

export const QUIZ_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  ESSAY: 'essay',
  CODE: 'code'
};

export const BADGE_TYPES = {
  FIRST_COURSE: 'first_course',
  STREAK_7: 'streak_7',
  STREAK_30: 'streak_30',
  QUIZ_MASTER: 'quiz_master',
  FAST_LEARNER: 'fast_learner',
  DEDICATED_LEARNER: 'dedicated_learner',
  COURSE_COMPLETE: 'course_complete',
  TOP_PERFORMER: 'top_performer'
};

export const NOTIFICATION_TYPES = {
  COURSE_UPDATE: 'course_update',
  ASSIGNMENT_DUE: 'assignment_due',
  QUIZ_AVAILABLE: 'quiz_available',
  ACHIEVEMENT: 'achievement',
  MESSAGE: 'message',
  SYSTEM: 'system'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
  COURSE_DETAIL: '/course/:id',
  QUIZ: '/quiz/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  TUTOR_DASHBOARD: '/tutor/dashboard',
  CREATE_COURSE: '/tutor/create-course',
  MANAGE_COURSES: '/tutor/manage-courses'
};

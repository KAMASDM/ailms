// src/hooks/useQuizzes.js
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import quizService from '../services/quizService';

export const useQuizzes = (filters = {}) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await quizService.getQuizzes(filters);
      
      if (result.success) {
        setQuizzes(result.quizzes);
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
    fetchQuizzes();
  }, [fetchQuizzes]);

  const refetch = useCallback(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return {
    quizzes,
    loading,
    error,
    refetch
  };
};

export const useQuiz = (quizId) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuiz = useCallback(async () => {
    if (!quizId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await quizService.getQuiz(quizId);
      
      if (result.success) {
        setQuiz(result.quiz);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const refetch = useCallback(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  return {
    quiz,
    loading,
    error,
    refetch
  };
};

export const useCreateQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  const createQuiz = useCallback(async (quizData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await quizService.createQuiz(quizData, user.uid);
      
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
    createQuiz,
    loading,
    error
  };
};

export const useUpdateQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateQuiz = useCallback(async (quizId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await quizService.updateQuiz(quizId, updates);
      
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
    updateQuiz,
    loading,
    error
  };
};

export const useQuizAttempt = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const { user } = useSelector(state => state.auth);

  const submitQuiz = useCallback(async (quizId, answers, timeSpent) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await quizService.submitQuizAttempt(quizId, user.uid, answers, timeSpent);
      
      if (result.success) {
        setCurrentAttempt(result);
      } else {
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

  const canTakeQuiz = useCallback(async (quizId) => {
    try {
      setError(null);
      
      const result = await quizService.canStudentTakeQuiz(quizId, user.uid);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [user]);

  return {
    submitQuiz,
    canTakeQuiz,
    currentAttempt,
    loading,
    error
  };
};

export const useStudentQuizAttempts = (quizId = null) => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  const fetchAttempts = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await quizService.getStudentAttempts(user.uid, quizId);
      
      if (result.success) {
        setAttempts(result.attempts);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, quizId]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  const refetch = useCallback(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  return {
    attempts,
    loading,
    error,
    refetch
  };
};

export const useQuizAnalytics = (quizId) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!quizId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await quizService.getQuizAnalytics(quizId);
      
      if (result.success) {
        setAnalytics(result.analytics);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refetch = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch
  };
};

export const useQuizTimer = (timeLimit = null) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit ? timeLimit * 60 : null); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    let interval = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
        
        if (timeLimit) {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setIsRunning(false);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLimit]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeSpent(0);
    setTimeLeft(timeLimit ? timeLimit * 60 : null);
  }, [timeLimit]);

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeLeft,
    timeSpent,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime,
    isTimeUp: timeLimit && timeLeft === 0
  };
};

export const useQuizNavigation = (totalQuestions) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  const goToQuestion = useCallback((questionIndex) => {
    if (questionIndex >= 0 && questionIndex < totalQuestions) {
      setCurrentQuestion(questionIndex);
    }
  }, [totalQuestions]);

  const nextQuestion = useCallback(() => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuestion, totalQuestions]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  const setAnswer = useCallback((questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  }, []);

  const toggleFlag = useCallback((questionIndex) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  }, []);

  const getProgress = useCallback(() => {
    const answeredCount = Object.keys(answers).length;
    return {
      answered: answeredCount,
      total: totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0
    };
  }, [answers, totalQuestions]);

  const canSubmit = useCallback(() => {
    return Object.keys(answers).length === totalQuestions;
  }, [answers, totalQuestions]);

  return {
    currentQuestion,
    answers,
    flaggedQuestions,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    setAnswer,
    toggleFlag,
    getProgress,
    canSubmit,
    isFirstQuestion: currentQuestion === 0,
    isLastQuestion: currentQuestion === totalQuestions - 1
  };
};
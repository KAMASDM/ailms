// src/services/quizService.js
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

class QuizService {
  constructor() {
    this.quizzesCollection = 'quizzes';
    this.attemptsCollection = 'quiz_attempts';
    this.questionsCollection = 'quiz_questions';
  }

  // Create a new quiz
  async createQuiz(quizData, instructorId) {
    try {
      const quiz = {
        ...quizData,
        instructorId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'draft', // draft, published, archived
        totalAttempts: 0,
        averageScore: 0,
        questions: quizData.questions || [],
        settings: {
          timeLimit: quizData.timeLimit || null, // in minutes
          attemptsAllowed: quizData.attemptsAllowed || 1,
          randomizeQuestions: quizData.randomizeQuestions || false,
          randomizeAnswers: quizData.randomizeAnswers || false,
          showResults: quizData.showResults !== undefined ? quizData.showResults : true,
          showCorrectAnswers: quizData.showCorrectAnswers !== undefined ? quizData.showCorrectAnswers : true,
          passingScore: quizData.passingScore || 70,
          ...quizData.settings
        }
      };

      const docRef = await addDoc(collection(db, this.quizzesCollection), quiz);
      return { success: true, quizId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update quiz
  async updateQuiz(quizId, updates) {
    try {
      const quizRef = doc(db, this.quizzesCollection, quizId);
      await updateDoc(quizRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete quiz
  async deleteQuiz(quizId) {
    try {
      await deleteDoc(doc(db, this.quizzesCollection, quizId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get quiz by ID
  async getQuiz(quizId) {
    try {
      const quizDoc = await getDoc(doc(db, this.quizzesCollection, quizId));
      if (quizDoc.exists()) {
        const quizData = { id: quizDoc.id, ...quizDoc.data() };
        // Convert timestamps
        if (quizData.createdAt?.toDate) {
          quizData.createdAt = quizData.createdAt.toDate().toISOString();
        }
        if (quizData.updatedAt?.toDate) {
          quizData.updatedAt = quizData.updatedAt.toDate().toISOString();
        }
        return { success: true, quiz: quizData };
      } else {
        return { success: false, error: 'Quiz not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get quizzes with filters
  async getQuizzes(filters = {}) {
    try {
      let q = collection(db, this.quizzesCollection);
      
      // Apply filters
      const conditions = [];
      
      if (filters.status) {
        conditions.push(where('status', '==', filters.status));
      }
      
      if (filters.courseId) {
        conditions.push(where('courseId', '==', filters.courseId));
      }
      
      if (filters.instructorId) {
        conditions.push(where('instructorId', '==', filters.instructorId));
      }

      if (conditions.length > 0) {
        q = query(q, ...conditions);
      }

      // Apply ordering
      q = query(q, orderBy('createdAt', 'desc'));

      // Apply pagination
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const snapshot = await getDocs(q);
      const quizzes = snapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        // Convert timestamps
        if (data.createdAt?.toDate) {
          data.createdAt = data.createdAt.toDate().toISOString();
        }
        if (data.updatedAt?.toDate) {
          data.updatedAt = data.updatedAt.toDate().toISOString();
        }
        return data;
      });

      return { success: true, quizzes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Submit quiz attempt
  async submitQuizAttempt(quizId, studentId, answers, timeSpent) {
    try {
      // Get quiz to calculate score
      const quizResult = await this.getQuiz(quizId);
      if (!quizResult.success) {
        return quizResult;
      }

      const quiz = quizResult.quiz;
      const { score, totalPoints, correctAnswers, results } = this.calculateScore(quiz.questions, answers);

      // Create attempt record
      const attempt = {
        quizId,
        studentId,
        answers,
        score,
        totalPoints,
        timeSpent, // in seconds
        correctAnswers,
        results, // detailed results for each question
        submittedAt: serverTimestamp(),
        passed: score >= (quiz.settings?.passingScore || 70)
      };

      const docRef = await addDoc(collection(db, this.attemptsCollection), attempt);

      // Update quiz statistics
      await this.updateQuizStatistics(quizId);

      return { 
        success: true, 
        attemptId: docRef.id,
        score,
        totalPoints,
        passed: attempt.passed,
        results: quiz.settings?.showResults ? results : null
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Calculate quiz score
  calculateScore(questions, answers) {
    let score = 0;
    let totalPoints = 0;
    let correctAnswers = 0;
    const results = [];

    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const questionPoints = question.points || 1;
      totalPoints += questionPoints;

      let isCorrect = false;
      let earnedPoints = 0;

      switch (question.type) {
        case 'multiple_choice':
          isCorrect = userAnswer === question.correctAnswer;
          if (isCorrect) {
            earnedPoints = questionPoints;
            correctAnswers++;
          }
          break;

        case 'true_false':
          isCorrect = userAnswer === question.correctAnswer;
          if (isCorrect) {
            earnedPoints = questionPoints;
            correctAnswers++;
          }
          break;

        case 'multiple_select':
          // For multiple select, check if arrays match exactly
          const correctAnswers = question.correctAnswers || [];
          const selectedAnswers = userAnswer || [];
          isCorrect = correctAnswers.length === selectedAnswers.length &&
                     correctAnswers.every(answer => selectedAnswers.includes(answer));
          if (isCorrect) {
            earnedPoints = questionPoints;
            correctAnswers++;
          }
          break;

        case 'short_answer':
          // For short answers, do a simple case-insensitive comparison
          // In a real app, you might want more sophisticated matching
          const correctAnswer = question.correctAnswer?.toLowerCase().trim();
          const userAnswerText = userAnswer?.toLowerCase().trim();
          isCorrect = correctAnswer === userAnswerText;
          if (isCorrect) {
            earnedPoints = questionPoints;
            correctAnswers++;
          }
          break;

        default:
          // For essay questions or other types, manual grading might be required
          break;
      }

      score += earnedPoints;

      results.push({
        questionId: question.id || index,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer || question.correctAnswers,
        isCorrect,
        earnedPoints,
        totalPoints: questionPoints,
        explanation: question.explanation
      });
    });

    // Convert to percentage
    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    return {
      score: percentage,
      totalPoints,
      correctAnswers,
      results
    };
  }

  // Update quiz statistics
  async updateQuizStatistics(quizId) {
    try {
      // Get all attempts for this quiz
      const attemptsQuery = query(
        collection(db, this.attemptsCollection),
        where('quizId', '==', quizId)
      );
      
      const snapshot = await getDocs(attemptsQuery);
      const attempts = snapshot.docs.map(doc => doc.data());

      if (attempts.length === 0) return;

      // Calculate statistics
      const totalAttempts = attempts.length;
      const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
      const averageScore = Math.round(totalScore / totalAttempts);

      // Update quiz document
      const quizRef = doc(db, this.quizzesCollection, quizId);
      await updateDoc(quizRef, {
        totalAttempts,
        averageScore
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get student's quiz attempts
  async getStudentAttempts(studentId, quizId = null) {
    try {
      let q = collection(db, this.attemptsCollection);
      const conditions = [where('studentId', '==', studentId)];
      
      if (quizId) {
        conditions.push(where('quizId', '==', quizId));
      }

      q = query(q, ...conditions, orderBy('submittedAt', 'desc'));

      const snapshot = await getDocs(q);
      const attempts = snapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        // Convert timestamps
        if (data.submittedAt?.toDate) {
          data.submittedAt = data.submittedAt.toDate().toISOString();
        }
        return data;
      });

      return { success: true, attempts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get quiz analytics for instructor
  async getQuizAnalytics(quizId) {
    try {
      const attemptsQuery = query(
        collection(db, this.attemptsCollection),
        where('quizId', '==', quizId),
        orderBy('submittedAt', 'desc')
      );
      
      const snapshot = await getDocs(attemptsQuery);
      const attempts = snapshot.docs.map(doc => {
        const data = doc.data();
        if (data.submittedAt?.toDate) {
          data.submittedAt = data.submittedAt.toDate().toISOString();
        }
        return data;
      });

      // Calculate analytics
      const totalAttempts = attempts.length;
      const passedAttempts = attempts.filter(attempt => attempt.passed).length;
      const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
      
      const scores = attempts.map(attempt => attempt.score);
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
      const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
      const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

      const avgTimeSpent = attempts.length > 0 
        ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0) / attempts.length)
        : 0;

      // Score distribution
      const scoreRanges = {
        '90-100': 0,
        '80-89': 0,
        '70-79': 0,
        '60-69': 0,
        '0-59': 0
      };

      scores.forEach(score => {
        if (score >= 90) scoreRanges['90-100']++;
        else if (score >= 80) scoreRanges['80-89']++;
        else if (score >= 70) scoreRanges['70-79']++;
        else if (score >= 60) scoreRanges['60-69']++;
        else scoreRanges['0-59']++;
      });

      return {
        success: true,
        analytics: {
          totalAttempts,
          passedAttempts,
          passRate,
          averageScore,
          highestScore,
          lowestScore,
          avgTimeSpent,
          scoreDistribution: scoreRanges,
          recentAttempts: attempts.slice(0, 10) // Last 10 attempts
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check if student can take quiz
  async canStudentTakeQuiz(quizId, studentId) {
    try {
      const quizResult = await this.getQuiz(quizId);
      if (!quizResult.success) {
        return { success: false, canTake: false, reason: 'Quiz not found' };
      }

      const quiz = quizResult.quiz;
      
      // Check if quiz is published
      if (quiz.status !== 'published') {
        return { success: true, canTake: false, reason: 'Quiz is not available' };
      }

      // Get student's previous attempts
      const attemptsResult = await this.getStudentAttempts(studentId, quizId);
      if (!attemptsResult.success) {
        return attemptsResult;
      }

      const attempts = attemptsResult.attempts;
      const attemptsAllowed = quiz.settings?.attemptsAllowed || 1;

      if (attempts.length >= attemptsAllowed) {
        return { success: true, canTake: false, reason: 'Maximum attempts reached' };
      }

      return { success: true, canTake: true, attemptsUsed: attempts.length, attemptsAllowed };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new QuizService();
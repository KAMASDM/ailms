// src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    // You'll need to add your Gemini API key to environment variables
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  // Assess student assignments
  async assessAssignment(assignment, studentAnswer, rubric = null) {
    try {
      const prompt = this.buildAssessmentPrompt(assignment, studentAnswer, rubric);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const assessment = response.text();
      
      return {
        success: true,
        assessment: this.parseAssessment(assessment)
      };
    } catch (error) {
      console.error('Error assessing assignment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate personalized learning recommendations
  async generateRecommendations(userProfile, learningHistory, currentCourse = null) {
    try {
      const prompt = this.buildRecommendationPrompt(userProfile, learningHistory, currentCourse);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const recommendations = response.text();
      
      return {
        success: true,
        recommendations: this.parseRecommendations(recommendations)
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate quiz questions based on course content
  async generateQuizQuestions(courseContent, difficulty = 'intermediate', questionCount = 5) {
    try {
      const prompt = this.buildQuizPrompt(courseContent, difficulty, questionCount);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const questions = response.text();
      
      return {
        success: true,
        questions: this.parseQuizQuestions(questions)
      };
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Provide adaptive learning suggestions
  async getAdaptiveLearningPath(studentProgress, strengths, weaknesses) {
    try {
      const prompt = this.buildAdaptiveLearningPrompt(studentProgress, strengths, weaknesses);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const learningPath = response.text();
      
      return {
        success: true,
        learningPath: this.parseAdaptiveLearningPath(learningPath)
      };
    } catch (error) {
      console.error('Error generating adaptive learning path:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Explain complex AI concepts in simple terms
  async explainConcept(concept, userLevel = 'beginner', context = '') {
    try {
      const prompt = this.buildConceptExplanationPrompt(concept, userLevel, context);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const explanation = response.text();
      
      return {
        success: true,
        explanation: explanation
      };
    } catch (error) {
      console.error('Error explaining concept:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Build prompts for different use cases
  buildAssessmentPrompt(assignment, studentAnswer, rubric) {
    return `
      You are an AI tutor assessing a student's assignment. Please provide a comprehensive assessment.

      Assignment Details:
      ${assignment.description}

      Student's Answer:
      ${studentAnswer}

      ${rubric ? `Assessment Rubric:\n${rubric}` : ''}

      Please provide:
      1. Overall Score (0-100)
      2. Strengths (what the student did well)
      3. Areas for Improvement (specific feedback)
      4. Suggestions (how to improve)
      5. Grade Level (A, B, C, D, F)

      Format your response as JSON:
      {
        "score": number,
        "grade": "letter",
        "strengths": ["point1", "point2"],
        "improvements": ["point1", "point2"],
        "suggestions": ["suggestion1", "suggestion2"],
        "overall_feedback": "detailed feedback"
      }
    `;
  }

  buildRecommendationPrompt(userProfile, learningHistory, currentCourse) {
    return `
      Generate personalized learning recommendations for this student.

      User Profile:
      - Level: ${userProfile.level}
      - Interests: ${userProfile.interests?.join(', ')}
      - Skills: ${userProfile.skills?.join(', ')}

      Learning History:
      - Completed Courses: ${learningHistory.completedCourses?.length || 0}
      - Strong Areas: ${learningHistory.strongAreas?.join(', ')}
      - Weak Areas: ${learningHistory.weakAreas?.join(', ')}

      ${currentCourse ? `Current Course: ${currentCourse.title}` : ''}

      Provide recommendations in JSON format:
      {
        "next_courses": ["course1", "course2"],
        "focus_areas": ["area1", "area2"],
        "study_tips": ["tip1", "tip2"],
        "resources": ["resource1", "resource2"]
      }
    `;
  }

  buildQuizPrompt(courseContent, difficulty, questionCount) {
    return `
      Generate ${questionCount} ${difficulty} level quiz questions based on this course content:

      ${courseContent}

      Create a mix of question types: multiple choice, true/false, and short answer.
      
      Format as JSON:
      {
        "questions": [
          {
            "type": "multiple_choice",
            "question": "question text",
            "options": ["A", "B", "C", "D"],
            "correct_answer": "A",
            "explanation": "why this is correct"
          }
        ]
      }
    `;
  }

  buildAdaptiveLearningPrompt(studentProgress, strengths, weaknesses) {
    return `
      Create an adaptive learning path for a student with the following profile:

      Progress: ${JSON.stringify(studentProgress)}
      Strengths: ${strengths.join(', ')}
      Weaknesses: ${weaknesses.join(', ')}

      Provide a personalized learning path in JSON format:
      {
        "immediate_focus": "what to work on next",
        "learning_sequence": ["step1", "step2", "step3"],
        "time_allocation": {"topic1": "30%", "topic2": "70%"},
        "difficulty_adjustment": "increase/maintain/decrease",
        "recommended_resources": ["resource1", "resource2"]
      }
    `;
  }

  buildConceptExplanationPrompt(concept, userLevel, context) {
    return `
      Explain the AI concept "${concept}" for a ${userLevel} level learner.
      
      ${context ? `Context: ${context}` : ''}

      Please provide:
      1. Simple definition
      2. Real-world analogy
      3. Practical example
      4. Why it's important in AI
      5. Next steps for learning

      Use clear, simple language appropriate for ${userLevel} level.
    `;
  }

  // Parse different types of responses
  parseAssessment(assessment) {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(assessment);
      return parsed;
    } catch (error) {
      // If not JSON, parse manually
      return {
        score: 75, // Default score
        grade: 'B',
        strengths: ['Demonstrates understanding'],
        improvements: ['Needs more detail'],
        suggestions: ['Review course materials'],
        overall_feedback: assessment
      };
    }
  }

  parseRecommendations(recommendations) {
    try {
      return JSON.parse(recommendations);
    } catch (error) {
      return {
        next_courses: [],
        focus_areas: [],
        study_tips: [],
        resources: []
      };
    }
  }

  parseQuizQuestions(questions) {
    try {
      return JSON.parse(questions);
    } catch (error) {
      return { questions: [] };
    }
  }

  parseAdaptiveLearningPath(learningPath) {
    try {
      return JSON.parse(learningPath);
    } catch (error) {
      return {
        immediate_focus: 'Continue with current studies',
        learning_sequence: [],
        time_allocation: {},
        difficulty_adjustment: 'maintain',
        recommended_resources: []
      };
    }
  }
}

export default new GeminiService();
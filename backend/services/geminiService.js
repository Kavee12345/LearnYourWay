const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

/**
 * Gemini Service - Handles AI-powered lesson generation
 */
class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  /**
   * Generate structured lesson content from text using Gemini API
   * @param {string} textContent - Educational text to process
   * @param {number} difficultyLevel - Difficulty level (1-5)
   * @returns {Promise<Object>} - Structured lesson with summary, concepts, and quiz
   */
  async generateLesson(textContent, difficultyLevel = 1) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      const difficultyDescriptions = {
        1: 'beginner level with simple explanations',
        2: 'elementary level with some technical terms',
        3: 'intermediate level with balanced explanations',
        4: 'advanced level with technical depth',
        5: 'expert level with complex concepts'
      };

      const prompt = `Convert this educational text into a structured 3-part interactive lesson.

Difficulty Level: ${difficultyLevel} (${difficultyDescriptions[difficultyLevel]})

Requirements:
1. Create a comprehensive summary (2-3 paragraphs) appropriate for the difficulty level
2. Generate 3 visual concepts, each with:
   - title: short title
   - description: detailed explanation
   - icon: emoji representation
3. Create a 5-question quiz with:
   - question: the question text
   - options: array of 4 multiple choice options
   - correct_answer: index of correct option (0-3)

Format the response ONLY as valid JSON with this exact structure:
{
  "summary": "...",
  "visual_concepts": [
    {"title": "...", "description": "...", "icon": "..."},
    ...
  ],
  "quiz": [
    {"question": "...", "options": [...], "correct_answer": 0},
    ...
  ]
}

Text to convert:
${textContent.substring(0, 4000)}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Extract JSON from response (handle markdown code blocks if present)
      let jsonString = responseText;
      const jsonMatch = responseText.match(/\`\`\`json\n?([\s\S]*?)\n?\`\`\`/);
      if (jsonMatch) {
        jsonString = jsonMatch[1];
      }

      const lessonContent = JSON.parse(jsonString);

      return {
        summary: lessonContent.summary,
        visual_concepts: lessonContent.visual_concepts,
        quiz: lessonContent.quiz,
        difficulty_level: difficultyLevel
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  /**
   * Calculate new difficulty level based on user performance
   * @param {number} userScore - Number of correct answers
   * @param {number} totalQuestions - Total questions attempted
   * @param {number} currentDifficulty - Current difficulty level
   * @returns {Object} - New difficulty, score percentage, and recommendation
   */
  async adjustDifficultyAndRegenerateQuiz(userScore, totalQuestions, currentDifficulty) {
    try {
      const scorePercentage = (userScore / totalQuestions) * 100;

      // Adaptive difficulty adjustment logic
      let newDifficulty = currentDifficulty;
      let recommendation = 'Maintaining difficulty';

      if (scorePercentage >= 85 && currentDifficulty < 5) {
        newDifficulty = currentDifficulty + 1;
        recommendation = 'Increasing difficulty - Great job!';
      } else if (scorePercentage < 50 && currentDifficulty > 1) {
        newDifficulty = currentDifficulty - 1;
        recommendation = 'Reducing difficulty - Let\'s review the basics';
      }

      return {
        newDifficulty,
        scorePercentage: scorePercentage.toFixed(2),
        recommendation,
        performance: scorePercentage >= 80 ? 'excellent' : scorePercentage >= 60 ? 'good' : 'needs-improvement'
      };
    } catch (error) {
      throw new Error(`Difficulty adjustment error: ${error.message}`);
    }
  }

  /**
   * Validate Gemini API key
   * @returns {Promise<boolean>} - True if API key is valid
   */
  async validateAPIKey() {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return false;
      }
      // Simple validation by attempting to get a model
      this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new GeminiService();

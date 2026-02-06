"use client";

import React, { useState } from 'react';
import { submitQuiz } from '@/services/api';

export const QuizComponent = ({ quizId, questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleSelectAnswer = (optionIndex) => {
    if (!submitted) {
      setSelectedAnswer(optionIndex);
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      let correctCount = 0;
      for (let i = 0; i < questions.length; i++) {
        if (newAnswers[i] === questions[i].correct_answer) {
          correctCount++;
        }
      }
      setScore(correctCount);

      submitQuizAnswers(newAnswers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const submitQuizAnswers = async (finalAnswers) => {
    setLoading(true);
    try {
      await submitQuiz(quizId, finalAnswers);
      setSubmitted(true);
      onComplete?.(finalAnswers.filter((ans, i) => ans === questions[i].correct_answer).length);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const percentage = ((score / questions.length) * 100).toFixed(2);

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl font-bold text-blue-600 mb-4">{score}/{questions.length}</div>
            <div className="text-3xl font-semibold text-gray-800 mb-2">Quiz Complete!</div>
            <div className="text-xl text-gray-600">{percentage}% Correct</div>
          </div>

          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            {percentage > '80' && (
              <p className="text-lg text-green-600 font-semibold">🎉 Excellent work! Your difficulty has been increased.</p>
            )}
            {percentage <= '80' && percentage > '60' && (
              <p className="text-lg text-blue-600 font-semibold">👍 Good job! Keep practicing.</p>
            )}
            {percentage <= '60' && (
              <p className="text-lg text-orange-600 font-semibold">📚 Let's review. Your difficulty has been adjusted.</p>
            )}
          </div>

          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
            onClick={() => window.location.href = '/dashboard'}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">{questions[currentQuestion].question}</h3>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full p-4 border-2 rounded-lg text-left transition ${
                  selectedAnswer === index
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                } ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                disabled={loading}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center ${
                      selectedAnswer === index ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
                    }`}
                  >
                    {selectedAnswer === index && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-gray-800">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={selectedAnswer === null || loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Submitting...' : currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

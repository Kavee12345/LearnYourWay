import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Quiz() {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/quiz`);
      setQuiz(response.data.quiz);
      setError('');
    } catch (err) {
      setError(`❌ Error loading quiz: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    if (!quiz || Object.keys(answers).length !== quiz.questions.length) {
      setError('❌ Please answer all questions');
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(`${API_BASE}/api/quiz/submit`, {
        quizId: quiz.id,
        answers: answers
      });

      setResult(response.data.result);
      setError('');
    } catch (err) {
      setError(`❌ Error submitting quiz: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main style={{ padding: '32px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
        <h1>📝 Quiz</h1>
        <p>Loading quiz...</p>
      </main>
    );
  }

  if (error && !quiz) {
    return (
      <main style={{ padding: '32px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
        <h1>📝 Quiz</h1>
        <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>
        <a href="/" style={{ color: '#007bff', textDecoration: 'none', marginTop: '20px', display: 'block' }}>← Back to Home</a>
      </main>
    );
  }

  return (
    <main style={{ padding: '32px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h1>📝 {quiz?.title || 'Quiz'}</h1>
      
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {result ? (
        <div style={{
          padding: '20px',
          backgroundColor: '#d4edda',
          borderRadius: '4px',
          border: '1px solid #c3e6cb',
          marginTop: '20px'
        }}>
          <h2>🎉 Quiz Complete!</h2>
          <p><strong>Score:</strong> {result.score}%</p>
          <p><strong>Correct:</strong> {result.correct} out of {result.total}</p>
          <p><strong>Feedback:</strong> {result.feedback}</p>
          <p><strong>Next Difficulty Level:</strong> {result.nextDifficulty}</p>
          
          <button
            onClick={() => {
              setQuiz(null);
              setAnswers({});
              setResult(null);
              fetchQuiz();
            }}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Take Another Quiz
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
          {quiz?.questions?.map((question, qIndex) => (
            <div key={question.id} style={{
              marginBottom: '25px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <h3>Question {qIndex + 1}: {question.text}</h3>
              <div style={{ marginTop: '10px' }}>
                {question.options.map((option, oIndex) => (
                  <label key={oIndex} style={{
                    display: 'block',
                    marginBottom: '8px',
                    padding: '8px',
                    backgroundColor: answers[question.id] === oIndex ? '#e3f2fd' : 'transparent',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={oIndex}
                      checked={answers[question.id] === oIndex}
                      onChange={() => handleAnswerChange(question.id, oIndex)}
                      style={{ marginRight: '8px' }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '12px 30px',
              backgroundColor: submitting ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </form>
      )}

      <div style={{ marginTop: '40px' }}>
        <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Home</a>
      </div>
    </main>
  );
}

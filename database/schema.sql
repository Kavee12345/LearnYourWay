-- Learn Your Way Educational Suite - MySQL Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  difficulty_level INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_users_email (email),
  CHECK (difficulty_level >= 1 AND difficulty_level <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  source_pdf_name VARCHAR(255),
  lesson_content JSON,
  summary TEXT,
  visual_concepts JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_lessons_user_id (user_id),
  KEY idx_lessons_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lesson_id INT NOT NULL,
  questions JSON NOT NULL,
  difficulty_level INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  KEY idx_quizzes_lesson_id (lesson_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Quiz Scores Table (for tracking user performance and adaptive learning)
CREATE TABLE IF NOT EXISTS quiz_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  score INT NOT NULL,
  correct_answers INT NOT NULL,
  total_questions INT NOT NULL,
  difficulty_level INT NOT NULL DEFAULT 1,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  KEY idx_quiz_scores_user_id (user_id),
  KEY idx_quiz_scores_completed_at (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Document Chunks Table (for storing text segments for RAG)
CREATE TABLE IF NOT EXISTS document_chunks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lesson_id INT NOT NULL,
  chunk_text LONGTEXT NOT NULL,
  embedding_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  KEY idx_document_chunks_lesson_id (lesson_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sessions Table (for tracking user sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_sessions_user_id (user_id),
  KEY idx_sessions_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample queries for common operations (MySQL placeholders use ?)

-- Get user's latest lessons
-- SELECT id, title, created_at FROM lessons WHERE user_id = ? ORDER BY created_at DESC LIMIT 10;

-- Get user's quiz performance over time
-- SELECT q.id, qs.score, qs.total_questions, qs.difficulty_level, qs.completed_at
-- FROM quiz_scores qs
-- JOIN quizzes q ON qs.quiz_id = q.id
-- WHERE qs.user_id = ?
-- ORDER BY qs.completed_at DESC
-- LIMIT 20;

-- Calculate user's average score at each difficulty level
-- SELECT difficulty_level, AVG(score/total_questions * 100) as avg_percentage, COUNT(*) as attempts
-- FROM quiz_scores
-- WHERE user_id = ?
-- GROUP BY difficulty_level
-- ORDER BY difficulty_level;

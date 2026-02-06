import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const uploadPDF = (file, title) => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('title', title);

  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      console.log(`Upload progress: ${percentCompleted}%`);
    }
  });
};

export const getLesson = (lessonId) => {
  return api.get(`/upload/lessons/${lessonId}`);
};

export const getUserLessons = (limit = 10, offset = 0) => {
  return api.get('/upload/lessons/user/me', {
    params: { limit, offset }
  });
};

export const deleteLesson = (lessonId) => {
  return api.delete(`/upload/lessons/${lessonId}`);
};

export const getQuiz = (quizId) => {
  return api.get(`/quiz/${quizId}`);
};

export const submitQuiz = (quizId, answers) => {
  return api.post('/quiz/submit', {
    quizId,
    answers
  });
};

export const getUserStatistics = () => {
  return api.get('/quiz/statistics/user');
};

export const getQuizHistory = (limit = 10, offset = 0) => {
  return api.get('/quiz/history/user', {
    params: { limit, offset }
  });
};

export const checkHealth = () => {
  return api.get('/health');
};

export default api;

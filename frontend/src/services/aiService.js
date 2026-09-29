import API from './api';

export const aiService = {
  chat: (prompt) => API.post('/ai/chat', { prompt }),
  getRecommendations: () => API.get('/ai/recommendations'),
  analyzeResume: () => API.get('/ai/analyze-resume')
};

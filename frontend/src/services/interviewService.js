import API from './api';

export const interviewService = {
  getExperiences: (params) => API.get('/interviews', { params }),
  getExperienceById: (id) => API.get(`/interviews/${id}`),
  createExperience: (data) => API.post('/interviews', data),
  deleteExperience: (id) => API.delete(`/interviews/${id}`)
};

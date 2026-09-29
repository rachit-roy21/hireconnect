import API from './api';

export const reviewService = {
  getReviews: (params) => API.get('/reviews', { params }),
  createReview: (data) => API.post('/reviews', data),
  deleteReview: (id) => API.delete(`/reviews/${id}`)
};

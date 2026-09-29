import API from './api';

export const adminService = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleUserStatus: (id) => API.put(`/admin/users/${id}/toggle-status`),
  getCompanies: () => API.get('/admin/companies'),
  createCompany: (data) => API.post('/admin/companies', data),
  updateCompany: (id, data) => API.put(`/admin/companies/${id}`, data),
  deleteCompany: (id) => API.delete(`/admin/companies/${id}`),
  getJobs: () => API.get('/admin/jobs'),
  getApplications: () => API.get('/admin/applications'),
  getReviews: () => API.get('/admin/reviews'),
  getInterviews: () => API.get('/admin/interviews'),
  moderateReview: (id, status) => API.put(`/admin/reviews/${id}/moderate`, { status }),
  moderateInterview: (id, status) => API.put(`/admin/interviews/${id}/moderate`, { status })
};

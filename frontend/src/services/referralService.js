import API from './api';

export const referralService = {
  requestReferral: (data) => API.post('/referrals', data),
  getStudentReferrals: () => API.get('/referrals/student'),
  getAlumniReferrals: () => API.get('/referrals/alumni'),
  updateStatus: (id, data) => API.put(`/referrals/${id}/status`, data)
};

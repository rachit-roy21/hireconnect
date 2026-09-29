import API from './api';

export const applicationService = {
  applyForJob: (data) => API.post('/applications', data),
  getStudentApplications: () => API.get('/applications/my-applications'),
  getJobApplicants: (jobId) => API.get(`/applications/job/${jobId}`),
  updateStatus: (id, statusData) => API.put(`/applications/${id}/status`, statusData)
};

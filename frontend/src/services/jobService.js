import API from './api';

export const jobService = {
  getJobs: (params) => API.get('/jobs', { params }),
  getJobById: (id) => API.get(`/jobs/${id}`),
  createJob: (jobData) => API.post('/jobs', jobData),
  updateJob: (id, jobData) => API.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => API.delete(`/jobs/${id}`),
  toggleSaveJob: (id) => API.post(`/jobs/${id}/save`),
  getSavedJobs: () => API.get('/jobs/saved'),
  getRecruiterJobs: () => API.get('/jobs/my-jobs'),
  getExternalJobs: (params) => API.get('/external-jobs', { params })
};

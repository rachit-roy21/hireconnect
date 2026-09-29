import API from './api';

export const profileService = {
  updateStudentProfile: (data) => API.put('/profiles/student', data),
  updateRecruiterProfile: (data) => API.put('/profiles/recruiter', data),
  updateAlumniProfile: (data) => API.put('/profiles/alumni', data),
  getAlumniList: (params) => API.get('/profiles/alumni', { params }),
  getAlumniById: (id) => API.get(`/profiles/alumni/${id}`),
  getStudentById: (userId) => API.get(`/profiles/student/${userId}`)
};

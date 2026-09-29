import API from './api';

export const authService = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me'),
  updatePassword: (passwords) => API.put('/auth/update-password', passwords)
};

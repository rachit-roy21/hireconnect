import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hireconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default API;

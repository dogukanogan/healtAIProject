// apiClient.js — Axios instance for real backend communication.
// All real API services import this instead of calling axios directly.

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ─────────────────────────────────────────────────────
// Attach JWT token from localStorage to every request automatically.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('healthai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────────────────────────────
// On 401: clear auth state and redirect to /login.
// On other errors: normalize the error message from backend response.
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('healthai_user');
      localStorage.removeItem('healthai_token');
      window.location.href = '/login';
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.';

    return Promise.reject(new Error(message));
  }
);

export default apiClient;

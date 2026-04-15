import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('healthai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Server Error';
    return Promise.reject(new Error(message));
  }
);

// ── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ── Posts ──────────────────────────────────────────────────────────────────
export const postsApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.domain) params.append('domain', filters.domain);
    if (filters.city) params.append('city', filters.city);
    if (filters.status) params.append('status', filters.status);
    if (filters.stage) params.append('stage', filters.stage);
    if (filters.expertise) params.append('expertise', filters.expertise);
    return api.get(`/posts?${params.toString()}`);
  },
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  changeStatus: (id, status) => api.patch(`/posts/${id}/status`, { status }),
  delete: (id) => api.delete(`/posts/${id}`),
};

// ── Meetings ───────────────────────────────────────────────────────────────
export const meetingsApi = {
  getAll: () => api.get('/meetings'),
  create: (data) => api.post('/meetings', data),
  respond: (id, action) => api.patch(`/meetings/${id}/respond`, { action }), // action: 'accepted' or 'declined'
};

// ── Admin ──────────────────────────────────────────────────────────────────
export const adminApi = {
  getUsers: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    return api.get(`/admin/users?${params.toString()}`);
  },
  suspendUser: (id) => api.patch(`/admin/users/${id}/suspend`),
  getLogs: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.action) params.append('action', filters.action);
    if (filters.userId) params.append('userId', filters.userId);
    return api.get(`/admin/logs?${params.toString()}`);
  },
  exportLogsCSV: (logs) => {
    const header = 'ID,User,Role,Action,Target,Result,Timestamp';
    const rows = logs.map((l) => `${l.id},${l.userName},${l.role},${l.action},${l.target},${l.result},${l.timestamp}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activity_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  },
};

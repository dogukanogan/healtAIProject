// api.js — Real API services using the axios client.
// All functions mirror the mockApi.js interface so switching is seamless.

import apiClient from './apiClient';

// ── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),

  login: (credentials) => apiClient.post('/auth/login', credentials),

  logout: () => apiClient.post('/auth/logout'),

  verifyEmail: (token) => apiClient.get(`/auth/verify-email?token=${token}`),

  me: () => apiClient.get('/auth/me'),
};

// ── Posts ──────────────────────────────────────────────────────────────────
export const postsApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.domain)    params.append('domain', filters.domain);
    if (filters.city)      params.append('city', filters.city);
    if (filters.status)    params.append('status', filters.status);
    if (filters.stage)     params.append('stage', filters.stage);
    if (filters.expertise) params.append('expertise', filters.expertise);
    return apiClient.get(`/posts?${params.toString()}`);
  },

  getById: (id) => apiClient.get(`/posts/${id}`),

  create: (data) => apiClient.post('/posts', data),

  update: (id, data) => apiClient.put(`/posts/${id}`, data),

  changeStatus: (id, status) => apiClient.patch(`/posts/${id}/status`, { status }),

  delete: (id) => apiClient.delete(`/posts/${id}`),
};

// ── Meetings ───────────────────────────────────────────────────────────────
export const meetingsApi = {
  getAll: () => apiClient.get('/meetings'),

  create: (data) => apiClient.post('/meetings', data),

  // action: 'accepted' | 'declined'
  respond: (id, action, confirmedSlot) =>
    apiClient.patch(`/meetings/${id}/respond`, { action, confirmedSlot }),
};

// ── Admin ──────────────────────────────────────────────────────────────────
export const adminApi = {
  getUsers: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    return apiClient.get(`/admin/users?${params.toString()}`);
  },

  suspendUser: (id) => apiClient.patch(`/admin/users/${id}/suspend`),

  getLogs: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.action) params.append('action', filters.action);
    if (filters.userId) params.append('userId', filters.userId);
    return apiClient.get(`/admin/logs?${params.toString()}`);
  },

  // CSV export — same client-side logic as mock since data is already in memory
  exportLogsCSV: (logs) => {
    const header = 'ID,User,Role,Action,Target,Result,Timestamp';
    const rows = logs.map(
      (l) => `${l.id},${l.userName},${l.role},${l.action},${l.target},${l.result},${l.timestamp}`
    );
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

// ── Profile ────────────────────────────────────────────────────────────────
export const profileApi = {
  getMe: () => apiClient.get('/profile/me'),

  updateMe: (data) => apiClient.put('/profile/me', data),

  // Returns JSON blob — handled client-side after receiving data
  exportMyData: () => apiClient.get('/profile/me/export'),

  // email re-confirmation required by backend
  deleteAccount: (email) => apiClient.delete('/profile/me', { data: { email } }),
};

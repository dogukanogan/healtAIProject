// services/index.js — Single import point for all API services.
//
// VITE_USE_MOCK=true  → uses mockApi.js (no backend needed, default for V1/V2 dev)
// VITE_USE_MOCK=false → uses api.js    (real Express backend)
//
// Usage in any component:
//   import { authApi, postsApi, meetingsApi, adminApi, profileApi } from '../../services';

import * as mock from './mockApi.js';
import * as real from './api.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// profileApi shim for mock mode (mockApi.js has no profile module)
const mockProfileApi = {
  getMe:         () => Promise.resolve(null),
  updateMe:      (data) => Promise.resolve(data),
  exportMyData:  () => Promise.resolve(null),
  deleteAccount: () => Promise.resolve({ message: 'Account deleted.' }),
};

export const authApi     = USE_MOCK ? mock.authApi     : real.authApi;
export const postsApi    = USE_MOCK ? mock.postsApi    : real.postsApi;
export const meetingsApi = USE_MOCK ? mock.meetingsApi : real.meetingsApi;
export const adminApi    = USE_MOCK ? mock.adminApi    : real.adminApi;
export const profileApi  = USE_MOCK ? mockProfileApi   : real.profileApi;

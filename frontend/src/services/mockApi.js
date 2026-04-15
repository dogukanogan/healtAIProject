// Mock API service — V1'de gerçek backend yok, bu dosya simüle eder.
// V2'de bu fonksiyonlar axios.get/post çağrılarına dönüşecek.

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ── Seed Data ──────────────────────────────────────────────────────────────
export const SEED_USERS = [
  { id: 1, name: 'Dogukan Ogan',    email: 'dogukan@university.edu',  role: 'engineer',             verified: true  },
  { id: 2, name: 'Dr. Ayse Kaya',  email: 'ayse@hospital.edu',       role: 'healthcare',           verified: true  },
  { id: 3, name: 'Admin User',      email: 'admin@healthai.edu',       role: 'admin',                verified: true  },
  { id: 4, name: 'Mehmet Demir',   email: 'mehmet@university.edu',   role: 'engineer',             verified: false },
  { id: 5, name: 'Dr. Fatma Yilmaz', email: 'fatma@clinic.edu',      role: 'healthcare',           verified: true  },
];

export const SEED_POSTS = [
  {
    id: 1, userId: 1, authorName: 'Dogukan Ogan', role: 'engineer',
    title: 'AI-Powered ECG Analysis Tool',
    domain: 'Cardiology Imaging',
    description: 'Developing a deep learning model for real-time ECG anomaly detection. Looking for a cardiologist to validate clinical scenarios.',
    expertiseRequired: 'Cardiology / Clinical Validation',
    city: 'Istanbul', country: 'Turkey',
    projectStage: 'prototype', commitmentLevel: 'Part-time (10h/week)',
    collaborationType: 'Research Partner',
    confidentiality: 'Public pitch — details in meeting',
    status: 'active',
    expiryDate: '2026-06-01',
    createdAt: '2026-03-10',
  },
  {
    id: 2, userId: 2, authorName: 'Dr. Ayse Kaya', role: 'healthcare',
    title: 'Digital Triage System for Emergency Departments',
    domain: 'Emergency Medicine',
    description: 'I have a workflow concept for AI-assisted patient triage. Need a software engineer to build the system.',
    expertiseRequired: 'Full-Stack Development / NLP',
    city: 'Ankara', country: 'Turkey',
    projectStage: 'concept_validation', commitmentLevel: 'Full-time',
    collaborationType: 'Co-Founder',
    confidentiality: 'Details discussed in meeting only',
    status: 'active',
    expiryDate: '2026-05-15',
    createdAt: '2026-03-15',
  },
  {
    id: 3, userId: 1, authorName: 'Dogukan Ogan', role: 'engineer',
    title: 'Wearable Fall Detection for Elderly Patients',
    domain: 'Geriatrics / IoT',
    description: 'Sensor-based fall detection prototype. Requires clinical expertise to refine alert thresholds.',
    expertiseRequired: 'Geriatrics / Physical Therapy',
    city: 'Istanbul', country: 'Turkey',
    projectStage: 'pilot_testing', commitmentLevel: 'Advisor (2h/week)',
    collaborationType: 'Advisor',
    confidentiality: 'Public pitch — details in meeting',
    status: 'meeting_scheduled',
    expiryDate: '2026-07-01',
    createdAt: '2026-02-20',
  },
  {
    id: 4, userId: 5, authorName: 'Dr. Fatma Yilmaz', role: 'healthcare',
    title: 'Mental Health Chatbot for University Students',
    domain: 'Psychiatry / NLP',
    description: 'Concept for an NLP-based mental health support bot. Seeking an ML engineer.',
    expertiseRequired: 'NLP / Machine Learning',
    city: 'Izmir', country: 'Turkey',
    projectStage: 'idea', commitmentLevel: 'Part-time (5h/week)',
    collaborationType: 'Research Partner',
    confidentiality: 'Details discussed in meeting only',
    status: 'draft',
    expiryDate: '2026-08-01',
    createdAt: '2026-04-01',
  },
  {
    id: 5, userId: 2, authorName: 'Dr. Ayse Kaya', role: 'healthcare',
    title: 'Radiological Image Labeling Platform',
    domain: 'Radiology',
    description: 'Need a platform to crowdsource radiological image labeling for training datasets.',
    expertiseRequired: 'Web Development / Computer Vision',
    city: 'Ankara', country: 'Turkey',
    projectStage: 'pre_deployment', commitmentLevel: 'Full-time',
    collaborationType: 'Co-Founder',
    confidentiality: 'Public pitch — details in meeting',
    status: 'active',
    expiryDate: '2026-05-30',
    createdAt: '2026-03-25',
  },
];

export const SEED_MEETINGS = [
  {
    id: 1, postId: 3, postTitle: 'Wearable Fall Detection for Elderly Patients',
    requesterId: 2, requesterName: 'Dr. Ayse Kaya',
    ownerId: 1, ownerName: 'Dogukan Ogan',
    status: 'accepted',
    ndaAccepted: true,
    proposedSlots: ['2026-04-15 14:00', '2026-04-16 10:00'],
    confirmedSlot: '2026-04-15 14:00',
    message: 'I have extensive experience with fall biomechanics. Would love to collaborate.',
    createdAt: '2026-04-02',
  },
];

export const SEED_LOGS = [
  { id: 1, userId: 1, userName: 'Dogukan Ogan', role: 'engineer', action: 'login',           target: '-',         result: 'success', timestamp: '2026-04-09 09:00' },
  { id: 2, userId: 1, userName: 'Dogukan Ogan', role: 'engineer', action: 'post_create',     target: 'Post #1',   result: 'success', timestamp: '2026-04-09 09:15' },
  { id: 3, userId: 2, userName: 'Dr. Ayse Kaya', role: 'healthcare', action: 'login',        target: '-',         result: 'success', timestamp: '2026-04-09 09:30' },
  { id: 4, userId: 2, userName: 'Dr. Ayse Kaya', role: 'healthcare', action: 'meeting_request', target: 'Post #3', result: 'success', timestamp: '2026-04-09 09:45' },
  { id: 5, userId: 4, userName: 'Mehmet Demir', role: 'engineer', action: 'login',           target: '-',         result: 'failed',  timestamp: '2026-04-09 10:00' },
  { id: 6, userId: 3, userName: 'Admin User',   role: 'admin',    action: 'post_remove',     target: 'Post #4',   result: 'success', timestamp: '2026-04-09 10:15' },
];

// ── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  register: async ({ name, email, password, role }) => {
    await delay();
    if (!email.endsWith('.edu')) throw new Error('Only institutional .edu email addresses are allowed.');
    if (SEED_USERS.find((u) => u.email === email)) throw new Error('This email is already registered.');
    const newUser = { id: Date.now(), name, email, role, verified: false };
    return { user: newUser, message: 'Registration successful. Please verify your email.' };
  },

  login: async ({ email, password }) => {
    await delay();
    const user = SEED_USERS.find((u) => u.email === email);
    if (!user) throw new Error('Invalid email or password.');
    return { user, token: 'mock-jwt-token-' + user.id };
  },

  verifyEmail: async (token) => {
    await delay();
    return { message: 'Email verified successfully.' };
  },

  logout: async () => {
    await delay(100);
    return { message: 'Logged out.' };
  },
};

// ── Posts ──────────────────────────────────────────────────────────────────
let postsStore = [...SEED_POSTS];

export const postsApi = {
  getAll: async (filters = {}) => {
    await delay();
    let results = [...postsStore];
    if (filters.domain)   results = results.filter((p) => p.domain.toLowerCase().includes(filters.domain.toLowerCase()));
    if (filters.city)     results = results.filter((p) => p.city.toLowerCase().includes(filters.city.toLowerCase()));
    if (filters.status)   results = results.filter((p) => p.status === filters.status);
    if (filters.stage)    results = results.filter((p) => p.projectStage === filters.stage);
    if (filters.expertise) results = results.filter((p) => p.expertiseRequired.toLowerCase().includes(filters.expertise.toLowerCase()));
    return results;
  },

  getById: async (id) => {
    await delay();
    const post = postsStore.find((p) => p.id === Number(id));
    if (!post) throw new Error('Post not found.');
    return post;
  },

  create: async (data) => {
    await delay();
    const newPost = { ...data, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    postsStore.push(newPost);
    return newPost;
  },

  update: async (id, data) => {
    await delay();
    postsStore = postsStore.map((p) => (p.id === Number(id) ? { ...p, ...data } : p));
    return postsStore.find((p) => p.id === Number(id));
  },

  changeStatus: async (id, status) => {
    await delay();
    postsStore = postsStore.map((p) => (p.id === Number(id) ? { ...p, status } : p));
    return postsStore.find((p) => p.id === Number(id));
  },

  delete: async (id) => {
    await delay();
    postsStore = postsStore.filter((p) => p.id !== Number(id));
    return { message: 'Post removed.' };
  },
};

// ── Meetings ───────────────────────────────────────────────────────────────
let meetingsStore = [...SEED_MEETINGS];

export const meetingsApi = {
  getAll: async () => {
    await delay();
    return meetingsStore;
  },

  create: async (data) => {
    await delay();
    const newMeeting = { ...data, id: Date.now(), status: 'pending', createdAt: new Date().toISOString().split('T')[0] };
    meetingsStore.push(newMeeting);
    return newMeeting;
  },

  respond: async (id, action) => {
    await delay();
    meetingsStore = meetingsStore.map((m) => (m.id === Number(id) ? { ...m, status: action } : m));
    return meetingsStore.find((m) => m.id === Number(id));
  },
};

// ── Admin ──────────────────────────────────────────────────────────────────
export const adminApi = {
  getUsers: async (filters = {}) => {
    await delay();
    let results = [...SEED_USERS];
    if (filters.role) results = results.filter((u) => u.role === filters.role);
    return results;
  },

  suspendUser: async (id) => {
    await delay();
    return { message: `User ${id} suspended.` };
  },

  getLogs: async (filters = {}) => {
    await delay();
    let results = [...SEED_LOGS];
    if (filters.action) results = results.filter((l) => l.action === filters.action);
    if (filters.userId) results = results.filter((l) => l.userId === Number(filters.userId));
    return results;
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

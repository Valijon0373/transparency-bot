import axios from 'axios';

const API_BASE_URL = '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Initial mock data fallback in case backend server is unreachable
const mockAppeals = [];

export const api = {
  login: async (username, password) => {
    try {
      const res = await client.post('/auth/login', { username, password });
      return res.data;
    } catch (err) {
      if (err.response) throw new Error(err.response.data.error || 'Kirish xatosi');
      // Fallback for offline client demo mode
      if (username === 'admin' && password === 'admin123') {
        const token = 'mock_jwt_token_demo';
        localStorage.setItem('admin_token', token);
        return { success: true, token, admin: { id: 1, username: 'admin', name: 'Super Administrator' } };
      }
      throw new Error('Parol yoki foydalanuvchi nomi noto\'g\'ri');
    }
  },

  getStats: async () => {
    try {
      const res = await client.get('/stats');
      return res.data.data;
    } catch (err) {
      // Mock stats
      return {
        total: mockAppeals.length,
        byStatus: [
          { status: 'Yangi', count: mockAppeals.filter(a => a.status === 'Yangi').length },
          { status: 'Jarayonda', count: mockAppeals.filter(a => a.status === 'Jarayonda').length },
          { status: 'Bajarildi', count: mockAppeals.filter(a => a.status === 'Bajarildi').length },
          { status: 'Rad etildi', count: mockAppeals.filter(a => a.status === 'Rad etildi').length }
        ],
        byCategory: [
          { category_key: 'corruption', count: mockAppeals.filter(a => a.category_key === 'corruption').length },
          { category_key: 'system', count: mockAppeals.filter(a => a.category_key === 'system').length }
        ]
      };
    }
  },

  getAppeals: async (params = {}) => {
    try {
      const res = await client.get('/appeals', { params });
      return res.data;
    } catch (err) {
      let filtered = [...mockAppeals];
      if (params.status && params.status !== 'ALL') {
        filtered = filtered.filter(a => a.status === params.status);
      }
      if (params.category_key && params.category_key !== 'ALL') {
        filtered = filtered.filter(a => a.category_key === params.category_key);
      }
      if (params.language && params.language !== 'ALL') {
        filtered = filtered.filter(a => a.language === params.language);
      }
      if (params.search) {
        const term = params.search.toLowerCase();
        filtered = filtered.filter(a => 
          a.tracking_id.toLowerCase().includes(term) ||
          a.phone_number.toLowerCase().includes(term) ||
          a.text.toLowerCase().includes(term)
        );
      }
      return { success: true, count: filtered.length, data: filtered };
    }
  },

  getAppealDetail: async (id) => {
    try {
      const res = await client.get(`/appeals/${id}`);
      return res.data.data;
    } catch (err) {
      const found = mockAppeals.find(a => a.id === Number(id));
      return found || mockAppeals[0];
    }
  },

  updateStatus: async (id, status, admin_notes) => {
    try {
      const res = await client.patch(`/appeals/${id}/status`, { status, admin_notes });
      return res.data;
    } catch (err) {
      const item = mockAppeals.find(a => a.id === Number(id));
      if (item) {
        item.status = status;
        if (admin_notes) item.admin_notes = admin_notes;
      }
      return { success: true, message: 'Status yangilandi', status };
    }
  },

  sendReply: async (id, message) => {
    try {
      const res = await client.post(`/appeals/${id}/reply`, { message });
      return res.data;
    } catch (err) {
      const item = mockAppeals.find(a => a.id === Number(id));
      if (item) {
        if (!item.replies) item.replies = [];
        item.replies.push({
          id: Date.now(),
          admin_username: 'admin',
          message,
          created_at: new Date().toISOString()
        });
      }
      return { success: true, message: 'Javob saqlandi', sentToTelegram: false };
    }
  }
};

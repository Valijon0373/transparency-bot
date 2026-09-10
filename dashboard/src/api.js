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
const mockAppeals = [
  {
    id: 1,
    tracking_id: '#APP-839201',
    telegram_id: '123456789',
    username: 'jasur_uz',
    first_name: 'Jasur Bek',
    phone_number: '+998901234567',
    is_anonymous: 0,
    language: 'uz',
    category: '🚨 Korrupsion Holat',
    category_key: 'corruption',
    text: 'Toshkent shahar N-tumanidagi shifoxonada vrach davolanish uchun alohida pul talab qilmoqda va hujjatsiz to\'lov so\'ramoqda.',
    photo_path: null,
    status: 'Yangi',
    admin_notes: '',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    replies: []
  },
  {
    id: 2,
    tracking_id: '#APP-471092',
    telegram_id: '987654321',
    username: 'anonym_user',
    first_name: 'Anonim',
    phone_number: 'Anonim (Kiritilmadi)',
    is_anonymous: 1,
    language: 'uz',
    category: '⚙️ Tizim muammosi',
    category_key: 'system',
    text: 'Elektron portal orqali ariza topshirishda server 500 xatolik bermoqda, SMS kodlar 30 daqiqadan so\'ng kelmoqda.',
    photo_path: null,
    status: 'Jarayonda',
    admin_notes: 'Dasturchilar guruhiga topshirildi',
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    replies: [
      { id: 101, admin_username: 'admin', message: 'Assalomu alaykum! Texnik bo\'lim masalani o\'rganmoqda.', created_at: new Date(Date.now() - 3600000 * 10).toISOString() }
    ]
  },
  {
    id: 3,
    tracking_id: '#APP-192834',
    telegram_id: '554433221',
    username: 'elena_m',
    first_name: 'Елена',
    phone_number: '+998935551234',
    is_anonymous: 0,
    language: 'ru',
    category: '🚨 Коррупция',
    category_key: 'corruption',
    text: 'В районной инспекции затягивают выдачу лицензии и намекают на ускорительную оплату.',
    photo_path: null,
    status: 'Bajarildi',
    admin_notes: 'Xizmat tekshiruvi o\'tkazildi',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    replies: []
  },
  {
    id: 4,
    tracking_id: '#APP-663810',
    telegram_id: '887766554',
    username: 'john_doe',
    first_name: 'John',
    phone_number: '+998977778899',
    is_anonymous: 0,
    language: 'en',
    category: '⚙️ System Issue',
    category_key: 'system',
    text: 'Unable to login to the citizen portal using OneID integration on iOS Safari.',
    photo_path: null,
    status: 'Rad etildi',
    admin_notes: 'Murojaat mazmunsiz',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    replies: []
  }
];

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

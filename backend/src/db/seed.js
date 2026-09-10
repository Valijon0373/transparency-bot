import { initDb, run, getOne } from './database.js';

const seedData = async () => {
  await initDb();

  const count = await getOne('SELECT COUNT(*) as cnt FROM appeals');
  if (count.cnt > 0) {
    console.log('Database already has appeals data. Skipping seed.');
    process.exit(0);
  }

  console.log('Seeding initial sample appeals into database...');

  const samples = [
    {
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
      status: 'Yangi',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
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
      status: 'Jarayonda',
      created_at: new Date(Date.now() - 3600000 * 14).toISOString()
    },
    {
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
      status: 'Bajarildi',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString()
    },
    {
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
      status: 'Rad etildi',
      created_at: new Date(Date.now() - 3600000 * 72).toISOString()
    }
  ];

  for (const s of samples) {
    await run(
      `INSERT INTO appeals 
       (tracking_id, telegram_id, username, first_name, phone_number, is_anonymous, language, category, category_key, text, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.tracking_id, s.telegram_id, s.username, s.first_name, s.phone_number, s.is_anonymous, s.language, s.category, s.category_key, s.text, s.status, s.created_at]
    );
  }

  console.log('Sample data seeded successfully.');
  process.exit(0);
};

seedData();

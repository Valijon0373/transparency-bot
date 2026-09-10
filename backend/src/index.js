import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db/database.js';
import { initBot } from './bot/bot.js';
import authRoutes from './routes/auth.js';
import appealRoutes from './routes/appeals.js';
import statsRoutes from './routes/stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads for attached images
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appeals', appealRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Transparency Appeals Backend API', timestamp: new Date() });
});

// Initialize DB and Bot, then start Express server
const startServer = async () => {
  try {
    await initDb();

    // Start Telegram Bot
    const bot = initBot(process.env.BOT_TOKEN);
    if (bot) {
      app.set('telegramBot', bot);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Express Backend Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

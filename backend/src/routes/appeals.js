import express from 'express';
import { query, getOne, run } from '../db/database.js';
import { verifyToken } from './auth.js';
import { getLangText } from '../bot/locales.js';

const router = express.Router();

// Helper to access telegram bot instance from app
const getBot = (req) => req.app.get('telegramBot');

// GET /api/appeals - list all appeals with filters & search
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, category_key, language, search } = req.query;

    let sql = 'SELECT * FROM appeals WHERE 1=1';
    const params = [];

    if (status && status !== 'ALL') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (category_key && category_key !== 'ALL') {
      sql += ' AND category_key = ?';
      params.push(category_key);
    }

    if (language && language !== 'ALL') {
      sql += ' AND language = ?';
      params.push(language);
    }

    if (search) {
      sql += ' AND (tracking_id LIKE ? OR phone_number LIKE ? OR text LIKE ? OR username LIKE ? OR first_name LIKE ? OR full_name LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term, term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const appeals = await query(sql, params);
    res.json({ success: true, count: appeals.length, data: appeals });
  } catch (err) {
    console.error('Error fetching appeals:', err);
    res.status(500).json({ error: 'Failed to fetch appeals' });
  }
});

// GET /api/appeals/:id - single appeal detail with replies
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const appeal = await getOne('SELECT * FROM appeals WHERE id = ?', [req.params.id]);
    if (!appeal) {
      return res.status(404).json({ error: 'Appeal not found' });
    }

    const replies = await query('SELECT * FROM replies WHERE appeal_id = ? ORDER BY created_at ASC', [req.params.id]);

    res.json({
      success: true,
      data: {
        ...appeal,
        replies
      }
    });
  } catch (err) {
    console.error('Error fetching appeal detail:', err);
    res.status(500).json({ error: 'Failed to fetch appeal detail' });
  }
});

// PATCH /api/appeals/:id/status - update status
router.patch('/:id/status', verifyToken, async (req, res) => {
  const { status, admin_notes } = req.body;
  const appealId = req.params.id;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const appeal = await getOne('SELECT * FROM appeals WHERE id = ?', [appealId]);
    if (!appeal) {
      return res.status(404).json({ error: 'Appeal not found' });
    }

    await run(
      'UPDATE appeals SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, admin_notes || appeal.admin_notes, appealId]
    );

    // Notify user on Telegram if bot is available
    const bot = getBot(req);
    if (bot && appeal.telegram_id) {
      try {
        const lang = appeal.language || 'uz';
        const msg = `${getLangText(lang, 'status_updated')}${appeal.tracking_id}\n\n${getLangText(lang, 'status_label')} **${status}**`;
        await bot.telegram.sendMessage(appeal.telegram_id, msg, { parse_mode: 'Markdown' });
      } catch (tgErr) {
        console.warn(`Could not send Telegram status update to user ${appeal.telegram_id}:`, tgErr.message);
      }
    }

    res.json({ success: true, message: 'Status updated successfully', status });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// POST /api/appeals/:id/reply - send admin reply to user
router.post('/:id/reply', verifyToken, async (req, res) => {
  const { message } = req.body;
  const appealId = req.params.id;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Reply message cannot be empty' });
  }

  try {
    const appeal = await getOne('SELECT * FROM appeals WHERE id = ?', [appealId]);
    if (!appeal) {
      return res.status(404).json({ error: 'Appeal not found' });
    }

    await run(
      'INSERT INTO replies (appeal_id, admin_username, message) VALUES (?, ?, ?)',
      [appealId, req.admin.username, message.trim()]
    );

    // Send reply via Telegram bot
    let sentToTelegram = false;
    const bot = getBot(req);
    if (bot && appeal.telegram_id) {
      try {
        const lang = appeal.language || 'uz';
        const msg = `${getLangText(lang, 'admin_reply_received')}${appeal.tracking_id}\n\n💬 **Javob:**\n${message.trim()}`;
        await bot.telegram.sendMessage(appeal.telegram_id, msg, { parse_mode: 'Markdown' });
        sentToTelegram = true;
      } catch (tgErr) {
        console.warn(`Failed to send Telegram message to ${appeal.telegram_id}:`, tgErr.message);
      }
    }

    res.json({
      success: true,
      message: sentToTelegram ? 'Reply sent to Telegram and saved' : 'Reply saved locally (Bot inactive or user blocked bot)',
      sentToTelegram
    });
  } catch (err) {
    console.error('Error saving reply:', err);
    res.status(500).json({ error: 'Failed to save reply' });
  }
});

export default router;

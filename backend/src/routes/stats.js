import express from 'express';
import { query, getOne } from '../db/database.js';
import { verifyToken } from './auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const totalRow = await getOne('SELECT COUNT(*) as total FROM appeals');
    const total = totalRow.total || 0;

    const statusCounts = await query(`
      SELECT status, COUNT(*) as count 
      FROM appeals 
      GROUP BY status
    `);

    const categoryCounts = await query(`
      SELECT category_key, category, COUNT(*) as count 
      FROM appeals 
      GROUP BY category_key
    `);

    const languageCounts = await query(`
      SELECT language, COUNT(*) as count 
      FROM appeals 
      GROUP BY language
    `);

    const recentAppeals = await query(`
      SELECT id, tracking_id, category, category_key, status, phone_number, created_at 
      FROM appeals 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        total,
        byStatus: statusCounts,
        byCategory: categoryCounts,
        byLanguage: languageCounts,
        recent: recentAppeals
      }
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;

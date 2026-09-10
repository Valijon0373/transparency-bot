import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'transparency.db');
const db = new sqlite3.Database(dbPath);

export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const initDb = async () => {
  console.log('Initializing database schema...');

  await run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS appeals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_id TEXT UNIQUE NOT NULL,
      telegram_id TEXT NOT NULL,
      username TEXT,
      first_name TEXT,
      phone_number TEXT,
      is_anonymous INTEGER DEFAULT 0,
      language TEXT DEFAULT 'uz',
      category TEXT NOT NULL,
      category_key TEXT NOT NULL,
      text TEXT NOT NULL,
      photo_path TEXT,
      telegram_photo_id TEXT,
      status TEXT DEFAULT 'Yangi',
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appeal_id INTEGER NOT NULL,
      admin_username TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (appeal_id) REFERENCES appeals(id) ON DELETE CASCADE
    )
  `);

  // Sync admin credentials from .env
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(adminPass, 10);

  const existingAdmin = await getOne('SELECT * FROM admins WHERE username = ?', [adminUser]);
  if (!existingAdmin) {
    await run(
      'INSERT INTO admins (username, password_hash, name) VALUES (?, ?, ?)',
      [adminUser, hash, 'Super Administrator']
    );
    console.log(`Default admin created: username='${adminUser}'`);
  } else {
    await run('UPDATE admins SET password_hash = ? WHERE username = ?', [hash, adminUser]);
    console.log(`Admin password synced from .env for user '${adminUser}'`);
  }

  console.log('Database initialization completed successfully.');
};

export default db;

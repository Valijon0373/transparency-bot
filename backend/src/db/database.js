import sqlite3 from 'sqlite3';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbType = process.env.DB_TYPE || (process.env.POSTGRES_DB ? 'postgres' : 'sqlite');
const isPostgres = dbType === 'postgres';

let sqliteDb = null;
let pgPool = null;

if (isPostgres) {
  const { Pool } = pg;
  pgPool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'transparency_user',
    password: process.env.POSTGRES_PASSWORD || 'transparency_pass_2026',
    database: process.env.POSTGRES_DB || 'transparency_db',
  });
  console.log(`🔌 Database driver set to PostgreSQL (${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB})`);
} else {
  const dbDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, 'transparency.db');
  sqliteDb = new sqlite3.Database(dbPath);
  console.log(`🔌 Database driver set to SQLite (${dbPath})`);
}

// Convert SQLite '?' placeholders to PostgreSQL '$1', '$2', ...
const formatSqlForPg = (sql) => {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
};

export const query = async (sql, params = []) => {
  if (isPostgres) {
    const pgSql = formatSqlForPg(sql);
    const res = await pgPool.query(pgSql, params);
    return res.rows;
  }
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getOne = async (sql, params = []) => {
  if (isPostgres) {
    const pgSql = formatSqlForPg(sql);
    const res = await pgPool.query(pgSql, params);
    return res.rows[0] || null;
  }
  return new Promise((resolve, reject) => {
    sqliteDb.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = async (sql, params = []) => {
  if (isPostgres) {
    let pgSql = formatSqlForPg(sql);
    if (/^\s*INSERT\s+INTO/i.test(sql) && !/RETURNING/i.test(sql)) {
      pgSql += ' RETURNING id';
    }
    const res = await pgPool.query(pgSql, params);
    return {
      lastID: res.rows?.[0]?.id || null,
      changes: res.rowCount
    };
  }
  return new Promise((resolve, reject) => {
    sqliteDb.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const initDb = async () => {
  console.log(`Initializing database schema (${dbType})...`);

  if (isPostgres) {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS appeals (
        id SERIAL PRIMARY KEY,
        tracking_id VARCHAR(255) UNIQUE NOT NULL,
        telegram_id VARCHAR(255) NOT NULL,
        username VARCHAR(255),
        first_name VARCHAR(255),
        phone_number VARCHAR(255),
        is_anonymous INTEGER DEFAULT 0,
        language VARCHAR(50) DEFAULT 'uz',
        category TEXT NOT NULL,
        category_key VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        photo_path TEXT,
        telegram_photo_id TEXT,
        status VARCHAR(50) DEFAULT 'Yangi',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS replies (
        id SERIAL PRIMARY KEY,
        appeal_id INTEGER NOT NULL REFERENCES appeals(id) ON DELETE CASCADE,
        admin_username VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } else {
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
  }

  // Sync admin credentials from .env
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'urspi2026!';
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

export default isPostgres ? pgPool : sqliteDb;

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://demo:demo@db:5432/demo';

const pool = new Pool({ connectionString });

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL
    );
  `);
  await pool.query(`
    INSERT INTO messages (text)
    SELECT 'Hello World from database'
    WHERE NOT EXISTS (SELECT 1 FROM messages);
  `);
}

const ready = init();

const getHello = async () => {
  await ready;
  const { rows } = await pool.query('SELECT id, text FROM messages ORDER BY id LIMIT 1');
  return rows[0] || { id: null, text: 'no message' };
};

const getMessages = async () => {
  await ready;
  const { rows } = await pool.query('SELECT id, text FROM messages ORDER BY id');
  return rows;
};

const createMessage = async (text) => {
  await ready;
  const { rows } = await pool.query('INSERT INTO messages (text) VALUES ($1) RETURNING id, text', [text]);
  return rows[0];
};

const updateMessage = async (id, text) => {
  await ready;
  const { rows } = await pool.query('UPDATE messages SET text = $1 WHERE id = $2 RETURNING id, text', [text, id]);
  return rows[0];
};

const end = () => pool.end();

module.exports = { getHello, getMessages, createMessage, updateMessage, end, dbPath: connectionString };

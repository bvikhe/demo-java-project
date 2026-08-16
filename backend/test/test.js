const assert = require('assert');
const db = require('../db');

(async () => {
  try {
    console.log('DB URL:', db.dbPath);
    const created = await db.createMessage('hello-from-test');
    assert(created.id, 'created id expected');
    const rows = await db.getMessages();
    assert(rows.length >= 1, 'expected at least one message');
    console.log('DB test passed');
  } finally {
    await db.end();
  }
})();

const Fastify = require('fastify');
const db = require('./db');

const fastify = Fastify();

fastify.get('/api/hello', async () => ({ message: 'Hello World from backend' }));

fastify.get('/api/db', async () => ({ message: (await db.getHello()).text }));

fastify.get('/api/messages', async () => db.getMessages());

fastify.post('/api/messages', async (req) => {
  const { text } = req.body;
  return db.createMessage(text || 'empty');
});

fastify.put('/api/messages/:id', async (req) => {
  const id = Number(req.params.id);
  const { text } = req.body;
  return db.updateMessage(id, text || '');
});

const start = async () => {
  try {
    await db.getHello();
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';
    await fastify.listen({ port, host });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();

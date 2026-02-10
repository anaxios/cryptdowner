import { Hono } from 'hono';
import KVStoreCFKV from './lib/KVStoreCFKV.js';
import { createMiddleware } from 'hono/factory';
const app = new Hono();

const rateLimiter = (keyFn) => {
  return createMiddleware(async (c, next) => {
    const key = keyFn ? keyFn(c) : new URL(c.req.url).pathname

    const { success } = await c.env.RATE_LIMITER.limit({ key })

    if (!success) {
      return c.text(`429 Failure – rate limit exceeded for ${key}`, 429)
    }

    await next()
  })
}

// Apply rate limiting middleware
app.use('*', rateLimiter());
//app.use('*', rateLimiter((c) => c.req.header('cf-connecting-ip') || 'unknown'));

app.get('/api/retrieve/:id', async (c) => {
    const db = new KVStoreCFKV(c.env);
    const id = await c.req.param('id');
    const data = await db.retrieve(id);
    if (! data) {
        return c.json({});
    }
    //console.log(data);
    const j = JSON.stringify(data);
    return c.json(j);
});

app.post('/api/store', async (c) => {
    const db = new KVStoreCFKV(c.env);
    const body = await c.req.json();
    const s = JSON.stringify(body);
    const r = await db.store(s);
    //const r = c.env.cryptdowner.put(generateID(), s, { expirationTtl: 60 });
    return c.json(r);
});

app.get('/', async (c) => {c.env.ASSETS.fetch('index.html')});

export default app;

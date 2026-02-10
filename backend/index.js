import { Hono } from 'hono';
//import { serveStatic } from 'hono/cloudflare-workers';
import KVStoreCFKV from './lib/KVStoreCFKV.js';

const app = new Hono();

//const db = new KVStore();

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

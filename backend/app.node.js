import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';
import KVStore from './lib/KVStore.js';

const db = new KVStore();
const app = new Hono();

const server = serve(app);

app.use('/*', serveStatic({ root: '../src' }));

// graceful shutdown
process.on('SIGINT', () => {
    db.close();
    server.close();
    process.exit(0);
});
process.on('SIGTERM', () => {
    server.close((err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        db.close();
        process.exit(0);
    });
});

export default app;

import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono();

app.use('/*', serveStatic({ root: '../src' }));

export default app;

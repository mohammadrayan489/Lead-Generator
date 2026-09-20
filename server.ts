import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import leadRouter from './src/api/leads';

const PORT = 3000;

async function startServer() {
  const app = express();

  // Configure robust body parser limits (50mb) to support large lead batches, multi-platform audits, and exclusion sets
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API routes FIRST
  app.use('/api/leads', leadRouter);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Handle payload and server errors gracefully
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err && (err.type === 'entity.too.large' || err.status === 413)) {
      return res.status(413).json({
        error: 'PayloadTooLargeError: request entity too large. The batch has been split or reduced.',
      });
    }
    if (err) {
      console.error('Express server error:', err);
      return res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
    }
    next();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

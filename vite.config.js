import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import handler from './api/analyze.js';

// Local API middleware plugin for Vercel-compatible /api/analyze emulation
function localApiPlugin() {
  return {
    name: 'local-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/analyze' && req.method === 'POST') {
          const chunks = [];
          req.on('data', chunk => {
            chunks.push(chunk);
          });
          req.on('end', async () => {
            try {
              const rawBody = Buffer.concat(chunks).toString('utf8');
              const parsedBody = rawBody ? JSON.parse(rawBody) : {};
              const mockReq = {
                method: req.method,
                body: parsedBody,
                headers: req.headers
              };
              const mockRes = {
                status(code) {
                  res.statusCode = code;
                  return this;
                },
                setHeader(name, val) {
                  res.setHeader(name, val);
                  return this;
                },
                json(data) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return this;
                },
                end(str) {
                  res.end(str);
                  return this;
                }
              };

              await handler(mockReq, mockRes);
            } catch (err) {
              console.error('[Local API Middleware Error]', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }
  if (env.GEMINI_MODEL) {
    process.env.GEMINI_MODEL = env.GEMINI_MODEL;
  }

  return {
    plugins: [react(), localApiPlugin()],
  };
});

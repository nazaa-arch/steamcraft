const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { initDatabase, setAppMode } = require('./src/db');
const { handleApiRequest } = require('./src/routes');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Sync environment mode if specified
if (process.env.APP_MODE) {
  setAppMode(process.env.APP_MODE);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Initialize database schema and default seeds
initDatabase();

const server = http.createServer((req, res) => {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Route API requests
  if (parsedUrl.pathname.startsWith('/api/')) {
    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk;
    });

    req.on('end', () => {
      let parsedBody = {};
      if (bodyData) {
        try {
          parsedBody = JSON.parse(bodyData);
        } catch (e) {
          parsedBody = {};
        }
      }
      handleApiRequest(req, res, parsedUrl, parsedBody);
    });
    return;
  }

  // Serve static files from /public
  let filePath = path.join(PUBLIC_DIR, parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log('===========================================================');
  console.log('  🚀 STEAM-Craft — Ruang Kolaborasi Multidisiplin Berjalan');
  console.log('===========================================================');
  console.log(`  Alamat Lokal : http://localhost:${PORT}`);
  console.log('  Database     : SQLite (steamcraft.db)');
  console.log('  Role Mahasiswa Demo: Budi Santoso (NIM: 202610101)');
  console.log('  Role Dosen Demo    : Dr. Rahmat Wijaya, M.Sc.');
  console.log('===========================================================');
});

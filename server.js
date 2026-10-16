// Máy chủ tĩnh chỉ lắng nghe trên máy cá nhân, không cần thư viện ngoài.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end('Method not allowed'); }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  const relative = path.relative(root, file);
  if (relative.startsWith('..') || path.isAbsolute(relative) || !['index.html', 'assets', 'data', 'js', 'pages', 'styles'].includes(relative.split(path.sep)[0])) {
    res.writeHead(403); return res.end('Forbidden');
  }
  fs.readFile(file, (error, content) => {
    if (error) { res.writeHead(404); return res.end('Không tìm thấy trang.'); }
    res.writeHead(200, { 'Content-Type': (types[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : content);
  });
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? 'Cổng 3000 đang được sử dụng. Hãy đóng máy chủ cũ rồi thử lại.' : error.message); process.exit(1); });
server.listen(3000, '127.0.0.1', () => console.log('Cổng sinh viên: http://localhost:3000\nNhấn Ctrl+C để dừng máy chủ.'));

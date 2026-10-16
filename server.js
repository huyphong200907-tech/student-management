// Máy chủ tĩnh chỉ lắng nghe trên máy cá nhân, không cần thư viện ngoài.

// 1. Khai báo các thư viện cần thiết
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// 2. Xác định thư mục gốc của website
const root = __dirname;

// 3. Khai báo các loại file được hỗ trợ
const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
};

// 4. Tạo máy chủ HTTP
const server = http.createServer((req, res) => {

    // Chỉ cho phép phương thức GET và HEAD
    if (!['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(405);
        return res.end('Method not allowed');
    }

    // Xử lý đường dẫn được yêu cầu
    let pathname;

    try {
        pathname = decodeURIComponent(
            new URL(req.url, 'http://localhost').pathname
        );
    } catch {
        res.writeHead(400);
        return res.end('Bad request');
    }

    // Xác định đường dẫn file cần truy cập
    const file = path.resolve(
        root,
        '.' + (pathname === '/' ? '/index.html' : pathname)
    );

    const relative = path.relative(root, file);

    // Kiểm tra quyền truy cập thư mục và file
    if (
        relative.startsWith('..') ||
        path.isAbsolute(relative) ||
        ![
            'index.html',
            'assets',
            'data',
            'js',
            'pages',
            'styles'
        ].includes(relative.split(path.sep)[0])
    ) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    // 5. Đọc file và gửi nội dung về trình duyệt
    fs.readFile(file, (error, content) => {

        // Trường hợp không tìm thấy file
        if (error) {
            res.writeHead(404);
            return res.end('Không tìm thấy trang.');
        }

        // Thiết lập HTTP Response
        res.writeHead(200, {
            'Content-Type':
                (types[path.extname(file)] || 'application/octet-stream') +
                '; charset=utf-8',

            'Cache-Control': 'no-cache',

            'X-Content-Type-Options': 'nosniff'
        });

        // Trả nội dung file về trình duyệt
        res.end(req.method === 'HEAD' ? undefined : content);
    });
});

// 6. Xử lý lỗi máy chủ
server.on('error', error => {

    console.error(
        error.code === 'EADDRINUSE'
            ? 'Cổng 3000 đang được sử dụng. Hãy đóng máy chủ cũ rồi thử lại.'
            : error.message
    );

    process.exit(1);
});

// 7. Khởi động máy chủ
server.listen(3000, '127.0.0.1', () => {

    console.log(
        'Cổng sinh viên: http://localhost:3000\n' +
        'Nhấn Ctrl+C để dừng máy chủ.'
    );

});
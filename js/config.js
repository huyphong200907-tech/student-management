
// Cấu hình, điều hướng, icon và các hàm tiện ích dùng chung.
export const DB = window.PORTAL_DATA;
if (!DB) throw new Error('Không tải được data/database.js. Kiểm tra thứ tự các thẻ script.');

export const page = document.body.dataset.page;
export const base = page === 'overview' ? '' : '../';

export const routes = {
  overview: 'index.html',
  tuition: 'pages/hoc-phi.html',
  schedule: 'pages/lich-hoc.html',
  results: 'pages/ket-qua.html',
  profile: 'pages/profile.html'
};

export const labels = {
  overview: 'Tổng quan',
  tuition: 'Học phí',
  schedule: 'Lịch học',
  results: 'Kết quả',
  profile: 'Profile'
};

const paths = {
  overview: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
  tuition: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18m-6 5h3M7 5V3h11"/>',
  schedule: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 5h2m4 0h2"/>',
  results: '<path d="M4 3v18h17M8 16v-4m5 4V8m5 8V5"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  cap: '<path d="m2 8 10-5 10 5-10 5L2 8Zm4 3v6q6 5 12 0v-6m4-3v9"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  bell: '<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3Zm5 4h4"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  book: '<path d="M12 5v16M3 3l9 2 9-2v16l-9 2-9-2V3Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>'
};

export const icon = (name, cls = '') => `
  <svg class="icon ${cls}" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="1.7"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    ${paths[name] || paths.book}
  </svg>
`;

// Sửa lỗi dấu nháy ở hàm esc() từ code gốc; ngăn HTML injection khi hiển thị dữ liệu.
export const esc = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[char]);

export const money = value =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export const dateText = value =>
  new Date(value + 'T12:00:00').toLocaleDateString('vi-VN');

export const link = key => base + routes[key];

export const sum = (rows, key) =>
  rows.reduce((total, row) => total + row[key], 0);

export function score(row) {
  return Math.round((row.process * 0.4 + row.exam * 0.6) * 10) / 10;
}

export function grade(row) {
  const n = score(row);

  return n >= 8.5 ? ['A', 4]
    : n >= 7 ? ['B', 3]
    : n >= 5.5 ? ['C', 2]
    : n >= 4 ? ['D', 1]
    : ['F', 0];
}

export function gpa(rows) {
  return rows.length
    ? (rows.reduce((n, row) => n + grade(row)[1] * row.credits, 0) / sum(rows, 'credits')).toFixed(2)
    : '0.00';
}

export function semesterSelect(semester) {
  return `
    <label class="select-label">
      Học kỳ
      <select id="semester">
        ${DB.semesters.map(s => `
          <option value="${s.id}" ${s.id === semester ? 'selected' : ''}>
            ${esc(s.name)}
          </option>
        `).join('')}
      </select>
    </label>
  `;
}

export function stat(label, value, note, symbol, color) {
  return `
    <div class="stat">
      <div class="stat-top">
        <span>${label}</span>
        <span class="mini-icon ${color}">${icon(symbol)}</span>
      </div>
      <strong>${value}</strong>
      <small>${note}</small>
    </div>
  `;
}

export function heading(title, description, actions = '') {
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">CỔNG THÔNG TIN SINH VIÊN</div>
        <h1>${title}</h1>
        <p>${description}</p>
      </div>
      <div class="heading-actions">${actions}</div>
    </div>
  `;
}

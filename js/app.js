'use strict';
// Toàn bộ giao diện sử dụng JavaScript thuần. Dữ liệu gốc nằm trong data/.
const DB = window.PORTAL_DATA;
const page = document.body.dataset.page;
const base = page === 'overview' ? '' : '../';
const routes = { overview: 'index.html', tuition: 'pages/hoc-phi.html', schedule: 'pages/lich-hoc.html', results: 'pages/ket-qua.html', profile: 'pages/profile.html' };
const labels = { overview: 'Tổng quan', tuition: 'Học phí', schedule: 'Lịch học', results: 'Kết quả', profile: 'Profile' };
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
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const money = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
const dateText = value => new Date(value + 'T12:00:00').toLocaleDateString('vi-VN');
const link = key => base + routes[key];
const sum = (rows, key) => rows.reduce((total, row) => total + row[key], 0);
function readSaved(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { toast('Trình duyệt không cho phép lưu dữ liệu.'); return false; } }
const savedProfile = readSaved('portal-profile-v1', {});
let student = { ...DB.student };
for (const key of ['email', 'phone', 'address', 'bio']) if (typeof savedProfile?.[key] === 'string') student[key] = savedProfile[key];
let payments = readSaved('portal-payments-v1', []);
if (!Array.isArray(payments)) payments = [];
const isPaid = row => row.paid || payments.some(payment => payment.ids?.includes(row.id));
let semester = DB.semesters[0].id;
let newsFilter = 'all';
let selectedFees = new Set();
let week = new Date(2026, 9, 5, 12);
let scheduleMode = 'week';
function score(row) { return Math.round((row.process * 0.4 + row.exam * 0.6) * 10) / 10; }
function grade(row) { const n = score(row); return n >= 8.5 ? ['A', 4] : n >= 7 ? ['B', 3] : n >= 5.5 ? ['C', 2] : n >= 4 ? ['D', 1] : ['F', 0]; }
function gpa(rows) { return rows.length ? (rows.reduce((n, row) => n + grade(row)[1] * row.credits, 0) / sum(rows, 'credits')).toFixed(2) : '0.00'; }
function semesterSelect() { return `<label class="select-label">Học kỳ<select id="semester">${DB.semesters.map(s => `<option value="${s.id}" ${s.id === semester ? 'selected' : ''}>${s.name}</option>`).join('')}</select></label>`; }
function stat(label, value, note, symbol, color) { return `<div class="stat"><div class="stat-top"><span>${label}</span><span class="mini-icon ${color}">${icon(symbol)}</span></div><strong>${value}</strong><small>${note}</small></div>`; }
function heading(title, description, actions = '') { return `<div class="page-heading"><div><div class="eyebrow">CỔNG THÔNG TIN SINH VIÊN</div><h1>${title}</h1><p>${description}</p></div><div class="heading-actions">${actions}</div></div>`; }
document.getElementById('app').innerHTML = `
  <a class="skip-link" href="#main">Đến nội dung chính</a>
  <button class="sidebar-scrim" aria-label="Đóng menu" tabindex="-1"></button>
  <aside class="sidebar" id="sidebar"><a class="brand" href="${link('overview')}"><img src="${base}assets/logo.svg" alt="Biểu tượng cổng sinh viên"><span>ĐẠI HỌC<br>GIAO THÔNG VẬN TẢI</span></a><div class="portal-label">STUDENT PORTAL <span>●</span></div><div class="nav-caption">KHÔNG GIAN SINH VIÊN</div><nav aria-label="Điều hướng chính">${Object.keys(routes).map(key => `<a class="nav-link ${page === key ? 'active' : ''}" href="${link(key)}" ${page === key ? 'aria-current="page"' : ''}>${icon(key)}<span>${labels[key]}</span>${page === key ? '<span class="nav-dot"></span>' : ''}</a>`).join('')}</nav><div class="sidebar-bottom"><div class="semester-note">${icon('cap')}<div><b>Năm học 2026 – 2027</b><small>Học kỳ I</small></div></div><div class="demo-tag">DỰ ÁN MÔ PHỎNG · BTL WEB</div></div></aside>
  <div class="workspace"><header class="topbar"><div class="breadcrumb"><button id="menu-toggle" class="icon-btn mobile-menu" aria-label="Mở menu" aria-controls="sidebar" aria-expanded="false">${icon('menu')}</button><span>Cổng sinh viên</span>${icon('chevron')}<b>${labels[page]}</b></div><div class="topbar-right"><form id="global-search" class="search-box" role="search"><label class="sr-only" for="search-input">Tìm kiếm thông báo, học phần</label>${icon('search')}<input id="search-input" placeholder="Tìm kiếm thông tin…" autocomplete="off"><kbd>↵</kbd></form><button id="notifications" class="icon-btn notification" aria-label="Xem thông báo">${icon('bell')}<i></i></button><a class="user-chip" href="${link('profile')}"><span class="avatar">DS</span><span><b>Trần Đức Sinh</b><small>Sinh viên · K65</small></span>${icon('chevron')}</a></div></header><main id="main" tabindex="-1"></main><footer><span>© 2026 Cổng thông tin sinh viên</span><span>Bài tập lớn Thiết kế web <i>•</i> Dữ liệu minh họa</span></footer></div>
  <dialog id="dialog" aria-labelledby="dialog-title"><div class="dialog-top"><h2 id="dialog-title"></h2><button class="icon-btn" id="dialog-close" aria-label="Đóng">${icon('close')}</button></div><div id="dialog-body"></div></dialog><div class="toast" role="status" aria-live="polite"></div>`;
const main = document.getElementById('main');
const dialog = document.getElementById('dialog');
function openDialog(title, body) { document.getElementById('dialog-title').textContent = title; document.getElementById('dialog-body').innerHTML = body; if (!dialog.open) dialog.showModal(); }
let toastTimer;
function toast(message) { const el = document.querySelector('.toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 4000); }
document.getElementById('dialog-close').onclick = () => dialog.close();
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
function toggleMenu(force) { const open = force ?? !document.body.classList.contains('menu-open'); document.body.classList.toggle('menu-open', open); document.getElementById('menu-toggle').setAttribute('aria-expanded', String(open)); }
document.getElementById('menu-toggle').onclick = () => toggleMenu();
document.querySelector('.sidebar-scrim').onclick = () => toggleMenu(false);
document.addEventListener('keydown', event => { if (event.key === 'Escape') toggleMenu(false); });
function newsRows(category, limit = 3) { return DB.news.filter(n => category === 'all' || n.category === category).slice(0, limit).map(n => `<button class="news-row" data-news="${n.id}"><span class="news-bullet">${icon('bell')}</span><span><b>${esc(n.title)}</b><small>${dateText(n.date)} <span>•</span> ${n.category === 'school' ? 'Nhà trường' : 'Đào tạo'}</small></span>${icon('chevron')}</button>`).join(''); }
function newsPanel(title, category) { return `<section class="panel news-panel"><div class="panel-heading"><h2>${title}</h2><button class="text-btn" data-news-list="${category}">Xem tất cả ${icon('arrow')}</button></div>${newsRows(category)}</section>`; }
function showNewsList(category) { newsFilter = category; openDialog('Tin tức & thông báo', `<div class="tabs">${[['all', 'Tất cả'], ['school', 'Nhà trường'], ['training', 'Đào tạo']].map(([id, title]) => `<button class="tab ${category === id ? 'active' : ''}" data-news-list="${id}">${title}</button>`).join('')}</div>${newsRows(category, 99)}`); }
document.getElementById('notifications').onclick = () => showNewsList('all');
document.addEventListener('click', event => {
  const news = event.target.closest('[data-news]');
  const list = event.target.closest('[data-news-list]');
  if (news) { const item = DB.news.find(n => n.id === Number(news.dataset.news)); openDialog(item.title, `<div class="article-meta">${dateText(item.date)} · Thông báo ${item.category === 'school' ? 'nhà trường' : 'đào tạo'}</div><p class="article-body">${esc(item.text)}</p><div class="notice">${icon('info')}Nội dung minh họa phục vụ bài tập lớn.</div><button class="btn secondary" data-news-list="${newsFilter}">Quay lại danh sách</button>`); }
  if (list) showNewsList(list.dataset.newsList);
});
document.getElementById('global-search').onsubmit = event => {
  event.preventDefault(); const query = document.getElementById('search-input').value.trim().toLocaleLowerCase('vi');
  if (!query) return toast('Nhập từ khóa để tìm kiếm.');
  const items = DB.news.filter(n => n.title.toLocaleLowerCase('vi').includes(query));
  const courses = DB.fees.filter(n => `${n.name} ${n.code}`.toLocaleLowerCase('vi').includes(query));
  const navigation = Object.keys(labels).filter(k => labels[k].toLocaleLowerCase('vi').includes(query));
  openDialog('Kết quả tìm kiếm', `<p class="muted">Từ khóa: “${esc(query)}” · ${items.length + courses.length + navigation.length} kết quả</p>${navigation.map(k => `<a class="search-result" href="${link(k)}">${icon(k)}<span>${labels[k]}</span>${icon('arrow')}</a>`).join('')}${items.map(n => `<button class="search-result" data-news="${n.id}">${icon('bell')}<span>${esc(n.title)}</span>${icon('arrow')}</button>`).join('')}${courses.map(n => `<a class="search-result" href="${link('results')}?semester=${n.semester}">${icon('book')}<span>${esc(n.name)} <small>${n.code} · ${DB.semesters.find(s => s.id === n.semester).name}</small></span>${icon('arrow')}</a>`).join('')}${!items.length && !courses.length && !navigation.length ? '<div class="empty-state">Không tìm thấy kết quả. Thử tên môn học hoặc “học phí”.</div>' : ''}`);
};
function overview() {
  const fees = DB.fees.filter(f => f.semester === '2026-1');
  main.innerHTML = `<section class="welcome"><div><span class="welcome-kicker">HỌC TẬP HÔM NAY, VỮNG BƯỚC NGÀY MAI</span><p>Chào mừng trở lại,</p><h1>Trần Đức Sinh <span>✦</span></h1><div class="welcome-date">${icon('schedule')}${new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date())}</div></div><div class="welcome-art" aria-hidden="true"><div class="orbit"></div><div class="cap-tile">${icon('cap')}</div><span class="art-spark">✧</span></div></section>
  <div class="section-caption"><h2>Góc học tập của bạn</h2><span>Học kỳ I · 2026 – 2027</span></div><div class="stats-grid">${stat('GPA tích lũy', gpa(DB.results), 'Thang điểm 4.0 · Dữ liệu mẫu', 'results', 'blue')}${stat('Tín chỉ tích lũy', sum(DB.results.filter(r => grade(r)[1] > 0), 'credits'), 'Tín chỉ đã đạt trong dữ liệu mẫu', 'book', 'purple')}${stat('Buổi học mỗi tuần', DB.schedule.length, 'Lịch mẫu · 07/09 – 20/12/2026', 'schedule', 'orange')}${stat('Học phí còn lại', money(sum(fees.filter(f => !isPaid(f)), 'amount')), 'Hạn đóng minh họa: 30/10/2026', 'tuition', 'green')}</div>
  <div class="quick-links">${[['schedule', 'orange', 'Sắp xếp thời gian', 'Thời khóa biểu'], ['tuition', 'green', 'Theo dõi tài chính', 'Tra cứu học phí'], ['results', 'blue', 'Hành trình học tập', 'Kết quả học tập'], ['profile', 'purple', 'Thông tin của bạn', 'Hồ sơ sinh viên']].map(([key, color, sub, title]) => `<a href="${link(key)}" class="quick-link"><span class="quick-icon ${color}">${icon(key)}</span><span><small>${sub}</small><b>${title}</b></span>${icon('arrow')}</a>`).join('')}</div>
  <div class="news-grid">${newsPanel('Tin nhà trường', 'school')}${newsPanel('Tin đào tạo', 'training')}</div>
  <div class="bottom-grid"><section class="panel"><div class="panel-heading"><h2>Hoạt động sinh viên</h2><span class="badge blue">THÁNG 10</span></div><div class="activity"><div class="activity-art">${icon('cap')}<span>CREATIVE<br>CAMPUS</span></div><div><span class="eyebrow">KẾT NỐI & PHÁT TRIỂN</span><h3>Tuần lễ sinh viên sáng tạo</h3><p>Cùng chia sẻ ý tưởng, khám phá công nghệ và tạo nên những điều mới.</p><button class="text-btn" data-news="3">Khám phá hoạt động ${icon('arrow')}</button></div></div></section><section class="panel reminders"><div class="panel-heading"><h2>Đừng bỏ lỡ</h2>${icon('clock')}</div><div class="reminder"><div class="date-box"><b>16</b><span>THÁNG 10</span></div><div><h3>Đăng ký bổ sung học phần</h3><p>Kiểm tra kế hoạch học tập của bạn.</p><button class="text-btn" data-news="4">Xem thông báo ${icon('arrow')}</button></div></div><div class="reminder"><div class="date-box warm"><b>30</b><span>THÁNG 10</span></div><div><h3>Hoàn thành học phí học kỳ I</h3><p>Theo dõi các khoản phí còn lại.</p><a class="text-btn" href="${link('tuition')}">Xem học phí ${icon('arrow')}</a></div></div></section></div>`;
}
function tuition() {
  const rows = DB.fees.filter(row => row.semester === semester);
  const unpaid = rows.filter(row => !isPaid(row));
  main.innerHTML = heading('Học phí', 'Theo dõi và quản lý các khoản học phí của bạn.', semesterSelect()) + `<div class="notice">${icon('info')}Chế độ bài tập: thanh toán chỉ được mô phỏng trên trình duyệt, không phát sinh giao dịch thật.</div><div class="stats-grid three">${stat('Tổng học phí', money(sum(rows, 'amount')), `${sum(rows, 'credits')} tín chỉ đăng ký`, 'tuition', 'blue')}${stat('Đã thanh toán', money(sum(rows.filter(isPaid), 'amount')), 'Bao gồm thanh toán mô phỏng', 'check', 'green')}${stat('Còn phải đóng', money(sum(unpaid, 'amount')), semester === '2026-1' ? 'Hạn đóng mẫu: 30/10/2026' : 'Học kỳ đã hoàn thành', 'clock', 'orange')}</div><section class="panel"><div class="panel-heading"><h2>Chi tiết học phí</h2><button id="export-fees" class="btn secondary compact">${icon('download')} Xuất CSV</button></div><div class="table-wrap"><table><thead><tr><th><input type="checkbox" id="select-all" aria-label="Chọn tất cả khoản chưa đóng" ${unpaid.length ? '' : 'disabled'}></th><th>Học phần</th><th>Tín chỉ</th><th>Số tiền</th><th>Trạng thái</th></tr></thead><tbody>${rows.map(row => `<tr><td><input type="checkbox" class="fee-check" data-id="${row.id}" aria-label="Chọn ${esc(row.name)}" ${isPaid(row) ? 'disabled' : ''}></td><td><b>${row.name}</b><small>${row.code}</small></td><td>${row.credits}</td><td class="numeric">${money(row.amount)}</td><td><span class="badge ${isPaid(row) ? 'green' : 'orange'}">${isPaid(row) ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></td></tr>`).join('')}</tbody></table></div><div class="payment-bar"><div><small id="selected-count">Chưa chọn khoản học phí</small><strong id="selected-total">${money(0)}</strong></div><button id="pay" class="btn primary" disabled>${icon('tuition')}Thanh toán mô phỏng</button></div></section><section class="panel history"><div class="panel-heading"><h2>Lịch sử thanh toán mô phỏng</h2><button class="text-btn" id="reset-payments" ${payments.length ? '' : 'disabled'}>Đặt lại dữ liệu</button></div>${payments.length ? payments.slice().reverse().map(p => `<div class="history-row"><span class="mini-icon green">${icon('check')}</span><div><b>${esc(p.reference)}</b><small>${esc(p.time)} · ${p.ids.length} học phần</small></div><strong>${money(p.total)}</strong></div>`).join('') : '<div class="empty-state">Chưa có giao dịch mô phỏng. Chọn học phần để trải nghiệm.</div>'}</section>`;
  selectedFees.clear();
  const update = () => {
    const chosen = unpaid.filter(row => selectedFees.has(row.id));
    document.getElementById('selected-count').textContent = `Đã chọn ${chosen.length} học phần`;
    document.getElementById('selected-total').textContent = money(sum(chosen, 'amount'));
    document.getElementById('pay').disabled = !chosen.length;
    const all = document.getElementById('select-all'); all.checked = !!unpaid.length && chosen.length === unpaid.length; all.indeterminate = chosen.length > 0 && chosen.length < unpaid.length;
  };
  document.querySelectorAll('.fee-check').forEach(input => input.onchange = () => { input.checked ? selectedFees.add(input.dataset.id) : selectedFees.delete(input.dataset.id); update(); });
  document.getElementById('select-all').onchange = event => { document.querySelectorAll('.fee-check:not(:disabled)').forEach(input => { input.checked = event.target.checked; input.checked ? selectedFees.add(input.dataset.id) : selectedFees.delete(input.dataset.id); }); update(); };
  document.getElementById('pay').onclick = () => {
    const chosen = unpaid.filter(row => selectedFees.has(row.id)); const total = sum(chosen, 'amount');
    openDialog('Xác nhận thanh toán mô phỏng', `<p>Bạn đã chọn ${chosen.length} học phần.</p><div class="payment-summary">${chosen.map(row => `<div><span>${row.name}</span><b>${money(row.amount)}</b></div>`).join('')}<div class="total"><span>Tổng cộng</span><b>${money(total)}</b></div></div><p class="muted">Không yêu cầu thẻ hoặc tài khoản ngân hàng. Kết quả chỉ lưu trên trình duyệt này.</p><button class="btn primary full" id="confirm-pay">Xác nhận mô phỏng</button>`);
    document.getElementById('confirm-pay').onclick = () => { const next = [...payments, { ids: chosen.map(r => r.id), total, time: new Date().toLocaleString('vi-VN'), reference: 'DEMO-' + Date.now().toString().slice(-8) }]; if (save('portal-payments-v1', next)) { payments = next; dialog.close(); render(); toast('Thanh toán mô phỏng thành công.'); } };
  };
  document.getElementById('reset-payments').onclick = () => { openDialog('Đặt lại thanh toán mẫu', '<p>Xóa các giao dịch bạn vừa mô phỏng và khôi phục trạng thái học phí ban đầu?</p><button id="confirm-reset" class="btn primary">Đặt lại dữ liệu</button>'); document.getElementById('confirm-reset').onclick = () => { if (save('portal-payments-v1', [])) { payments = []; dialog.close(); render(); toast('Đã khôi phục học phí mẫu.'); } }; };
  document.getElementById('export-fees').onclick = () => csv('hoc-phi', ['Mã học phần', 'Tên học phần', 'Tín chỉ', 'Số tiền (VND)', 'Trạng thái'], rows.map(r => [r.code, r.name, r.credits, r.amount, isPaid(r) ? 'Đã thanh toán' : 'Chưa thanh toán']));
}
function weekDates() { return Array.from({ length: 7 }, (_, index) => { const d = new Date(week); d.setDate(d.getDate() + index); return d; }); }
const shortDate = date => date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
function lessonMarkup(item, index) { return `<button class="lesson ${item.color}" data-lesson="${index}"><span class="lesson-time">${item.start} – ${item.end}</span><b>${item.name}</b><span>${icon('pin')}${item.room}</span><small>${item.type}</small></button>`; }
function schedule() {
  const dates = weekDates(); const inTerm = week >= new Date(2026, 8, 7) && week <= new Date(2026, 11, 14, 23);
  const sessions = inTerm ? DB.schedule : [];
  main.innerHTML = heading('Lịch học', 'Chủ động thời gian, sẵn sàng cho mỗi buổi học.', '<span class="badge blue">HỌC KỲ I · 2026 – 2027</span>') + `<section class="panel"><div class="calendar-toolbar"><div class="week-controls"><button class="icon-btn bordered" id="prev-week" aria-label="Tuần trước">${icon('chevron', 'flip')}</button><strong>${shortDate(dates[0])} – ${shortDate(dates[6])}/${dates[6].getFullYear()}</strong><button class="icon-btn bordered" id="next-week" aria-label="Tuần sau">${icon('chevron')}</button><button class="btn secondary compact" id="today-week">Tuần hiện tại</button></div><div class="tabs"><button id="week-mode" class="tab ${scheduleMode === 'week' ? 'active' : ''}">Theo tuần</button><button id="list-mode" class="tab ${scheduleMode === 'list' ? 'active' : ''}">Danh sách</button></div></div>${!inTerm ? '<div class="empty-state">Không có lịch học trong tuần này.<br><small>Lịch mẫu áp dụng từ 07/09 đến 20/12/2026.</small></div>' : scheduleMode === 'week' ? `<div class="table-wrap"><div class="calendar-grid">${dates.map((d, index) => `<div class="calendar-column"><div class="day-header ${d.toDateString() === new Date().toDateString() ? 'today' : ''}"><span>${index === 6 ? 'Chủ nhật' : 'Thứ ' + (index + 2)}</span><strong>${shortDate(d)}</strong></div><div class="day-lessons">${sessions.filter(s => s.day === index).map(s => lessonMarkup(s, DB.schedule.indexOf(s))).join('') || '<div class="free-day">Không có lịch</div>'}</div></div>`).join('')}</div></div>` : `<div class="schedule-list">${dates.map((d, day) => `<div class="schedule-list-row"><strong>${day === 6 ? 'Chủ nhật' : 'Thứ ' + (day + 2)}<small>${shortDate(d)}</small></strong><div>${sessions.filter(s => s.day === day).map(s => lessonMarkup(s, DB.schedule.indexOf(s))).join('') || '<p class="muted">Không có lịch học</p>'}</div></div>`).join('')}</div>`}<div class="calendar-legend"><span><i class="blue-dot"></i>Lịch học mẫu lặp lại hàng tuần</span><span>${icon('info')}Chọn buổi học để xem chi tiết</span></div></section><div class="notice">${icon('info')}Lịch minh họa không bao gồm điều chỉnh ngày lễ hoặc lịch thi. Tuần mẫu ban đầu: 05 – 11/10/2026.</div>`;
  document.getElementById('prev-week').onclick = () => { week.setDate(week.getDate() - 7); render(); };
  document.getElementById('next-week').onclick = () => { week.setDate(week.getDate() + 7); render(); };
  document.getElementById('today-week').onclick = () => { week = new Date(); week.setHours(12, 0, 0, 0); week.setDate(week.getDate() - (week.getDay() + 6) % 7); render(); };
  document.getElementById('week-mode').onclick = () => { scheduleMode = 'week'; render(); };
  document.getElementById('list-mode').onclick = () => { scheduleMode = 'list'; render(); };
  document.querySelectorAll('[data-lesson]').forEach(button => button.onclick = () => { const item = DB.schedule[button.dataset.lesson]; openDialog(item.name, `<span class="badge ${item.color}">${item.type}</span><dl class="details"><div><dt>Mã học phần</dt><dd>${item.code}</dd></div><div><dt>Ngày học</dt><dd>${dates[item.day].toLocaleDateString('vi-VN')}</dd></div><div><dt>Thời gian</dt><dd>${item.start} – ${item.end}</dd></div><div><dt>Phòng học</dt><dd>${item.room}</dd></div><div><dt>Giảng viên</dt><dd>${item.teacher}</dd></div></dl>`); });
}
function results() {
  const rows = DB.results.filter(row => row.semester === semester);
  const average = gpa(rows); const passed = rows.filter(r => grade(r)[1] > 0);
  main.innerHTML = heading('Kết quả học tập', 'Mỗi học phần là một bước tiến trên hành trình của bạn.', semesterSelect()) + `<div class="stats-grid three">${stat('GPA học kỳ', average + ' <em>/ 4.0</em>', Number(average) >= 3.6 ? 'Xếp loại mẫu: Xuất sắc' : Number(average) >= 3.2 ? 'Xếp loại mẫu: Giỏi' : Number(average) >= 2.5 ? 'Xếp loại mẫu: Khá' : Number(average) >= 2 ? 'Xếp loại mẫu: Trung bình' : Number(average) >= 1 ? 'Xếp loại mẫu: Yếu' : 'Xếp loại mẫu: Kém', 'results', 'blue')}${stat('Tín chỉ đạt', sum(passed, 'credits') + ' <em>/ ' + sum(rows, 'credits') + '</em>', 'Tín chỉ hoàn thành trong học kỳ', 'cap', 'green')}${stat('Học phần đạt', passed.length + ' <em>/ ' + rows.length + '</em>', 'Dữ liệu kết quả minh họa', 'check', 'purple')}</div><section class="panel"><div class="panel-heading"><h2>Bảng điểm học phần</h2><button class="btn secondary compact" id="export-results">${icon('download')}Xuất bảng điểm</button></div><div class="table-wrap"><table><thead><tr><th>Học phần</th><th>Tín chỉ</th><th>Quá trình</th><th>Điểm thi</th><th>Tổng kết</th><th>Điểm chữ</th><th>Kết quả</th></tr></thead><tbody>${rows.map(r => `<tr><td><b>${r.name}</b><small>${r.code}</small></td><td>${r.credits}</td><td>${r.process.toFixed(1)}</td><td>${r.exam.toFixed(1)}</td><td><strong class="score">${score(r).toFixed(1)}</strong></td><td><span class="grade ${grade(r)[0] === 'A' ? 'green' : 'blue'}">${grade(r)[0]}</span></td><td><span class="badge ${grade(r)[1] ? 'green' : 'orange'}">${grade(r)[1] ? 'Đạt' : 'Chưa đạt'}</span></td></tr>`).join('')}</tbody></table></div></section><div class="results-bottom"><section class="panel"><div class="panel-heading"><h2>Phân bố điểm chữ</h2><span class="muted">${rows.length} học phần</span></div><div class="grade-chart">${['A', 'B', 'C', 'D', 'F'].map(letter => { const count = rows.filter(r => grade(r)[0] === letter).length; return `<div class="bar-row"><b>${letter}</b><div class="bar-track"><div style="width:${count / Math.max(rows.length, 1) * 100}%"></div></div><span>${count}</span></div>`; }).join('')}</div></section><section class="panel"><div class="panel-heading"><h2>Cách tính điểm mẫu</h2>${icon('info')}</div><div class="grading-note"><p>Tổng kết = <b>40% quá trình + 60% điểm thi</b>, làm tròn 1 chữ số thập phân.</p><p>A ≥ 8.5 · B ≥ 7.0 · C ≥ 5.5 · D ≥ 4.0 · F &lt; 4.0</p><p>Quy đổi A/B/C/D/F tương ứng 4/3/2/1/0. GPA là trung bình có trọng số theo tín chỉ.</p><small>Quy tắc phục vụ bài tập, không phải quy định chính thức.</small></div></section></div>`;
  document.getElementById('export-results').onclick = () => csv('bang-diem', ['Mã học phần', 'Học phần', 'Tín chỉ', 'Quá trình', 'Điểm thi', 'Tổng kết', 'Điểm chữ', 'Hệ 4'], rows.map(r => [r.code, r.name, r.credits, r.process, r.exam, score(r), ...grade(r)]));
}
function profile() {
  main.innerHTML = heading('Hồ sơ sinh viên', 'Thông tin cá nhân và hành trình học tập của bạn.') + `<div class="profile-grid"><section class="panel profile-card"><div class="profile-cover"></div><div class="profile-avatar">DS<span>${icon('check')}</span></div><h2>${student.name}</h2><p>${student.id}</p><span class="badge green">Đang theo học</span><div class="profile-identity"><p>${icon('cap')}${student.major}</p><p>${icon('book')}${student.className}</p><p>${icon('schedule')}Khóa ${student.course}</p></div><div class="profile-note">${icon('info')}Hồ sơ minh họa cho bài tập lớn.<br>Không nhập dữ liệu nhạy cảm.</div></section><div><section class="panel"><div class="panel-heading"><h2>Thông tin học vụ</h2><span class="badge blue">SINH VIÊN CHÍNH QUY</span></div><dl class="academic-info"><div><dt>Mã sinh viên</dt><dd>${student.id}</dd></div><div><dt>Lớp sinh viên</dt><dd>${student.className}</dd></div><div><dt>Khoa</dt><dd>${student.faculty}</dd></div><div><dt>Ngày sinh</dt><dd>${dateText(student.birthday)}</dd></div><div><dt>Ngành học</dt><dd>${student.major}</dd></div><div><dt>Khóa học</dt><dd>${student.course}</dd></div></dl></section><section class="panel profile-form-panel"><div class="panel-heading"><h2>Thông tin liên hệ</h2><span class="muted">Có thể chỉnh sửa</span></div><form id="profile-form" class="profile-form"><div class="form-grid"><label>Email<input name="email" type="email" required maxlength="120" value="${esc(student.email)}" autocomplete="email"></label><label>Số điện thoại<input name="phone" type="tel" required pattern="0[0-9]{9}" title="Số điện thoại gồm 10 chữ số, bắt đầu bằng 0" maxlength="10" value="${esc(student.phone)}" autocomplete="tel"></label><label class="full-field">Địa chỉ liên hệ<input name="address" required maxlength="250" value="${esc(student.address)}" autocomplete="street-address"></label><label class="full-field">Giới thiệu bản thân<textarea name="bio" rows="3" maxlength="500">${esc(student.bio)}</textarea></label></div><div class="form-actions"><span id="save-status">${icon('info')}Lưu trên trình duyệt của bạn</span><button class="btn secondary" type="reset">Hủy thay đổi</button><button class="btn primary" type="submit">${icon('check')}Lưu thông tin</button></div></form></section></div></div>`;
  document.getElementById('profile-form').onsubmit = event => { event.preventDefault(); const form = event.currentTarget; const values = Object.fromEntries(new FormData(form)); for (const key in values) values[key] = values[key].trim(); if (!values.address) return toast('Vui lòng nhập địa chỉ hợp lệ.'); if (save('portal-profile-v1', values)) { student = { ...student, ...values }; render(); toast('Đã lưu thông tin cá nhân.'); } };
}
function csv(name, headers, rows) {
  // Thêm BOM để Excel hiển thị đúng dấu tiếng Việt.
  const cell = value => '"' + String(value).replace(/"/g, '""') + '"';
  const blob = new Blob(['\uFEFF' + [headers, ...rows].map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${name}-${semester}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Đã xuất tệp CSV.');
}
function render() { ({ overview, tuition, schedule, results, profile })[page](); const select = document.getElementById('semester'); if (select) select.onchange = () => { semester = select.value; render(); }; }
const querySemester = new URLSearchParams(location.search).get('semester');
if (DB.semesters.some(s => s.id === querySemester)) semester = querySemester;
render();

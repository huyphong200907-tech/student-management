// Bố cục chung: sidebar, header, dialog, toast và menu trên điện thoại.
import { page, base, routes, labels, icon, link, esc } from './config.js';
import { state } from './state.js';
import { logout } from './auth.js';
export let main;
export let dialog;
let toastTimer;
export function toast(message) {
  const el = document.querySelector('.toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 4000);
}
export function openDialog(title, body) {
  document.getElementById('dialog-title').textContent = title;
  document.getElementById('dialog-body').innerHTML = body;
  if (!dialog.open) dialog.showModal();
}
export function toggleMenu(force) {
  const open = force ?? !document.body.classList.contains('menu-open');
  document.body.classList.toggle('menu-open', open);
  document.getElementById('menu-toggle').setAttribute('aria-expanded', String(open));
}
export function setupLayout() {
  const initials = state.student.name.split(/\s+/).slice(-2).map(s => s[0]).join('').toUpperCase();
  document.getElementById('app').innerHTML = `
  <a class="skip-link" href="#main">Đến nội dung chính</a>
  <button class="sidebar-scrim" aria-label="Đóng menu" tabindex="-1"></button>
  <aside class="sidebar" id="sidebar">
    <a class="brand" href="${link('overview')}"><img src="${base}assets/logo.svg" alt="Biểu tượng cổng sinh viên"><span>ĐẠI HỌC<br>GIAO THÔNG VẬN TẢI</span></a>
    <div class="portal-label">STUDENT PORTAL <span>●</span></div>
    <div class="nav-caption">KHÔNG GIAN SINH VIÊN</div>
    <nav aria-label="Điều hướng chính">${Object.keys(routes).map(key => `<a class="nav-link ${page === key ? 'active' : ''}" href="${link(key)}" ${page === key ? 'aria-current="page"' : ''}>${icon(key)}<span>${labels[key]}</span>${page === key ? '<span class="nav-dot"></span>' : ''}</a>`).join('')}</nav>
    <div class="sidebar-bottom"><div class="semester-note">${icon('cap')}<div><b>Năm học 2026 – 2027</b><small>Học kỳ I</small></div></div><div class="demo-tag">DỰ ÁN MÔ PHỎNG · BTL WEB</div></div>
  </aside>
  <div class="workspace">
    <header class="topbar"><div class="breadcrumb"><button id="menu-toggle" class="icon-btn mobile-menu" aria-label="Mở menu" aria-controls="sidebar" aria-expanded="false">${icon('menu')}</button><span>Cổng sinh viên</span>${icon('chevron')}<b>${labels[page]}</b></div>
      <div class="topbar-right"><form id="global-search" class="search-box" role="search"><label class="sr-only" for="search-input">Tìm kiếm thông báo, học phần</label>${icon('search')}<input id="search-input" placeholder="Tìm kiếm thông tin…" autocomplete="off"><kbd>↵</kbd></form><button id="notifications" class="icon-btn notification" aria-label="Xem thông báo">${icon('bell')}<i></i></button><a class="user-chip" href="${link('profile')}"><span class="avatar">${esc(initials)}</span><span><b>${esc(state.student.name)}</b><small>Sinh viên · K65</small></span>${icon('chevron')}</a><button id="student-logout" class="icon-btn logout-icon" title="Đăng xuất" aria-label="Đăng xuất">${icon('close')}</button></div>
    </header>
    <main id="main" tabindex="-1"></main>
    <footer><span>© 2026 Cổng thông tin sinh viên</span><span>Bài tập lớn Thiết kế web <i>•</i> Dữ liệu minh họa</span></footer>
  </div>
  <dialog id="dialog" aria-labelledby="dialog-title"><div class="dialog-top"><h2 id="dialog-title"></h2><button class="icon-btn" id="dialog-close" aria-label="Đóng">${icon('close')}</button></div><div id="dialog-body"></div></dialog>
  <div class="toast" role="status" aria-live="polite"></div>`;
  main = document.getElementById('main');
  dialog = document.getElementById('dialog');
  document.getElementById('dialog-close').onclick = () => dialog.close();
  document.getElementById('student-logout').onclick = logout;
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    }
  });
  document.getElementById('menu-toggle').onclick = () => toggleMenu();
  document.querySelector('.sidebar-scrim').onclick = () => toggleMenu(false);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') toggleMenu(false); });
}

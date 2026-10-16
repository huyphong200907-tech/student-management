// Thông báo, danh sách tin tức và tìm kiếm trên toàn website.
import { DB, labels, icon, link, esc, dateText } from './config.js';
import { state } from './state.js';
import { openDialog, toast } from './layout.js';
export function newsRows(category, limit = 3) {
  return DB.news.filter(n => category === 'all' || n.category === category).slice(0, limit).map(n => `<button class="news-row" data-news="${n.id}"><span class="news-bullet">${icon('bell')}</span><span><b>${esc(n.title)}</b><small>${dateText(n.date)} <span>•</span> ${n.category === 'school' ? 'Nhà trường' : 'Đào tạo'}</small></span>${icon('chevron')}</button>`).join('');
}
export function newsPanel(title, category) {
  return `<section class="panel news-panel"><div class="panel-heading"><h2>${title}</h2><button class="text-btn" data-news-list="${category}">Xem tất cả ${icon('arrow')}</button></div>${newsRows(category)}</section>`;
}
export function showNewsList(category) {
  state.newsFilter = category;
  openDialog('Tin tức & thông báo', `<div class="tabs">${[['all', 'Tất cả'], ['school', 'Nhà trường'], ['training', 'Đào tạo']].map(([id, title]) => `<button class="tab ${category === id ? 'active' : ''}" data-news-list="${id}">${title}</button>`).join('')}</div>${newsRows(category, 99)}`);
}
export function setupNews() {
  document.getElementById('notifications').onclick = () => showNewsList('all');
  document.addEventListener('click', event => {
    const news = event.target.closest('[data-news]');
    const list = event.target.closest('[data-news-list]');
    if (news) {
      const item = DB.news.find(n => n.id === Number(news.dataset.news));
      if (item) openDialog(item.title, `<div class="article-meta">${dateText(item.date)} · Thông báo ${item.category === 'school' ? 'nhà trường' : 'đào tạo'}</div><p class="article-body">${esc(item.text)}</p><div class="notice">${icon('info')}Nội dung minh họa phục vụ bài tập lớn.</div><button class="btn secondary" data-news-list="${state.newsFilter}">Quay lại danh sách</button>`);
    }
    if (list) showNewsList(list.dataset.newsList);
  });
  document.getElementById('global-search').onsubmit = event => {
    event.preventDefault();
    const query = document.getElementById('search-input').value.trim().toLocaleLowerCase('vi');
    if (!query) return toast('Nhập từ khóa để tìm kiếm.');
    const items = DB.news.filter(n => n.title.toLocaleLowerCase('vi').includes(query));
    const courses = DB.fees.filter(n => `${n.name} ${n.code}`.toLocaleLowerCase('vi').includes(query));
    const navigation = Object.keys(labels).filter(k => labels[k].toLocaleLowerCase('vi').includes(query));
    openDialog('Kết quả tìm kiếm', `<p class="muted">Từ khóa: “${esc(query)}” · ${items.length + courses.length + navigation.length} kết quả</p>${navigation.map(k => `<a class="search-result" href="${link(k)}">${icon(k)}<span>${labels[k]}</span>${icon('arrow')}</a>`).join('')}${items.map(n => `<button class="search-result" data-news="${n.id}">${icon('bell')}<span>${esc(n.title)}</span>${icon('arrow')}</button>`).join('')}${courses.map(n => `<a class="search-result" href="${link('results')}?semester=${encodeURIComponent(n.semester)}">${icon('book')}<span>${esc(n.name)} <small>${esc(n.code)} · ${esc(DB.semesters.find(s => s.id === n.semester)?.name ?? '')}</small></span>${icon('arrow')}</a>`).join('')}${!items.length && !courses.length && !navigation.length ? '<div class="empty-state">Không tìm thấy kết quả. Thử tên môn học hoặc “học phí”.</div>' : ''}`);
  };
}

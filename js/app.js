// File điều phối chính: khởi tạo ứng dụng và gọi đúng trang.
import { DB, page } from './config.js';
import { state } from './state.js';
import { setupLayout } from './layout.js';
import { setupNews } from './news.js';
import { overview } from './pages/overview.js';
import { tuition } from './pages/tuition.js';
import { schedule } from './pages/schedule.js';
import { results } from './pages/results.js';
import { profile } from './pages/profile.js';

const pages = { overview, tuition, schedule, results, profile };
export function render() {
  const showPage = pages[page];
  if (!showPage) throw new Error(`Không hỗ trợ trang: ${page}`);
  showPage(render);
  const select = document.getElementById('semester');
  if (select) select.onchange = () => { state.semester = select.value; render(); };
}

setupLayout();
setupNews();
const querySemester = new URLSearchParams(location.search).get('semester');
if (DB.semesters.some(s => s.id === querySemester)) state.semester = querySemester;
render();

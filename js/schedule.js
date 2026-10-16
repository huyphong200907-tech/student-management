
// Trang lịch học: chuyển tuần, chế độ tuần/danh sách và chi tiết buổi học.
import { DB, icon, heading, esc } from '../config.js';
import { state } from '../state.js';
import { main, openDialog } from '../layout.js';

function weekDates() {
  return Array.from({ length: 7 }, (_, index) => {
    const d = new Date(state.week);
    d.setDate(d.getDate() + index);
    return d;
  });
}

const shortDate = date => date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

function lessonMarkup(item, index) {
  return `
    <button class="lesson ${item.color}" data-lesson="${index}">
      <span class="lesson-time">${esc(item.start)} – ${esc(item.end)}</span>
      <b>${esc(item.name)}</b>
      <span>${icon('pin')}${esc(item.room)}</span>
      <small>${esc(item.type)}</small>
    </button>
  `;
}

export function schedule(render) {
  const dates = weekDates();
  const inTerm = state.week >= new Date(2026, 8, 7) && state.week <= new Date(2026, 11, 14, 23);
  const sessions = inTerm ? DB.schedule : [];

  main.innerHTML = heading(
    'Lịch học',
    'Chủ động thời gian, sẵn sàng cho mỗi buổi học.',
    '<span class="badge blue">HỌC KỲ I · 2026 – 2027</span>'
  ) + `
    <section class="panel">
      <div class="calendar-toolbar">
        <div class="week-controls">
          <button class="icon-btn bordered" id="prev-week" aria-label="Tuần trước">
            ${icon('chevron', 'flip')}
          </button>
          <strong>${shortDate(dates[0])} – ${shortDate(dates[6])}/${dates[6].getFullYear()}</strong>
          <button class="icon-btn bordered" id="next-week" aria-label="Tuần sau">
            ${icon('chevron')}
          </button>
          <button class="btn secondary compact" id="today-week">Tuần hiện tại</button>
        </div>
        <div class="tabs">
          <button id="week-mode" class="tab ${state.scheduleMode === 'week' ? 'active' : ''}">Theo tuần</button>
          <button id="list-mode" class="tab ${state.scheduleMode === 'list' ? 'active' : ''}">Danh sách</button>
        </div>
      </div>
      ${!inTerm
        ? `
          <div class="empty-state">
            Không có lịch học trong tuần này.<br>
            <small>Lịch mẫu áp dụng từ 07/09 đến 20/12/2026.</small>
          </div>
        `
        : state.scheduleMode === 'week'
          ? `
            <div class="table-wrap">
              <div class="calendar-grid">
                ${dates.map((d, index) => `
                  <div class="calendar-column">
                    <div class="day-header ${d.toDateString() === new Date().toDateString() ? 'today' : ''}">
                      <span>${index === 6 ? 'Chủ nhật' : 'Thứ ' + (index + 2)}</span>
                      <strong>${shortDate(d)}</strong>
                    </div>
                    <div class="day-lessons">
                      ${sessions.filter(s => s.day === index)
                        .map(s => lessonMarkup(s, DB.schedule.indexOf(s))).join('')
                        || '<div class="free-day">Không có lịch</div>'}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `
          : `
            <div class="schedule-list">
              ${dates.map((d, day) => `
                <div class="schedule-list-row">
                  <strong>
                    ${day === 6 ? 'Chủ nhật' : 'Thứ ' + (day + 2)}
                    <small>${shortDate(d)}</small>
                  </strong>
                  <div>
                    ${sessions.filter(s => s.day === day)
                      .map(s => lessonMarkup(s, DB.schedule.indexOf(s))).join('')
                      || '<p class="muted">Không có lịch học</p>'}
                  </div>
                </div>
              `).join('')}
            </div>
          `
      }
      <div class="calendar-legend">
        <span><i class="blue-dot"></i>Lịch học mẫu lặp lại hàng tuần</span>
        <span>${icon('info')}Chọn buổi học để xem chi tiết</span>
      </div>
    </section>
    <div class="notice">
      ${icon('info')}
      Lịch minh họa không bao gồm điều chỉnh ngày lễ hoặc lịch thi.
      Tuần mẫu ban đầu: 05 – 11/10/2026.
    </div>
  `;

  document.getElementById('prev-week').onclick = () => {
    state.week.setDate(state.week.getDate() - 7);
    render();
  };

  document.getElementById('next-week').onclick = () => {
    state.week.setDate(state.week.getDate() + 7);
    render();
  };

  document.getElementById('today-week').onclick = () => {
    state.week = new Date();
    state.week.setHours(12, 0, 0, 0);
    state.week.setDate(state.week.getDate() - (state.week.getDay() + 6) % 7);
    render();
  };

  document.getElementById('week-mode').onclick = () => {
    state.scheduleMode = 'week';
    render();
  };

  document.getElementById('list-mode').onclick = () => {
    state.scheduleMode = 'list';
    render();
  };

  document.querySelectorAll('[data-lesson]').forEach(button => {
    button.onclick = () => {
      const item = DB.schedule[Number(button.dataset.lesson)];
      if (!item) return;

      openDialog(item.name, `
        <span class="badge ${item.color}">${esc(item.type)}</span>
        <dl class="details">
          <div><dt>Mã học phần</dt><dd>${esc(item.code)}</dd></div>
          <div><dt>Ngày học</dt><dd>${dates[item.day].toLocaleDateString('vi-VN')}</dd></div>
          <div><dt>Thời gian</dt><dd>${esc(item.start)} – ${esc(item.end)}</dd></div>
          <div><dt>Phòng học</dt><dd>${esc(item.room)}</dd></div>
          <div><dt>Giảng viên</dt><dd>${esc(item.teacher)}</dd></div>
        </dl>
      `);
    };
  });
}

// Trang quản trị mô phỏng: các thay đổi chỉ có hiệu lực trong cùng một trình duyệt.
import { DB, money, esc, score } from './config.js';
import { requireRole, logout } from './auth.js';
import { getRecords, saveRecords, getStudent, saveStudentContact } from './store.js';

if (requireRole('admin')) {
  document.getElementById('logout').onclick = logout;
  document.getElementById('menu-button').onclick = () => document.body.classList.toggle('menu-open');
  const main = document.getElementById('admin-main');
  let section = 'students';
  let selectedId = DB.students[0].id;
  let selectedSemester = DB.semesters[0].id;
  const notice = '<div class="notice">Dữ liệu mô phỏng. Các thay đổi được lưu vào localStorage trên trình duyệt này, không đồng bộ sang thiết bị khác.</div>';
  const studentOption = s => `<option value="${esc(s.id)}" ${s.id === selectedId ? 'selected' : ''}>${esc(s.name)} · ${esc(s.id)}</option>`;
  const semesterOption = s => `<option value="${esc(s.id)}" ${s.id === selectedSemester ? 'selected' : ''}>${esc(s.name)}</option>`;
  function notify(message) {
    const el = document.getElementById('message'); el.textContent = message; el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3200);
  }
  function controls(semester = false) {
    return `<div class="form-row">
      <div><label for="student-select">Sinh viên</label><select id="student-select">${DB.students.map(studentOption).join('')}</select></div>
      ${semester ? `<div><label for="semester-select">Học kỳ</label><select id="semester-select">${DB.semesters.map(semesterOption).join('')}</select></div>` : ''}
    </div>`;
  }
  function title(text) { return `${notice}<div class="card"><h2>${text}</h2>${controls(section === 'results' || section === 'fees')}</div>`; }
  function render() {
    document.querySelectorAll('[data-section]').forEach(btn => btn.classList.toggle('active', btn.dataset.section === section));
    const s = getStudent(selectedId);
    const records = getRecords(selectedId);
    if (section === 'students') {
      main.innerHTML = `${title('Thông tin sinh viên')}<section class="card">
        <p><b>${esc(s.name)}</b> · ${esc(s.id)} · ${esc(s.className)}</p>
        <form id="student-form" class="grid">
          <div class="field"><label>Email</label><input name="email" type="email" required value="${esc(s.email)}"></div>
          <div class="field"><label>Số điện thoại</label><input name="phone" value="${esc(s.phone)}"></div>
          <div class="field"><label>Địa chỉ</label><input name="address" value="${esc(s.address)}"></div>
          <div class="field"><label>Giới thiệu</label><input name="bio" value="${esc(s.bio)}"></div>
          <div><button class="action" type="submit">Lưu thông tin</button></div>
        </form>
      </section><section class="card"><h2>Danh sách lớp</h2><div class="table-wrap"><table><thead><tr><th>Mã SV</th><th>Họ tên</th><th>Lớp</th></tr></thead><tbody>
        ${DB.students.map(st => `<tr><td>${esc(st.id)}</td><td>${esc(st.name)}</td><td>${esc(st.className)}</td></tr>`).join('')}
      </tbody></table></div></section>`;
      document.getElementById('student-form').onsubmit = event => {
        event.preventDefault();
        if (saveStudentContact(selectedId, Object.fromEntries(new FormData(event.currentTarget)))) notify('Đã lưu thông tin sinh viên.');
        else notify('Không lưu được dữ liệu trên trình duyệt.');
      };
    } else if (section === 'courses') {
      const unique = [...new Map(DB.fees.map(f => [f.code, f])).values()];
      main.innerHTML = `${title('Danh mục môn học')}<section class="card"><p class="muted">Danh mục môn học mẫu (chỉ xem).</p><div class="table-wrap"><table><thead><tr><th>Mã HP</th><th>Tên môn</th><th>Tín chỉ</th><th>Học phí</th></tr></thead><tbody>${unique.map(c => `<tr><td>${esc(c.code)}</td><td>${esc(c.name)}</td><td>${c.credits}</td><td>${money(c.amount)}</td></tr>`).join('')}</tbody></table></div></section>`;
    } else if (section === 'schedules') {
      main.innerHTML = `${title('Lịch học')}<section class="card"><p class="muted">Lịch học mẫu của sinh viên đang chọn (chỉ xem).</p><div class="table-wrap"><table><thead><tr><th>Thứ</th><th>Giờ</th><th>Môn học</th><th>Phòng</th></tr></thead><tbody>${records.schedule.map(c => `<tr><td>Thứ ${c.day + 2}</td><td>${esc(c.start)}–${esc(c.end)}</td><td>${esc(c.name)}</td><td>${esc(c.room)}</td></tr>`).join('')}</tbody></table></div></section>`;
    } else if (section === 'results') {
      const rows = records.results.filter(r => r.semester === selectedSemester);
      main.innerHTML = `${title('Quản lý điểm')}<form id="results-form" class="card"><div class="table-wrap"><table><thead><tr><th>Mã HP</th><th>Môn học</th><th>Quá trình</th><th>Thi</th><th>Điểm tổng</th></tr></thead><tbody>
        ${rows.map(r => `<tr data-code="${esc(r.code)}"><td>${esc(r.code)}</td><td>${esc(r.name)}</td><td><input type="number" class="process" min="0" max="10" step="0.1" value="${r.process}" required></td><td><input type="number" class="exam" min="0" max="10" step="0.1" value="${r.exam}" required></td><td>${score(r).toFixed(1)}</td></tr>`).join('')}
      </tbody></table></div><button class="action" type="submit">Lưu bảng điểm</button></form>`;
      document.getElementById('results-form').onsubmit = event => {
        event.preventDefault();
        event.currentTarget.querySelectorAll('tr[data-code]').forEach(tr => {
          const r = records.results.find(x => x.semester === selectedSemester && x.code === tr.dataset.code);
          r.process = Number(tr.querySelector('.process').value); r.exam = Number(tr.querySelector('.exam').value);
        });
        if (saveRecords(selectedId, records)) { render(); notify('Đã lưu bảng điểm mẫu.'); }
        else notify('Không lưu được dữ liệu trên trình duyệt.');
      };
    } else if (section === 'fees') {
      const rows = records.fees.filter(r => r.semester === selectedSemester);
      main.innerHTML = `${title('Quản lý học phí')}<form id="fees-form" class="card"><div class="table-wrap"><table><thead><tr><th>Mã HP</th><th>Môn học</th><th>Số tiền</th><th>Đã thanh toán</th></tr></thead><tbody>
        ${rows.map(r => `<tr data-id="${esc(r.id)}"><td>${esc(r.code)}</td><td>${esc(r.name)}</td><td>${money(r.amount)}</td><td><input type="checkbox" class="paid" ${r.paid ? 'checked' : ''}></td></tr>`).join('')}
      </tbody></table></div><button class="action" type="submit">Lưu học phí</button></form>`;
      document.getElementById('fees-form').onsubmit = event => {
        event.preventDefault();
        event.currentTarget.querySelectorAll('tr[data-id]').forEach(tr => {
          const r = records.fees.find(x => x.id === tr.dataset.id); r.paid = tr.querySelector('.paid').checked;
        });
        if (saveRecords(selectedId, records)) notify('Đã lưu trạng thái học phí mẫu.');
        else notify('Không lưu được dữ liệu trên trình duyệt.');
      };
    }
    document.getElementById('student-select').onchange = event => { selectedId = event.target.value; render(); };
    const semesterSelect = document.getElementById('semester-select');
    if (semesterSelect) semesterSelect.onchange = event => { selectedSemester = event.target.value; render(); };
  }
  document.querySelectorAll('[data-section]').forEach(button => button.onclick = () => {
    section = button.dataset.section; document.body.classList.remove('menu-open'); render();
  });
  render();
}

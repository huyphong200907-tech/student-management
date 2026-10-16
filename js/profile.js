// Trang hồ sơ sinh viên: hiển thị và lưu thông tin liên hệ trên trình duyệt.
import { icon, dateText, heading, esc } from '../config.js';
import { state, save } from '../state.js';
import { main, toast } from '../layout.js';
export function profile(render) {
  const student = state.student;
  const initials = student.name.split(/\s+/).slice(-2).map(s => s[0]).join('').toUpperCase();
  main.innerHTML = heading('Hồ sơ sinh viên', 'Thông tin cá nhân và hành trình học tập của bạn.') + `
  <div class="profile-grid"><section class="panel profile-card"><div class="profile-cover"></div><div class="profile-avatar">${esc(initials)}<span>${icon('check')}</span></div><h2>${esc(student.name)}</h2><p>${esc(student.id)}</p><span class="badge green">Đang theo học</span><div class="profile-identity"><p>${icon('cap')}${esc(student.major)}</p><p>${icon('book')}${esc(student.className)}</p><p>${icon('schedule')}Khóa ${esc(student.course)}</p></div><div class="profile-note">${icon('info')}Hồ sơ minh họa cho bài tập lớn.<br>Không nhập dữ liệu nhạy cảm.</div></section>
  <div><section class="panel"><div class="panel-heading"><h2>Thông tin học vụ</h2><span class="badge blue">SINH VIÊN CHÍNH QUY</span></div><dl class="academic-info"><div><dt>Mã sinh viên</dt><dd>${esc(student.id)}</dd></div><div><dt>Lớp sinh viên</dt><dd>${esc(student.className)}</dd></div><div><dt>Khoa</dt><dd>${esc(student.faculty)}</dd></div><div><dt>Ngày sinh</dt><dd>${dateText(student.birthday)}</dd></div><div><dt>Ngành học</dt><dd>${esc(student.major)}</dd></div><div><dt>Khóa học</dt><dd>${esc(student.course)}</dd></div></dl></section>
  <section class="panel profile-form-panel"><div class="panel-heading"><h2>Thông tin liên hệ</h2><span class="muted">Có thể chỉnh sửa</span></div><form id="profile-form" class="profile-form"><div class="form-grid"><label>Email<input name="email" type="email" required maxlength="120" value="${esc(student.email)}" autocomplete="email"></label><label>Số điện thoại<input name="phone" type="tel" required pattern="0[0-9]{9}" title="Số điện thoại gồm 10 chữ số, bắt đầu bằng 0" maxlength="10" value="${esc(student.phone)}" autocomplete="tel"></label><label class="full-field">Địa chỉ liên hệ<input name="address" required maxlength="250" value="${esc(student.address)}" autocomplete="street-address"></label><label class="full-field">Giới thiệu bản thân<textarea name="bio" rows="3" maxlength="500">${esc(student.bio)}</textarea></label></div><div class="form-actions"><span id="save-status">${icon('info')}Lưu trên trình duyệt của bạn</span><button class="btn secondary" type="reset">Hủy thay đổi</button><button class="btn primary" type="submit">${icon('check')}Lưu thông tin</button></div></form></section></div></div>`;
  document.getElementById('profile-form').onsubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    for (const key in values) values[key] = values[key].trim();
    if (!values.address) return toast('Vui lòng nhập địa chỉ hợp lệ.');
    if (save('portal-profile-v1', values)) {
      state.student = { ...state.student, ...values };
      render();
      toast('Đã lưu thông tin cá nhân.');
    } else toast('Trình duyệt không cho phép lưu dữ liệu.');
  };
}

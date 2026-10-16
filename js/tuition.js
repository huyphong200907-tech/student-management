// Trang học phí: lọc học kỳ, chọn học phần, thanh toán mô phỏng, xuất CSV.
import { DB, icon, esc, money, sum, stat, heading, semesterSelect } from '../config.js';
import { state, isPaid, save } from '../state.js';
import { main, dialog, openDialog, toast } from '../layout.js';
import { csv } from '../csv.js';
export function tuition(render) {
  const rows = DB.fees.filter(row => row.semester === state.semester);
  const unpaid = rows.filter(row => !isPaid(row));
  main.innerHTML = heading('Học phí', 'Theo dõi và quản lý các khoản học phí của bạn.', semesterSelect(state.semester)) + `
  <div class="notice">${icon('info')}Chế độ bài tập: thanh toán chỉ được mô phỏng trên trình duyệt, không phát sinh giao dịch thật.</div>
  <div class="stats-grid three">${stat('Tổng học phí', money(sum(rows, 'amount')), `${sum(rows, 'credits')} tín chỉ đăng ký`, 'tuition', 'blue')}${stat('Đã thanh toán', money(sum(rows.filter(isPaid), 'amount')), 'Bao gồm thanh toán mô phỏng', 'check', 'green')}${stat('Còn phải đóng', money(sum(unpaid, 'amount')), state.semester === '2026-1' ? 'Hạn đóng mẫu: 30/10/2026' : 'Học kỳ đã hoàn thành', 'clock', 'orange')}</div>
  <section class="panel"><div class="panel-heading"><h2>Chi tiết học phí</h2><button id="export-fees" class="btn secondary compact">${icon('download')} Xuất CSV</button></div><div class="table-wrap"><table><thead><tr><th><input type="checkbox" id="select-all" aria-label="Chọn tất cả khoản chưa đóng" ${unpaid.length ? '' : 'disabled'}></th><th>Học phần</th><th>Tín chỉ</th><th>Số tiền</th><th>Trạng thái</th></tr></thead><tbody>${rows.map(row => `<tr><td><input type="checkbox" class="fee-check" data-id="${esc(row.id)}" aria-label="Chọn ${esc(row.name)}" ${isPaid(row) ? 'disabled' : ''}></td><td><b>${esc(row.name)}</b><small>${esc(row.code)}</small></td><td>${row.credits}</td><td class="numeric">${money(row.amount)}</td><td><span class="badge ${isPaid(row) ? 'green' : 'orange'}">${isPaid(row) ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></td></tr>`).join('')}</tbody></table></div><div class="payment-bar"><div><small id="selected-count">Chưa chọn khoản học phí</small><strong id="selected-total">${money(0)}</strong></div><button id="pay" class="btn primary" disabled>${icon('tuition')}Thanh toán mô phỏng</button></div></section>
  <section class="panel history"><div class="panel-heading"><h2>Lịch sử thanh toán mô phỏng</h2><button class="text-btn" id="reset-payments" ${state.payments.length ? '' : 'disabled'}>Đặt lại dữ liệu</button></div>${state.payments.length ? state.payments.slice().reverse().map(p => `<div class="history-row"><span class="mini-icon green">${icon('check')}</span><div><b>${esc(p.reference)}</b><small>${esc(p.time)} · ${p.ids.length} học phần</small></div><strong>${money(p.total)}</strong></div>`).join('') : '<div class="empty-state">Chưa có giao dịch mô phỏng. Chọn học phần để trải nghiệm.</div>'}</section>`;
  state.selectedFees.clear();
  const update = () => {
    const chosen = unpaid.filter(row => state.selectedFees.has(row.id));
    document.getElementById('selected-count').textContent = `Đã chọn ${chosen.length} học phần`;
    document.getElementById('selected-total').textContent = money(sum(chosen, 'amount'));
    document.getElementById('pay').disabled = !chosen.length;
    const all = document.getElementById('select-all');
    all.checked = !!unpaid.length && chosen.length === unpaid.length;
    all.indeterminate = chosen.length > 0 && chosen.length < unpaid.length;
  };
  document.querySelectorAll('.fee-check').forEach(input => input.onchange = () => {
    input.checked ? state.selectedFees.add(input.dataset.id) : state.selectedFees.delete(input.dataset.id);
    update();
  });
  document.getElementById('select-all').onchange = event => {
    document.querySelectorAll('.fee-check:not(:disabled)').forEach(input => {
      input.checked = event.target.checked;
      input.checked ? state.selectedFees.add(input.dataset.id) : state.selectedFees.delete(input.dataset.id);
    });
    update();
  };
  document.getElementById('pay').onclick = () => {
    const chosen = unpaid.filter(row => state.selectedFees.has(row.id));
    const total = sum(chosen, 'amount');
    openDialog('Xác nhận thanh toán mô phỏng', `<p>Bạn đã chọn ${chosen.length} học phần.</p><div class="payment-summary">${chosen.map(row => `<div><span>${esc(row.name)}</span><b>${money(row.amount)}</b></div>`).join('')}<div class="total"><span>Tổng cộng</span><b>${money(total)}</b></div></div><p class="muted">Không yêu cầu thẻ hoặc tài khoản ngân hàng. Kết quả chỉ lưu trên trình duyệt này.</p><button class="btn primary full" id="confirm-pay">Xác nhận mô phỏng</button>`);
    document.getElementById('confirm-pay').onclick = () => {
      const next = [...state.payments, { ids: chosen.map(r => r.id), total, time: new Date().toLocaleString('vi-VN'), reference: 'DEMO-' + Date.now().toString().slice(-8) }];
      if (save('portal-payments-v1', next)) {
        state.payments = next;
        dialog.close();
        render();
        toast('Thanh toán mô phỏng thành công.');
      } else toast('Trình duyệt không cho phép lưu dữ liệu.');
    };
  };
  document.getElementById('reset-payments').onclick = () => {
    openDialog('Đặt lại thanh toán mẫu', '<p>Xóa các giao dịch bạn vừa mô phỏng và khôi phục trạng thái học phí ban đầu?</p><button id="confirm-reset" class="btn primary">Đặt lại dữ liệu</button>');
    document.getElementById('confirm-reset').onclick = () => {
      if (save('portal-payments-v1', [])) {
        state.payments = [];
        dialog.close();
        render();
        toast('Đã khôi phục học phí mẫu.');
      } else toast('Trình duyệt không cho phép lưu dữ liệu.');
    };
  };
  document.getElementById('export-fees').onclick = () => csv('hoc-phi', ['Mã học phần', 'Tên học phần', 'Tín chỉ', 'Số tiền (VND)', 'Trạng thái'], rows.map(r => [r.code, r.name, r.credits, r.amount, isPaid(r) ? 'Đã thanh toán' : 'Chưa thanh toán']));
}

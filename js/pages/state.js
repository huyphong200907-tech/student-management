// Trạng thái thay đổi khi người dùng thao tác và dữ liệu lưu tại trình duyệt.
import { DB } from '../config.js';
export function readSaved(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
export function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}
const savedProfile = readSaved('portal-profile-v1', {});
const student = { ...DB.student };
for (const key of ['email', 'phone', 'address', 'bio']) {
  if (typeof savedProfile?.[key] === 'string') student[key] = savedProfile[key];
}
let payments = readSaved('portal-payments-v1', []);
if (!Array.isArray(payments)) payments = [];
export const state = {
  student,
  payments,
  semester: DB.semesters[0].id,
  newsFilter: 'all',
  selectedFees: new Set(),
  week: new Date(2026, 9, 5, 12),
  scheduleMode: 'week'
};
export const isPaid = row => row.paid || state.payments.some(payment => payment.ids?.includes(row.id));

// Trạng thái riêng cho sinh viên đang đăng nhập.
import { DB } from './config.js';
import { getSession } from './auth.js';
import { getRecords, getStudent } from './store.js';
export function readSaved(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
export function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}
const session = getSession();
const studentId = session?.role === 'student' ? session.studentId : null;
const initial = studentId && getRecords(studentId);
const paymentsKey = `portal-demo-payments-v1-${studentId ?? 'none'}`;
let payments = readSaved(paymentsKey, []);
if (!Array.isArray(payments)) payments = [];
export const state = {
  studentId,
  student: studentId ? getStudent(studentId) : null,
  records: initial || { fees: [], results: [], schedule: [] },
  payments, paymentsKey,
  semester: DB.semesters[0].id,
  newsFilter: 'all', selectedFees: new Set(),
  week: new Date(2026, 9, 5, 12), scheduleMode: 'week'
};
export const isPaid = row => row.paid || state.payments.some(payment => payment.ids?.includes(row.id));

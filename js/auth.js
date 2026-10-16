// TÀI KHOẢN DEMO: chỉ mô phỏng, không phải xác thực an toàn.
import { DB } from './config.js';
const KEY = 'portal-demo-session-v1';
export const demoAccounts = [
  { username: 'admin', password: 'admin123', role: 'admin', studentId: null },
  ...DB.students.map(s => ({ username: s.id, password: 'demo123', role: 'student', studentId: s.id }))
];
export function getSession() {
  try {
    const value = JSON.parse(sessionStorage.getItem(KEY));
    if (!value) return null;
    return demoAccounts.some(a => a.username === value.username && a.role === value.role && a.studentId === value.studentId)
      ? value : null;
  } catch { return null; }
}
export function login(username, password) {
  const account = demoAccounts.find(a => a.username === username.trim() && a.password === password);
  if (!account) return null;
  const session = { username: account.username, role: account.role, studentId: account.studentId };
  try { sessionStorage.setItem(KEY, JSON.stringify(session)); }
  catch { return null; }
  return session;
}
export function logout() {
  try { sessionStorage.removeItem(KEY); } catch {}
  location.href = (document.body.dataset.page === 'overview' || document.body.dataset.page === 'admin') ? 'login.html' : '../login.html';
}
export function requireRole(role) {
  const session = getSession();
  if (!session || session.role !== role) {
    const current = document.body.dataset.page;
    location.replace(current === 'overview' || current === 'admin' ? 'login.html' : '../login.html');
    return null;
  }
  return session;
}

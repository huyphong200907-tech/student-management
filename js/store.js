// Dữ liệu thay đổi chỉ được lưu trong localStorage của TRÌNH DUYỆT NÀY.
import { DB } from './config.js';
const PREFIX = 'portal-demo-records-v1-';
const PROFILE = 'portal-demo-profile-v1-';
export function getRecords(studentId) {
  const defaults = DB.recordsByStudent[studentId];
  if (!defaults) return null;
  try {
    const saved = JSON.parse(localStorage.getItem(PREFIX + studentId));
    if (saved && Array.isArray(saved.fees) && Array.isArray(saved.results) && Array.isArray(saved.schedule)) return saved;
  } catch {}
  return JSON.parse(JSON.stringify(defaults));
}
export function saveRecords(studentId, records) {
  if (!DB.recordsByStudent[studentId]) return false;
  try { localStorage.setItem(PREFIX + studentId, JSON.stringify(records)); return true; }
  catch { return false; }
}
export function getStudent(studentId) {
  const student = DB.students.find(s => s.id === studentId);
  if (!student) return null;
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE + studentId));
    return { ...student, ...(saved && typeof saved === 'object' ? saved : {}) };
  } catch { return { ...student }; }
}
export function saveStudentContact(studentId, contact) {
  if (!DB.students.some(s => s.id === studentId)) return false;
  const allowed = {};
  for (const k of ['email', 'phone', 'address', 'bio']) {
    if (typeof contact[k] === 'string') allowed[k] = contact[k];
  }
  try { localStorage.setItem(PROFILE + studentId, JSON.stringify(allowed)); return true; }
  catch { return false; }
}

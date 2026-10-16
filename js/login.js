import { getSession, login } from './auth.js';
const current = getSession();
if (current) location.replace(current.role === 'admin' ? 'admin.html' : 'index.html');
document.getElementById('login-form').addEventListener('submit', event => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const session = login(username, password);
  if (!session) {
    document.getElementById('login-error').textContent = 'Tài khoản hoặc mật khẩu demo không đúng.';
    return;
  }
  location.replace(session.role === 'admin' ? 'admin.html' : 'index.html');
});

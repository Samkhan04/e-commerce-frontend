// ============================
// AUTHENTICATION
// ============================

function openAuthModal() {
  document.getElementById('authModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('authModal').classList.remove('active');
  document.body.style.overflow = '';
}

function switchAuthTab(tab, event) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('otpForm').style.display = tab === 'otp' ? 'block' : 'none';
  document.getElementById('forgotForm').style.display = 'none';
  document.getElementById('resetForm').style.display = 'none';
}

function showForgotPassword() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('forgotForm').style.display = 'block';
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalBtnText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> please wait...';
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('velric_token', data.token);
    localStorage.setItem('velric_user', JSON.stringify(data.user));
    updateAuthUI();
    closeAuthModal();
    fetchCart();
    showToast('Welcome back, ' + data.user.name);
    if (data.user.role === 'admin') navigateTo('admin');
  } catch (err) {}
  finally {
      btn.disabled = false;
      btn.innerHTML = originalBtnText;
    }
  }

async function handleRegister(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalBtnText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> please wait...';
  const body = {
    name: document.getElementById('regName').value,
    email: document.getElementById('regEmail').value,
    password: document.getElementById('regPassword').value,
    phone: document.getElementById('regPhone').value
  };
  try {
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify(body) });
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('velric_token', data.token);
    localStorage.setItem('velric_user', JSON.stringify(data.user));
    updateAuthUI();
    closeAuthModal();
    showToast('Account created! Welcome to Velric London.');
    navigateTo('home');
  } catch (err) {}
  finally {
      btn.disabled = false;
      btn.innerHTML = originalBtnText;
    }
  }

async function sendOtp() {
  const phone = document.getElementById('otpPhone').value;
  if (!phone || phone.length < 10) { showToast('Enter valid 10-digit phone', 'error'); return; }
  try {
    const data = await api('/otp/send-otp', { method: 'POST', body: JSON.stringify({ phone }) });
    showToast(data.message);
    document.getElementById('otpVerifySection').style.display = 'block';
    document.getElementById('sendOtpBtn').style.display = 'none';
  } catch (err) {}
}

async function verifyOtp() {
  const phone = document.getElementById('otpPhone').value;
  const otp = document.getElementById('otpCode').value;
  try {
    const data = await api('/otp/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) });
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('velric_token', data.token);
    localStorage.setItem('velric_user', JSON.stringify(data.user));
    updateAuthUI();
    closeAuthModal();
    fetchCart();
    showToast('Login successful!');
  } catch (err) {}
}

async function handleForgotPassword(e) {
  e.preventDefault();
  try {
    const data = await api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: document.getElementById('forgotEmail').value }) });
    showToast(data.message);
    switchAuthTab('login');
  } catch (err) {}
}

async function handleResetPassword(e) {
  e.preventDefault();
  const token = window.location.hash.split('/').pop();
  const password = document.getElementById('resetPassword').value;
  try {
    const data = await api(`/auth/reset-password/${token}`, { method: 'PUT', body: JSON.stringify({ password }) });
    showToast(data.message);
    document.getElementById('resetForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    window.location.hash = '';
  } catch (err) {}
}

function logout() {
  state.token = null;
  state.user = null;
  state.cart = [];
  localStorage.removeItem('velric_token');
  localStorage.removeItem('velric_user');
  updateAuthUI();
  updateCartUI();
  navigateTo('home');
  showToast('Logged out successfully');
}
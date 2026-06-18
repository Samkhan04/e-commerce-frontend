// ============================
// APP CORE - State, API, Router, Utils
// ============================

// ============================
// APP CORE - State, API, Router, Utils
// ============================

// 🔥 FIXED: Better environment detection for production
const API_URL = (() => {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Production (Netlify or any other domain)
  return 'https://velric-london-api.onrender.com/api';
})();

const state = {
  token: localStorage.getItem('velric_token') || null,
  user: JSON.parse(localStorage.getItem('velric_user') || 'null'),
  cart: [],
  wishlist: [],
  theme: localStorage.getItem('velric_theme') || 'light',
  currentView: 'home',
  filters: {},
  adminData: null,
  recentlyViewed: JSON.parse(localStorage.getItem('velric_recent') || '[]')
};

// Initialize theme
document.documentElement.setAttribute('data-theme', state.theme);
const themeIcon = document.getElementById('themeIcon');
if (themeIcon) themeIcon.className = state.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

// API Helper
async function api(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(state.token ? { 'Authorization': `Bearer ${state.token}` } : {})
    },
    ...options
  };
  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }
  
  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error('API Error:', err.message);
    showToast(err.message || 'Network error. Please try again.', 'error');
    throw err;
  }
}

// Toast
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle';
  toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Auth UI
function updateAuthUI() {
  const btn = document.getElementById('authBtn');
  const mobileAdmin = document.getElementById('mobileAdminLink');
  if (!btn) return;
  if (state.user) {
    btn.innerHTML = `<div style="width:32px;height:32px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;">${state.user.name?.charAt(0).toUpperCase() || 'U'}</div>`;
    btn.onclick = () => navigateTo('account');
    if (mobileAdmin && state.user.role === 'admin') {
      mobileAdmin.style.display = 'block';
    }
  } else {
    btn.innerHTML = '<i class="fas fa-user"></i>';
    btn.onclick = () => { if (typeof openAuthModal === 'function') openAuthModal(); };
    if (mobileAdmin) mobileAdmin.style.display = 'none';
  }
}

// Theme
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('velric_theme', state.theme);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.className = state.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Mobile Menu
function toggleMobileMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('active');
}

// Cart UI
function toggleCart() {
  document.getElementById('cartSidebar')?.classList.toggle('active');
  document.getElementById('cartOverlay')?.classList.toggle('active');
  document.body.style.overflow = document.getElementById('cartSidebar')?.classList.contains('active') ? 'hidden' : '';
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const items = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const total = document.getElementById('cartTotal');
  if (!badge || !items) return;

  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';

  if (state.cart.length === 0) {
    items.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-bag"></i><h3>Your cart is empty</h3><p>Add some premium leather goods!</p></div>';
    if (footer) footer.style.display = 'none';
    return;
  }

  let totalAmount = 0;
  items.innerHTML = state.cart.map(item => {
    const product = item.product || {};
    const price = item.price || product.price || 0;
    totalAmount += price * item.quantity;
    return `
      <div class="cart-item">
        <img src="${product.mainImage || 'https://placehold.co/100x100?text=No+Image'}" alt="${product.name || item.name}" loading="lazy">
        <div class="cart-item-info">
          <h4>${product.name || item.name}</h4>
          <p>${item.size ? 'Size: ' + item.size : ''} ${item.color ? 'Color: ' + item.color : ''}</p>
          <div class="cart-item-qty">
            <button onclick="updateCartItem('${item._id}', ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartItem('${item._id}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <div class="cart-item-price">Rs.${price * item.quantity}</div>
          <button class="cart-item-remove" onclick="removeCartItem('${item._id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  }).join('');

  if (total) total.textContent = 'Rs.' + totalAmount.toLocaleString('en-IN');
  if (footer) footer.style.display = 'block';
}

// Cart Operations
async function fetchCart() {
  if (!state.token) return;
  try {
    const data = await api('/cart');
    state.cart = data.data?.items || [];
    updateCartUI();
  } catch (err) { console.log('Cart fetch failed'); }
}

async function addToCart(productId, qty = 1, size = '', color = '') {
  if (!state.token) { if (typeof openAuthModal === 'function') openAuthModal(); return; }
  try {
    await api('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity: qty, size, color }) });
    showToast('Added to cart!');
    toggleCart();
    fetchCart();
  } catch (err) {}
}

async function updateCartItem(itemId, qty) {
  if (qty <= 0) { removeCartItem(itemId); return; }
  try {
    await api(`/cart/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity: qty }) });
    fetchCart();
  } catch (err) {}
}

async function removeCartItem(itemId) {
  try {
    await api(`/cart/${itemId}`, { method: 'DELETE' });
    fetchCart();
    showToast('Item removed');
  } catch (err) {}
}

// Wishlist
async function fetchWishlist() {
  if (!state.token) return;
  try {
    const data = await api('/users/wishlist');
    state.wishlist = data.data || [];
  } catch (err) {}
}

async function toggleWishlist(productId) {
  if (!state.token) { if (typeof openAuthModal === 'function') openAuthModal(); return; }
  const isWished = state.wishlist.some(p => p._id === productId || p === productId);
  try {
    if (isWished) {
      await api(`/users/wishlist/${productId}`, { method: 'DELETE' });
      showToast('Removed from wishlist');
    } else {
      await api(`/users/wishlist/${productId}`, { method: 'POST' });
      showToast('Added to wishlist');
    }
    fetchWishlist();
    renderCurrentView();
  } catch (err) {}
}

// Recently Viewed
function addToRecentlyViewed(product) {
  if (!product) return;
  const existing = state.recentlyViewed.find(p => p._id === product._id);
  if (!existing) {
    state.recentlyViewed.unshift(product);
    if (state.recentlyViewed.length > 8) state.recentlyViewed.pop();
    localStorage.setItem('velric_recent', JSON.stringify(state.recentlyViewed));
  }
}

// Breadcrumb
function updateBreadcrumb(items) {
  const el = document.getElementById('breadcrumb');
  if (!el) return;
  if (!items || items.length === 0) {
    el.style.display = 'none';
    return;
  }
  el.style.display = 'block';
  el.innerHTML = items.map((item, i) => {
    if (i === items.length - 1) return `<span>${item.label}</span>`;
    return `<a href="${item.href || '#'}">${item.label}</a><span>/</span>`;
  }).join('');
}

// Router
function navigateTo(view, params = {}) {
  window.location.hash = view + (Object.keys(params).length ? '?' + new URLSearchParams(params) : '');
  state.currentView = view;
  state.filters = { ...state.filters, ...params };
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('mobileMenu')?.classList.remove('active');
}
function renderCurrentView() {
  const main = document.getElementById('mainContent');
  const fullHash = window.location.hash.slice(1);
  const view = fullHash.split('?')[0];
  const params = new URLSearchParams(fullHash.split('?')[1] || '');
  if (params.get('id')) state.filters.id = params.get('id');
  if (params.get('category')) state.filters.category = params.get('category');
  
  // Reset password handling
  if (view.startsWith('reset-password')) {
    openAuthModal();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('otpForm').style.display = 'none';
    document.getElementById('forgotForm').style.display = 'none';
    document.getElementById('resetForm').style.display = 'block';
    return;
  }
  
  if (!main) return;
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  document.querySelector(`.nav-link[href="#${view}"]`)?.classList.add('active');

  updateBreadcrumb([]);

  switch(view) {
    case 'home': renderHome(main); break;
    case 'shop': renderShop(main); break;
    case 'product': renderProductDetail(main); break;
    case 'checkout': renderCheckout(main); break;
    case 'account': renderAccount(main); break;
    case 'orders': renderOrders(main); break;
    case 'my-returns': renderMyReturns(main); break;
    case 'wishlist': renderWishlist(main); break;
    case 'admin': renderAdmin(main); break;
    case 'about': renderAbout(main); break;
    case 'contact': renderContact(main); break;
    case 'returns': renderReturns(main); break;
    case 'shipping': renderShipping(main); break;
    case 'faq': renderFaq(main); break;
    case 'craftmanship': renderCraftsmanship(main); break;
    case 'privacy': renderPrivacy(main); break;
    case 'terms': renderTerms(main); break;
    case 'size-guide': openSizeGuide(); navigateTo('shop'); break;
    default: renderHome(main);
  }
}

// Utilities
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

async function handleNewsletter(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const email = document.getElementById('newsletterEmail')?.value;
  
  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email', 'error');
    return;
  }
  
  btn.innerText = 'Subscribing...';
  btn.disabled = true;

  try {
    const data = await api('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    showToast(data.message || 'Thank you for subscribing!');
    e.target.reset();
  } catch (err) {
    showToast('Subscription failed. Please try again.', 'error');
  } finally {
    btn.innerText = 'Subscribe';
    btn.disabled = false;
  }
}
// Size Guide
function openSizeGuide() {
  document.getElementById('sizeGuideModal')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeSizeGuide(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('sizeGuideModal')?.classList.remove('active');
  document.body.style.overflow = '';
}

// Preloader & Scroll
window.addEventListener('load', () => {
  document.getElementById('preloader')?.classList.add('hidden');
});

window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  if (window.scrollY > 400) btn.classList.add('visible');
  else btn.classList.remove('visible');
});

// Hash Router
window.addEventListener('hashchange', () => {
  state.currentView = window.location.hash.slice(1).split('?')[0] || 'home';
  renderCurrentView();
});

// ✅ SAFE INIT: Sab scripts load hone ke baad chalega
window.addEventListener('load', () => {
  state.currentView = window.location.hash.slice(1).split('?')[0] || 'home';
  renderCurrentView();
  updateAuthUI();
  fetchCart();
  fetchWishlist();
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
// Cookie Consent
function acceptCookies() {
  localStorage.setItem('velric_cookies', 'accepted');
  document.getElementById('cookieBanner').style.display = 'none';
}

window.addEventListener('load', () => {
  if (!localStorage.getItem('velric_cookies')) {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'flex';
  }
});
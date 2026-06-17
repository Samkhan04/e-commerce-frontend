// ============================
// ACCOUNT, PROFILE, ORDERS, ADDRESSES, RETURNS
// ============================

async function renderAccount(container) {
  if (!state.token) { openAuthModal(); return; }
  const tab = new URLSearchParams(window.location.hash.split('?')[1] || '').get('tab') || 'profile';

  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'My Account' }]);

  container.innerHTML = `
    <div class="account-layout">
      <div class="account-sidebar">
        <a href="#account?tab=profile" class="${tab === 'profile' ? 'active' : ''}"><i class="fas fa-user"></i> Profile</a>
        <a href="#account?tab=addresses" class="${tab === 'addresses' ? 'active' : ''}"><i class="fas fa-map-marker-alt"></i> Addresses</a>
        <a href="#orders"><i class="fas fa-box"></i> My Orders</a>
        <a href="#my-returns"><i class="fas fa-undo"></i> My Returns</a>
        <a href="#wishlist"><i class="fas fa-heart"></i> Wishlist</a>
        ${state.user?.role === 'admin' ? `<a href="#admin" style="color:var(--gold); font-weight:700;"><i class="fas fa-crown"></i> Admin Dashboard</a>` : ''}
        <a href="#" onclick="logout(); return false;"><i class="fas fa-sign-out-alt"></i> Logout</a>
      </div>
      <div class="account-content" id="accountContent">
        ${tab === 'profile' ? renderProfileForm() : renderAddressesPage()}
      </div>
    </div>
  `;

  if (tab === 'profile') loadProfileData();
  if (tab === 'addresses') loadAddressesData();
}

function renderProfileForm() {
  return `
    <h2><i class="fas fa-user-circle" style="color:var(--primary); margin-right:12px;"></i>Profile Settings</h2>
    <div style="display:flex; align-items:center; gap:24px; margin-bottom:32px; padding:24px; background:var(--bg); border-radius:var(--radius); border:1px solid var(--border);">
      <div class="profile-avatar" id="profileAvatar">${state.user?.name?.charAt(0) || 'U'}</div>
      <div>
        <div style="font-size:20px; font-weight:700;">${state.user?.name || 'User'}</div>
        <div style="color:var(--text-secondary); font-size:14px;">${state.user?.email || ''}</div>
        <div style="color:var(--gold); font-size:13px; font-weight:600; margin-top:4px;"><i class="fas fa-crown"></i> ${state.user?.role === 'admin' ? 'Admin' : 'Member'} | ${state.user?.loyaltyPoints || 0} Loyalty Points</div>
      </div>
    </div>
    <form class="profile-form" onsubmit="updateProfile(event)">
      <div class="form-row">
        <div class="form-group"><label>Full Name</label><input type="text" id="profileName" value="${state.user?.name || ''}" required></div>
        <div class="form-group"><label>Phone Number</label><input type="tel" id="profilePhone" value="${state.user?.phone || ''}" placeholder="9876543210"></div>
      </div>
      <div class="form-group"><label>Email Address</label><input type="email" value="${state.user?.email || ''}" disabled style="background:var(--bg); cursor:not-allowed;"></div>
      <div class="form-group"><label>Avatar URL (Optional)</label><input type="url" id="profileAvatarUrl" value="${state.user?.avatar || ''}" placeholder="https://example.com/avatar.jpg"></div>
      <button type="submit" class="btn btn-dark"><i class="fas fa-save"></i> Save Changes</button>
    </form>

    <div style="margin-top:48px; padding-top:32px; border-top:2px solid var(--border);">
      <h3 style="font-size:20px; margin-bottom:24px; color:var(--primary);"><i class="fas fa-lock" style="margin-right:10px;"></i>Change Password</h3>
      <form onsubmit="updatePassword(event)">
        <div class="form-row">
          <div class="form-group"><label>Current Password</label><input type="password" id="currentPassword" required placeholder="Enter current password"></div>
          <div class="form-group"><label>New Password</label><input type="password" id="newPassword" required minlength="6" placeholder="Min 6 characters"></div>
        </div>
        <button type="submit" class="btn btn-dark"><i class="fas fa-key"></i> Update Password</button>
      </form>
    </div>
  `;
}

async function loadProfileData() {
  try {
    const data = await api('/auth/me');
    state.user = data.user;
    localStorage.setItem('velric_user', JSON.stringify(data.user));
    document.getElementById('profileName').value = data.user.name || '';
    document.getElementById('profilePhone').value = data.user.phone || '';
    document.getElementById('profileAvatarUrl').value = data.user.avatar || '';
    document.getElementById('profileAvatar').textContent = (data.user.name || 'U').charAt(0).toUpperCase();
  } catch (err) {}
}

async function updateProfile(e) {
  e.preventDefault();
  try {
    const data = await api('/auth/me', {
      method: 'PUT',
      body: JSON.stringify({
        name: document.getElementById('profileName').value,
        phone: document.getElementById('profilePhone').value,
        avatar: document.getElementById('profileAvatarUrl').value
      })
    });
    state.user = data.user;
    localStorage.setItem('velric_user', JSON.stringify(data.user));
    showToast('Profile updated successfully');
    updateAuthUI();
  } catch (err) {}
}

async function updatePassword(e) {
  e.preventDefault();
  try {
    await api('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: document.getElementById('newPassword').value
      })
    });
    showToast('Password updated successfully');
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
  } catch (err) {}
}

// Addresses
function renderAddressesPage() {
  return `
    <h2><i class="fas fa-map-marked-alt" style="color:var(--primary); margin-right:12px;"></i>Saved Addresses</h2>
    <div id="addressesList" class="address-grid" style="margin-top:24px;">
      <div class="empty-state"><i class="fas fa-home"></i><h3>No saved addresses</h3><p>Add your first delivery address below</p></div>
    </div>
    <div class="address-form" style="margin-top:40px;">
      <h3><i class="fas fa-plus-circle" style="color:var(--gold); margin-right:8px;"></i>Add New Address</h3>
      <form onsubmit="saveAddress(event)" style="margin-top:20px;">
        <div class="form-row">
          <div class="form-group"><label>Label</label><input type="text" id="addrLabel" placeholder="Home / Office / Other" required></div>
          <div class="form-group"><label>Full Name</label><input type="text" id="addrFullName" placeholder="Recipient full name" required></div>
        </div>
        <div class="form-group"><label>Address Line 1</label><input type="text" id="addrLine1" placeholder="House no, Street, Colony" required></div>
        <div class="form-group"><label>Address Line 2</label><input type="text" id="addrLine2" placeholder="Landmark, Near by (Optional)"></div>
        <div class="form-row">
          <div class="form-group"><label>City</label><input type="text" id="addrCity" required></div>
          <div class="form-group"><label>State</label><input type="text" id="addrState" required></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Pincode</label><input type="text" id="addrPincode" required maxlength="6"></div>
          <div class="form-group"><label>Phone</label><input type="tel" id="addrPhone" placeholder="10-digit mobile number" required></div>
        </div>
        <label style="display:flex; align-items:center; gap:8px; margin:16px 0; cursor:pointer; font-size:14px;">
          <input type="checkbox" id="addrDefault" style="accent-color:var(--primary); width:18px; height:18px;">
          Set as default address
        </label>
        <button type="submit" class="btn btn-dark" style="min-width:200px;"><i class="fas fa-save"></i> Save Address</button>
      </form>
    </div>
  `;
}

async function loadAddressesData() {
  try {
    const data = await api('/auth/me');
    const addresses = data.user?.addresses || [];
    const container = document.getElementById('addressesList');
    if (addresses.length) {
      container.innerHTML = addresses.map((addr, i) => `
        <div class="address-card ${addr.isDefault ? 'default' : ''}">
          ${addr.isDefault ? '<span class="badge-default"><i class="fas fa-check"></i> Default</span>' : ''}
          <h4><i class="fas fa-${addr.label?.toLowerCase().includes('office') ? 'building' : 'home'}" style="color:var(--gold); margin-right:8px;"></i>${addr.label || 'Address'}</h4>
          <p><strong>${addr.fullName}</strong><br>${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}<br>${addr.city}, ${addr.state} - ${addr.pincode}<br><i class="fas fa-phone" style="font-size:12px; color:var(--gold);"></i> ${addr.phone || 'N/A'}</p>
          <div class="address-actions">
            <button class="btn btn-sm btn-outline" style="color:var(--primary); border-color:var(--primary);" onclick="editAddress(${i})"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteAddress(${i})"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {}
}

async function saveAddress(e) {
  e.preventDefault();
  const address = {
    label: document.getElementById('addrLabel').value,
    fullName: document.getElementById('addrFullName').value,
    addressLine1: document.getElementById('addrLine1').value,
    addressLine2: document.getElementById('addrLine2').value,
    city: document.getElementById('addrCity').value,
    state: document.getElementById('addrState').value,
    pincode: document.getElementById('addrPincode').value,
    phone: document.getElementById('addrPhone').value,
    isDefault: document.getElementById('addrDefault').checked
  };
  try {
    await api('/users/address', { method: 'POST', body: JSON.stringify(address) });
    showToast('Address saved successfully');
    e.target.reset();
    loadAddressesData();
  } catch (err) {}
}

async function deleteAddress(idx) {
  if (!confirm('Delete this address?')) return;
  try {
    await api(`/users/address/${idx}`, { method: 'DELETE' });
    showToast('Address deleted');
    loadAddressesData();
  } catch (err) {}
}

function editAddress(idx) {
  showToast('Please delete and re-add the address with changes', 'warning');
}

// ============================
// ORDERS
// ============================

async function renderOrders(container) {
  if (!state.token) { openAuthModal(); return; }
  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'My Orders' }]);
  
  container.innerHTML = `
    <div class="section" style="max-width:900px;">
      <h2 class="section-title"><i class="fas fa-box-open" style="color:var(--primary); margin-right:12px;"></i>My Orders</h2>
      <div class="orders-list" id="ordersList">
        ${Array(3).fill(0).map(() => `<div class="order-card"><div class="skeleton" style="width:100%;height:120px;"></div></div>`).join('')}
      </div>
    </div>
  `;
  
  try {
    const data = await api('/orders');
    const orders = data.data || [];
    
    document.getElementById('ordersList').innerHTML = orders.length ? orders.map(o => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <h4>Order ${o.orderNumber}</h4>
            <div class="order-meta">
              <span><i class="fas fa-calendar"></i> ${formatDate(o.createdAt)}</span>
              <span><i class="fas fa-box"></i> ${o.items?.length || 0} items</span>
              <span><i class="fas fa-credit-card"></i> ${o.paymentMethod?.toUpperCase() || 'COD'}</span>
            </div>
          </div>
          <span class="status-badge status-${o.status}">${o.status?.replace(/_/g, ' ') || 'Pending'}</span>
        </div>
        <div class="order-items">
          ${o.items?.map(item => `
            <div class="order-item-mini">
              <img src="${item.product?.mainImage || 'https://placehold.co/50x50?text=No+Image'}" alt="${item.name}" loading="lazy">
              <span>${item.name} <strong>x${item.quantity}</strong></span>
            </div>
          `).join('') || ''}
        </div>
        <div class="order-footer">
          <div class="order-total">Total: Rs.${o.totalAmount}</div>
          <div class="order-actions">
            <button class="btn btn-sm btn-dark" onclick="downloadInvoice('${o._id}', '${o.orderNumber}')"><i class="fas fa-file-pdf"></i> Invoice</button>
            ${o.status === 'pending' || o.status === 'confirmed' ? `<button class="btn btn-sm btn-danger" onclick="cancelOrder('${o._id}')"><i class="fas fa-times"></i> Cancel</button>` : ''}
            ${o.status === 'delivered' && !o.rating?.score ? `<button class="btn btn-sm btn-outline" style="color:var(--gold); border-color:var(--gold);" onclick="rateOrder('${o._id}')"><i class="fas fa-star"></i> Rate</button>` : ''}
            ${o.status === 'delivered' ? `<button class="btn btn-sm btn-outline" style="color:#e74c3c; border-color:#e74c3c;" onclick="event.stopPropagation(); openReturnModal('${o._id}')"><i class="fas fa-undo"></i> Return</button>` : ''}
          </div>
        </div>
      </div>
    `).join('') : '<div class="empty-state"><i class="fas fa-box-open"></i><h3>No orders yet</h3><p>Start shopping to see your orders here</p></div>';
  } catch (err) {
    console.error('Orders error:', err);
  }
}

async function downloadInvoice(orderId, orderNumber) {
  try {
    showToast('Generating invoice...');
    const res = await fetch(`${API_URL}/orders/${orderId}/invoice`, {
      headers: state.token ? { 'Authorization': `Bearer ${state.token}` } : {}
    });
    if (!res.ok) throw new Error('Failed to download');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${orderNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    showToast('Invoice downloaded!');
  } catch (err) { showToast('Invoice download failed', 'error'); }
}

async function cancelOrder(orderId) {
  if (!confirm('Are you sure you want to cancel this order?')) return;
  try {
    await api(`/orders/${orderId}/cancel`, { method: 'PUT' });
    showToast('Order cancelled');
    renderOrders(document.getElementById('mainContent'));
  } catch (err) {}
}

function rateOrder(orderId) {
  const score = prompt('Rate your order (1-5 stars):');
  if (!score || score < 1 || score > 5) return;
  api(`/orders/${orderId}/rate`, { method: 'PUT', body: JSON.stringify({ score: parseInt(score), review: '' }) })
    .then(() => { showToast('Thank you for rating!'); renderOrders(document.getElementById('mainContent')); })
    .catch(() => {});
}

// ============================
// RETURN MODAL — FIXED
// ============================

async function openReturnModal(orderId) {
  console.log('Opening return modal for:', orderId);
  
  if (!orderId) {
    showToast('Order ID missing', 'error');
    return;
  }

  try {
    showToast('Loading order details...');
    const res = await api(`/orders/${orderId}`);
    const order = res.data;
    
    if (!order || !order.items || order.items.length === 0) {
      showToast('No items found in this order', 'error');
      return;
    }

    closeReturnModal();

    const modal = document.createElement('div');
    modal.id = 'returnModalOverlay';
    modal.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.7); 
      z-index:99999; display:flex; align-items:center; justify-content:center; 
      padding:16px; overflow-y:auto;
    `;
    
    modal.innerHTML = `
      <div style="background:var(--surface); padding:28px; border-radius:16px; max-width:600px; width:100%; max-height:90vh; overflow-y:auto; box-shadow:0 25px 80px rgba(0,0,0,0.4); border:1px solid var(--border);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h3 style="margin:0; color:var(--primary); font-size:20px;">
            <i class="fas fa-undo" style="color:#e74c3c; margin-right:10px;"></i>Request Return
          </h3>
          <button onclick="closeReturnModal()" style="background:none; border:none; font-size:24px; color:var(--text-secondary); cursor:pointer; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:20px; padding:12px; background:var(--bg); border-radius:8px; border-left:3px solid var(--gold);">
          <i class="fas fa-info-circle"></i> Select items to return. Return window: <strong>7 days</strong> from delivery.
        </p>

        <form id="returnForm">
          ${order.items.map((item, idx) => {
            const productName = item.name || 'Product';
            const qty = item.quantity || 1;
            const price = item.price || 0;
            const total = item.totalPrice || (price * qty);
            const productId = item.product?._id || item.product || '';
            
            return `
              <div style="border:2px solid var(--border); padding:16px; border-radius:12px; margin-bottom:14px; background:var(--bg);">
                <label style="display:flex; align-items:flex-start; gap:12px; cursor:pointer; margin-bottom:12px;">
                  <input type="checkbox" name="returnItem" value="${idx}" 
                    data-product="${productId}" 
                    data-name="${productName}" 
                    data-price="${price}" 
                    data-qty="${qty}"
                    style="width:20px; height:20px; accent-color:var(--primary); margin-top:2px;">
                  <div style="flex:1;">
                    <div style="font-weight:700; font-size:15px; color:var(--text); margin-bottom:4px;">${productName}</div>
                    <div style="font-size:13px; color:var(--text-secondary);">
                      Qty: ${qty} | Rs.${total} 
                      ${item.size ? `| Size: ${item.size}` : ''} 
                      ${item.color ? `| Color: ${item.color}` : ''}
                    </div>
                  </div>
                </label>
                <select name="reason_${idx}" required style="width:100%; padding:12px; border:2px solid var(--border); border-radius:8px; font-family:inherit; font-size:14px; background:var(--surface); color:var(--text);">
                  <option value="">Select Return Reason *</option>
                  <option value="Damaged">Damaged / Defective</option>
                  <option value="Wrong Item">Wrong Item Received</option>
                  <option value="Not as described">Not as Described</option>
                  <option value="Quality issue">Quality Issue</option>
                  <option value="Size issue">Size Issue</option>
                  <option value="Changed mind">Changed My Mind</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            `;
          }).join('')}
          
          <div style="background:var(--bg); padding:16px; border-radius:10px; margin:20px 0; border:1px dashed var(--border);">
            <label style="font-size:13px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:8px;">Refund Method</label>
            <div style="display:flex; gap:16px; flex-wrap:wrap;">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:14px;">
                <input type="radio" name="refundMethod" value="original" checked style="accent-color:var(--primary);">
                Original Payment
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:14px;">
                <input type="radio" name="refundMethod" value="wallet" style="accent-color:var(--primary);">
                Store Wallet
              </label>
            </div>
          </div>

          <div style="display:flex; gap:12px; margin-top:24px;">
            <button type="button" onclick="closeReturnModal()" style="flex:1; padding:14px; border:2px solid var(--border); border-radius:10px; background:var(--surface); color:var(--text); font-weight:600; cursor:pointer; font-size:15px;">
              Cancel
            </button>
            <button type="submit" style="flex:1; padding:14px; background:#e74c3c; color:#fff; border:none; border-radius:10px; font-weight:700; cursor:pointer; font-size:15px;">
              <i class="fas fa-paper-plane"></i> Submit Return
            </button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeReturnModal();
    });
    
    const escHandler = (e) => {
      if (e.key === 'Escape') closeReturnModal();
    };
    document.addEventListener('keydown', escHandler);
    modal._escHandler = escHandler;

    modal.querySelector('#returnForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const checked = modal.querySelectorAll('input[name="returnItem"]:checked');
      if (!checked.length) {
        alert('Please select at least one item to return');
        return;
      }
      
      const refundMethod = modal.querySelector('input[name="refundMethod"]:checked')?.value || 'original';
      
      const returnItems = Array.from(checked).map(cb => {
        const idx = cb.value;
        const reasonSelect = modal.querySelector(`[name="reason_${idx}"]`);
        return {
          productId: cb.dataset.product,
          name: cb.dataset.name,
          price: Number(cb.dataset.price),
          quantity: Number(cb.dataset.qty),
          reason: reasonSelect ? reasonSelect.value : 'Other'
        };
      });
      
      const submitBtn = modal.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      
      try {
        await api('/returns', {
          method: 'POST',
          body: JSON.stringify({ 
            orderId, 
            items: returnItems, 
            reason: returnItems[0].reason,
            refundMethod
          })
        });
        showToast('Return request submitted successfully!');
        closeReturnModal();
        renderOrders(document.getElementById('mainContent'));
      } catch (err) {
        console.error('Return submit error:', err);
        showToast(err.message || 'Failed to submit return', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Return';
      }
    });
    
  } catch (err) {
    console.error('Return modal error:', err);
    showToast('Failed to load order details', 'error');
  }
}

function closeReturnModal() {
  const modal = document.getElementById('returnModalOverlay');
  if (modal) {
    if (modal._escHandler) document.removeEventListener('keydown', modal._escHandler);
    modal.remove();
    document.body.style.overflow = '';
  }
}

// ============================
// MY RETURNS PAGE
// ============================

async function renderMyReturns(container) {
  if (!state.token) { openAuthModal(); return; }
  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'My Returns' }]);
  
  container.innerHTML = `
    <div class="section" style="max-width:900px;">
      <h2 class="section-title"><i class="fas fa-undo" style="color:var(--primary); margin-right:12px;"></i>My Returns</h2>
      <div class="orders-list" id="returnsList">
        <div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Loading...</p></div>
      </div>
    </div>
  `;
  
  try {
    const data = await api('/returns/my-returns');
    const returns = data.data || [];
    
    const statusConfig = {
      requested: { class: 'status-pending', icon: 'fa-clock', text: 'Under review by admin' },
      approved: { class: 'status-confirmed', icon: 'fa-check', text: 'Return approved — pickup arranged' },
      picked_up: { class: 'status-shipped', icon: 'fa-truck', text: 'Product received, verifying' },
      refunded: { class: 'status-delivered', icon: 'fa-check-circle', text: 'Refund processed successfully' },
      rejected: { class: 'status-cancelled', icon: 'fa-times-circle', text: 'Return request rejected' },
      cancelled: { class: 'status-cancelled', icon: 'fa-ban', text: 'Cancelled' }
    };
    
    document.getElementById('returnsList').innerHTML = returns.length ? returns.map(r => {
      const cfg = statusConfig[r.status] || statusConfig.requested;
      return `
      <div class="order-card" style="margin-bottom:20px;">
        <div class="order-header">
          <div>
            <h4>Return — Order ${r.order?.orderNumber || 'N/A'}</h4>
            <div class="order-meta">
              <span><i class="fas fa-calendar"></i> ${formatDate(r.createdAt)}</span>
              <span><i class="fas fa-box"></i> ${r.items?.length || 0} items</span>
              <span><i class="fas fa-money-bill-wave"></i> Refund: Rs.${r.refundAmount}</span>
            </div>
          </div>
          <span class="status-badge ${cfg.class}">${r.status?.replace(/_/g, ' ').toUpperCase()}</span>
        </div>
        <div class="order-items">
          ${r.items?.map(item => `
            <div class="order-item-mini">
              <div style="width:50px; height:50px; background:var(--bg); border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:20px; color:var(--primary);">
                <i class="fas fa-box"></i>
              </div>
              <span>
                ${item.name} <strong>x${item.quantity}</strong>
                <br><small style="color:var(--text-secondary);">Reason: ${item.reason}</small>
                ${item.condition ? `<br><small style="color:var(--text-secondary);">Condition: ${item.condition}</small>` : ''}
              </span>
            </div>
          `).join('') || '<p style="color:var(--text-secondary);">No items</p>'}
        </div>
        <div class="order-footer" style="flex-direction:column; align-items:flex-start; gap:8px;">
          <div style="font-size:14px; color:var(--text-secondary);">
            <i class="fas ${cfg.icon}" style="color:var(--gold); margin-right:6px;"></i> ${cfg.text}
          </div>
          ${r.trackingId ? `<div style="font-size:12px; color:var(--text-secondary);"><i class="fas fa-barcode"></i> Pickup Tracking: <strong>${r.trackingId}</strong></div>` : ''}
          ${r.notes ? `<div style="font-size:12px; color:#e74c3c; margin-top:4px;"><i class="fas fa-comment"></i> Admin Note: ${r.notes}</div>` : ''}
          <div class="order-total" style="font-size:16px; align-self:flex-end;">Refund: Rs.${r.refundAmount}</div>
        </div>
      </div>
    `}).join('') : `
      <div class="empty-state">
        <i class="fas fa-undo" style="font-size:48px; color:var(--border); margin-bottom:16px;"></i>
        <h3>No returns yet</h3>
        <p style="color:var(--text-secondary); max-width:400px; margin:0 auto 20px;">You have not initiated any return requests. You can return delivered orders within 7 days.</p>
        <a href="#orders" class="btn btn-dark btn-sm"><i class="fas fa-box"></i> View My Orders</a>
      </div>
    `;
  } catch (err) {
    console.error('My returns error:', err);
    document.getElementById('returnsList').innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-circle" style="color:#e74c3c;"></i>
        <h3>Failed to load returns</h3>
        <p>Please try again later</p>
      </div>
    `;
  }
}
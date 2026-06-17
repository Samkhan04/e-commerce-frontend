// ============================
// ADMIN DASHBOARD
// ============================
let adminCharts = {};

function destroyAdminCharts() {
  Object.values(adminCharts).forEach(chart => {
    if (chart && typeof chart.destroy === 'function') {
      chart.destroy();
    }
  });
  adminCharts = {};
}
async function renderAdmin(container) {
  destroyAdminCharts();
  if (!state.token || state.user?.role !== 'admin') {
    showToast('Admin access only', 'error');
    navigateTo('home');
    return;
  }

  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'Admin Dashboard' }]);

  container.innerHTML = `
    <div class="section" style="max-width:1400px;">
      <h2 class="section-title"><i class="fas fa-chart-line" style="color:var(--primary); margin-right:12px;"></i>Admin Dashboard</h2>

      <div class="admin-stats" id="adminStats">
        <div class="stat-card"><h3>Total Revenue</h3><div class="value">Rs.0</div></div>
        <div class="stat-card"><h3>Total Orders</h3><div class="value">0</div></div>
        <div class="stat-card"><h3>Today Visitors</h3><div class="value">0</div></div>
        <div class="stat-card"><h3>Products</h3><div class="value">0</div></div>
      </div>

      <div class="admin-tabs">
        <button class="admin-tab active" onclick="switchAdminTab('overview', this)">Overview</button>
        <button class="admin-tab" onclick="switchAdminTab('orders', this)">Orders</button>
        <button class="admin-tab" onclick="switchAdminTab('products', this)">Products</button>
        <button class="admin-tab" onclick="switchAdminTab('customers', this)">Customers</button>
        <button class="admin-tab" onclick="switchAdminTab('coupons', this)">Coupons</button>
        <button class="admin-tab" onclick="switchAdminTab('returns', this)">Returns</button>
      </div>

      <div class="admin-section active" id="adminOverview">
        <div class="charts-grid">
          <div class="chart-card">
            <h4><i class="fas fa-trophy" style="color:var(--gold); margin-right:8px;"></i>Best Selling Products</h4>
            <div class="chart-container"><canvas id="bestsellersChart"></canvas></div>
          </div>
          <div class="chart-card">
            <h4><i class="fas fa-chart-pie" style="color:var(--gold); margin-right:8px;"></i>Traffic Sources</h4>
            <div class="chart-container"><canvas id="trafficChart"></canvas></div>
          </div>
          <div class="chart-card">
            <h4><i class="fas fa-tags" style="color:var(--gold); margin-right:8px;"></i>Sales by Category</h4>
            <div class="chart-container"><canvas id="categoryChart"></canvas></div>
          </div>
          <div class="chart-card">
            <h4><i class="fas fa-shopping-cart" style="color:var(--gold); margin-right:8px;"></i>Analytics Overview</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; padding:20px;">
              <div style="text-align:center; padding:24px; background:var(--bg); border-radius:12px;">
                <div style="font-size:42px; font-weight:700; color:var(--primary); font-family:'Playfair Display';" id="conversionRate">0%</div>
                <div style="font-size:13px; color:var(--text-secondary); margin-top:8px; text-transform:uppercase; letter-spacing:1px;">Conversion Rate</div>
              </div>
              <div style="text-align:center; padding:24px; background:var(--bg); border-radius:12px;">
                <div style="font-size:42px; font-weight:700; color:var(--primary); font-family:'Playfair Display';" id="abandonedCarts">0</div>
                <div style="font-size:13px; color:var(--text-secondary); margin-top:8px; text-transform:uppercase; letter-spacing:1px;">Abandoned Carts</div>
                <div style="font-size:12px; color:var(--gold); margin-top:4px;" id="abandonedValue">Rs.0</div>
              </div>
            </div>
          </div>
        </div>
        <div class="chart-card" style="margin-top:24px;">
          <h4><i class="fas fa-exclamation-triangle" style="color:#e74c3c; margin-right:8px;"></i>Inventory Alerts</h4>
          <div id="inventoryAlerts" style="padding:16px;"><p style="color:var(--text-secondary);">Loading inventory data...</p></div>
        </div>
      </div>

      <div class="admin-section" id="adminOrders">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h3>All Orders</h3>
          <select id="orderStatusFilter" onchange="loadAdminOrders()" style="padding:8px 14px; border-radius:8px; border:2px solid var(--border); background:var(--surface);">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div id="adminOrdersTable"></div>
      </div>

      <div class="admin-section" id="adminProducts">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h3>Product Management</h3>
          <button class="btn btn-dark btn-sm" onclick="showAddProductModal()"><i class="fas fa-plus"></i> Add Product</button>
        </div>
        <div id="adminProductsTable"></div>
      </div>

      <div class="admin-section" id="adminCustomers">
        <h3 style="margin-bottom:20px;">Customer Management</h3>
        <div id="adminCustomersTable"></div>
      </div>

      <div class="admin-section" id="adminCoupons">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h3>Coupon Management</h3>
          <button class="btn btn-dark btn-sm" onclick="showAddCouponModal()"><i class="fas fa-plus"></i> Add Coupon</button>
        </div>
        <div id="adminCouponsTable"></div>
      </div>

      <div class="admin-section" id="adminReturns">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h3><i class="fas fa-undo" style="color:#e74c3c; margin-right:10px;"></i>Return & Refund Management</h3>
        </div>
        <div id="adminReturnsTable"></div>
      </div>
    </div>
  `;

  loadAdminDashboard();
}

async function loadAdminDashboard() {
  try {
    destroyAdminCharts();
    const data = await api('/analytics/dashboard');
    const d = data.data;
    state.adminData = d;

    const stats = document.getElementById('adminStats');
    stats.innerHTML = `
      <div class="stat-card"><h3>Total Revenue</h3><div class="value">Rs.${(d.revenue?.total || 0).toLocaleString('en-IN')}</div><div class="change">Today: Rs.${(d.revenue?.today || 0).toLocaleString('en-IN')}</div></div>
      <div class="stat-card"><h3>Total Orders</h3><div class="value">${d.orders?.total || 0}</div><div class="change">Today: ${d.orders?.today || 0}</div></div>
      <div class="stat-card"><h3>Today Visitors</h3><div class="value">${d.visitors?.today || 0}</div><div class="change">Week: ${d.visitors?.week || 0}</div></div>
      <div class="stat-card"><h3>Products</h3><div class="value">${(d.inventory?.lowStock?.length || 0) + (d.inventory?.outOfStock?.length || 0)}</div><div class="change" style="color:#e74c3c;">Low Stock: ${d.inventory?.lowStock?.length || 0}</div></div>
    `;

    document.getElementById('conversionRate').textContent = (d.conversionRate || 0) + '%';
    document.getElementById('abandonedCarts').textContent = d.abandoned?.carts || 0;
    document.getElementById('abandonedValue').textContent = 'Rs.' + (d.abandoned?.value || 0).toLocaleString('en-IN');

    // Load Chart.js dynamically if needed
    if (typeof Chart === 'undefined') {
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    const bsCtx = document.getElementById('bestsellersChart');
    if (bsCtx && d.bestsellers?.length) {
      adminCharts.bestsellers = new Chart(bsCtx, {
        type: 'bar',
        data: {
          labels: d.bestsellers.map(b => b.name?.substring(0, 15) + '...'),
          datasets: [{
            label: 'Units Sold',
            data: d.bestsellers.map(b => b.totalSold),
            backgroundColor: '#6B3A1F',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
        }
      });
    }

    const trCtx = document.getElementById('trafficChart');
    if (trCtx && d.trafficSources?.length) {
      adminCharts.traffic = new Chart(trCtx, {
        type: 'doughnut',
        data: {
          labels: d.trafficSources.map(t => t._id || 'Direct'),
          datasets: [{
            data: d.trafficSources.map(t => t.count),
            backgroundColor: ['#6B3A1F', '#C9A961', '#8B5A3C', '#D4A574', '#A0522D', '#CD853F', '#DEB887', '#F5DEB3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } } }
        }
      });
    }

    const catCtx = document.getElementById('categoryChart');
    if (catCtx && d.categorySales?.length) {
      adminCharts.category = new Chart(catCtx, {
        type: 'bar',
        data: {
          labels: d.categorySales.map(c => c._id),
          datasets: [{
            label: 'Revenue (Rs.)',
            data: d.categorySales.map(c => c.revenue),
            backgroundColor: '#C9A961',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
        }
      });
    }

    const inv = document.getElementById('inventoryAlerts');
    const low = d.inventory?.lowStock || [];
    const out = d.inventory?.outOfStock || [];
    if (low.length || out.length) {
      inv.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
          ${low.map(p => `
            <div style="padding:16px; background:#fff8e1; border-left:4px solid #f39c12; border-radius:8px;">
              <div style="font-weight:600; font-size:14px; color:var(--primary);">${p.name}</div>
              <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">SKU: ${p.sku} | Stock: <strong style="color:#f39c12;">${p.stock}</strong></div>
            </div>
          `).join('')}
          ${out.map(p => `
            <div style="padding:16px; background:#ffeaea; border-left:4px solid #e74c3c; border-radius:8px;">
              <div style="font-weight:600; font-size:14px; color:var(--primary);">${p.name}</div>
              <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">SKU: ${p.sku} | <strong style="color:#e74c3c;">OUT OF STOCK</strong></div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      inv.innerHTML = '<p style="color:var(--text-secondary);"><i class="fas fa-check-circle" style="color:#27ae60;"></i> All inventory levels are healthy.</p>';
    }

    loadAdminOrders();
    loadAdminProducts();
    loadAdminCustomers();
    loadAdminCoupons();
    loadAdminReturns();
  } catch (err) { console.error('Admin load failed:', err); }
}

function switchAdminTab(tab, btn) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.getElementById('admin' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
}

async function loadAdminOrders() {
  const status = document.getElementById('orderStatusFilter')?.value || '';
  try {
    let url = '/orders/admin/all?limit=50';
    if (status) url += '&status=' + status;
    const data = await api(url);
    const orders = data.data || [];
    document.getElementById('adminOrdersTable').innerHTML = orders.length ? `
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td><strong>${o.orderNumber}</strong><br><span style="font-size:12px; color:var(--text-secondary);">${o.items?.length || 0} items</span></td>
                <td>${o.user?.name || 'N/A'}<br><span style="font-size:12px; color:var(--text-secondary);">${o.user?.email || ''}</span></td>
                <td>${formatDate(o.createdAt)}</td>
                <td>Rs.${o.totalAmount}</td>
                <td><span class="status-badge status-${o.status}">${o.status?.replace(/_/g, ' ')}</span></td>
                <td>${o.paymentStatus}</td>
                <td class="actions">
                  <button class="btn btn-sm btn-dark" onclick="updateOrderStatus('${o._id}')">Update</button>
                  <button class="btn btn-sm btn-outline" onclick="downloadInvoice('${o._id}', '${o.orderNumber}')">Invoice</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><p>No orders found</p></div>';
  } catch (err) {}
}

async function updateOrderStatus(orderId) {
  // 🔥 Dropdown modal instead of prompt
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.innerHTML = `
    <div style="background:#fff;padding:28px;border-radius:12px;min-width:320px;max-width:90vw;">
      <h3 style="margin-bottom:16px;color:var(--primary);">Update Order Status</h3>
      <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">Order: <strong>#${orderId.slice(-6)}</strong></p>
      <select id="statusSelect" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:8px;margin-bottom:12px;font-family:inherit;">
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="packed">Packed</option>
        <option value="shipped">Shipped</option>
        <option value="out_for_delivery">Out for Delivery</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input type="text" id="trackingInput" placeholder="Tracking ID (optional)" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:8px;margin-bottom:20px;font-family:inherit;">
      <div style="display:flex;gap:10px;">
        <button onclick="this.closest('.modal-overlay').remove()" style="flex:1;padding:10px;border:1px solid var(--border);border-radius:8px;background:#fff;cursor:pointer;">Cancel</button>
        <button id="confirmStatusBtn" style="flex:1;padding:10px;background:var(--primary);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Update</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  modal.querySelector('#confirmStatusBtn').onclick = async () => {
    const status = document.getElementById('statusSelect').value;
    const trackingId = document.getElementById('trackingInput').value;
    modal.remove();
    
    try {
      await api(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status, trackingId }) });
      showToast('Order status updated to ' + status);
      loadAdminOrders();
    } catch (err) {}
  };
  
  modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
}

async function loadAdminProducts() {
  try {
    const data = await api('/products?limit=100');
    const products = data.data || [];
    document.getElementById('adminProductsTable').innerHTML = products.length ? `
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td style="display:flex; align-items:center; gap:12px;">
                  <img src="${p.mainImage || 'https://placehold.co/50x50'}" style="width:40px; height:40px; object-fit:cover; border-radius:6px;" loading="lazy">
                  <div><div style="font-weight:600;">${p.name}</div><div style="font-size:12px; color:var(--text-secondary);">${p.sku}</div></div>
                </td>
                <td>${p.category}</td>
                <td>Rs.${p.price}</td>
                <td><span style="color:${p.stock <= 5 ? '#e74c3c' : '#27ae60'}; font-weight:600;">${p.stock}</span></td>
                <td>${p.isAvailable ? 'Active' : 'Inactive'}</td>
                <td class="actions" style="display:flex; gap:8px; min-width:120px;">
  <button class="btn btn-sm btn-outline" onclick="editProduct('${p._id}')" style="padding:6px 14px; background:var(--primary); color:#fff; border:none; border-radius:6px; font-size:13px; cursor:pointer; font-weight:600;">
    <i class="fas fa-edit" style="margin-right:4px;"></i>Edit
  </button>
  <button class="btn btn-sm btn-danger" onclick="deleteProduct('${p._id}')" style="padding:6px 14px; background:#e74c3c; color:#fff; border:none; border-radius:6px; font-size:13px; cursor:pointer; font-weight:600;">
    <i class="fas fa-trash" style="margin-right:4px;"></i>Delete
  </button>
</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><p>No products found</p></div>';
  } catch (err) {}
}

async function loadAdminCustomers() {
  try {
    const data = await api('/users');
    const users = data.data || [];
    document.getElementById('adminCustomersTable').innerHTML = users.length ? `
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Points</th><th>Joined</th></tr></thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td><strong>${u.name}</strong></td>
                <td>${u.email}</td>
                <td>${u.phone || 'N/A'}</td>
                <td><span class="status-badge ${u.role === 'admin' ? 'status-delivered' : 'status-pending'}">${u.role}</span></td>
                <td>${u.loyaltyPoints || 0} pts</td>
                <td>${formatDate(u.createdAt)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><p>No customers found</p></div>';
  } catch (err) {}
}

async function loadAdminCoupons() {
  try {
    const data = await api('/coupons');
    const coupons = data.data || [];
    document.getElementById('adminCouponsTable').innerHTML = coupons.length ? `
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Usage</th><th>Valid Until</th><th>Status</th></tr></thead>
          <tbody>
            ${coupons.map(c => `
              <tr>
                <td><span style="font-family:monospace; font-weight:700; color:var(--primary); font-size:16px;">${c.code}</span></td>
                <td>${c.discountType}</td>
                <td>${c.discountType === 'percentage' ? c.discountValue + '%' : 'Rs.' + c.discountValue}</td>
                <td>Rs.${c.minOrderAmount}</td>
                <td>${c.usageCount || 0}${c.usageLimit ? '/' + c.usageLimit : ''}</td>
                <td>${formatDate(c.validUntil)}</td>
                <td><span class="status-badge ${c.isActive ? 'status-delivered' : 'status-cancelled'}">${c.isActive ? 'Active' : 'Inactive'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><p>No coupons found</p></div>';
  } catch (err) {}
}
// ===== COLOR PICKER DATA =====
const LEATHER_COLORS = [
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Black', hex: '#000000' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Red', hex: '#DC143C' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#008000' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Rose', hex: '#FF007F' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Olive', hex: '#556B2F' },
];

function renderColorPickerHtml(selectedColors = [], inputId = 'selectedColors') {
  return `
    <div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:10px;" id="colorPicker">
      ${LEATHER_COLORS.map(c => {
        const isSelected = selectedColors.some(sc => sc.name === c.name && sc.hex === c.hex);
        return `
          <button type="button" 
            onclick="toggleColorSwatch(this, '${c.name}', '${c.hex}', '${inputId}')"
            class="color-swatch-btn ${isSelected ? 'selected' : ''}"
            data-name="${c.name}" data-hex="${c.hex}"
            style="
              display:flex; flex-direction:column; align-items:center; gap:6px;
              padding:8px 10px; border:2px solid ${isSelected ? 'var(--gold)' : 'var(--border)'};
              border-radius:10px; background:var(--bg); cursor:pointer; min-width:60px;
              transition:all 0.2s; box-shadow:${isSelected ? '0 4px 12px rgba(201,169,97,0.25)' : 'none'};
            ">
            <span style="
              width:32px; height:32px; border-radius:50%; 
              background:${c.hex}; 
              border:2px solid ${c.hex === '#FFFFFF' ? '#ddd' : 'transparent'};
              display:flex; align-items:center; justify-content:center;
              box-shadow:0 2px 6px rgba(0,0,0,0.15);
            ">
              ${isSelected ? '<i class="fas fa-check" style="color:#fff; font-size:12px; text-shadow:0 1px 3px rgba(0,0,0,0.5);"></i>' : ''}
            </span>
            <span style="font-size:11px; font-weight:600; color:var(--text);">${c.name}</span>
          </button>
        `;
      }).join('')}
    </div>
    <input type="hidden" name="${inputId}" id="${inputId}" value='${JSON.stringify(selectedColors)}'>
  `;
}

function toggleColorSwatch(btn, name, hex, inputId) {
  const input = document.getElementById(inputId);
  let selected = JSON.parse(input.value || '[]');
  const idx = selected.findIndex(c => c.name === name && c.hex === hex);
  
  if (idx > -1) {
    selected.splice(idx, 1);
    btn.style.borderColor = 'var(--border)';
    btn.style.boxShadow = 'none';
    btn.querySelector('span:first-child').innerHTML = '';
  } else {
    selected.push({ name, hex });
    btn.style.borderColor = 'var(--gold)';
    btn.style.boxShadow = '0 4px 12px rgba(201,169,97,0.25)';
    btn.querySelector('span:first-child').innerHTML = '<i class="fas fa-check" style="color:#fff; font-size:12px; text-shadow:0 1px 3px rgba(0,0,0,0.5);"></i>';
  }
  input.value = JSON.stringify(selected);
}

function previewProductImages(input) {
  const container = document.getElementById('imagePreview');
  container.innerHTML = '';
  if (input.files) {
    Array.from(input.files).slice(0, 6).forEach((file, i) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative; width:120px; height:120px;';
      wrap.innerHTML = `
        <img src="${URL.createObjectURL(file)}" style="width:120px; height:120px; object-fit:cover; border-radius:10px; border:2px solid var(--border);">
        <span style="position:absolute; top:-6px; right:-6px; width:24px; height:24px; background:var(--primary); color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; border:2px solid var(--surface);">${i+1}</span>
      `;
      container.appendChild(wrap);
    });
  }
}
// ===== IMAGE COMPRESSION =====
async function compressImage(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Agar image already chhoti hai, toh compress mat karo
        if (img.width <= maxWidth && file.size < 1024 * 1024) {
          resolve(file);
          return;
        }
        
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, { 
              type: 'image/jpeg', 
              lastModified: Date.now() 
            });
            console.log(`Compressed: ${(file.size/1024).toFixed(1)}KB → ${(compressedFile.size/1024).toFixed(1)}KB`);
            resolve(compressedFile);
          } else {
            resolve(file); // fallback
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

function showAddProductModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.id = 'productModalOverlay';
  modal.innerHTML = `
    <div class="modal" style="max-width:750px; max-height:92vh; overflow-y:auto;">
      <div class="modal-header">
        <h2><i class="fas fa-plus-circle" style="color:var(--gold); margin-right:8px;"></i>Add New Product</h2>
        <button class="modal-close" onclick="document.getElementById('productModalOverlay').remove()"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">
        <form id="addProductForm" onsubmit="submitNewProduct(event)">
          <div class="form-row">
            <div class="form-group"><label>Product Name *</label><input type="text" name="name" required placeholder="e.g. Classic Brown Leather Belt"></div>
            <div class="form-group"><label>SKU *</label><input type="text" name="sku" required placeholder="VL-M-BLT-001"></div>
          </div>
          <div class="form-group"><label>Description</label><textarea name="description" rows="3" maxlength="1000" placeholder="Product details..."></textarea></div>
          <div class="form-row">
            <div class="form-group"><label>Price (Rs.) *</label><input type="number" name="price" required min="0" placeholder="1299"></div>
            <div class="form-group"><label>Compare Price (Rs.)</label><input type="number" name="comparePrice" min="0" placeholder="1999"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Category *</label>
              <select name="category" required>
                <option value="">Select</option>
                <option value="belts">Belts</option>
                <option value="jackets">Jackets</option>
                <option value="shoes">Shoes</option>
                <option value="purses">Purses</option>
                <option value="sandals">Sandals</option>
                <option value="slippers">Slippers</option>
                <option value="wallets">Wallets</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div class="form-group"><label>Stock *</label><input type="number" name="stock" required min="0" value="10"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Material</label><input type="text" name="material" placeholder="Full-Grain Leather"></div>
            <div class="form-group"><label>Weight (kg)</label><input type="number" name="weight" step="0.1" value="0.5"></div>
          </div>
          <div class="form-group"><label>Sizes (comma separated)</label><input type="text" name="sizes" placeholder="28, 30, 32, 34 or S, M, L, XL"></div>
          
          <div class="form-group">
            <label>Select Colors <span style="font-weight:400; color:var(--text-secondary); font-size:12px;">(Click to select multiple)</span></label>
            ${renderColorPickerHtml([], 'selectedColors')}
          </div>
          
          <div class="form-group"><label>Tags (comma separated)</label><input type="text" name="tags" placeholder="men, formal, bestseller, gift"></div>
          <div class="form-group"><label>Care Instructions</label><textarea name="careInstructions" rows="2" placeholder="Clean with soft cloth..."></textarea></div>
          <div style="display:flex; gap:12px; margin:16px 0; flex-wrap:wrap;">
            <label style="display:flex; align-items:center; gap:6px; font-size:14px; cursor:pointer;"><input type="checkbox" name="isTrending"> Trending</label>
            <label style="display:flex; align-items:center; gap:6px; font-size:14px; cursor:pointer;"><input type="checkbox" name="isNewArrival"> New Arrival</label>
            <label style="display:flex; align-items:center; gap:6px; font-size:14px; cursor:pointer;"><input type="checkbox" name="isBestseller"> Bestseller</label>
          </div>
          <div class="form-group">
            <label>Product Images <span style="font-weight:400; color:var(--text-secondary); font-size:12px;">(up to 6 photos)</span></label>
            <input type="file" name="images" multiple accept="image/*" id="prodImages" onchange="previewProductImages(this)" style="padding:10px; border:2px dashed var(--border); border-radius:10px; width:100%; background:var(--bg);">
            <div id="imagePreview" style="display:flex; gap:12px; margin-top:14px; flex-wrap:wrap;"></div>
          </div>
          <button type="submit" class="btn btn-dark" style="width:100%; margin-top:16px; padding:14px;" id="addProdBtn">
            <i class="fas fa-save"></i> Create Product
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

async function editProduct(id) {
  try {
    const { data: p } = await api(`/products/${id}`);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'editProductModalOverlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:750px; max-height:92vh; overflow-y:auto;">
        <div class="modal-header">
          <h2><i class="fas fa-edit" style="color:var(--gold); margin-right:8px;"></i>Edit Product</h2>
          <button class="modal-close" onclick="document.getElementById('editProductModalOverlay').remove()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="editProductForm" onsubmit="submitEditProduct(event, '${id}')">
            <div class="form-row">
              <div class="form-group"><label>Name *</label><input type="text" name="name" required value="${p.name || ''}"></div>
              <div class="form-group"><label>SKU *</label><input type="text" name="sku" required value="${p.sku || ''}"></div>
            </div>
            <div class="form-group"><label>Description</label><textarea name="description" rows="3">${p.description || ''}</textarea></div>
            <div class="form-row">
              <div class="form-group"><label>Price *</label><input type="number" name="price" required min="0" value="${p.price || ''}"></div>
              <div class="form-group"><label>Compare Price</label><input type="number" name="comparePrice" min="0" value="${p.comparePrice || ''}"></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Category *</label>
                <select name="category" required>
                  ${['belts','jackets','shoes','purses','sandals','slippers','wallets','accessories'].map(c => 
                    `<option value="${c}" ${p.category === c ? 'selected' : ''}>${c.charAt(0).toUpperCase() + c.slice(1)}</option>`
                  ).join('')}
                </select>
              </div>
              <div class="form-group"><label>Stock *</label><input type="number" name="stock" required min="0" value="${p.stock || 0}"></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Material</label><input type="text" name="material" value="${p.material || ''}"></div>
              <div class="form-group"><label>Weight</label><input type="number" name="weight" step="0.1" value="${p.weight || 0.5}"></div>
            </div>
            <div class="form-group"><label>Sizes (comma separated)</label><input type="text" name="sizes" value="${p.sizes?.join(', ') || ''}"></div>
            
            <div class="form-group">
              <label>Select Colors <span style="font-weight:400; color:var(--text-secondary); font-size:12px;">(Click to select multiple)</span></label>
              ${renderColorPickerHtml(p.colors || [], 'editSelectedColors')}
            </div>
            
            <div class="form-group"><label>Tags (comma separated)</label><input type="text" name="tags" value="${p.tags?.join(', ') || ''}"></div>
            <div class="form-group"><label>Care Instructions</label><textarea name="careInstructions" rows="2">${p.careInstructions || ''}</textarea></div>
            <div style="display:flex; gap:12px; margin:16px 0; flex-wrap:wrap;">
              <label style="display:flex; align-items:center; gap:6px; font-size:14px; cursor:pointer;"><input type="checkbox" name="isTrending" ${p.isTrending ? 'checked' : ''}> Trending</label>
              <label style="display:flex; align-items:center; gap:6px; font-size:14px; cursor:pointer;"><input type="checkbox" name="isNewArrival" ${p.isNewArrival ? 'checked' : ''}> New Arrival</label>
              <label style="display:flex; align-items:center; gap:6px; font-size:14px; cursor:pointer;"><input type="checkbox" name="isBestseller" ${p.isBestseller ? 'checked' : ''}> Bestseller</label>
            </div>
            
            <div class="form-group">
              <label>Current Images</label>
              <div style="display:flex; gap:12px; margin-bottom:12px; flex-wrap:wrap;" id="existingImagesPreview">
                ${p.images?.map((img, i) => `
                  <div style="position:relative; width:120px; height:120px;">
                    <img src="${img}" style="width:120px; height:120px; object-fit:cover; border-radius:10px; border:2px solid var(--border);">
                    <span style="position:absolute; top:-6px; right:-6px; width:24px; height:24px; background:var(--primary); color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; border:2px solid var(--surface);">${i+1}</span>
                  </div>
                `).join('') || '<p style="font-size:13px;color:var(--text-secondary);">No images</p>'}
              </div>
              <input type="hidden" id="existingImagesData" value='${JSON.stringify(p.images || [])}'>
              <label>Replace Images <span style="font-weight:400; color:var(--text-secondary); font-size:12px;">(up to 6 new)</span></label>
              <input type="file" name="images" multiple accept="image/*" id="editProdImages" onchange="previewProductImages(this)" style="padding:10px; border:2px dashed var(--border); border-radius:10px; width:100%; background:var(--bg);">
              <div id="imagePreview" style="display:flex; gap:12px; margin-top:14px; flex-wrap:wrap;"></div>
            </div>
            
            <button type="submit" class="btn btn-dark" style="width:100%; margin-top:16px; padding:14px;" id="editProdBtn">
              <i class="fas fa-save"></i> Update Product
            </button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  } catch (err) {
    showToast('Failed to load product', 'error');
  }
}

async function submitNewProduct(e) {
  e.preventDefault();
  const btn = document.getElementById('addProdBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

  const form = e.target;
  const formData = new FormData();

  formData.append('name', form.name.value);
  formData.append('sku', form.sku.value);
  formData.append('description', form.description.value);
  formData.append('price', form.price.value);
  formData.append('comparePrice', form.comparePrice.value || 0);
  formData.append('category', form.category.value);
  formData.append('stock', form.stock.value);
  formData.append('material', form.material.value || 'Genuine Leather');
  formData.append('weight', form.weight.value || 0.5);
  formData.append('careInstructions', form.careInstructions.value || 'Clean with soft cloth. Avoid water exposure.');

  if (form.sizes.value) {
    form.sizes.value.split(',').map(s => s.trim()).filter(Boolean).forEach(s => formData.append('sizes', s));
  }
  
  // Colors from hidden input (JSON array)
  const colors = JSON.parse(document.getElementById('selectedColors').value || '[]');
  colors.forEach(c => formData.append('colors', JSON.stringify(c)));
  
  if (form.tags.value) {
    form.tags.value.split(',').map(t => t.trim()).filter(Boolean).forEach(t => formData.append('tags', t));
  }

  formData.append('isTrending', form.isTrending.checked);
  formData.append('isNewArrival', form.isNewArrival.checked);
  formData.append('isBestseller', form.isBestseller.checked);

  const files = document.getElementById('prodImages').files;
  if (files.length === 0) {
    showToast('Please select at least one image', 'error');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Create Product';
    return;
  }

  // 🔥 Compress images before upload
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compressing...';
  const compressedFiles = await Promise.all(
    Array.from(files).slice(0, 6).map(file => compressImage(file))
  );
  compressedFiles.forEach(file => formData.append('images', file));
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: state.token ? { 'Authorization': `Bearer ${state.token}` } : {},
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create product');

    showToast('Product created successfully!');
    document.getElementById('productModalOverlay')?.remove();
    loadAdminProducts();
  } catch (err) {
    showToast(err.message || 'Failed to create product', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Create Product';
  }
}

async function submitEditProduct(e, id) {
  e.preventDefault();
  const btn = document.getElementById('editProdBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

  const form = e.target;
  const formData = new FormData();

  formData.append('name', form.name.value);
  formData.append('sku', form.sku.value);
  formData.append('description', form.description.value);
  formData.append('price', form.price.value);
  formData.append('comparePrice', form.comparePrice.value || 0);
  formData.append('category', form.category.value);
  formData.append('stock', form.stock.value);
  formData.append('material', form.material.value || 'Genuine Leather');
  formData.append('weight', form.weight.value || 0.5);
  formData.append('careInstructions', form.careInstructions.value || 'Clean with soft cloth. Avoid water exposure.');

  if (form.sizes.value) {
    form.sizes.value.split(',').map(s => s.trim()).filter(Boolean).forEach(s => formData.append('sizes', s));
  }
  
  // Colors from hidden input
  const colors = JSON.parse(document.getElementById('editSelectedColors').value || '[]');
  colors.forEach(c => formData.append('colors', JSON.stringify(c)));
  
  if (form.tags.value) {
    form.tags.value.split(',').map(t => t.trim()).filter(Boolean).forEach(t => formData.append('tags', t));
  }

  formData.append('isTrending', form.isTrending.checked);
  formData.append('isNewArrival', form.isNewArrival.checked);
  formData.append('isBestseller', form.isBestseller.checked);
  const existingImages = JSON.parse(document.getElementById('existingImagesData')?.value || '[]');
  if (existingImages.length > 0) {
    existingImages.forEach(img => formData.append('existingImages', img));
  }
  const files = document.getElementById('editProdImages').files;
  if (files.length > 0) {
    // 🔥 Compress images before upload
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compressing...';
    const compressedFiles = await Promise.all(
      Array.from(files).slice(0, 6).map(file => compressImage(file))
    );
    compressedFiles.forEach(file => formData.append('images', file));
  }

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: state.token ? { 'Authorization': `Bearer ${state.token}` } : {},
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update product');

    showToast('Product updated successfully!');
    document.getElementById('editProductModalOverlay')?.remove();
    loadAdminProducts();
  } catch (err) {
    showToast(err.message || 'Failed to update product', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Update Product';
  }
}
async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  try { await api(`/products/${id}`, { method: 'DELETE' }); showToast('Product removed'); loadAdminProducts(); } catch (err) {}
}
function showAddCouponModal() {
  document.getElementById('couponModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  // Default dates set karo
  document.getElementById('couponValidFrom').valueAsDate = new Date();
  document.getElementById('couponValidUntil').valueAsDate = new Date(Date.now() + 30*24*60*60*1000);
  loadCouponList();
}

function closeCouponModal(e) {
  if (e && e.target !== e.currentTarget && e.target.id !== 'couponModal') return;
  document.getElementById('couponModal').classList.remove('active');
  document.body.style.overflow = '';
}

async function loadCouponList() {
  const list = document.getElementById('couponList');
  try {
    const data = await api('/coupons');
    const coupons = data.data || [];
    if (!coupons.length) { list.innerHTML = '<p style="color:var(--text-secondary);">No active coupons.</p>'; return; }
    list.innerHTML = `
      <table>
        <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Valid Until</th><th>Status</th></tr></thead>
        <tbody>
          ${coupons.map(c => `
            <tr>
              <td><strong style="color:var(--primary);">${c.code}</strong></td>
              <td>${c.discountType}</td>
              <td>${c.discountType === 'percentage' ? c.discountValue + '%' : '₹' + c.discountValue}</td>
              <td>${new Date(c.validUntil).toLocaleDateString('en-IN')}</td>
              <td><span class="badge ${c.isActive ? 'badge-success' : 'badge-danger'}">${c.isActive ? 'Active' : 'Inactive'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (e) { list.innerHTML = '<p style="color:#e74c3c;">Failed to load coupons.</p>'; }
}

async function submitCoupon(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
  
  const body = {
    code: document.getElementById('couponCode').value.toUpperCase().trim(),
    description: document.getElementById('couponDesc').value,
    discountType: document.getElementById('couponType').value,
    discountValue: Number(document.getElementById('couponValue').value),
    minOrderAmount: Number(document.getElementById('couponMin').value) || 0,
    maxDiscount: Number(document.getElementById('couponMax').value) || null,
    validFrom: document.getElementById('couponValidFrom').value,
    validUntil: document.getElementById('couponValidUntil').value,
    usageLimit: Number(document.getElementById('couponLimit').value) || null,
    applicableCategories: ['all']
  };
  
  try {
    await api('/coupons', { method: 'POST', body: JSON.stringify(body) });
    showToast('Coupon created successfully!');
    e.target.reset();
    document.getElementById('couponValidFrom').valueAsDate = new Date();
    document.getElementById('couponValidUntil').valueAsDate = new Date(Date.now() + 30*24*60*60*1000);
    loadCouponList();
  } catch (err) { showToast('Failed to create coupon', 'error'); }
  finally { btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Create Coupon'; }
}
async function loadAdminReturns() {
  try {
    const data = await api('/returns/admin/all');
    const returns = data.data || [];
    
    const statusBadgeClass = (status) => {
      switch(status) {
        case 'requested': return 'status-pending';
        case 'approved': return 'status-confirmed';
        case 'picked_up': return 'status-shipped';
        case 'refunded': return 'status-delivered';
        case 'rejected': return 'status-cancelled';
        default: return 'status-pending';
      }
    };
    
    document.getElementById('adminReturnsTable').innerHTML = returns.length ? `
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items to Return</th>
              <th>Refund Amount</th>
              <th>Status</th>
              <th>Pickup Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${returns.map(r => `
              <tr>
                <td>
                  <strong>${r.order?.orderNumber || 'N/A'}</strong>
                  <br><span style="font-size:12px; color:var(--text-secondary);">${formatDate(r.createdAt)}</span>
                </td>
                <td>
                  ${r.user?.name || 'N/A'}
                  <br><span style="font-size:12px; color:var(--text-secondary);">${r.user?.email || ''}</span>
                  <br><span style="font-size:12px; color:var(--text-secondary);">📞 ${r.user?.phone || 'N/A'}</span>
                </td>
                <td>
                  ${r.items?.map(i => `
                    <div style="font-size:13px; margin-bottom:6px; padding:6px; background:var(--bg); border-radius:6px;">
                      <strong>${i.name}</strong> x${i.quantity}
                      <br><span style="font-size:11px; color:var(--text-secondary);">Reason: ${i.reason}</span>
                      <br><span style="font-size:11px; color:var(--text-secondary);">Condition: ${i.condition || 'unopened'}</span>
                    </div>
                  `).join('') || '-'}
                </td>
                <td>
                  <strong>₹${r.refundAmount}</strong>
                  <br><span style="font-size:12px; color:var(--text-secondary); text-transform:uppercase;">${r.refundMethod}</span>
                </td>
                <td>
                  <span class="status-badge ${statusBadgeClass(r.status)}">${r.status?.replace(/_/g, ' ').toUpperCase()}</span>
                </td>
                <td style="font-size:12px; max-width:180px;">
                  <strong>${r.pickupAddress?.fullName || ''}</strong><br>
                  ${r.pickupAddress?.addressLine1 || ''}<br>
                  ${r.pickupAddress?.addressLine2 ? r.pickupAddress.addressLine2 + '<br>' : ''}
                  ${r.pickupAddress?.city || ''}, ${r.pickupAddress?.state || ''} - ${r.pickupAddress?.pincode || ''}<br>
                  <span style="color:var(--text-secondary);">📞 ${r.pickupAddress?.phone || 'N/A'}</span>
                </td>
                <td class="actions" style="min-width:140px;">
                  ${r.status === 'requested' ? `
                    <button class="btn btn-sm btn-success" onclick="updateReturnStatus('${r._id}', 'approved')" style="background:#27ae60; color:#fff; border:none; margin-bottom:6px;">✓ Approve</button>
                    <button class="btn btn-sm btn-danger" onclick="updateReturnStatus('${r._id}', 'rejected')" style="border:none;">✕ Reject</button>
                  ` : ''}
                  ${r.status === 'approved' ? `
                    <button class="btn btn-sm btn-dark" onclick="updateReturnStatus('${r._id}', 'picked_up')">Mark Picked Up</button>
                  ` : ''}
                  ${r.status === 'picked_up' ? `
                    <button class="btn btn-sm btn-success" onclick="updateReturnStatus('${r._id}', 'refunded')" style="background:#27ae60; color:#fff; border:none;">Process Refund</button>
                  ` : ''}
                  ${r.status === 'refunded' ? `
                    <span style="color:#27ae60; font-size:13px; font-weight:600;"><i class="fas fa-check-circle"></i> Completed</span>
                    <br><span style="font-size:11px; color:var(--text-secondary);">${formatDate(r.resolvedAt)}</span>
                  ` : ''}
                  ${r.status === 'rejected' ? `
                    <span style="color:#e74c3c; font-size:13px; font-weight:600;"><i class="fas fa-times-circle"></i> Rejected</span>
                  ` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><i class="fas fa-undo"></i><h3>No return requests</h3><p>All customers are happy with their orders!</p></div>';
  } catch (err) {
    console.error('Admin returns load failed:', err);
    document.getElementById('adminReturnsTable').innerHTML = '<p style="color:#e74c3c;">Failed to load returns data.</p>';
  }
}

async function updateReturnStatus(returnId, status) {
  let trackingId = '';
  let notes = '';
  
  if (status === 'approved') {
    trackingId = prompt('Enter pickup tracking ID (optional):') || '';
  }
  if (status === 'rejected') {
    notes = prompt('Enter rejection reason for customer:') || '';
  }
  if (status === 'refunded') {
    if (!confirm('Confirm refund of ₹' + (document.querySelector(`button[onclick="updateReturnStatus('${returnId}', 'refunded')"]`)?.closest('tr')?.querySelector('td:nth-child(4)')?.textContent || 'amount') + '?')) return;
  }
  
  try {
    const body = { status };
    if (trackingId) body.trackingId = trackingId;
    if (notes) body.notes = notes;
    
    await api(`/returns/${returnId}/status`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
    showToast('Return status updated: ' + status.toUpperCase());
    loadAdminReturns();
  } catch (err) {
    showToast('Failed to update return status', 'error');
  }
}
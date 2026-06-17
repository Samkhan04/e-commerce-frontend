// ============================
// CHECKOUT & PAYMENT
// ============================

async function renderCheckout(container) {
  if (!state.token) { openAuthModal(); return; }
  if (!state.cart.length) { showToast('Your cart is empty', 'error'); navigateTo('shop'); return; }

  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'Shop', href: '#shop' }, { label: 'Checkout' }]);

  container.innerHTML = `
    <div class="checkout-grid">
      <div class="checkout-form">
        <h2 style="font-size:28px; margin-bottom:8px;">Checkout</h2>
        <p style="color:var(--text-secondary); margin-bottom:24px;">Complete your order</p>

        <div style="background:var(--surface); padding:24px; border-radius:var(--radius); border:1px solid var(--border); margin-bottom:24px;">
          <h3 style="font-size:16px; margin-bottom:16px; text-transform:uppercase; letter-spacing:1px;">Shipping Address</h3>
          <div id="savedAddresses"></div>
          <div class="address-form" style="margin-top:20px;">
            <div class="form-row">
              <div class="form-group"><label>Full Name</label><input type="text" id="shipName" required></div>
              <div class="form-group"><label>Phone</label><input type="tel" id="shipPhone" required></div>
            </div>
            <div class="form-group"><label>Address Line 1</label><input type="text" id="shipAddr1" required></div>
            <div class="form-group"><label>Address Line 2</label><input type="text" id="shipAddr2"></div>
            <div class="form-row">
              <div class="form-group"><label>City</label><input type="text" id="shipCity" required></div>
              <div class="form-group"><label>State</label><input type="text" id="shipState" required></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Pincode</label><input type="text" id="shipPin" required></div>
              <div class="form-group"><label>Country</label><input type="text" id="shipCountry" value="India" readonly></div>
            </div>
          </div>
        </div>

        <div style="background:var(--surface); padding:24px; border-radius:var(--radius); border:1px solid var(--border);">
          <h3 style="font-size:16px; margin-bottom:16px; text-transform:uppercase; letter-spacing:1px;">Payment Method</h3>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <label class="payment-option">
              <input type="radio" name="payment" value="cod" checked>
              <div><div style="font-weight:600; font-size:14px;">Cash on Delivery</div><div style="font-size:12px; color:var(--text-secondary);">Pay when you receive</div></div>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="razorpay">
              <div><div style="font-weight:600; font-size:14px;">Online Payment</div><div style="font-size:12px; color:var(--text-secondary);">Razorpay Secure</div></div>
            </label>
          </div>
        </div>

        <div class="form-group" style="margin-top:24px;">
          <label>Order Notes (Optional)</label>
          <textarea id="orderNotes" rows="3" placeholder="Any special instructions..."></textarea>
        </div>

        <button class="btn btn-dark" style="width:100%; justify-content:center; margin-top:16px; padding:16px; font-size:16px;" onclick="placeOrder()">
          <i class="fas fa-lock"></i> Place Order Securely
        </button>
      </div>

      <div class="checkout-summary">
        <h3>Order Summary</h3>
        <div id="checkoutItems"></div>
        <div class="summary-row"><span>Subtotal</span><span id="checkoutSubtotal">Rs.0</span></div>
        <div class="summary-row"><span>Shipping</span><span id="checkoutShipping">Rs.0</span></div>
        <div class="summary-row discount" id="checkoutDiscountRow" style="display:none;"><span>Discount</span><span id="checkoutDiscount">-Rs.0</span></div>
        <div class="summary-row total"><span>Total</span><span id="checkoutTotal">Rs.0</span></div>

        <div style="margin-top:20px; padding-top:20px; border-top:1px solid var(--border);">
          <div class="form-group"><label>Coupon Code</label><div style="display:flex; gap:8px;"><input type="text" id="couponCode" placeholder="WELCOME20"><button class="btn btn-sm btn-outline" style="color:var(--primary); border-color:var(--primary);" onclick="applyCoupon()">Apply</button></div></div>
        </div>
      </div>
    </div>
  `;

  renderCheckoutItems();
  loadUserAddresses();
}

function renderCheckoutItems() {
  const container = document.getElementById('checkoutItems');
  let subtotal = 0;
  
  // 🔥 NaN se bachne ke liye safety check
  if (!Array.isArray(state.cart) || state.cart.length === 0) {
    container.innerHTML = '<p style="color:var(--text-secondary); padding:20px;">Your cart is empty</p>';
    document.getElementById('checkoutSubtotal').textContent = 'Rs.0';
    document.getElementById('checkoutShipping').textContent = 'FREE';
    document.getElementById('checkoutTotal').textContent = 'Rs.0';
    document.getElementById('checkoutDiscountRow').style.display = 'none';
    return;
  }

  container.innerHTML = state.cart.map(item => {
    const p = item.product || {};
    // 🔥 Number() se convert karo, NaN prevent karo
    const price = Number(item.price || p.price || 0);
    const qty = Number(item.quantity || 1);
    const lineTotal = price * qty;
    subtotal += lineTotal;
    
    return `
      <div style="display:flex; gap:12px; margin-bottom:16px; padding-bottom:16px; border-bottom:1px solid var(--border);">
        <img src="${p.mainImage || 'https://placehold.co/80x80?text=No+Image'}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;" loading="lazy">
        <div style="flex:1;">
          <div style="font-weight:600; font-size:14px;">${p.name || item.name || 'Product'}</div>
          <div style="font-size:12px; color:var(--text-secondary);">Qty: ${qty}</div>
          <div style="font-weight:700; color:var(--primary); font-size:14px;">Rs.${lineTotal.toLocaleString('en-IN')}</div>
        </div>
      </div>
    `;
  }).join('');

  const shipping = subtotal > 999 ? 0 : 50;
  const discount = Number(window.checkoutDiscount) || 0; // 🔥 Number() se NaN handle
  const total = subtotal + shipping - discount; // 🔥 GST hata diya

  document.getElementById('checkoutSubtotal').textContent = 'Rs.' + subtotal.toLocaleString('en-IN');
  document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'FREE' : 'Rs.' + shipping;
  
  // 🔥 GST element hata diya, isliye yeh line hatao
  // document.getElementById('checkoutGst').textContent = 'Rs.' + gst;
  
  if (discount > 0) {
    document.getElementById('checkoutDiscountRow').style.display = 'flex';
    document.getElementById('checkoutDiscount').textContent = '-Rs.' + discount.toLocaleString('en-IN');
  } else {
    document.getElementById('checkoutDiscountRow').style.display = 'none';
  }
  
  document.getElementById('checkoutTotal').textContent = 'Rs.' + total.toLocaleString('en-IN');
}

async function loadUserAddresses() {
  try {
    const data = await api('/auth/me');
    const addresses = data.user?.addresses || [];
    const container = document.getElementById('savedAddresses');
    if (addresses.length) {
      container.innerHTML = '<p style="font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-secondary); margin-bottom:12px;">Saved Addresses</p>' +
        addresses.map((addr, i) => `
          <div style="padding:14px; border:2px solid ${addr.isDefault ? 'var(--gold)' : 'var(--border)'}; border-radius:10px; margin-bottom:10px; cursor:pointer; background:${addr.isDefault ? 'rgba(201,169,97,0.05)' : 'var(--bg)'};" onclick="fillAddress(${i})">
            <div style="font-weight:600; font-size:14px; margin-bottom:4px;">${addr.label || 'Address'} ${addr.isDefault ? '<span style="font-size:11px; background:var(--gold); color:var(--primary); padding:2px 8px; border-radius:10px; margin-left:8px;">Default</span>' : ''}</div>
            <div style="font-size:13px; color:var(--text-secondary);">${addr.fullName}, ${addr.addressLine1}, ${addr.city}, ${addr.state} - ${addr.pincode}</div>
          </div>
        `).join('');
      window.savedAddresses = addresses;
    }
  } catch (err) {}
}

function fillAddress(idx) {
  const addr = window.savedAddresses[idx];
  if (!addr) return;
  document.getElementById('shipName').value = addr.fullName || '';
  document.getElementById('shipPhone').value = addr.phone || '';
  document.getElementById('shipAddr1').value = addr.addressLine1 || '';
  document.getElementById('shipAddr2').value = addr.addressLine2 || '';
  document.getElementById('shipCity').value = addr.city || '';
  document.getElementById('shipState').value = addr.state || '';
  document.getElementById('shipPin').value = addr.pincode || '';
}

async function applyCoupon() {
  const code = document.getElementById('couponCode').value;
  if (!code) return;
  try {
    const data = await api(`/coupons/validate/${code}`);
    const coupon = data.data;
    let subtotal = state.cart.reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0);
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    } else if (coupon.discountType === 'free_delivery') {
      discount = 50;
    }
    window.checkoutDiscount = discount;
    window.checkoutCoupon = code;
    renderCheckoutItems();
    showToast(`Coupon applied! You saved Rs.${discount}`);
  } catch (err) { showToast('Invalid or expired coupon', 'error'); }
}

async function placeOrder() {
  
  
  const btn = document.querySelector('button[onclick="placeOrder()"]');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> processing...';
  }

  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  

  const address = {
    fullName: document.getElementById('shipName').value,
    phone: document.getElementById('shipPhone').value,
    addressLine1: document.getElementById('shipAddr1').value,
    addressLine2: document.getElementById('shipAddr2').value,
    city: document.getElementById('shipCity').value,
    state: document.getElementById('shipState').value,
    pincode: document.getElementById('shipPin').value,
    country: 'India'
  };

  if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-lock"></i> Place Order Securely';
    }
    return showToast('Please fill all required address fields', 'error');
  }

  const items = state.cart.map(item => ({
    productId: item.product?._id || item.product,
    quantity: item.quantity,
    size: item.size,
    color: item.color
  }));

  try {
    
    const body = { items, shippingAddress: address, paymentMethod, notes: document.getElementById('orderNotes').value };
    if (window.checkoutCoupon) body.couponCode = window.checkoutCoupon;

    const data = await api('/orders', { method: 'POST', body: JSON.stringify(body) });
    
    
    showToast('Order placed successfully!');
    state.cart = [];
    updateCartUI();
    window.checkoutDiscount = 0;
    window.checkoutCoupon = null;
    showOrderConfirmation(data.data);
    if (paymentMethod === 'razorpay' && data.data?._id) {
      
      await initRazorpay(data.data);
    } else {
      
      navigateTo('orders');
    }
  } catch (err) {
    
    showToast('Order failed: ' + (err.message || 'Unknown error'), 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-lock"></i> Place Order Securely';
    }
  }
}
async function initRazorpay(order) {
  console.log('🔥 INIT RAZORPAY STARTED', order);

  try {
    // 1. Config check
    console.log('📡 Fetching /payment/config...');
    const config = await api('/payment/config');
    console.log('📡 Config response:', config);

    if (!config.enabled || !config.key) {
      console.error('❌ Razorpay not enabled in backend');
      showToast('Razorpay not configured. Pay via COD.', 'error');
      navigateTo('orders');
      return;
    }
    console.log('✅ Config OK, key:', config.key);

    // 2. Load script
    if (!window.Razorpay) {
      console.log('📥 Loading Razorpay script...');
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          console.log('✅ Script loaded');
          resolve();
        };
        script.onerror = () => {
          console.error('❌ Script failed to load');
          reject(new Error('Failed to load Razorpay'));
        };
        document.head.appendChild(script);
      });
    } else {
      console.log('✅ Razorpay already loaded');
    }

    // 3. Create Razorpay order
    console.log('📡 Creating Razorpay order...');
    const { data: razorpayOrder } = await api('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount: order.totalAmount, orderId: order._id })
    });
    console.log('✅ Razorpay order created:', razorpayOrder);

    // 4. Options
    const options = {
      key: config.key,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Velric London',
      description: 'Order ' + order.orderNumber,
      order_id: razorpayOrder.id,
      handler: async function(response) {
        console.log('💰 Payment success:', response);
        try {
          await api('/payment/verify', {
            method: 'POST',
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id
            })
          });
          showToast('Payment successful!');
          navigateTo('orders');
        } catch (e) {
          console.error('❌ Verification failed:', e);
          showToast('Payment verification failed', 'error');
          navigateTo('orders');
        }
      },
      modal: {
        ondismiss: function() {
          console.log('❌ Modal dismissed by user');
          showToast('Payment cancelled. Retry from My Orders.', 'warning');
          navigateTo('orders');
        }
      },
      prefill: { 
        name: state.user?.name || '', 
        email: state.user?.email || '', 
        contact: state.user?.phone || '' 
      },
      theme: { color: '#6B3A1F' }
    };

    // 5. OPEN MODAL
    console.log('🚪 Opening Razorpay modal...');
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function(response) {
      console.error('❌ Payment failed:', response.error);
      showToast('Payment failed: ' + response.error.description, 'error');
    });
    
    rzp.open();
    console.log('🚪 rzp.open() called');

  } catch (err) {
    console.error('❌ initRazorpay crashed:', err);
    showToast('Payment gateway error: ' + err.message, 'error');
    navigateTo('orders');
  }
}
function showOrderConfirmation(order) {
  const modal = document.getElementById('orderConfirmModal');
  document.getElementById('confirmOrderDetails').innerHTML = `
    <p style="margin-bottom:8px;"><strong>Order Number:</strong> <span style="color:var(--primary);">${order.orderNumber}</span></p>
    <p style="margin-bottom:8px;"><strong>Amount:</strong> ₹${order.totalAmount?.toLocaleString('en-IN')}</p>
    <p style="margin-bottom:8px;"><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
    <p style="margin-bottom:0;"><strong>Estimated Delivery:</strong> 5-7 Business Days</p>
  `;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeOrderConfirm() {
  document.getElementById('orderConfirmModal').classList.remove('active');
  document.body.style.overflow = '';
  navigateTo('orders');
}
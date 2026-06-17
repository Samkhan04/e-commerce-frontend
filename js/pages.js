// ============================
// STATIC PAGES: About, Contact, Returns, Shipping, FAQ
// ============================

function renderAbout(container) {
  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'About Us' }]);
  
  container.innerHTML = `
    <div class="hero" style="padding:80px 5%;">
      <div class="hero-content">
        <h1>Our Story</h1>
        <p>Crafting premium leather goods since 2026. Every piece tells a story of heritage, craftsmanship, and timeless style.</p>
      </div>
    </div>
    <div class="section" style="max-width:800px;">
      <p style="font-size:16px; line-height:1.8; color:var(--text-secondary); margin-bottom:24px;">
        Velric London was born from a passion for authentic leather craftsmanship. Founded in India in 2026, we have grown from a small workshop to a trusted name in premium leather goods across India.
      </p>
      <p style="font-size:16px; line-height:1.8; color:var(--text-secondary); margin-bottom:24px;">
        Each product is handcrafted by skilled artisans using full-grain and top-grain leather sourced from the finest tanneries. We believe in sustainability, durability, and designs that age beautifully with time.
      </p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:24px; margin-top:40px;">
        <div style="text-align:center; padding:24px; background:var(--surface); border-radius:var(--radius);"><div style="font-size:36px; font-weight:700; color:var(--primary); font-family:'Playfair Display';">25+</div><div style="color:var(--text-secondary); font-size:14px;">Artisan Partners</div></div>
        <div style="text-align:center; padding:24px; background:var(--surface); border-radius:var(--radius);"><div style="font-size:36px; font-weight:700; color:var(--primary); font-family:'Playfair Display';">15K+</div><div style="color:var(--text-secondary); font-size:14px;">Happy Customers</div></div>
        <div style="text-align:center; padding:24px; background:var(--surface); border-radius:var(--radius);"><div style="font-size:36px; font-weight:700; color:var(--primary); font-family:'Playfair Display';">8</div><div style="color:var(--text-secondary); font-size:14px;">Product Categories</div></div>
      </div>
    </div>
  `;
}

function renderContact(container) {
  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'Contact Us' }]);
  
  container.innerHTML = `
    <div class="section" style="max-width:800px;">
      <h2 class="section-title">Contact Us</h2>
      <p class="section-subtitle">We'd love to hear from you</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:24px; margin-bottom:40px;">
        <div style="padding:24px; background:var(--surface); border-radius:var(--radius); border:1px solid var(--border); text-align:center;">
          <i class="fas fa-envelope" style="font-size:32px; color:var(--gold); margin-bottom:12px;"></i>
          <h4>Email</h4>
          <p style="color:var(--text-secondary); font-size:14px;"><a href="mailto:velriclondon2004@gmail.com" style="color:var(--primary);">velriclondon2004@gmail.com</a></p>
        </div>
        <div style="padding:24px; background:var(--surface); border-radius:var(--radius); border:1px solid var(--border); text-align:center;">
          <i class="fas fa-phone" style="font-size:32px; color:var(--gold); margin-bottom:12px;"></i>
          <h4>Phone</h4>
          <p style="color:var(--text-secondary); font-size:14px;"><a href="tel:+919653078168" style="color:var(--primary);">+91 96530 78168</a></p>
        </div>
        <div style="padding:24px; background:var(--surface); border-radius:var(--radius); border:1px solid var(--border); text-align:center;">
          <i class="fas fa-map-marker-alt" style="font-size:32px; color:var(--gold); margin-bottom:12px;"></i>
          <h4>Address</h4>
          <p style="color:var(--text-secondary); font-size:14px;">Kanpur Nagar, Uttar Pradesh, 208010, India</p>
        </div>
      </div>
      <form onsubmit="submitContactForm(event)">
        <div class="form-row">
          <div class="form-group"><label>Name</label><input type="text" id="contactName" required></div>
          <div class="form-group"><label>Email</label><input type="email" id="contactEmail" required></div>
        </div>
        <div class="form-group"><label>Subject</label><input type="text" id="contactSubject" required></div>
        <div class="form-group"><label>Message</label><textarea id="contactMessage" rows="5" required></textarea></div>
        <button type="submit" class="btn btn-dark"><i class="fas fa-paper-plane"></i> Send Message</button>
      </form>
    </div>
  `;
}

function renderReturns(container) {
  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'Returns Policy' }]);
  
  container.innerHTML = `
    <div class="section" style="max-width:800px;">
      <h2 class="section-title">Returns & Refunds</h2>
      <div style="background:var(--surface); padding:32px; border-radius:var(--radius); border:1px solid var(--border); line-height:1.8; color:var(--text-secondary);">
        <h3 style="color:var(--primary); margin-bottom:16px;">7-Day Return Policy</h3>
        <p>We accept returns within 7 days of delivery. Items must be unused, in original packaging, and with all tags attached.</p>
        <ul style="margin:16px 0; padding-left:20px;">
          <li>Initiate return from your order history</li>
          <li>Pickup will be arranged from your address</li>
          <li>Refund processed within 5-7 business days</li>
          <li>Customized items are non-returnable</li>
        </ul>
        <p>For any issues, contact us at <a href="mailto:velriclondon2004@gmail.com" style="color:var(--primary);">velriclondon2004@gmail.com</a> or <a href="tel:+919653078168" style="color:var(--primary);">+91 96530 78168</a>.</p>
      </div>
    </div>
  `;
}

function renderShipping(container) {
  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'Shipping Info' }]);
  
  container.innerHTML = `
    <div class="section" style="max-width:800px;">
      <h2 class="section-title">Shipping Information</h2>
      <div style="background:var(--surface); padding:32px; border-radius:var(--radius); border:1px solid var(--border); line-height:1.8; color:var(--text-secondary);">
        <h3 style="color:var(--primary); margin-bottom:16px;">Delivery Details</h3>
        <p><strong>Free Shipping:</strong> On all orders above Rs.999</p>
        <p><strong>Standard Delivery:</strong> 5-7 business days across India</p>
        <p><strong>Express Delivery:</strong> 2-3 business days (available at checkout)</p>
        <p><strong>Order Tracking:</strong> You will receive tracking details via email and SMS once your order is shipped.</p>
        <div style="margin-top:24px; padding:20px; background:var(--bg); border-radius:8px;">
          <p><i class="fas fa-info-circle" style="color:var(--gold);"></i> For shipping-related queries, call <a href="tel:+919653078168" style="color:var(--primary);">+91 96530 78168</a></p>
        </div>
      </div>
    </div>
  `;
}

function renderFaq(container) {
  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'FAQ' }]);
  
  const faqs = [
    { q: 'Is the leather genuine?', a: 'Yes, all our products use 100% genuine full-grain or top-grain leather sourced from premium tanneries.' },
    { q: 'How do I care for my leather product?', a: 'Clean with a soft, dry cloth. Avoid water exposure. Use leather conditioner every 3-6 months for longevity.' },
    { q: 'What is your return policy?', a: 'We offer a 7-day return policy. Items must be unused and in original packaging.' },
    { q: 'How long does delivery take?', a: 'Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available at checkout.' },
    { q: 'Do you offer Cash on Delivery?', a: 'Yes, COD is available for all orders. Online payment via Razorpay is also accepted.' },
    { q: 'Can I change my order after placing it?', a: 'Orders can be modified within 2 hours of placement. Contact us immediately at +91 96530 78168.' }
  ];
  
  container.innerHTML = `
    <div class="section" style="max-width:800px;">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div style="display:flex; flex-direction:column; gap:16px; margin-top:24px;">
        ${faqs.map((f, i) => `
          <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden;">
            <button onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'" style="width:100%; padding:20px; text-align:left; font-weight:600; font-size:15px; display:flex; justify-content:space-between; align-items:center; background:none; border:none; color:var(--text);">
              ${f.q}
              <i class="fas fa-chevron-down" style="color:var(--gold);"></i>
            </button>
            <div style="display:none; padding:0 20px 20px; color:var(--text-secondary); line-height:1.7; border-top:1px solid var(--border); padding-top:16px; margin:0 20px 20px;">
              ${f.a}
            </div>
          </div>
        `).join('')}
      </div>
      <div style="text-align:center; margin-top:40px; padding:32px; background:var(--surface); border-radius:var(--radius); border:1px solid var(--border);">
        <h3 style="margin-bottom:8px;">Still have questions?</h3>
        <p style="color:var(--text-secondary); margin-bottom:16px;">We're here to help.</p>
        <a href="#contact" class="btn btn-dark">Contact Support</a>
      </div>
    </div>
  `;
}
async function submitContactForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value;
  
  try {
    const data = await api('/contact', {
      method: 'POST',
      body: JSON.stringify({ name, email, subject, message })
    });
    showToast(data.message || 'Message sent! We will get back to you soon.');
    e.target.reset();
  } catch (err) {
    showToast('Failed to send message. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}
function renderPrivacy(container) {
  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'Privacy Policy' }]);
  container.innerHTML = `
    <div class="section" style="max-width:800px;">
      <h2 class="section-title">Privacy Policy</h2>
      <div style="background:var(--surface); padding:32px; border-radius:var(--radius); border:1px solid var(--border); line-height:1.8; color:var(--text-secondary);">
        <p><strong>Last Updated:</strong> June 2026</p>
        <h3 style="color:var(--primary); margin:20px 0 12px;">1. Information We Collect</h3>
        <p>We collect your name, email, phone, shipping address, and payment details to process orders and improve your shopping experience.</p>
        <h3 style="color:var(--primary); margin:20px 0 12px;">2. How We Use Your Data</h3>
        <p>Your data is used solely for order fulfillment, shipping, customer support, and marketing communications (if opted in). We never sell your data.</p>
        <h3 style="color:var(--primary); margin:20px 0 12px;">3. Payment Security</h3>
        <p>All online payments are processed securely via Razorpay. We do not store your card details on our servers.</p>
        <h3 style="color:var(--primary); margin:20px 0 12px;">4. Cookies</h3>
        <p>We use essential cookies to maintain your cart and session. By using our site, you consent to this.</p>
        <h3 style="color:var(--primary); margin:20px 0 12px;">5. Contact</h3>
        <p>For privacy concerns, email <a href="mailto:velriclondon2004@gmail.com" style="color:var(--primary);">velriclondon2004@gmail.com</a>.</p>
      </div>
    </div>
  `;
}

function renderTerms(container) {
  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'Terms & Conditions' }]);
  container.innerHTML = `
    <div class="section" style="max-width:800px;">
      <h2 class="section-title">Terms & Conditions</h2>
      <div style="background:var(--surface); padding:32px; border-radius:var(--radius); border:1px solid var(--border); line-height:1.8; color:var(--text-secondary);">
        <h3 style="color:var(--primary); margin:20px 0 12px;">1. General</h3>
        <p>By accessing Velric London, you agree to these terms. All products are subject to availability.</p>
        <h3 style="color:var(--primary); margin:20px 0 12px;">2. Pricing & Payment</h3>
        <p>Prices are in INR. We accept COD and online payments via Razorpay. Orders are confirmed only after payment verification.</p>
        <h3 style="color:var(--primary); margin:20px 0 12px;">3. Shipping</h3>
        <p>Free shipping on orders above ₹999. Standard delivery: 5-7 business days. Delays due to logistics are not our liability.</p>
        <h3 style="color:var(--primary); margin:20px 0 12px;">4. Returns</h3>
        <p>7-day return window. Items must be unused with original packaging. Refunds processed within 5-7 business days.</p>
        <h3 style="color:var(--primary); margin:20px 0 12px;">5. Intellectual Property</h3>
        <p>All designs, logos, and content are property of Velric London. Unauthorized use is prohibited.</p>
      </div>
    </div>
  `;
}
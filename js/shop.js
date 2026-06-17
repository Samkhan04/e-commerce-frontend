// ============================
// SHOP, PRODUCTS, HOME, WISHLIST
// ============================

async function renderHome(container) {
  // 🔥 CRITICAL: Always hide preloader after max 8 seconds
  const preloaderTimeout = setTimeout(() => {
    document.getElementById('preloader')?.classList.add('hidden');
    console.log('⏱️ Preloader force-hidden by timeout');
  }, 8000);

  container.innerHTML = `
    <!-- HERO -->
    <div class="hero">
      <div class="hero-content">
        <div style="font-size:14px; letter-spacing:3px; text-transform:uppercase; margin-bottom:16px; color:var(--gold);">Est. 2026 India</div>
        <h1>Craftsmanship That Speaks</h1>
        <p>Premium handcrafted leather goods designed for those who appreciate timeless elegance and enduring quality.</p>
        <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
          <a href="#shop" class="btn btn-primary">Shop Collection</a>
          <a href="#about" class="btn btn-outline">Our Story</a>
        </div>
      </div>
    </div>

    <!-- CATEGORY STORYTELLING -->
    <div class="category-story-container">
      ${[
        { name: 'Leather Belts', img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=1200&q=80' },
        { name: 'Wallets', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=1200&q=80' },
        { name: 'Handbags', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80' },
        { name: 'Jackets', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80' },
        { name: 'Accessories', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80' }
      ].map(cat => `
        <div class="category-story-panel">
          <div class="cat-story-visual">
            <img src="${cat.img}" alt="${cat.name}" loading="lazy">
          </div>
          <div class="cat-story-text">
            <span class="cat-label">The Collection</span>
            <h2>${cat.name}</h2>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- CRAFTSMANSHIP -->
    <div class="craftsmanship-section">
      <div class="craft-pinned">
        ${['Full Grain Leather','Handcrafted Excellence','Premium Materials','Timeless Design','Built To Last','Attention To Every Detail','Luxury Without Compromise'].map(text => `
          <div class="craft-value"><span>${text}</span></div>
        `).join('')}
      </div>
    </div>

    <!-- SHOP BY CATEGORY -->
    <div class="section" style="padding-bottom:10px;">
      <h2 class="section-title" style="font-size:22px;">Shop by Category</h2>
      <div class="category-scroll">
        ${[
          { name: 'Belts', img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=300&h=300&fit=crop', cat: 'belts' },
          { name: 'Jackets', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop', cat: 'jackets' },
          { name: 'Shoes', img: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=300&h=300&fit=crop', cat: 'shoes' },
          { name: 'Purses', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop', cat: 'purses' },
          { name: 'Sandals', img: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&h=300&fit=crop', cat: 'sandals' },
          { name: 'Slippers', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop', cat: 'slippers' },
          { name: 'Wallets', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop', cat: 'wallets' },
          { name: 'Accessories', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop', cat: 'accessories' }
        ].map(c => `
          <div class="category-circle" onclick="navigateTo('shop', {category: '${c.cat}'})">
            <div class="category-img-wrap">
              <img src="${c.img}" alt="${c.name}" loading="lazy">
            </div>
            <span class="category-label">${c.name}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- NEW COLLECTIONS -->
    <div class="section" style="padding-top:10px;">
      <h2 class="section-title" style="font-size:22px;">New Collections</h2>
      <div class="model-scroll">
        ${[
          { title: 'Women Purses', sub: 'Elegant & Premium', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop', cat: 'purses' },
          { title: 'Men Shoes', sub: 'Formal Leather', img: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=800&fit=crop', cat: 'shoes' },
          { title: 'Classic Belts', sub: 'Handcrafted', img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&h=800&fit=crop', cat: 'belts' },
          { title: 'Leather Jackets', sub: 'Winter Ready', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop', cat: 'jackets' },
          { title: 'Luxury Wallets', sub: 'Minimalist', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=800&fit=crop', cat: 'wallets' },
          { title: 'Summer Sandals', sub: 'Comfort First', img: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=800&fit=crop', cat: 'sandals' }
        ].map(m => `
          <div class="model-card" onclick="navigateTo('shop', {category: '${m.cat}'})">
            <img src="${m.img}" alt="${m.title}" loading="lazy">
            <div class="model-overlay">
              <h4>${m.title}</h4>
              <p>${m.sub}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- TRENDING PRODUCTS -->
    <div class="section">
      <h2 class="section-title">Trending Now</h2>
      <p class="section-subtitle">Our most loved pieces this season</p>
      <div class="products-grid" id="trendingProducts">
        <div class="empty-state" style="grid-column:1/-1; padding:40px;">
          <i class="fas fa-spinner fa-spin" style="font-size:32px; color:var(--gold); margin-bottom:16px;"></i>
          <p>Loading products...</p>
        </div>
      </div>
    </div>

    <!-- NEW ARRIVALS -->
    <div class="section">
      <h2 class="section-title">New Arrivals</h2>
      <p class="section-subtitle">Fresh from our India workshop</p>
      <div class="products-grid" id="newArrivals">
        <div class="empty-state" style="grid-column:1/-1; padding:40px;">
          <i class="fas fa-spinner fa-spin" style="font-size:32px; color:var(--gold); margin-bottom:16px;"></i>
          <p>Loading products...</p>
        </div>
      </div>
    </div>

    <!-- TRUST BADGES -->
    <div class="section" style="background:var(--surface); border-radius:var(--radius); margin:0 5% 40px;">
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:40px; text-align:center; padding:40px;">
        <div class="trust-badge-item"><i class="fas fa-shipping-fast" style="font-size:40px; color:var(--gold); margin-bottom:16px;"></i><h3>Free Shipping</h3><p style="color:var(--text-secondary); font-size:14px;">On all orders above Rs.999</p></div>
        <div class="trust-badge-item"><i class="fas fa-shield-alt" style="font-size:40px; color:var(--gold); margin-bottom:16px;"></i><h3>Secure Payment</h3><p style="color:var(--text-secondary); font-size:14px;">100% secure checkout</p></div>
        <div class="trust-badge-item"><i class="fas fa-undo" style="font-size:40px; color:var(--gold); margin-bottom:16px;"></i><h3>Easy Returns</h3><p style="color:var(--text-secondary); font-size:14px;">7-day return policy</p></div>
        <div class="trust-badge-item"><i class="fas fa-medal" style="font-size:40px; color:var(--gold); margin-bottom:16px;"></i><h3>Premium Quality</h3><p style="color:var(--text-secondary); font-size:14px;">Genuine leather guaranteed</p></div>
      </div>
    </div>

    ${state.recentlyViewed.length > 0 ? `
    <div class="section recently-viewed">
      <h3><i class="fas fa-history" style="color:var(--gold);margin-right:10px"></i>Recently Viewed</h3>
      <div class="products-grid" id="recentlyViewedGrid"></div>
    </div>` : ''}
  `;

  // 🔥 BULLETPROOF PRODUCT LOADING
  try {
    console.log('📡 [1] Fetching trending products...');

    // Force no-cache to prevent stale 304 responses
    const trending = await api('/products?trending=true&limit=4');
    console.log('✅ [2] Trending response:', trending);
    console.log('📦 [3] Trending data count:', trending?.data?.length || 0);

    const newArrivals = await api('/products?newArrival=true&limit=4');
    console.log('✅ [4] NewArrivals response:', newArrivals);
    console.log('📦 [5] NewArrivals data count:', newArrivals?.data?.length || 0);

    // Get DOM elements
    const trendingEl = document.getElementById('trendingProducts');
    const newArrivalsEl = document.getElementById('newArrivals');

    console.log('🔍 [6] DOM elements found:', { trendingEl: !!trendingEl, newArrivalsEl: !!newArrivalsEl });

    if (!trendingEl || !newArrivalsEl) {
      console.error('❌ CRITICAL: DOM elements not found!');
      return;
    }

    // Use data or fallback to empty array
    const trendingData = Array.isArray(trending?.data) ? trending.data : [];
    const newArrivalData = Array.isArray(newArrivals?.data) ? newArrivals.data : [];

    console.log('🎨 [7] Rendering products...');

    // Render products
    trendingEl.innerHTML = renderProductCards(trendingData);
    newArrivalsEl.innerHTML = renderProductCards(newArrivalData);

    console.log('✅ [8] Products rendered successfully');

    // Recently viewed
    const recentGrid = document.getElementById('recentlyViewedGrid');
    if (recentGrid && state.recentlyViewed.length > 0) {
      recentGrid.innerHTML = renderProductCards(state.recentlyViewed);
    }

  } catch (err) {
    console.error('❌ [ERROR] Home load failed:', err);
    console.error('Stack:', err.stack);

    const trendingEl = document.getElementById('trendingProducts');
    const newArrivalsEl = document.getElementById('newArrivals');
    const errorHtml = `
      <div class="empty-state" style="grid-column:1/-1; padding:40px;">
        <i class="fas fa-exclamation-triangle" style="font-size:32px; color:#e74c3c; margin-bottom:16px;"></i>
        <h3>Failed to load products</h3>
        <p style="color:var(--text-secondary); margin-bottom:16px;">${err.message || 'Network error'}</p>
        <button onclick="renderHome(document.getElementById('mainContent'))" class="btn btn-dark btn-sm">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>
    `;
    if (trendingEl) trendingEl.innerHTML = errorHtml;
    if (newArrivalsEl) newArrivalsEl.innerHTML = errorHtml;
  } finally {
    clearTimeout(preloaderTimeout);
    document.getElementById('preloader')?.classList.add('hidden');
    console.log('✅ [9] Preloader hidden');
  }

  // Initialize all scroll animations (preserved exactly)
  console.log('🎬 [10] Starting scroll animations...');
  initHomeScrollAnimations();
  console.log('✅ [11] Home render complete');
}
function renderProductCards(products) {
  if (!products.length) return '<div class="empty-state" style="grid-column:1/-1;"><p>No products found</p></div>';
  return products.map(p => `
    <div class="product-card" onclick="navigateTo('product', {id: '${p._id}'})">
      <div class="product-image">
        <img src="${p.mainImage || (p.images && p.images[0]) || 'https://placehold.co/400x400?text=Velric+London'}" alt="${p.name}" loading="lazy">
        ${p.isBestseller ? '<span class="product-badge">Bestseller</span>' : ''}
        ${p.isNewArrival ? '<span class="product-badge" style="background:var(--gold); color:var(--primary);">New</span>' : ''}
        ${p.stockStatus === 'low_stock' ? '<span class="product-badge" style="background:#e74c3c;">Low Stock</span>' : ''}
        <button class="product-wishlist ${state.wishlist.some(w => w._id === p._id) ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist('${p._id}')"><i class="fas fa-heart"></i></button>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-meta">
          <span class="product-price">Rs.${p.price}</span>
          ${p.comparePrice ? `<span class="product-compare">Rs.${p.comparePrice}</span>` : ''}
        </div>
        <div class="product-rating">
          ${Array(5).fill(0).map((_, i) => `<i class="fas fa-star${i < Math.round(p.rating || 0) ? '' : '-empty'}"></i>`).join('')}
          <span style="color:var(--text-secondary); margin-left:4px;">(${p.ratingCount || 0})</span>
        </div>
        <div class="product-actions" onclick="event.stopPropagation()">
          <button class="btn btn-dark btn-sm" onclick="addToCart('${p._id}', 1)"><i class="fas fa-shopping-bag"></i> Add</button>
          <button class="btn btn-outline btn-sm" style="color:var(--text); border-color:var(--border);" onclick="navigateTo('product', {id: '${p._id}'})">View</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function renderShop(container) {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const category = params.get('category') || state.filters.category || '';
  const search = params.get('search') || state.filters.search || '';
  const sortBy = params.get('sortBy') || state.filters.sortBy || '';

  updateBreadcrumb([
    { label: 'Home', href: '#home' },
    { label: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Shop' }
  ]);

  container.innerHTML = `
    <div class="section">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px; margin-bottom:24px;">
  <div>
    <h2 class="section-title" style="margin-bottom:4px;">Shop</h2>
    <p class="section-subtitle" style="margin-bottom:0;">Discover our premium collection</p>
  </div>
</div>

<div class="shop-controls">
  <div class="search-box">
    <input type="text" id="shopSearch" placeholder="Search products..." value="${search}" 
      onkeydown="if(event.key==='Enter') filterShop()">
    <button class="search-btn" onclick="filterShop()" aria-label="Search">
      <i class="fas fa-search"></i>
    </button>
  </div>
  
  <div class="custom-select">
    <select id="categoryFilter" onchange="filterShop()">
      <option value="">All Categories</option>
      <option value="belts" ${category === 'belts' ? 'selected' : ''}>Belts</option>
      <option value="jackets" ${category === 'jackets' ? 'selected' : ''}>Jackets</option>
      <option value="shoes" ${category === 'shoes' ? 'selected' : ''}>Shoes</option>
      <option value="purses" ${category === 'purses' ? 'selected' : ''}>Purses</option>
      <option value="sandals" ${category === 'sandals' ? 'selected' : ''}>Sandals</option>
      <option value="slippers" ${category === 'slippers' ? 'selected' : ''}>Slippers</option>
      <option value="wallets" ${category === 'wallets' ? 'selected' : ''}>Wallets</option>
      <option value="accessories" ${category === 'accessories' ? 'selected' : ''}>Accessories</option>
    </select>
  </div>
  
  <div class="custom-select">
    <select id="sortFilter" onchange="filterShop()">
      <option value="">Sort By</option>
      <option value="price_low" ${sortBy === 'price_low' ? 'selected' : ''}>Price: Low to High</option>
      <option value="price_high" ${sortBy === 'price_high' ? 'selected' : ''}>Price: High to Low</option>
      <option value="newest" ${sortBy === 'newest' ? 'selected' : ''}>Newest First</option>
      <option value="rating" ${sortBy === 'rating' ? 'selected' : ''}>Top Rated</option>
    </select>
  </div>
</div>

      </div>
      <div class="products-grid" id="shopProducts">
        ${Array(8).fill(0).map(() => `<div class="product-card"><div class="product-image"><div class="skeleton" style="width:100%;height:260px;"></div></div><div class="product-info"><div class="skeleton" style="width:80%;height:20px;margin-bottom:12px;"></div><div class="skeleton" style="width:50%;height:16px;"></div></div></div>`).join('')}
      </div>
    </div>`;

  try {
    let url = '/products?limit=24';
    if (category) url += '&category=' + category;
    if (search) url += '&search=' + encodeURIComponent(search);
    if (sortBy) url += '&sortBy=' + sortBy;
    const data = await api(url);
    document.getElementById('shopProducts').innerHTML = renderProductCards(data.data || []);
  } catch (err) {}
}

function filterShop() {
  const category = document.getElementById('categoryFilter').value;
  const sortBy = document.getElementById('sortFilter').value;
  const search = document.getElementById('shopSearch')?.value || '';
  state.filters = { ...state.filters, category, sortBy, search };
  navigateTo('shop', { category, sortBy, search });
}
let selectedSize = '', selectedColor = '', productQty = 1;

async function renderProductDetail(container) {
  selectedSize = '';
  selectedColor = '';
  productQty = 1;
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const id = params.get('id');
  if (!id) { navigateTo('shop'); return; }

  updateBreadcrumb([
    { label: 'Home', href: '#home' },
    { label: 'Shop', href: '#shop' },
    { label: 'Product' }
  ]);

  container.innerHTML = `
    <div class="product-detail">
      <div class="product-gallery">
        <div class="main-image zoom-container" id="mainImage" onmousemove="zoomImage(event)" onmouseleave="resetZoom()"><div class="skeleton" style="width:100%;height:100%;"></div></div>
        <div class="thumbnail-list" id="thumbnails"></div>
      </div>
      <div class="product-details" id="productDetails">
        <div class="skeleton" style="width:60%;height:36px;margin-bottom:16px;"></div>
        <div class="skeleton" style="width:40%;height:28px;margin-bottom:24px;"></div>
        <div class="skeleton" style="width:100%;height:80px;margin-bottom:24px;"></div>
      </div>
    </div>
    <div class="sticky-atc" id="stickyAtc">
      <div style="display:flex; align-items:center; gap:12px; flex:1;">
        <span id="stickyPrice" style="font-weight:700; color:var(--primary); font-size:18px;"></span>
      </div>
      <button class="btn btn-dark" onclick="addProductToCart('${id}')"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
    </div>
  `;

  try {
    const { data: p } = await api(`/products/${id}`);
    addToRecentlyViewed(p);
    
    const images = p.images?.length ? p.images : [p.mainImage || 'https://placehold.co/600x600?text=Velric+London'];
    document.querySelector('.product-detail .main-image').innerHTML = `<img src="${images[0]}" alt="${p.name}" id="mainProductImg" style="transition:transform 0.3s ease-in-out;">`;
    
    document.getElementById('thumbnails').innerHTML = images.map((img, i) => 
      `<img src="${img}" class="${i===0?'active':''}" onclick="swapMainImage('${img}', this)" loading="lazy">`
    ).join('');

    const sizesHtml = (p.sizes || []).map(s => `<button class="size-btn" onclick="selectSize(this, '${s}')">${s}</button>`).join('');
    const colorsHtml = (p.colors || []).map(c => `<button class="color-btn ${c.hex === '#FFFFFF' ? 'white-btn' : ''}" style="background:${c.hex}" title="${c.name}" onclick="selectColor(this, '${c.name}')"></button>`).join('');

    document.getElementById('productDetails').innerHTML = `
      <h1>${p.name}</h1>
      <div class="detail-price">Rs.${p.price} ${p.comparePrice ? `<span style="font-size:18px; color:var(--text-secondary); text-decoration:line-through; font-weight:400;">Rs.${p.comparePrice}</span>` : ''}</div>
      <div class="product-rating" style="font-size:16px;">
        ${Array(5).fill(0).map((_, i) => `<i class="fas fa-star${i < Math.round(p.rating || 0) ? '' : '-empty'}"></i>`).join('')}
        <span style="color:var(--text-secondary); margin-left:8px;">${p.rating || 0} (${p.ratingCount || 0} reviews)</span>
      </div>
      <p style="color:var(--text-secondary); line-height:1.7;">${p.description || ''}</p>
      <div class="detail-section">
        <h4>Material</h4>
        <p style="font-size:15px;">${p.material || 'Genuine Leather'}</p>
      </div>
      ${sizesHtml ? `<div class="detail-section"><h4>Select Size <button class="btn btn-sm btn-outline" style="margin-left:10px;font-size:11px;padding:4px 10px;" onclick="openSizeGuide()">Size Guide</button></h4><div class="size-options" id="sizeOptions">${sizesHtml}</div></div>` : ''}
      ${colorsHtml ? `<div class="detail-section"><h4>Select Color</h4><div class="color-options" id="colorOptions">${colorsHtml}</div></div>` : ''}
      <div class="detail-section">
        <h4>Quantity</h4>
        <div class="qty-selector">
          <button onclick="changeQty(-1)">-</button>
          <span id="productQty">1</span>
          <button onclick="changeQty(1)">+</button>
        </div>
      </div>
      <div style="display:flex; gap:12px; margin-top:24px;">
        <button class="btn btn-dark" style="flex:1; justify-content:center;" onclick="addProductToCart('${p._id}')"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
        <button class="btn btn-outline" style="color:var(--text); border-color:var(--border);" onclick="toggleWishlist('${p._id}')"><i class="fas fa-heart"></i></button>
      </div>
      <div class="detail-section">
        <h4>Care Instructions</h4>
        <p style="font-size:14px; color:var(--text-secondary);">${p.careInstructions || 'Clean with soft cloth. Avoid water exposure.'}</p>
      </div>
      ${p.stock <= 5 ? `<div style="color:#e74c3c; font-size:14px; font-weight:600;"><i class="fas fa-fire"></i> Only ${p.stock} left in stock - order soon</div>` : ''}
      
     <div class="detail-section" style="margin-top:24px;">
        <h4>Customer Reviews (${p.ratingCount || 0})</h4>
        ${p.reviews?.length ? p.reviews.map(r => `
          <div style="padding:12px 0; border-bottom:1px solid var(--border);">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${r.name?.charAt(0) || 'U'}</div>
              <div>
                <div style="font-weight:600;font-size:14px;">${r.name || 'User'}</div>
                <div style="color:#f39c12;font-size:12px;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
              </div>
            </div>
            <p style="color:var(--text-secondary);font-size:14px;margin:0;">${r.comment || ''}</p>
          </div>
        `).join('') : '<p style="color:var(--text-secondary);font-size:14px;">No reviews yet. Be the first to review!</p>'}
        
        ${state.token ? `
        <div style="margin-top:20px; padding:20px; background:var(--bg); border-radius:10px; border:1px solid var(--border);">
          <h5 style="margin-bottom:12px; font-size:14px; text-transform:uppercase; letter-spacing:0.5px;">Write a Review</h5>
          <div style="display:flex; gap:6px; margin-bottom:12px;" id="reviewStars">
            ${[1,2,3,4,5].map(i => `<button type="button" onclick="setReviewStar(${i})" style="background:none; border:none; font-size:20px; color:var(--border); cursor:pointer;" id="star${i}">★</button>`).join('')}
          </div>
          <input type="hidden" id="reviewRating" value="5">
          <textarea id="reviewComment" rows="3" placeholder="Share your experience..." style="width:100%; padding:12px; border:2px solid var(--border); border-radius:8px; margin-bottom:10px; font-family:inherit;"></textarea>
          <button class="btn btn-dark btn-sm" onclick="submitReview('${p._id}')">Submit Review</button>
        </div>
        ` : `<p style="font-size:13px; color:var(--text-secondary); margin-top:16px;"><a href="#" onclick="openAuthModal(); return false;" style="color:var(--primary);">Login</a> to write a review.</p>`}
      </div>
      `;
    
    document.getElementById('stickyPrice').textContent = 'Rs.' + p.price;
    // 🔥 Related Products load karo
    loadRelatedProducts(p.category, p._id);
  } catch (err) { showToast('Product not found', 'error'); navigateTo('shop'); }
}

function swapMainImage(src, thumb) {
  document.getElementById('mainProductImg').src = src;
  document.querySelectorAll('.thumbnail-list img').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function selectSize(btn, size) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = size;
}

function selectColor(btn, color) {
  document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedColor = color;
}

function changeQty(delta) {
  productQty = Math.max(1, productQty + delta);
  const el = document.getElementById('productQty');
  if (el) el.textContent = productQty;
}

function addProductToCart(productId) {
  addToCart(productId, productQty, selectedSize, selectedColor);
  productQty = 1; selectedSize = ''; selectedColor = '';
}

async function renderWishlist(container) {
  if (!state.token) { openAuthModal(); return; }
  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'Wishlist' }]);
  
  container.innerHTML = `
    <div class="section">
      <h2 class="section-title"><i class="fas fa-heart" style="color:#e74c3c; margin-right:12px;"></i>My Wishlist</h2>
      <div class="products-grid" id="wishlistGrid">
        <div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-heart"></i><h3>Your wishlist is empty</h3></div>
      </div>
    </div>
  `;
  try {
    const data = await api('/users/wishlist');
    const products = data.data || [];
    state.wishlist = products;
    document.getElementById('wishlistGrid').innerHTML = products.length ? renderProductCards(products) : '<div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-heart"></i><h3>Your wishlist is empty</h3><p>Save items you love for later</p></div>';
  } catch (err) {}
}

async function loadRelatedProducts(category, currentId) {
  try {
    const { data } = await api(`/products?category=${category}&limit=4`);
    const related = (data || []).filter(p => p._id !== currentId).slice(0, 4);
    if (!related.length) return;
    
    const container = document.getElementById('mainContent');
    const section = document.createElement('div');
    section.className = 'section';
    section.style.maxWidth = '1200px';
    section.innerHTML = `
      <h3 class="section-title" style="font-size:24px;"><i class="fas fa-thumbs-up" style="color:var(--gold);margin-right:10px;"></i>You May Also Like</h3>
      <div class="products-grid" style="margin-top:20px;">
        ${renderProductCards(related)}
      </div>
    `;
    container.appendChild(section);
  } catch (e) { console.log('Related products failed', e); }
}

function zoomImage(e) {
  const img = document.getElementById('mainProductImg');
  if (!img) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  img.style.transformOrigin = `${x}% ${y}%`;
  img.style.transform = 'scale(2)';
}

function resetZoom() {
  const img = document.getElementById('mainProductImg');
  if (!img) return;
  img.style.transform = 'scale(1)';
  setTimeout(() => { img.style.transformOrigin = 'center center'; }, 200);
}

let selectedReviewStar = 5;

function setReviewStar(n) {
  selectedReviewStar = n;
  document.getElementById('reviewRating').value = n;
  for (let i = 1; i <= 5; i++) {
    document.getElementById('star' + i).style.color = i <= n ? '#f39c12' : 'var(--border)';
  }
}

async function submitReview(productId) {
  const rating = selectedReviewStar;
  const comment = document.getElementById('reviewComment').value;
  try {
    await api(`/products/${productId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    });
    showToast('Review submitted! Thank you.');
    renderProductDetail(document.getElementById('mainContent'));
  } catch (err) {
    showToast('Failed to submit review', 'error');
  }
}

// ============================
// WALLET CRAFTSMANSHIP STORY
// ============================

async function renderCraftsmanship(container) {
  updateBreadcrumb([{ label: 'Home', href: '#home' }, { label: 'The Craft' }]);
  
  container.innerHTML = `
    <div class="wallet-story-container">
      <!-- HERO: 3D Rotating -->
      <div class="wallet-hero-section">
        <div class="wallet-scene">
          <div class="wallet-3d-wrapper">
            <div class="wallet-3d">
              <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80" alt="Velric Leather Wallet">
            </div>
          </div>
        </div>
        <div class="wallet-hero-text">
          <h1>Craftsmanship in Every Fold</h1>
          <p>Scroll to explore the journey</p>
        </div>
      </div>
      
      <!-- ZOOM + CALLOUTS (Pinned on Scroll) -->
      <div class="wallet-zoom-section">
        <div class="wallet-zoom-inner">
          <div class="wallet-zoom-img">
            <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=1200&q=80" alt="Velric Wallet Detail">
          </div>
          <div class="wallet-callout" id="wCallout1">
            <span class="callout-line"></span>
            <span>Full Grain Leather</span>
          </div>
          <div class="wallet-callout" id="wCallout2">
            <span class="callout-line"></span>
            <span>Handcrafted</span>
          </div>
          <div class="wallet-callout" id="wCallout3">
            <span class="callout-line"></span>
            <span>Lifetime Durability</span>
          </div>
        </div>
      </div>
      
      <!-- STITCHING CLOSE-UP -->
      <div class="wallet-stitch-section">
        <div class="stitch-image-wrapper">
          <img src="https://images.unsplash.com/photo-1559563458-527698bf5295?w=1600&q=80" alt="Leather Stitching Detail">
        </div>
        <div class="stitch-overlay">
          <h2>Precision<br>Stitching</h2>
          <p>Every thread placed with intention and expertise</p>
        </div>
      </div>
      
      <!-- AGING OVER TIME -->
      <div class="wallet-aging-section">
        <div class="aging-comparison">
          <div class="aging-img aging-new">
            <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80" alt="New Wallet">
            <span class="aging-label">Day One</span>
          </div>
          <div class="aging-img aging-old">
            <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80" alt="Aged Wallet">
            <span class="aging-label">Years Later</span>
          </div>
        </div>
        <div class="aging-text">
          <h2>Ages Beautifully</h2>
          <p>Developing a rich patina that tells your unique story over time</p>
        </div>
      </div>
      
      <!-- PRODUCT SHOWCASE + CTA -->
      <div class="wallet-final-section">
        <h2>The Classic Leather Wallet</h2>
        <p class="section-subtitle">Available in multiple artisan finishes</p>
        <div class="products-grid" id="craftProducts"></div>
        <a href="#shop?category=wallets" class="btn btn-primary btn-xl">Shop All Wallets</a>
      </div>
    </div>
  `;
  
  // Load wallet products
  try {
    const data = await api('/products?category=wallets&limit=4');
    const grid = document.getElementById('craftProducts');
    if (grid) grid.innerHTML = renderProductCards(data.data || []);
  } catch(e) {}
  
  // Init scroll animations
  initWalletAnimations();
}

function initWalletAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP not loaded');
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Purane triggers clean karo (duplicate na bane)
  ScrollTrigger.getAll().forEach(t => t.kill());
  
  // --- ZOOM SECTION PINNED ---
  const zoomTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wallet-zoom-section",
      start: "top top",
      end: "+=130%",
      pin: true,
      scrub: 1.2,
      anticipatePin: 1
    }
  });
  
  // Wallet zoom in
  zoomTl.fromTo(".wallet-zoom-img", 
    { scale: 0.5, opacity: 0.6, y: 50 },
    { scale: 1.6, opacity: 1, y: 0, duration: 1, ease: "power2.out" }
  );
  
  // Callouts appear sequentially
  zoomTl.fromTo("#wCallout1", 
    { opacity: 0, x: -80, scale: 0.9 }, 
    { opacity: 1, x: 0, scale: 1, duration: 0.25, ease: "back.out(1.7)" }, 0.25);
    
  zoomTl.fromTo("#wCallout2", 
    { opacity: 0, x: 80, scale: 0.9 }, 
    { opacity: 1, x: 0, scale: 1, duration: 0.25, ease: "back.out(1.7)" }, 0.45);
    
  zoomTl.fromTo("#wCallout3", 
    { opacity: 0, y: 60, scale: 0.9 }, 
    { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "back.out(1.7)" }, 0.65);
  
  // --- STITCHING REVEAL ---
  gsap.to(".stitch-image-wrapper", {
    scrollTrigger: {
      trigger: ".wallet-stitch-section",
      start: "top 85%",
      end: "top 15%",
      scrub: 1
    },
    clipPath: "inset(0% 0 0 0)",
    scale: 1,
    ease: "none"
  });
  
  gsap.from(".stitch-overlay", {
    scrollTrigger: {
      trigger: ".wallet-stitch-section",
      start: "top 55%",
      toggleActions: "play none none reverse"
    },
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });
  
  // --- AGING CROSSFADE ---
  gsap.to(".aging-old", {
    scrollTrigger: {
      trigger: ".wallet-aging-section",
      start: "top 70%",
      end: "bottom 40%",
      scrub: 1.5
    },
    opacity: 1,
    ease: "none"
  });
  
  gsap.from(".aging-text", {
    scrollTrigger: {
      trigger: ".wallet-aging-section",
      start: "top 50%",
      toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  });
  
  // Refresh layout after everything settles
  setTimeout(() => ScrollTrigger.refresh(), 200);
}

// ============================
// LUXURY SCROLL ANIMATIONS
// ============================

function initHomeScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.log('GSAP not loaded-animations skipped,but products should still show');
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Clean old triggers
  ScrollTrigger.getAll().forEach(t => t.kill());

  // --- LENIS SMOOTH SCROLL ---
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // --- SECTION 1: HERO ENTRANCE ---
  gsap.to('.hero-content > *', {
    y: 0,
    opacity: 1,
    duration: 1.2,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.4
  });

  // Hero parallax on scroll
  gsap.to('.hero-content', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5
    },
    y: -80,
    opacity: 0.3,
    ease: 'none'
  });

  // --- SECTION 2: CATEGORY STORYTELLING (Pinned Zoom) ---
  const panels = gsap.utils.toArray('.category-story-panel');
  panels.forEach((panel, i) => {
    const img = panel.querySelector('.cat-story-visual img');
    const text = panel.querySelector('.cat-story-text');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1
      }
    });
    
    // Zoom in + fade in
    tl.fromTo(img, 
      { scale: 0.5, opacity: 0, rotateY: -8 },
      { scale: 1, opacity: 1, rotateY: 0, duration: 0.35, ease: 'power2.out' }
    )
    .fromTo(text, 
      { y: 60, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }, 
      0.1
    )
    // Hold moment
    .to(img, { scale: 1.05, duration: 0.3 })
    // Zoom out + fade out
    .to(img, 
      { scale: 0.5, opacity: 0, rotateY: 8, duration: 0.35, ease: 'power2.in' }
    )
    .to(text, 
      { y: -40, opacity: 0, duration: 0.2 }, 
      '-=0.3'
    );
  });

  // --- SECTION 3: CRAFTSMANSHIP (Pinned Text Reveal) ---
  const craftValues = gsap.utils.toArray('.craft-value');
  const craftTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.craftsmanship-section',
      start: 'top top',
      end: `+=${craftValues.length * 100}%`,
      pin: true,
      scrub: 0.6,
    }
  });

  craftValues.forEach((val, i) => {
    // Fade in + slide up
    craftTl.fromTo(val, 
      { opacity: 0, y: 50, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.15, ease: 'power2.out' }
    );
    // Hold
    craftTl.to(val, { duration: 0.08 });
    // Fade out + slide up
    craftTl.to(val, 
      { opacity: 0, y: -50, scale: 1.05, duration: 0.1, ease: 'power2.in' }
    );
  });

  // --- SECTION 4: FEATURED PRODUCTS (Staggered Reveal) ---
  const productCards = gsap.utils.toArray('.product-card');
  productCards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none reverse'
      },
      y: 70,
      opacity: 0,
      duration: 0.9,
      delay: (i % 4) * 0.1,
      ease: 'power2.out'
    });
    
    // Subtle parallax on images
    const img = card.querySelector('.product-image img');
    if (img) {
      gsap.from(img, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        scale: 1.15,
        y: 20,
        ease: 'none'
      });
    }
  });

  // --- TRUST BADGES ---
  gsap.utils.toArray('.trust-badge-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.12,
      ease: 'power2.out'
    });
  });

  // --- CATEGORY CIRCLES ---
  gsap.utils.toArray('.category-circle').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      scale: 0.9,
      duration: 0.7,
      delay: i * 0.06,
      ease: 'back.out(1.4)'
    });
  });

  // --- MODEL CARDS ---
  gsap.utils.toArray('.model-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      x: 60,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power2.out'
    });
  });

  // --- RECENTLY VIEWED ---
  const recentCards = document.querySelectorAll('.recently-viewed .product-card');
  recentCards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.08,
      ease: 'power2.out'
    });
  });

  // Refresh after all setup
  setTimeout(() => ScrollTrigger.refresh(), 300);
}
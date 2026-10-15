(() => {
  const CART_KEY = 'agrismartCart';
  const products = [
    { id: 'shop_0', name: 'Fiddle Leaf Fig', category: 'Indoor', price: 28.99, oldPrice: 35.99, discount: '20%', rating: '4.9', reviews: '(155)', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_L4cTO3ar9Qc7G98PzFmzbuGdY6qTgulnq3k7CDjmFsmgD_DaJIe6dNINqe8vDZ-G0qfc0pJdxNny4bkz0E4HaF7lk5yIdZQs9NojIEQ9swpJF6dzpp5ctCQmpO6CkByYxiThWF_1BBnXFAtayAh4RS9y5v5QF3pJkrZ7uZSHmm_nBUUrGUT96GCSh58kqHau4NJZlxoiZrCkQHvh28Kas-_XPbfJLAiglezWvBU' },
    { id: 'shop_3', name: 'Snake Plant', category: 'Indoor', price: 22.50, oldPrice: null, discount: '', rating: '4.8', reviews: '(92)', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKXARjf0gVPNC3kU-dNNyitZsSwFE7cRhw9nNsf6oYq4zRl76DCai_5R86v_aQqsNBN3hrYMVt66QFzoAEBuaEWJP-QVXHPTAItuuk-GInXfIcVZL_UwbAi7djHZKLB4_MMmEgzCf-CTGzXrSDGbv8HUbzamORDbTueRoXuZZqOi8GYQcLJN_1vRRVh_d_go-ZBjP4lB0WzV6dLea0LPjqEFiCh5VK_qWiR1cKgkE' },
    { id: 'shop_7', name: 'Lavender', category: 'Outdoor', price: 15.00, oldPrice: 28.00, discount: '50%', rating: '4.8', reviews: '(105)', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ-ntAOudQrJAEeTVCsla1Z7ZvGZoeVZzrC2Kkm_phLJ1WPW5_OuFllEaV1vY0QjDQJrkUH50566jgsbkvwsV8zZEMpgL6BFxzfDU3M7Hh1TQyjveluReiBhAw1bW4WEcdejnbnDfPA5kleCodNWPTvNZPhJN6DJqoNCoxugSL5GATMdmiKs3ga5XzrBHlThWCg-uazVFGIxSglfGj29Ye3DG-mfmDzsChVI78TQs' },
    { id: 'shop_4', name: 'ZZ Plant', category: 'Indoor', price: 24.00, oldPrice: null, discount: '', rating: '4.7', reviews: '(95)', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQO_VZuU8JeP2Bt1xnA4bChtzC7yJFh8-g_cK0cVQDv3-H7QefXz9cCfwX2gvehi_4N1C5eYlYVvjq9IsQsBWJeV2UsM15Im_LZLtZ1ylYGRD1fUGjS5DWtWRpW8pCHveLVayVWgI5K8K8QlbgEuXGiTQtpEb8sLqfIajY_eaxccJd2bCUTwRUgwhV9zHGdVMmUij5axqj-sVbff2qS-W5PBb_U_nHTES_5wpWHVg' },
    { id: 'shop_2', name: 'Monstera Deliciosa', category: 'Indoor', price: 25.99, oldPrice: 36.99, discount: '30%', rating: '4.9', reviews: '(275)', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPrqRJnPE-vWiyezGmEus-FJNFeh_i3YPmHkJyLgFe_JdatXW4ZVJQqIoXblsfSxx6PlDpQGmVZqQkPtES8nAUHNaMCRaDfxPjucvWW5pvcp8WaMPneTFUH66M9LuaGdsRrInbMS3ZwPOK_weL2S57aiAEy7hhrBkK7d0UM512QQ2xoMSnqoj4H_gaAU0NWzXYv3EVqtw77x6mB4a0U3aCCbvpTwRFp9jaMP4bOwI' }
  ];

  let cart = readCart();
  let discountRate = window.AgrismartAuth
    ? Number(window.AgrismartAuth.readUserData('agrismartCouponDiscount', 0)) || 0
    : Number(localStorage.getItem('agrismartCouponDiscount')) || 0;
  let toastTimer;

  function readCart() {
    if (window.AgrismartAuth) return window.AgrismartAuth.readUserData(CART_KEY, {});
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch { return {}; }
  }

  function saveCart() {
    if (window.AgrismartAuth) window.AgrismartAuth.writeUserData(CART_KEY, cart);
    else localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function money(value) {
    return '$' + Number(value || 0).toFixed(2);
  }

  function safeText(value) {
    const node = document.createElement('span');
    node.textContent = value == null ? '' : String(value);
    return node.innerHTML;
  }

  function render() {
    const items = Object.entries(cart).filter(([, item]) => item && Number(item.qty) > 0);
    const count = items.reduce((sum, [, item]) => sum + Number(item.qty), 0);
    const subtotal = items.reduce((sum, [, item]) => sum + Number(item.price) * Number(item.qty), 0);
    const discount = subtotal * discountRate;
    const total = Math.max(0, subtotal - discount);
    const cartItems = document.getElementById('cartItems');
    const empty = document.getElementById('cartEmpty');

    cartItems.innerHTML = items.map(([id, item]) => {
      const isSeed = id.startsWith('seed-') || /\bseeds?\b/i.test(item.name || '');
      const category = item.category || (isSeed ? 'Seeds' : 'Plant');
      const image = isSeed && (!item.img || item.img === 'assets/logo.svg') && typeof window.createSeedThumbnail === 'function'
        ? window.createSeedThumbnail(item.name)
        : item.img;
      return `
      <article class="cart-row grid grid-cols-12 items-center gap-2 px-3 py-3 text-xs sm:px-6 sm:py-4" data-cart-id="${safeText(id)}">
        <div class="col-span-6 flex min-w-0 items-center gap-2 sm:col-span-5 sm:gap-3">
          <button class="cart-remove" type="button" data-action="remove" aria-label="Remove ${safeText(item.name)}">×</button>
          <img class="cart-product-image" src="${safeText(image)}" alt="${safeText(item.name)}" loading="lazy">
          <div class="min-w-0"><p class="text-[10px] text-slate-400">${safeText(category)}</p><h3 class="truncate text-xs font-semibold text-slate-900 sm:text-sm">${safeText(item.name)}</h3></div>
        </div>
        <span class="hidden text-center font-medium text-slate-700 sm:col-span-2 sm:block">${money(item.price)}</span>
        <div class="col-span-3 flex justify-center sm:col-span-3">
          <div class="cart-qty-control"><button class="cart-qty-button" type="button" data-action="decrease" aria-label="Decrease quantity">−</button><span class="min-w-4 text-center font-semibold">${Number(item.qty)}</span><button class="cart-qty-button" type="button" data-action="increase" aria-label="Increase quantity">+</button></div>
        </div>
        <span class="col-span-3 text-right font-semibold text-slate-900 sm:col-span-2">${money(Number(item.price) * Number(item.qty))}</span>
      </article>`;
    }).join('');

    empty.classList.toggle('hidden', items.length > 0);
    document.getElementById('summaryCount').textContent = count;
    document.getElementById('summarySubtotal').textContent = money(subtotal);
    document.getElementById('summaryDiscount').textContent = '−' + money(discount);
    document.getElementById('summaryTotal').textContent = money(total);
    document.getElementById('discountRow').classList.toggle('hidden', discountRate === 0);
    document.getElementById('discountRow').classList.toggle('flex', discountRate > 0);
    document.getElementById('checkoutButton').disabled = items.length === 0;
    const countBadge = document.getElementById('cartCount');
    if (countBadge) countBadge.textContent = count;
  }

  function showMessage(message, isError = false) {
    const messageEl = document.getElementById('cartMessage');
    messageEl.textContent = message;
    messageEl.className = `mt-2 min-h-5 text-xs ${isError ? 'text-red-600' : 'text-green-700'}`;
  }

  function toast(message) {
    const el = document.getElementById('cartToast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2400);
  }

  document.getElementById('cartItems').addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin('the shopping cart')) return;
    const row = button.closest('[data-cart-id]');
    const id = row.dataset.cartId;
    const action = button.dataset.action;
    if (!cart[id]) return;
    if (action === 'remove') delete cart[id];
    if (action === 'increase') cart[id].qty = Number(cart[id].qty) + 1;
    if (action === 'decrease') {
      cart[id].qty = Number(cart[id].qty) - 1;
      if (cart[id].qty <= 0) delete cart[id];
    }
    saveCart();
    render();
  });

  document.getElementById('clearCart').addEventListener('click', () => {
    if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin('the shopping cart')) return;
    cart = {};
    discountRate = 0;
    if (window.AgrismartAuth) window.AgrismartAuth.writeUserData('agrismartCouponDiscount', 0);
    else localStorage.removeItem('agrismartCouponDiscount');
    saveCart();
    document.getElementById('couponCode').value = '';
    showMessage('Your cart has been cleared.');
    render();
  });

  document.getElementById('couponForm').addEventListener('submit', event => {
    event.preventDefault();
    if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin('cart coupons')) return;
    const code = document.getElementById('couponCode').value.trim().toUpperCase();
    if (!code) { showMessage('Enter a coupon code first.', true); return; }
    if (code === 'GREEN10') {
      discountRate = 0.10;
      if (window.AgrismartAuth) window.AgrismartAuth.writeUserData('agrismartCouponDiscount', discountRate);
      else localStorage.setItem('agrismartCouponDiscount', String(discountRate));
      showMessage('GREEN10 applied: 10% off your subtotal.');
    } else {
      discountRate = 0;
      if (window.AgrismartAuth) window.AgrismartAuth.writeUserData('agrismartCouponDiscount', 0);
      else localStorage.removeItem('agrismartCouponDiscount');
      showMessage('That coupon code is not available.', true);
    }
    render();
  });

  document.getElementById('checkoutButton').addEventListener('click', () => {
    if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin('checkout')) return;
    const hasItems = Object.values(cart).some(item => item && Number(item.qty) > 0);
    if (!hasItems) return;
    window.location.href = 'checkout.html';
  });

  document.getElementById('newsletterForm').addEventListener('submit', event => {
    event.preventDefault();
    toast('Newsletter sign-up is not connected yet.');
  });
  const recommendations = document.getElementById('recommendedProducts');
  recommendations.innerHTML = products.map(product => `
    <article class="product-card">
      <a href="product.html" class="block" aria-label="View ${safeText(product.name)}">
        <img class="product-card__image" src="${safeText(product.image)}" alt="${safeText(product.name)}" loading="lazy">
      </a>
      <div class="mt-2 flex items-center justify-between gap-2"><span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">${safeText(product.category)}</span><span class="text-slate-400" aria-hidden="true">♡</span></div>
      <h3 class="mt-2 min-h-9 text-xs font-semibold text-slate-900">${safeText(product.name)}</h3>
      <div class="mb-2 flex items-center gap-1 text-[10px] text-slate-400"><span class="text-amber-500">★</span><span class="font-medium text-slate-600">${safeText(product.rating)}</span><span>${safeText(product.reviews)}</span></div>
      <div class="flex items-center justify-between gap-2">
        <span class="flex min-w-0 items-center gap-1.5">${product.discount ? `<span class="rounded bg-red-50 px-1 text-[10px] font-bold text-red-500">${safeText(product.discount)}</span>` : ''}<span class="text-xs font-bold text-slate-900">${money(product.price)}</span>${product.oldPrice ? `<span class="truncate text-[10px] text-slate-400 line-through">${money(product.oldPrice)}</span>` : ''}</span>
        <button class="rounded-full border border-green-200 px-2.5 py-1 text-[10px] font-semibold text-green-700 transition hover:bg-green-50" type="button" data-add-product="${safeText(product.id)}">Add</button>
      </div>
    </article>`).join('');
  recommendations.addEventListener('click', event => {
    const button = event.target.closest('[data-add-product]');
    if (!button) return;
    if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin('the shopping cart')) return;
    const product = products.find(item => item.id === button.dataset.addProduct);
    if (!product) return;
    const id = product.id;
    if (!cart[id]) cart[id] = { name: product.name, price: product.price, img: product.image, qty: 0 };
    cart[id].qty = Number(cart[id].qty) + 1;
    saveCart();
    render();
    toast(`${product.name} added to your cart.`);
  });

  render();
})();

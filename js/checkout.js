(() => {
  const CART_KEY = 'agrismartCart';
  const DISCOUNT_KEY = 'agrismartCouponDiscount';
  const cart = readCart();
  const form = document.getElementById('checkoutForm');
  const submitButton = document.getElementById('placeOrderButton');
  const notice = document.getElementById('checkoutNotice');
  const addressOptions = document.querySelector('[data-checkout-address-options]');

  function readCart() {
    if (window.AgrismartAuth) return window.AgrismartAuth.readUserData(CART_KEY, {});
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch { return {}; }
  }

  function money(value) {
    return '$' + Number(value || 0).toFixed(2);
  }

  function getItems() {
    return Object.values(cart).filter(item => item && Number(item.qty) > 0);
  }

  function renderSummary() {
    const items = getItems();
    const itemCount = items.reduce((total, item) => total + Number(item.qty), 0);
    const subtotal = items.reduce((total, item) => total + Number(item.price) * Number(item.qty), 0);
    const discountRate = window.AgrismartAuth
      ? Number(window.AgrismartAuth.readUserData(DISCOUNT_KEY, 0)) || 0
      : Number(localStorage.getItem(DISCOUNT_KEY)) || 0;
    const discount = subtotal * discountRate;
    const total = Math.max(0, subtotal - discount);

    document.getElementById('checkoutItemCount').textContent = itemCount;
    document.getElementById('checkoutSubtotal').textContent = money(subtotal);
    document.getElementById('checkoutTaxes').textContent = money(0);
    document.getElementById('checkoutDiscount').textContent = '-' + money(discount);
    document.getElementById('checkoutTotal').textContent = money(total);
    submitButton.disabled = items.length === 0;

    if (!items.length) {
      notice.textContent = 'Your cart is empty. Add products before continuing.';
      notice.classList.remove('hidden');
    }
  }

  function restoreCheckoutDetails() {
    if (!form) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem('agrismartCheckoutDetails') || '{}');
      if (saved.deliveryAddress === 'different') addAlternateAddressFields();
      Object.entries(saved).forEach(([name, value]) => {
        const controls = form.elements.namedItem(name);
        if (!controls) return;
        if (controls instanceof RadioNodeList) {
          Array.from(controls).forEach(control => { control.checked = control.value === value; });
        } else if (controls.type !== 'radio') {
          controls.value = value;
        }
      });
      if (!saved.state) {
        const preferredCity = localStorage.getItem('agrismartPreferredCity');
        const stateByCity = { Amman: 'AMM', Zarqa: 'ZAR', Irbid: 'IRB', Aqaba: 'AQB' };
        if (preferredCity && stateByCity[preferredCity] && form.elements.namedItem('state')) {
          form.elements.namedItem('state').value = stateByCity[preferredCity];
        }
      }
    } catch { /* Ignore unavailable or malformed session data. */ }
  }

  function addAlternateAddressFields() {
    if (document.querySelector('[data-alternate-address]')) return;
    const panel = document.createElement('div');
    panel.dataset.alternateAddress = '';
    panel.className = 'mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4';
    panel.innerHTML = `
      <div class="sm:col-span-2">
        <label class="mb-1.5 block text-xs font-semibold text-gray-700" for="shippingAddress">Street Address*</label>
        <input class="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800" id="shippingAddress" name="shippingAddress" autocomplete="shipping street-address" required>
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-semibold text-gray-700" for="shippingCity">City*</label>
        <input class="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800" id="shippingCity" name="shippingCity" autocomplete="shipping address-level2" required>
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-semibold text-gray-700" for="shippingCountry">Country*</label>
        <select class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700" id="shippingCountry" name="shippingCountry" autocomplete="shipping country-name" required>
          <option value="">Select Country</option><option>Jordan</option><option>United Arab Emirates</option><option>Saudi Arabia</option><option>Qatar</option>
        </select>
      </div>`;
    addressOptions.after(panel);
  }

  function removeAlternateAddressFields() {
    document.querySelector('[data-alternate-address]')?.remove();
  }

  addressOptions?.addEventListener('change', event => {
    if (event.target.name !== 'deliveryAddress') return;
    if (event.target.value === 'different') addAlternateAddressFields();
    else removeAlternateAddressFields();
  });

  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin('checkout')) return;
    if (!getItems().length) {
      notice.textContent = 'Your cart is empty. Add products before continuing.';
      notice.classList.remove('hidden');
      return;
    }

    sessionStorage.setItem('agrismartCheckoutDetails', JSON.stringify(Object.fromEntries(new FormData(form).entries())));
    window.location.href = 'payment.html';
  });

  document.getElementById('checkoutNewsletterForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const input = event.currentTarget.querySelector('input[type="email"]');
    if (input?.checkValidity()) {
      input.value = '';
      input.placeholder = 'Thank you for subscribing!';
    }
  });

  document.addEventListener('agrismart:languagechange', () => {
    if (!getItems().length) {
      notice.textContent = document.documentElement.lang === 'ar'
        ? 'سلتك فارغة. أضف منتجات قبل المتابعة.'
        : 'Your cart is empty. Add products before continuing.';
    }
  });

  restoreCheckoutDetails();
  renderSummary();
})();

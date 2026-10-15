(() => {
  const SESSION_KEY = 'agrismartSession';
  const USERS_KEY = 'agrismartUsers';
  const ORDER_KEY = 'agrismartLastOrder';
  const ORDERS_KEY = 'agrismartOrders';
  const PAYMENT_KEY = 'agrismartPaymentMethods';
  const isArabic = () => document.documentElement.lang === 'ar' || document.documentElement.getAttribute('dir') === 'rtl';

  const read = key => {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch { return null; }
  };

  // Ensure an active consumer session exists; fallback to demo consumer if none set
  let session = read(SESSION_KEY);
  if (!session || !session.email) {
    session = {
      email: 'demo@agrismart.com',
      name: 'Agrismart Demo',
      accountType: 'personal'
    };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch {}
  }

  // If a business/merchant account is logged in, redirect them to the merchant profile
  if (session?.accountType === 'business') {
    location.replace('merchant-account.html');
    return;
  }

  const profileKey = `agrismartProfile:${session.email.toLowerCase()}`;
  const savedProfile = read(profileKey) || {};
  const names = (session.name || 'Agrismart Demo').trim().split(/\s+/);

  const defaultAddresses = [
    {
      id: 'addr-amman-1',
      firstName: savedProfile.firstName || names[0] || 'Demo',
      lastName: savedProfile.lastName || (names.length > 1 ? names.slice(1).join(' ') : 'User'),
      company: 'Agrismart Home',
      country: 'Jordan',
      street: '15 Wasfi Al-Tal St, Gardens',
      city: 'Amman',
      state: 'Amman Governorate',
      zip: '11953',
      phone: savedProfile.phone || '+962 7 9123 4567',
      email: session.email
    }
  ];

  const profile = {
    firstName: savedProfile.firstName || names[0] || 'Demo',
    lastName: savedProfile.lastName || (names.length > 1 ? names.slice(1).join(' ') : 'User'),
    email: session.email,
    phone: savedProfile.phone || '+962 7 9123 4567',
    gender: savedProfile.gender || 'Prefer not to say',
    avatar: savedProfile.avatar || '',
    addresses: Array.isArray(savedProfile.addresses) && savedProfile.addresses.length
      ? savedProfile.addresses
      : defaultAddresses
  };

  function setValues() {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };
    setVal('accountFirstName', profile.firstName);
    setVal('accountLastName', profile.lastName);
    setVal('accountEmail', profile.email);
    setVal('accountPhone', profile.phone);
    setVal('accountGender', profile.gender);
    setVal('addressFirstName', profile.firstName);
    setVal('addressLastName', profile.lastName);
    setVal('addressPhone', profile.phone);
    setVal('addressEmail', profile.email);
    if (profile.avatar && document.getElementById('accountAvatar')) {
      document.getElementById('accountAvatar').src = profile.avatar;
    }
  }

  function status(id, english, arabic) {
    const el = document.getElementById(id);
    if (el) el.textContent = isArabic() ? arabic : english;
  }

  function persistProfile() {
    localStorage.setItem(profileKey, JSON.stringify(profile));
    const updatedName = `${profile.firstName} ${profile.lastName}`.trim();
    const updatedSession = {
      email: profile.email,
      name: updatedName,
      accountType: session.accountType || 'personal'
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
    document.dispatchEvent(new CustomEvent('agrismart:sessionchange'));
  }

  function addText(parent, tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    parent.append(element);
    return element;
  }

  function renderAddresses() {
    const root = document.getElementById('accountAddressList');
    if (!root) return;
    root.replaceChildren();
    if (!profile.addresses || !profile.addresses.length) {
      const empty = document.createElement('p');
      empty.className = 'account-address-empty';
      empty.textContent = isArabic() ? 'لا توجد عناوين محفوظة. أضف عنوانك من النموذج أدناه.' : 'No saved addresses yet. Add one using the form below.';
      root.append(empty);
      return;
    }

    profile.addresses.forEach(address => {
      const card = document.createElement('article');
      card.className = 'account-address-card';
      const copy = document.createElement('div');
      copy.className = 'account-address-copy';
      addText(copy, 'strong', 'account-address-name', `${address.firstName || ''} ${address.lastName || ''}`.trim() || (isArabic() ? 'عنوان محفوظ' : 'Saved address'));
      const parts = [address.street, address.city, address.state, address.zip, address.country, address.phone].filter(Boolean);
      addText(copy, 'p', 'account-address-details', parts.join(', '));
      if (address.company) addText(copy, 'p', 'account-address-company', address.company);
      const actions = document.createElement('div');
      actions.className = 'account-address-actions';
      const edit = addText(actions, 'button', 'account-address-edit', isArabic() ? 'تعديل' : 'Edit');
      edit.type = 'button';
      edit.dataset.addressEdit = address.id;
      const remove = addText(actions, 'button', 'account-address-delete', isArabic() ? 'حذف' : 'Delete');
      remove.type = 'button';
      remove.dataset.addressDelete = address.id;
      card.append(copy, actions);
      root.append(card);
    });
  }

  function renderPaymentMethods() {
    const root = document.getElementById('accountPaymentMethods');
    if (!root) return;
    const key = `${PAYMENT_KEY}:${session.email.toLowerCase()}`;
    let methods = read(key);
    if (!Array.isArray(methods) || !methods.length) {
      methods = [
        { type: 'card', brand: 'VISA', last4: '8096' },
        { type: 'paypal', brand: 'P', name: 'PayPal', linked: true },
        { type: 'google', brand: 'G', name: 'Google Pay', linked: false }
      ];
      localStorage.setItem(key, JSON.stringify(methods));
    }
    root.replaceChildren();

    const walletRow = (type, brand, name) => {
      const row = document.createElement('article');
      row.className = 'account-payment-method';
      const copy = document.createElement('div');
      copy.className = 'account-payment-method-copy';
      addText(copy, 'span', `account-payment-brand is-${type}`, brand);
      addText(copy, 'strong', 'account-payment-method-name', name);
      const linked = Boolean(methods.find(method => method.type === type && method.linked));
      const action = addText(row, 'button', 'account-payment-method-action', linked ? (isArabic() ? 'إلغاء الربط' : 'Unlink Account') : (isArabic() ? 'ربط الحساب' : 'Link Account'));
      action.type = 'button';
      action.dataset.paymentWallet = type;
      action.setAttribute('aria-pressed', String(linked));
      row.prepend(copy);
      root.append(row);
    };

    walletRow('paypal', 'P', 'PayPal');

    methods.filter(method => method.type === 'card').forEach((method, index) => {
      const row = document.createElement('article');
      row.className = 'account-payment-method';
      const copy = document.createElement('div');
      copy.className = 'account-payment-method-copy';
      addText(copy, 'span', 'account-payment-brand', method.brand || 'VISA');
      addText(copy, 'strong', 'account-payment-last4', `•••• •••• •••• ${method.last4}`);
      const remove = addText(row, 'button', 'account-payment-method-action is-danger', isArabic() ? 'حذف' : 'Delete');
      remove.type = 'button';
      remove.dataset.paymentDelete = String(index);
      row.prepend(copy);
      root.append(row);
    });

    walletRow('google', 'G', 'Google Pay');
  }

  function setPaymentStatus(english, arabic) {
    const output = document.getElementById('paymentStatus');
    if (output) output.textContent = isArabic() ? arabic : english;
  }

  function resetAddressEditor() {
    const form = document.getElementById('accountAddressForm');
    if (form) form.reset();
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    setVal('accountAddressId', '');
    setVal('addressFirstName', profile.firstName);
    setVal('addressLastName', profile.lastName);
    setVal('addressPhone', profile.phone);
    setVal('addressEmail', profile.email);
    const title = document.getElementById('addressEditorTitle');
    if (title) title.textContent = isArabic() ? 'إضافة عنوان جديد' : 'Add New Address';
    const btn = document.getElementById('saveAddressButton');
    if (btn) btn.textContent = isArabic() ? 'إضافة عنوان' : 'Add Address';
    const cancel = document.getElementById('cancelAddressEdit');
    if (cancel) cancel.hidden = true;
    const st = document.getElementById('addressStatus');
    if (st) st.textContent = '';
  }

  function editAddress(address) {
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    setVal('accountAddressId', address.id);
    setVal('addressFirstName', address.firstName);
    setVal('addressLastName', address.lastName);
    setVal('addressCompany', address.company);
    setVal('addressCountry', address.country);
    setVal('addressStreet', address.street);
    setVal('addressCity', address.city);
    setVal('addressState', address.state);
    setVal('addressZip', address.zip);
    setVal('addressPhone', address.phone);
    setVal('addressEmail', address.email || profile.email);
    const title = document.getElementById('addressEditorTitle');
    if (title) title.textContent = isArabic() ? 'تعديل العنوان' : 'Edit Address';
    const btn = document.getElementById('saveAddressButton');
    if (btn) btn.textContent = isArabic() ? 'حفظ التعديلات' : 'Save Changes';
    const cancel = document.getElementById('cancelAddressEdit');
    if (cancel) cancel.hidden = false;
    document.getElementById('addressStreet')?.focus();
  }

  function readOrders() {
    const stored = window.AgrismartAuth ? window.AgrismartAuth.readUserData(ORDERS_KEY, []) : read(ORDERS_KEY);
    let orders = Array.isArray(stored) ? [...stored] : [];
    const lastOrder = window.AgrismartAuth ? window.AgrismartAuth.readUserData(ORDER_KEY, null) : read(ORDER_KEY);
    if (lastOrder && !orders.some(order => order.id === lastOrder.id)) {
      orders.unshift(lastOrder);
      if (window.AgrismartAuth) window.AgrismartAuth.writeUserData(ORDERS_KEY, orders);
      else localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
    const accountEmail = (session.email || '').toLowerCase();
    let userOrders = orders.filter(order => !order.customerEmail || order.customerEmail.toLowerCase() === accountEmail);

    if (userOrders.length === 0) {
      const demoOrder1 = {
        id: 'AGR-88241',
        customerEmail: session.email,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        deliveryEnd: new Date(Date.now() + 86400000 * 2).toISOString(),
        status: 'accepted',
        paymentMethod: 'card',
        paymentReference: 'TXN-94021-VISA',
        total: 58.50,
        items: [
          {
            name: 'Monstera Deliciosa (Swiss Cheese)',
            category: 'Indoor Plant',
            price: 32.00,
            qty: 1,
            image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=80'
          },
          {
            name: 'Terracotta Cylinder Pot (Medium)',
            category: 'Pots & Accessories',
            price: 26.50,
            qty: 1,
            image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80'
          }
        ]
      };
      const demoOrder2 = {
        id: 'AGR-76190',
        customerEmail: session.email,
        createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        deliveryEnd: new Date(Date.now() - 86400000 * 11).toISOString(),
        deliveredAt: new Date(Date.now() - 86400000 * 11).toISOString(),
        status: 'delivered',
        paymentMethod: 'card',
        paymentReference: 'TXN-81092-VISA',
        total: 24.00,
        items: [
          {
            name: 'Fiddle Leaf Fig (Ficus Lyrata)',
            category: 'Indoor Plant',
            price: 24.00,
            qty: 1,
            image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=80'
          }
        ]
      };
      userOrders = [demoOrder1, demoOrder2];
      orders.push(...userOrders);
      if (window.AgrismartAuth) window.AgrismartAuth.writeUserData(ORDERS_KEY, orders);
      else localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
    return userOrders;
  }

  function orderDate(value, fallback = '') {
    if (!value) return fallback;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;
    return new Intl.DateTimeFormat(isArabic() ? 'ar-JO' : 'en-JO', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  }

  function paymentLabel(order) {
    if (order.paymentMethod === 'card') return isArabic() ? 'بطاقة ائتمان' : 'Credit Card';
    if (order.paymentMethod === 'paypal') return 'PayPal';
    if (order.paymentMethod === 'googlepay') return 'Google Pay';
    return isArabic() ? 'الدفع عند الاستلام' : 'Cash on Delivery';
  }

  function orderStatus(state) {
    const labels = {
      accepted: ['Accepted', 'مقبول'],
      delivered: ['Delivered', 'تم التوصيل'],
      cancelled: ['Cancelled', 'ملغي']
    };
    return (labels[state] || labels.accepted)[isArabic() ? 1 : 0];
  }

  function orderStatusDescription(state) {
    const labels = {
      accepted: ['Your order has been accepted.', 'تم قبول طلبك.'],
      delivered: ['Your order has been delivered.', 'تم توصيل طلبك.'],
      cancelled: ['This order was cancelled in this browser.', 'تم إلغاء هذا الطلب محليًا.']
    };
    return (labels[state] || labels.accepted)[isArabic() ? 1 : 0];
  }

  function downloadOrderInvoice(order) {
    const lines = [
      isArabic() ? 'أجري سمارت — فاتورة الطلب' : 'AGRISMART — ORDER INVOICE',
      `${isArabic() ? 'رقم الطلب' : 'Order ID'}: ${order.id}`,
      `${isArabic() ? 'طريقة الدفع' : 'Payment method'}: ${paymentLabel(order)}`,
      `${isArabic() ? 'رقم العملية' : 'Transaction ID'}: ${order.paymentReference || '—'}`,
      '',
      ...(order.items || []).map(item => `${item.name} × ${item.qty} — $${(Number(item.price) * Number(item.qty)).toFixed(2)}`),
      '',
      `${isArabic() ? 'الإجمالي' : 'Total'}: $${Number(order.total || 0).toFixed(2)}`,
      '',
      isArabic() ? 'سجل تجريبي محفوظ محليًا.' : 'Demo order record saved locally.'
    ];
    const blob = new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agrismart-invoice-${order.id}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function showOrders() {
    const root = document.getElementById('accountOrderDetails');
    if (!root) return;
    root.replaceChildren();
    const count = document.getElementById('accountOrderCount');
    const sort = document.getElementById('accountOrderSort')?.value || 'newest';
    const orders = readOrders();
    if (count) count.textContent = orders.length;
    if (!orders.length) {
      const empty = document.createElement('p');
      empty.className = 'account-empty';
      empty.textContent = isArabic() ? 'لا توجد طلبات حتى الآن. ستظهر طلباتك هنا بعد إتمام الشراء.' : 'You have no orders yet. Your orders will appear here after checkout.';
      root.append(empty);
      return;
    }

    orders.sort((first, second) => {
      if (sort === 'oldest') return new Date(first.createdAt) - new Date(second.createdAt);
      if (sort === 'total-high') return Number(second.total) - Number(first.total);
      if (sort === 'total-low') return Number(first.total) - Number(second.total);
      return new Date(second.createdAt) - new Date(first.createdAt);
    });

    orders.forEach(order => {
      const card = document.createElement('article');
      card.className = 'account-order-card';
      card.dataset.orderId = order.id;
      const banner = document.createElement('div');
      banner.className = 'account-order-banner';
      [
        [isArabic() ? 'رقم الطلب' : 'Order ID', order.id],
        [isArabic() ? 'طريقة الدفع' : 'Payment Method', paymentLabel(order)],
        [isArabic() ? 'رقم العملية' : 'Transaction ID', order.paymentReference || '—'],
        [order.status === 'delivered' ? (isArabic() ? 'تاريخ التوصيل' : 'Delivery Date') : (isArabic() ? 'التوصيل المتوقع' : 'Estimated Delivery'), order.deliveryEnd ? orderDate(order.deliveryEnd) : orderDate(order.createdAt)]
      ].forEach(([label, value]) => {
        const meta = document.createElement('div');
        addText(meta, 'span', 'account-order-meta-label', label);
        addText(meta, 'strong', 'account-order-meta-value', value);
        banner.append(meta);
      });
      card.append(banner);

      const items = document.createElement('div');
      items.className = 'account-order-items';
      (order.items || []).forEach(item => {
        const row = document.createElement('div');
        row.className = 'account-order-product';
        const image = document.createElement('img');
        image.className = 'account-order-product-image';
        image.src = item.image || 'assets/logo.svg';
        image.alt = item.name || (isArabic() ? 'نبتة' : 'Plant');
        image.loading = 'lazy';
        const copy = document.createElement('div');
        copy.className = 'account-order-product-copy';
        addText(copy, 'span', 'account-order-category', item.category || (isArabic() ? 'نبات' : 'Plant'));
        addText(copy, 'strong', '', `${item.name || (isArabic() ? 'نبتة' : 'Plant')} × ${Number(item.qty || 1)}`);
        addText(row, 'strong', 'account-order-product-price', `$${(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}`);
        row.prepend(image, copy);
        items.append(row);
      });
      card.append(items);

      const footer = document.createElement('div');
      footer.className = 'account-order-footer';
      const statusWrap = document.createElement('div');
      statusWrap.className = 'account-order-status-wrap';
      const state = order.status === 'delivered' ? 'delivered' : order.status === 'cancelled' ? 'cancelled' : 'accepted';
      addText(statusWrap, 'span', `account-order-status is-${state}`, orderStatus(state));
      addText(statusWrap, 'span', 'account-order-status-description', orderStatusDescription(state));
      footer.append(statusWrap);

      const actions = document.createElement('div');
      actions.className = 'account-order-actions';
      if (state === 'accepted') {
        const track = addText(actions, 'button', 'account-order-action is-primary', isArabic() ? 'تتبع الطلب' : 'Track Order');
        track.type = 'button';
        track.dataset.orderTrack = order.id;
      }
      if (state === 'delivered') {
        const review = document.createElement('a');
        review.className = 'account-order-action is-primary';
        review.href = 'shop.html';
        review.textContent = isArabic() ? 'أضف تقييمًا' : 'Add Review';
        actions.append(review);
      }
      const invoice = addText(actions, 'button', 'account-order-action is-secondary', isArabic() ? 'الفاتورة' : 'Invoice');
      invoice.type = 'button';
      invoice.dataset.orderInvoice = order.id;
      if (state === 'accepted') {
        const cancel = addText(actions, 'button', 'account-order-action is-danger', isArabic() ? 'إلغاء الطلب' : 'Cancel Order');
        cancel.type = 'button';
        cancel.dataset.orderCancel = order.id;
      }
      footer.append(actions);
      card.append(footer);
      root.append(card);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setValues();
    renderAddresses();
    resetAddressEditor();
    renderPaymentMethods();
    showOrders();

    // Tab Navigation
    const tabs = document.querySelectorAll('[data-account-tab]');
    const panels = document.querySelectorAll('[data-account-panel]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.accountTab;
        tabs.forEach(item => item.classList.toggle('is-active', item === tab));
        panels.forEach(panel => {
          panel.hidden = panel.dataset.accountPanel !== target;
        });
        if (target === 'orders') showOrders();
        if (target === 'address') renderAddresses();
        if (target === 'payment') renderPaymentMethods();
        try { history.replaceState(null, '', `#${target}`); } catch {}
      });
    });

    // Check for hash link on page load
    const initialHash = (location.hash || '').replace('#', '');
    if (initialHash && document.querySelector(`[data-account-tab="${initialHash}"]`)) {
      document.querySelector(`[data-account-tab="${initialHash}"]`).click();
    }

    // Orders sorting
    const sortSelect = document.getElementById('accountOrderSort');
    if (sortSelect) sortSelect.addEventListener('change', showOrders);

    // Orders card buttons (Track, Invoice, Cancel)
    const ordersRoot = document.getElementById('accountOrderDetails');
    if (ordersRoot) {
      ordersRoot.addEventListener('click', event => {
        const orderId = event.target.dataset.orderTrack || event.target.dataset.orderInvoice || event.target.dataset.orderCancel;
        if (!orderId) return;
        const orders = readOrders();
        const order = orders.find(item => item.id === orderId);
        if (!order) return;
        if (event.target.dataset.orderTrack) {
          if (window.AgrismartAuth) window.AgrismartAuth.writeUserData(ORDER_KEY, order);
          else localStorage.setItem(ORDER_KEY, JSON.stringify(order));
          location.href = `order-tracking.html?id=${encodeURIComponent(order.id)}`;
        } else if (event.target.dataset.orderInvoice) {
          downloadOrderInvoice(order);
        } else if (event.target.dataset.orderCancel) {
          const approved = window.confirm(isArabic() ? 'هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟' : 'Are you sure you want to cancel this order?');
          if (!approved) return;
          const allOrders = window.AgrismartAuth ? window.AgrismartAuth.readUserData(ORDERS_KEY, []) : read(ORDERS_KEY);
          const storedOrders = Array.isArray(allOrders) ? allOrders : [];
          const targetOrder = storedOrders.find(item => item.id === order.id);
          if (targetOrder) targetOrder.status = 'cancelled';
          if (window.AgrismartAuth) window.AgrismartAuth.writeUserData(ORDERS_KEY, storedOrders);
          else localStorage.setItem(ORDERS_KEY, JSON.stringify(storedOrders));
          const currentOrder = window.AgrismartAuth ? window.AgrismartAuth.readUserData(ORDER_KEY, null) : read(ORDER_KEY);
          if (currentOrder?.id === order.id) {
            if (window.AgrismartAuth) window.AgrismartAuth.writeUserData(ORDER_KEY, targetOrder || order);
            else localStorage.setItem(ORDER_KEY, JSON.stringify(targetOrder || order));
          }
          showOrders();
        }
      });
    }

    // Logout
    const logoutBtn = document.querySelector('[data-account-logout]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem('agrismartCheckoutDetails');
        document.dispatchEvent(new Event('agrismart:sessionchange'));
        window.alert(isArabic() ? 'تم تسجيل خروجك بنجاح.' : 'You have signed out successfully.');
        location.href = 'index.html';
      });
    }

    // Profile update form
    const profileForm = document.getElementById('accountProfileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', event => {
        event.preventDefault();
        profile.firstName = document.getElementById('accountFirstName')?.value.trim() || '';
        profile.lastName = document.getElementById('accountLastName')?.value.trim() || '';
        profile.phone = document.getElementById('accountPhone')?.value.trim() || '';
        profile.gender = document.getElementById('accountGender')?.value || '';
        persistProfile();
        if (!document.getElementById('accountAddressId')?.value) {
          const afn = document.getElementById('addressFirstName');
          if (afn) afn.value = profile.firstName;
          const aln = document.getElementById('addressLastName');
          if (aln) aln.value = profile.lastName;
          const aph = document.getElementById('addressPhone');
          if (aph) aph.value = profile.phone;
        }
        status('profileStatus', 'Your profile has been updated.', 'تم تحديث بيانات حسابك بنجاح.');
        setTimeout(() => {
          const st = document.getElementById('profileStatus');
          if (st) st.textContent = '';
        }, 4000);
      });
    }

    // Address form
    const addressForm = document.getElementById('accountAddressForm');
    if (addressForm) {
      addressForm.addEventListener('submit', event => {
        event.preventDefault();
        const id = document.getElementById('accountAddressId')?.value || `address-${Date.now()}`;
        const address = {
          id,
          firstName: document.getElementById('addressFirstName')?.value.trim() || '',
          lastName: document.getElementById('addressLastName')?.value.trim() || '',
          company: document.getElementById('addressCompany')?.value.trim() || '',
          country: document.getElementById('addressCountry')?.value || '',
          street: document.getElementById('addressStreet')?.value.trim() || '',
          city: document.getElementById('addressCity')?.value.trim() || '',
          state: document.getElementById('addressState')?.value.trim() || '',
          zip: document.getElementById('addressZip')?.value.trim() || '',
          phone: document.getElementById('addressPhone')?.value.trim() || '',
          email: document.getElementById('addressEmail')?.value.trim() || ''
        };
        const index = profile.addresses.findIndex(item => item.id === id);
        if (index >= 0) profile.addresses[index] = address;
        else profile.addresses.push(address);
        persistProfile();
        renderAddresses();
        resetAddressEditor();
        status('addressStatus', index >= 0 ? 'Address changes have been saved.' : 'Address has been added.', index >= 0 ? 'تم حفظ تعديلات العنوان بنجاح.' : 'تمت إضافة العنوان بنجاح.');
        setTimeout(() => {
          const st = document.getElementById('addressStatus');
          if (st) st.textContent = '';
        }, 4000);
      });
    }

    // Cancel edit address
    const cancelAddressBtn = document.getElementById('cancelAddressEdit');
    if (cancelAddressBtn) cancelAddressBtn.addEventListener('click', resetAddressEditor);

    // Address list actions (Edit / Delete)
    const addressList = document.getElementById('accountAddressList');
    if (addressList) {
      addressList.addEventListener('click', event => {
        const editId = event.target.dataset.addressEdit;
        const deleteId = event.target.dataset.addressDelete;
        if (editId) {
          const address = profile.addresses.find(item => item.id === editId);
          if (address) editAddress(address);
        }
        if (deleteId) {
          const approved = window.confirm(isArabic() ? 'هل تريد حذف هذا العنوان؟' : 'Delete this address?');
          if (!approved) return;
          profile.addresses = profile.addresses.filter(item => item.id !== deleteId);
          persistProfile();
          renderAddresses();
          if (document.getElementById('accountAddressId')?.value === deleteId) resetAddressEditor();
          status('addressStatus', 'Address has been deleted.', 'تم حذف العنوان بنجاح.');
          setTimeout(() => {
            const st = document.getElementById('addressStatus');
            if (st) st.textContent = '';
          }, 4000);
        }
      });
    }

    // Payment methods actions (toggle wallet, delete card)
    const paymentRoot = document.getElementById('accountPaymentMethods');
    const paymentKey = `${PAYMENT_KEY}:${session.email.toLowerCase()}`;
    if (paymentRoot) {
      paymentRoot.addEventListener('click', event => {
        const wallet = event.target.closest('[data-payment-wallet]');
        const remove = event.target.closest('[data-payment-delete]');
        let methods = read(paymentKey) || [];
        if (wallet) {
          const type = wallet.dataset.paymentWallet;
          const existing = methods.find(method => method.type === type);
          if (existing) existing.linked = !existing.linked;
          else methods.push({ type, linked: true });
          localStorage.setItem(paymentKey, JSON.stringify(methods));
          renderPaymentMethods();
          setPaymentStatus('Wallet connection updated.', 'تم تحديث ربط المحفظة بنجاح.');
          setTimeout(() => setPaymentStatus('', ''), 4000);
        } else if (remove) {
          const cardIndices = [];
          methods.forEach((m, i) => { if (m.type === 'card') cardIndices.push(i); });
          const cardIdx = Number(remove.dataset.paymentDelete);
          if (cardIndices[cardIdx] !== undefined) {
            methods.splice(cardIndices[cardIdx], 1);
            localStorage.setItem(paymentKey, JSON.stringify(methods));
            renderPaymentMethods();
            setPaymentStatus('The saved card has been removed.', 'تم حذف البطاقة المحفوظة.');
            setTimeout(() => setPaymentStatus('', ''), 4000);
          }
        }
      });
    }

    // Add new card form
    const paymentForm = document.getElementById('accountPaymentForm');
    if (paymentForm) {
      paymentForm.addEventListener('submit', event => {
        event.preventDefault();
        const form = event.currentTarget;
        const number = (document.getElementById('paymentCardNumber')?.value || '').replace(/\D/g, '');
        const expiry = (document.getElementById('paymentCardExpiry')?.value || '').trim();
        const cvv = (document.getElementById('paymentCardCvv')?.value || '').trim();
        if (number.length < 12 || number.length > 19) {
          setPaymentStatus('Enter a valid card number.', 'أدخل رقم بطاقة صحيحًا.');
          return;
        }
        if (!/^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/.test(expiry) || !/^\d{3,4}$/.test(cvv)) {
          setPaymentStatus('Check the expiry date and security code.', 'تحقق من تاريخ الانتهاء ورمز الأمان.');
          return;
        }
        const expiryParts = expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/);
        const month = expiryParts[1];
        const yearText = expiryParts[2];
        const year = Number(yearText.length === 2 ? `20${yearText}` : yearText);
        const now = new Date();
        if (year < now.getFullYear() || (year === now.getFullYear() && Number(month) < now.getMonth() + 1)) {
          setPaymentStatus('This card has expired.', 'هذه البطاقة منتهية الصلاحية.');
          return;
        }
        let methods = read(paymentKey) || [];
        if (document.getElementById('paymentCardSave')?.checked) {
          const brand = number.startsWith('4') ? 'VISA' : (/^(5[1-5]|2)/.test(number) ? 'Mastercard' : 'CARD');
          methods.unshift({ type: 'card', brand, last4: number.slice(-4) });
          localStorage.setItem(paymentKey, JSON.stringify(methods));
          renderPaymentMethods();
        }
        form.reset();
        setPaymentStatus('Card added successfully.', 'تمت إضافة البطاقة بنجاح.');
        setTimeout(() => setPaymentStatus('', ''), 4000);
      });
    }

    // Profile Avatar Edit
    const avatarInput = document.getElementById('accountAvatarFile');
    const avatarEdit = document.getElementById('accountAvatarEdit');
    if (avatarEdit && avatarInput) {
      avatarEdit.addEventListener('click', () => avatarInput.click());
      avatarInput.addEventListener('change', () => {
        const file = avatarInput.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        const image = new Image();
        const reader = new FileReader();
        reader.onload = () => {
          image.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = Math.min(1, 360 / Math.max(image.width, image.height));
            canvas.width = Math.round(image.width * scale);
            canvas.height = Math.round(image.height * scale);
            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
            profile.avatar = canvas.toDataURL('image/jpeg', .78);
            const avImg = document.getElementById('accountAvatar');
            if (avImg) avImg.src = profile.avatar;
            persistProfile();
          };
          image.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    }

    // Password Manager
    const passwordForm = document.getElementById('accountPasswordForm');
    if (passwordForm) {
      passwordForm.addEventListener('submit', async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const currentPassword = document.getElementById('currentPassword')?.value || '';
        const nextPassword = document.getElementById('newPassword')?.value || '';
        const confirmation = document.getElementById('confirmPassword')?.value || '';
        if (nextPassword !== confirmation) {
          status('passwordStatus', 'The new passwords do not match.', 'كلمتا المرور الجديدتان غير متطابقتين.');
          return;
        }
        if (nextPassword.length < 8) {
          status('passwordStatus', 'Use at least 8 characters for the new password.', 'استخدم 8 أحرف على الأقل لكلمة المرور الجديدة.');
          return;
        }
        try {
          let seedUsers = [];
          try {
            const response = await fetch('data/users.json', { cache: 'no-store' });
            if (response.ok) seedUsers = await response.json();
          } catch {
            seedUsers = [
              {
                name: "Agrismart Demo",
                email: "demo@agrismart.com",
                passwordHash: "588c55f3ce2b8569b153c5abbf13f9f74308b88a20017cc699b835cc93195d16",
                accountType: "personal"
              }
            ];
          }
          const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
          const users = new Map(seedUsers.map(user => [user.email, user]));
          storedUsers.forEach(user => users.set(user.email, user));
          const user = users.get(session.email);
          const digest = async value => {
            const bytes = new TextEncoder().encode(value);
            const hash = await crypto.subtle.digest('SHA-256', bytes);
            return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
          };
          if (!user || (user.passwordHash && user.passwordHash !== await digest(currentPassword))) {
            status('passwordStatus', 'The current password is incorrect.', 'كلمة المرور الحالية غير صحيحة.');
            return;
          }
          const updated = {
            name: session.name,
            email: session.email,
            passwordHash: await digest(nextPassword),
            accountType: session.accountType || 'personal'
          };
          const nextUsers = storedUsers.filter(item => item.email !== session.email);
          nextUsers.push(updated);
          localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
          form.reset();
          status('passwordStatus', 'Your password has been changed successfully.', 'تم تغيير كلمة المرور بنجاح.');
          setTimeout(() => {
            const st = document.getElementById('passwordStatus');
            if (st) st.textContent = '';
          }, 4000);
        } catch {
          status('passwordStatus', 'Could not update password. Please try again.', 'تعذر تحديث كلمة المرور. يرجى المحاولة لاحقاً.');
        }
      });
    }

    // Language Change Listener
    document.addEventListener('agrismart:languagechange', () => {
      showOrders();
      renderAddresses();
      renderPaymentMethods();
      const editingId = document.getElementById('accountAddressId')?.value;
      const cancelButton = document.getElementById('cancelAddressEdit');
      if (cancelButton) cancelButton.textContent = isArabic() ? 'إلغاء' : 'Cancel';
      if (editingId) {
        const title = document.getElementById('addressEditorTitle');
        if (title) title.textContent = isArabic() ? 'تعديل العنوان' : 'Edit Address';
        const btn = document.getElementById('saveAddressButton');
        if (btn) btn.textContent = isArabic() ? 'حفظ التعديلات' : 'Save Changes';
      } else {
        resetAddressEditor();
      }
    });

    // Newsletter Form
    document.getElementById('checkoutNewsletterForm')?.addEventListener('submit', event => {
      event.preventDefault();
      const input = event.currentTarget.querySelector('input[type="email"]');
      if (input?.checkValidity()) {
        input.value = '';
        input.placeholder = isArabic() ? 'شكراً لاشتراكك في نشرتنا!' : 'Thank you for subscribing!';
      }
    });

    // Features Carousel Navigation
    const featuresGrid = document.getElementById('featuresGrid');
    document.getElementById('featuresPrevBtn')?.addEventListener('click', () => {
      if (featuresGrid) featuresGrid.scrollBy({ left: -300, behavior: 'smooth' });
    });
    document.getElementById('featuresNextBtn')?.addEventListener('click', () => {
      if (featuresGrid) featuresGrid.scrollBy({ left: 300, behavior: 'smooth' });
    });
  });
})();

/**
 * Agrismart - Merchant & Nursery Dashboard Script
 */

(() => {
  const SESSION_KEY = 'agrismartSession';
  const PRODUCTS_KEY = 'agrismartMerchantProducts';
  const ORDERS_KEY = 'agrismartMerchantOrders';

  const isArabic = () => document.documentElement.lang === 'ar';

  const DEFAULT_PRODUCTS = [
    {
      id: 'merch_1',
      name: 'Olive Bonsai Specimen (15 Years)',
      nameAr: 'بونساي شجرة زيتون معمرة (15 عاماً)',
      botanical: 'Olea europaea',
      category: 'outdoor',
      price: 65.00,
      wholesalePrice: 48.00,
      stock: 12,
      status: 'in-stock',
      image: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=500&auto=format&fit=crop&q=80',
      traits: 'Full Sun · Moderate Care',
      traitsAr: 'شمس كاملة · عناية معتدلة',
      sold: 28
    },
    {
      id: 'merch_2',
      name: 'Variegated Monstera Albo',
      nameAr: 'نبتة مونستيرا البو مبرقشة نادرة',
      botanical: 'Monstera deliciosa variegata',
      category: 'indoor',
      price: 110.00,
      wholesalePrice: 85.00,
      stock: 5,
      status: 'in-stock',
      image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&auto=format&fit=crop&q=80',
      traits: 'Bright Indirect · 1x/wk',
      traitsAr: 'ضوء ساطع غير مباشر · سقاية أسبوعية',
      sold: 14
    },
    {
      id: 'merch_3',
      name: 'Terracotta Cylinder Pot (Set of 3)',
      nameAr: 'طقم أصص طينية أسطوانية (3 قطع)',
      botanical: 'Handcrafted Mediterranean Clay',
      category: 'pots',
      price: 32.00,
      wholesalePrice: 22.00,
      stock: 18,
      status: 'in-stock',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=80',
      traits: 'Breathable Clay · Drainage Hole',
      traitsAr: 'فخار مسامي عالي الجودة · فتحات تصريف',
      sold: 45
    },
    {
      id: 'merch_4',
      name: 'Heritage Heirloom Tomato Seeds',
      nameAr: 'بذور طماطم بلدية متوارثة ممتازة',
      botanical: 'Solanum lycopersicum',
      category: 'seeds',
      price: 6.50,
      wholesalePrice: 3.80,
      stock: 60,
      status: 'in-stock',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910609f?w=500&auto=format&fit=crop&q=80',
      traits: 'Non-GMO · High Germination',
      traitsAr: 'غير معدلة وراثياً · نسبة إنبات 95%',
      sold: 82
    }
  ];

  const DEFAULT_ORDERS = [
    {
      id: '#AG-M801',
      customer: 'Rania Qasim',
      customerAr: 'رانيا قاسم',
      phone: '+962 79 554 1120',
      location: 'Amman - Abdoun',
      locationAr: 'عمان - عبدون',
      items: '2× Variegated Monstera Albo',
      itemsAr: '2× مونستيرا البو المبرقشة',
      amount: 220.00,
      date: 'Today, 11:20 AM',
      dateAr: 'اليوم، 11:20 ص',
      status: 'new'
    },
    {
      id: '#AG-M800',
      customer: 'Tareq Masri',
      customerAr: 'طارق المصري',
      phone: '+962 78 890 2419',
      location: 'Amman - Dabouq',
      locationAr: 'عمان - دابوق',
      items: '1× Olive Bonsai Specimen',
      itemsAr: '1× بونساي زيتون معمر',
      amount: 65.00,
      date: 'Yesterday',
      dateAr: 'أمس',
      status: 'packing'
    },
    {
      id: '#AG-M799',
      customer: 'Leen Al-Husseini',
      customerAr: 'لين الحسيني',
      phone: '+962 77 100 4883',
      location: 'Zarqa - New City',
      locationAr: 'الزرقاء - المدينة الجديدة',
      items: '3× Heritage Tomato Seeds',
      itemsAr: '3× بذور طماطم بلدية',
      amount: 19.50,
      date: '2 days ago',
      dateAr: 'منذ يومين',
      status: 'transit'
    },
    {
      id: '#AG-M798',
      customer: 'Omar Nabulsi',
      customerAr: 'عمر النابلسي',
      phone: '+962 79 321 0028',
      location: 'Amman - Sweifieh',
      locationAr: 'عمان - الصويفية',
      items: '2× Terracotta Cylinder Pot',
      itemsAr: '2× طقم أصص طينية أسطوانية',
      amount: 64.00,
      date: '3 days ago',
      dateAr: 'منذ 3 أيام',
      status: 'delivered'
    }
  ];

  function getProducts() {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.map(p => {
          const def = DEFAULT_PRODUCTS.find(d => d.id === p.id);
          return def ? { ...def, ...p, nameAr: p.nameAr || def.nameAr, traitsAr: p.traitsAr || def.traitsAr } : p;
        });
      }
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  }

  function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('agrismart:merchant-products-change'));
  }

  function getOrders() {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.map(o => {
          const def = DEFAULT_ORDERS.find(d => d.id === o.id);
          return def ? {
            ...def,
            ...o,
            customerAr: o.customerAr || def.customerAr,
            locationAr: o.locationAr || def.locationAr,
            itemsAr: o.itemsAr || def.itemsAr,
            dateAr: o.dateAr || def.dateAr
          } : o;
        });
      }
      localStorage.setItem(ORDERS_KEY, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  }

  function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  function showToast(message, isError = false) {
    let toast = document.getElementById('merchantToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'merchantToast';
      toast.style.cssText = 'position:fixed;bottom:24px;inset-inline-end:24px;padding:12px 20px;border-radius:12px;background:#17231c;color:#fff;font-weight:600;font-size:0.92rem;box-shadow:0 8px 24px rgba(0,0,0,0.2);z-index:9999;transition:all 0.3s ease;opacity:0;transform:translateY(10px);pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = isError ? '#dc2626' : '#10b951';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 2800);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const session = (() => {
      try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
      catch { return null; }
    })();

    if (!session) {
      location.replace('login.html?required=1');
      return;
    }

    // Populate Merchant Hero Info
    const storeNameEl = document.getElementById('storeHeroName');
    const storeCityEl = document.getElementById('storeHeroCity');
    const storePhoneEl = document.getElementById('storeHeroPhone');
    const storeInitialEl = document.getElementById('storeHeroInitial');
    const topStripStoreName = document.getElementById('topStripStoreName');

    function updateHeroInfo() {
      const isAr = isArabic();
      const defaultStoreEn = 'Al-Rawabi Botanical Nursery';
      const defaultStoreAr = 'مشتل الروابي النباتي';

      let businessName = session.businessName;
      if (!businessName || businessName === defaultStoreEn || businessName === defaultStoreAr) {
        businessName = isAr ? defaultStoreAr : defaultStoreEn;
      }

      if (storeNameEl) storeNameEl.textContent = businessName;
      if (storeInitialEl) storeInitialEl.textContent = businessName.charAt(0).toUpperCase();
      if (topStripStoreName) topStripStoreName.textContent = businessName;

      if (storeCityEl) {
        storeCityEl.textContent = isAr ? 'عمان، الأردن' : 'Amman, Jordan';
      }
    }

    updateHeroInfo();

    // Tab switching
    const tabButtons = document.querySelectorAll('.merchant-tab-btn');
    const tabPanels = document.querySelectorAll('.merchant-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabButtons.forEach(b => b.classList.remove('is-active'));
        tabPanels.forEach(p => p.classList.remove('is-active'));

        btn.classList.add('is-active');
        const panel = document.getElementById(`panel-${target}`);
        if (panel) panel.classList.add('is-active');
      });
    });

    const categoryLabels = {
      indoor: { en: 'Indoor Plants', ar: 'نباتات داخلية' },
      outdoor: { en: 'Outdoor Plants', ar: 'نباتات خارجية' },
      pots: { en: 'Pots & Planters', ar: 'أحواض ومراكن' },
      seeds: { en: 'Seeds & Nutrition', ar: 'بذور وأسمدة' }
    };

    // ── Render Products ──
    function renderProductList() {
      const products = getProducts();
      const tbody = document.getElementById('productsTableBody');
      const searchVal = (document.getElementById('productSearchInput')?.value || '').trim().toLowerCase();
      const catVal = document.getElementById('productCategoryFilter')?.value || 'all';
      const stockVal = document.getElementById('productStockFilter')?.value || 'all';

      if (!tbody) return;

      const filtered = products.filter(p => {
        const matchSearch = !searchVal || p.name.toLowerCase().includes(searchVal) || p.botanical.toLowerCase().includes(searchVal);
        const matchCat = catVal === 'all' || p.category === catVal;
        const matchStock = stockVal === 'all' || p.status === stockVal;
        return matchSearch && matchCat && matchStock;
      });

      // Update KPI
      const kpiProducts = document.getElementById('kpiTotalProducts');
      if (kpiProducts) kpiProducts.textContent = products.length;

      const badgeCount = document.getElementById('badgeInventoryCount');
      if (badgeCount) badgeCount.textContent = products.length;

      if (!filtered.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align:center;padding:2.5rem;color:var(--m-text-muted);">
              ${isArabic() ? 'لا توجد نباتات أو منتجات تطابق البحث.' : 'No plants or products match your search.'}
            </td>
          </tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(product => {
        const isOutOfStock = product.status === 'out-of-stock' || product.stock <= 0;
        const isLow = product.stock > 0 && product.stock <= 5;
        const badgeClass = isOutOfStock ? 'is-out' : (isLow ? 'is-low' : 'is-instock');
        const badgeText = isOutOfStock
          ? (isArabic() ? 'نفد المخزون' : 'Out of Stock')
          : (isLow ? (isArabic() ? 'مخزون منخفض' : 'Low Stock') : (isArabic() ? 'متوفر' : 'In Stock'));

        const catLabel = categoryLabels[product.category]
          ? (isArabic() ? categoryLabels[product.category].ar : categoryLabels[product.category].en)
          : product.category;
        const pName = (isArabic() && product.nameAr) ? product.nameAr : product.name;
        const unitsText = isArabic() ? 'وحدة' : 'units';

        const hasSale = product.salePrice && Number(product.salePrice) < Number(product.price);

        return `
          <tr data-product-id="${product.id}">
            <td>
              <div class="product-cell">
                <img class="product-thumb" src="${product.image}" alt="${pName}">
                <div class="product-info-col">
                  <span class="product-name">${pName}</span>
                  <span class="product-subtitle">${product.botanical}</span>
                </div>
              </div>
            </td>
            <td><span class="category-tag">${catLabel}</span></td>
            <td>
              ${hasSale ? `
                <span style="text-decoration:line-through;color:var(--m-text-muted);font-size:0.85rem;">$${Number(product.price).toFixed(2)}</span>
                <strong style="color:#b91c1c;margin-inline-start:4px;">$${Number(product.salePrice).toFixed(2)}</strong>
                <span class="sale-badge">% Sale</span>
              ` : `
                <strong>$${Number(product.price).toFixed(2)}</strong>
              `}
            </td>
            <td><span style="color:var(--m-text-muted);">$${Number(product.wholesalePrice).toFixed(2)}</span></td>
            <td>
              <div class="stock-qty-cell">
                <button type="button" class="btn-stock-step" data-action="step-stock" data-step="-1" data-id="${product.id}" title="${isArabic() ? 'إنقاص الكمية' : 'Decrease stock'}">−</button>
                <span class="stock-qty-num">${product.stock}</span>
                <button type="button" class="btn-stock-step" data-action="step-stock" data-step="1" data-id="${product.id}" title="${isArabic() ? 'زيادة الكمية' : 'Increase stock'}">+</button>
              </div>
              <small style="display:block;color:var(--m-text-muted);font-size:0.75rem;margin-top:2px;">${unitsText}</small>
            </td>
            <td>
              <span class="stock-badge ${badgeClass}">${badgeText}</span>
            </td>
            <td>
              <div class="row-actions">
                <button class="btn-icon-sm is-edit" data-action="edit" data-id="${product.id}" title="${isArabic() ? 'تعديل بيانات المنتج' : 'Edit Product'}">
                  ✏️
                </button>
                <button class="btn-icon-sm" data-action="toggle-stock" data-id="${product.id}" title="${isArabic() ? 'تبديل التوفر' : 'Toggle In-Stock'}">
                  ${isOutOfStock ? '⭕' : '🟢'}
                </button>
                <button class="btn-icon-sm is-delete" data-action="delete" data-id="${product.id}" title="${isArabic() ? 'حذف' : 'Delete'}">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    renderProductList();

    // Filters & Search handlers
    document.getElementById('productSearchInput')?.addEventListener('input', renderProductList);
    document.getElementById('productCategoryFilter')?.addEventListener('change', renderProductList);
    document.getElementById('productStockFilter')?.addEventListener('change', renderProductList);

    // Products table actions (Stock stepper, Stock toggle, Edit & Delete)
    document.getElementById('productsTableBody')?.addEventListener('click', event => {
      const target = event.target.closest('button');
      if (!target) return;

      const action = target.dataset.action;
      const id = target.dataset.id;
      let products = getProducts();

      if (action === 'step-stock') {
        const step = parseInt(target.dataset.step, 10) || 0;
        products = products.map(p => {
          if (p.id === id) {
            const nextStock = Math.max(0, (p.stock || 0) + step);
            const nextStatus = nextStock > 0 ? 'in-stock' : 'out-of-stock';
            return { ...p, stock: nextStock, status: nextStatus };
          }
          return p;
        });
        saveProducts(products);
        renderProductList();
        showToast(isArabic() ? 'تم تحديث كمية المخزون' : 'Stock quantity updated');
      }

      if (action === 'edit') {
        const prod = products.find(p => p.id === id);
        if (prod) openEditProductModal(prod);
      }

      if (action === 'toggle-stock') {
        products = products.map(p => {
          if (p.id === id) {
            const nextStatus = p.status === 'out-of-stock' ? 'in-stock' : 'out-of-stock';
            return { ...p, status: nextStatus };
          }
          return p;
        });
        saveProducts(products);
        renderProductList();
        showToast(isArabic() ? 'تم تحديث حالة توفر المنتج' : 'Product availability updated');
      }

      if (action === 'delete') {
        if (confirm(isArabic() ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this plant?')) {
          products = products.filter(p => p.id !== id);
          saveProducts(products);
          renderProductList();
          showToast(isArabic() ? 'تم حذف المنتج من قائمتك' : 'Product removed from your list');
        }
      }
    });

    // ── Render Orders ──
    function renderOrdersList() {
      const orders = getOrders();
      const tbody = document.getElementById('ordersTableBody');
      const statusFilter = document.getElementById('orderStatusFilter')?.value || 'all';

      if (!tbody) return;

      const filtered = orders.filter(o => statusFilter === 'all' || o.status === statusFilter);

      // Update KPI
      const kpiActive = document.getElementById('kpiActiveOrders');
      if (kpiActive) kpiActive.textContent = orders.filter(o => o.status !== 'delivered').length;

      const badgeOrders = document.getElementById('badgeOrdersCount');
      if (badgeOrders) badgeOrders.textContent = orders.filter(o => o.status !== 'delivered').length;

      const kpiRevenue = document.getElementById('kpiTotalRevenue');
      if (kpiRevenue) {
        const total = orders.reduce((sum, o) => sum + Number(o.amount), 0);
        kpiRevenue.textContent = `$${total.toFixed(2)}`;
      }

      if (!filtered.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center;padding:2.5rem;color:var(--m-text-muted);">
              ${isArabic() ? 'لا توجد طلبات في هذه الفئة حالياً.' : 'No orders in this stage.'}
            </td>
          </tr>`;
        return;
      }

      const statusLabels = {
        new: isArabic() ? 'طلب جديد' : 'New Order',
        packing: isArabic() ? 'قيد التجهيز' : 'Packing',
        transit: isArabic() ? 'قيد التوصيل' : 'In Transit',
        delivered: isArabic() ? 'تم التسليم' : 'Delivered',
        cancelled: isArabic() ? 'ملغي' : 'Cancelled'
      };

      const nextActions = {
        new: { label: isArabic() ? 'تجهيز الطلب' : 'Accept & Pack', next: 'packing' },
        packing: { label: isArabic() ? 'شحن مع المندوب 🚚' : 'Dispatch Courier 🚚', next: 'transit' },
        transit: { label: isArabic() ? 'تأكيد التسليم' : 'Mark Delivered', next: 'delivered' },
        delivered: { label: isArabic() ? 'مكتمل ✓' : 'Completed ✓', next: null },
        cancelled: { label: isArabic() ? 'ملغي' : 'Cancelled', next: null }
      };

      tbody.innerHTML = filtered.map(order => {
        const action = nextActions[order.status] || { label: order.status, next: null };
        const cust = (isArabic() && order.customerAr) ? order.customerAr : order.customer;
        const loc = (isArabic() && order.locationAr) ? order.locationAr : order.location;
        const itemsText = (isArabic() && order.itemsAr) ? order.itemsAr : order.items;
        const dateText = (isArabic() && order.dateAr) ? order.dateAr : order.date;

        // WhatsApp Customer Hotline Link
        const cleanPhone = (order.phone || '').replace(/[^0-9]/g, '');
        const waPhone = cleanPhone.startsWith('962') ? cleanPhone : cleanPhone.startsWith('0') ? '962' + cleanPhone.slice(1) : (cleanPhone ? '962' + cleanPhone : '962798112233');
        const storeName = (isArabic() && session.businessName) ? session.businessName : (session.businessName || 'Al-Rawabi Nursery');
        const waMsg = isArabic()
          ? `مرحباً ${cust}، معكم ${storeName}. بخصوص طلبك رقم ${order.id} (${itemsText}). نود تأكيد تفاصيل الشحن وإرسال صورة الشتلة إليك.`
          : `Hello ${cust}, this is ${storeName} regarding your Agrismart order ${order.id} (${itemsText}). We are preparing your plants and would like to confirm delivery details.`;
        const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`;

        const isDispatched = order.status === 'transit' && order.courier;
        const canCancel = order.status !== 'delivered' && order.status !== 'cancelled';

        return `
          <tr>
            <td>
              <strong>${order.id}</strong><br>
              <small style="color:var(--m-text-muted);">${dateText}</small>
            </td>
            <td>
              <div style="display:flex; align-items:center; flex-wrap:wrap; gap:0.25rem;">
                <strong>${cust}</strong>
                <a href="${waUrl}" target="_blank" rel="noopener" class="btn-wa-sm" title="${isArabic() ? 'مراسلة العميل على واتساب' : 'Chat with Customer on WhatsApp'}">💬</a>
              </div>
              <small style="color:var(--m-text-muted);">${order.phone}</small>
            </td>
            <td>${itemsText}</td>
            <td>
              <span>⌖ ${loc}</span>
              ${isDispatched ? `<div class="courier-badge" style="margin-top:4px;">🚚 ${order.courier.provider}</div>` : ''}
            </td>
            <td><strong>$${Number(order.amount).toFixed(2)}</strong></td>
            <td>
              <span class="order-status-chip status-${order.status}">
                ● ${statusLabels[order.status] || order.status}
              </span>
            </td>
            <td>
              <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
                ${action.next === 'transit' ? `
                  <button class="btn-order-advance" data-order-id="${order.id}" data-action="open-dispatch" style="background:#028532;">
                    ${action.label}
                  </button>
                ` : action.next ? `
                  <button class="btn-order-advance" data-order-id="${order.id}" data-next="${action.next}">
                    ${action.label}
                  </button>
                ` : order.status === 'delivered' ? `
                  <span style="color:var(--m-primary-dark);font-weight:700;font-size:0.85rem;">✓</span>
                ` : `
                  <span style="color:var(--m-text-muted);font-size:0.85rem;">—</span>
                `}
                <a href="merchant-invoice.html?id=${encodeURIComponent(order.id)}" class="btn-icon-sm" title="${isArabic() ? 'طباعة بوليصة التجهيز والشحن' : 'Print Packing Slip'}" style="text-decoration:none;display:inline-flex;">
                  📄
                </a>
                ${canCancel ? `
                  <button class="btn-icon-sm is-delete" data-order-id="${order.id}" data-action="open-cancel" title="${isArabic() ? 'إلغاء الطلب' : 'Cancel Order'}">
                    ❌
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    renderOrdersList();

    document.getElementById('orderStatusFilter')?.addEventListener('change', renderOrdersList);

    // ── Orders Actions & Progression Handler ──
    document.getElementById('ordersTableBody')?.addEventListener('click', event => {
      const btn = event.target.closest('button[data-order-id]');
      if (!btn) return;

      const orderId = btn.dataset.orderId;
      const action = btn.dataset.action;
      const nextStatus = btn.dataset.next;
      const orders = getOrders();
      const currentOrder = orders.find(o => o.id === orderId);

      // 1. Open Courier Dispatch Assignment Modal
      if (action === 'open-dispatch') {
        if (currentOrder) openDispatchModal(currentOrder);
        return;
      }

      // 2. Open Order Cancellation Modal
      if (action === 'open-cancel') {
        if (currentOrder) openCancelModal(currentOrder);
        return;
      }

      // 3. Normal status advance
      if (nextStatus) {
        const updated = orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o);
        saveOrders(updated);
        renderOrdersList();
        showToast(isArabic() ? `تم تحديث حالة الطلب ${orderId}` : `Order ${orderId} updated successfully`);
      }
    });

    // ── Modal: Edit Existing Plant / Product ──
    const editModal = document.getElementById('editProductModal');
    const closeEditBtn = document.getElementById('closeEditProductBtn');
    const cancelEditBtn = document.getElementById('cancelEditProductBtn');
    const editForm = document.getElementById('editProductForm');

    function openEditProductModal(product) {
      if (!editModal) return;
      document.getElementById('editProductId').value = product.id;
      document.getElementById('editProductName').value = product.name || '';
      document.getElementById('editProductNameAr').value = product.nameAr || '';
      document.getElementById('editProductBotanical').value = product.botanical || '';
      document.getElementById('editProductCategory').value = product.category || 'indoor';
      document.getElementById('editProductStock').value = product.stock || 0;
      document.getElementById('editProductPrice').value = product.price || 0;
      document.getElementById('editProductSalePrice').value = product.salePrice || '';
      document.getElementById('editProductWholesale').value = product.wholesalePrice || (product.price * 0.75);
      document.getElementById('editProductTraits').value = product.traits || '';
      document.getElementById('editProductImage').value = product.image || '';

      editModal.classList.add('is-open');
    }

    function closeEditModal() {
      if (editModal) editModal.classList.remove('is-open');
    }

    closeEditBtn?.addEventListener('click', closeEditModal);
    cancelEditBtn?.addEventListener('click', closeEditModal);

    editForm?.addEventListener('submit', event => {
      event.preventDefault();
      const id = document.getElementById('editProductId').value;
      const name = document.getElementById('editProductName').value.trim();
      const nameAr = document.getElementById('editProductNameAr').value.trim();
      const botanical = document.getElementById('editProductBotanical').value.trim();
      const category = document.getElementById('editProductCategory').value;
      const stock = parseInt(document.getElementById('editProductStock').value, 10) || 0;
      const price = parseFloat(document.getElementById('editProductPrice').value) || 0;
      const saleVal = document.getElementById('editProductSalePrice').value.trim();
      const salePrice = saleVal ? parseFloat(saleVal) : null;
      const wholesalePrice = parseFloat(document.getElementById('editProductWholesale').value) || (price * 0.75);
      const traits = document.getElementById('editProductTraits').value.trim();
      const image = document.getElementById('editProductImage').value.trim();

      let products = getProducts();
      products = products.map(p => {
        if (p.id === id) {
          return {
            ...p,
            name,
            nameAr: nameAr || p.nameAr,
            botanical,
            category,
            stock,
            price,
            salePrice,
            wholesalePrice,
            traits,
            image,
            status: stock > 0 ? 'in-stock' : 'out-of-stock'
          };
        }
        return p;
      });

      saveProducts(products);
      renderProductList();
      closeEditModal();
      showToast(isArabic() ? `تم تعديل بيانات ${name} بنجاح!` : `✓ ${name} updated successfully!`);
    });

    // ── Modal: Dispatch Courier Assignment ──
    const dispatchModal = document.getElementById('dispatchCourierModal');
    const closeDispatchBtn = document.getElementById('closeDispatchBtn');
    const cancelDispatchBtn = document.getElementById('cancelDispatchBtn');
    const dispatchForm = document.getElementById('dispatchCourierForm');

    function openDispatchModal(order) {
      if (!dispatchModal) return;
      document.getElementById('dispatchOrderId').value = order.id;
      document.getElementById('dispatchOrderRef').textContent = order.id;
      document.getElementById('dispatchOrderDest').textContent = (isArabic() && order.locationAr) ? order.locationAr : order.location;
      dispatchModal.classList.add('is-open');
    }

    function closeDispatchModal() {
      if (dispatchModal) dispatchModal.classList.remove('is-open');
    }

    closeDispatchBtn?.addEventListener('click', closeDispatchModal);
    cancelDispatchBtn?.addEventListener('click', closeDispatchModal);

    dispatchForm?.addEventListener('submit', event => {
      event.preventDefault();
      const orderId = document.getElementById('dispatchOrderId').value;
      const provider = document.getElementById('courierProvider').value;
      const driver = document.getElementById('courierDriverName').value.trim();
      const phone = document.getElementById('courierDriverPhone').value.trim();
      const code = document.getElementById('courierTrackingCode').value.trim();
      const notes = document.getElementById('courierCareNotes').value.trim();

      let orders = getOrders();
      orders = orders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'transit',
            courier: { provider, driver, phone, code, notes }
          };
        }
        return o;
      });

      saveOrders(orders);
      renderOrdersList();
      closeDispatchModal();
      showToast(isArabic() ? `✓ تم شحن الطلب ${orderId} مع ${provider}!` : `🚚 Order ${orderId} dispatched with ${provider}!`);
    });

    // ── Modal: Cancel Order ──
    const cancelModal = document.getElementById('cancelOrderModal');
    const closeCancelBtn = document.getElementById('closeCancelOrderBtn');
    const abortCancelBtn = document.getElementById('abortCancelBtn');
    const cancelForm = document.getElementById('cancelOrderForm');

    function openCancelModal(order) {
      if (!cancelModal) return;
      document.getElementById('cancelTargetOrderId').value = order.id;
      document.getElementById('cancelOrderDisplayId').textContent = order.id;
      cancelModal.classList.add('is-open');
    }

    function closeCancelModal() {
      if (cancelModal) cancelModal.classList.remove('is-open');
    }

    closeCancelBtn?.addEventListener('click', closeCancelModal);
    abortCancelBtn?.addEventListener('click', closeCancelModal);

    cancelForm?.addEventListener('submit', event => {
      event.preventDefault();
      const orderId = document.getElementById('cancelTargetOrderId').value;
      const reason = document.getElementById('cancelReason').value;
      const notes = document.getElementById('cancelNotes').value.trim();

      let orders = getOrders();
      orders = orders.map(o => {
        if (o.id === orderId) {
          return { ...o, status: 'cancelled', cancelReason: reason, cancelNotes: notes };
        }
        return o;
      });

      saveOrders(orders);
      renderOrdersList();
      closeCancelModal();
      showToast(isArabic() ? `تم إلغاء الطلب ${orderId}` : `Order ${orderId} cancelled`, true);
    });

    // ── Modal: Interactive B2B Wholesale Sourcing ──
    const wsModal = document.getElementById('wholesaleOrderModal');
    const closeWsBtn = document.getElementById('closeWholesaleBtn');
    const cancelWsBtn = document.getElementById('cancelWholesaleBtn');
    const wsForm = document.getElementById('wholesaleOrderForm');
    const wsQtyInput = document.getElementById('wsOrderQuantity');
    const wsTotalCost = document.getElementById('wsTotalCostDisplay');

    function updateWholesaleTotal() {
      const unit = parseFloat(document.getElementById('wsUnitPrice').value) || 0;
      const qty = parseInt(wsQtyInput.value, 10) || 1;
      const total = unit * qty;
      if (wsTotalCost) wsTotalCost.textContent = `$${total.toFixed(2)}`;
    }

    wsQtyInput?.addEventListener('input', updateWholesaleTotal);

    function openWholesaleModal(title, price, img, moq) {
      if (!wsModal) return;
      document.getElementById('wsItemTitle').value = title;
      document.getElementById('wsUnitPrice').value = price;
      document.getElementById('wsItemName').textContent = title;
      document.getElementById('wsPriceDisplay').textContent = `$${price.toFixed(2)}`;
      document.getElementById('wsMoqText').textContent = moq || '';
      document.getElementById('wsItemImg').src = img || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop&q=80';
      if (wsQtyInput) wsQtyInput.value = 2;
      updateWholesaleTotal();
      wsModal.classList.add('is-open');
    }

    function closeWholesaleModal() {
      if (wsModal) wsModal.classList.remove('is-open');
    }

    closeWsBtn?.addEventListener('click', closeWholesaleModal);
    cancelWsBtn?.addEventListener('click', closeWholesaleModal);

    wsForm?.addEventListener('submit', event => {
      event.preventDefault();
      const title = document.getElementById('wsItemTitle').value;
      const unit = parseFloat(document.getElementById('wsUnitPrice').value) || 0;
      const qty = parseInt(wsQtyInput.value, 10) || 2;
      const dest = document.getElementById('wsDeliveryAddress').value;
      const method = document.getElementById('wsPaymentMethod').value;
      const total = unit * qty;

      const wsOrders = JSON.parse(localStorage.getItem('agrismartWholesaleOrders') || '[]');
      wsOrders.unshift({
        id: `WS-${Date.now().toString(36).toUpperCase()}`,
        item: title,
        qty,
        total,
        dest,
        method,
        date: new Date().toLocaleDateString()
      });
      localStorage.setItem('agrismartWholesaleOrders', JSON.stringify(wsOrders));

      closeWholesaleModal();
      showToast(isArabic()
        ? `🚜 تم تأكيد طلب الجملة لـ ${qty}× ${title} بقيمة $${total.toFixed(2)}!`
        : `🚜 B2B Wholesale batch for ${qty}× ${title} confirmed ($${total.toFixed(2)})!`);
    });

    // Wire click on wholesale cards
    document.querySelectorAll('.wholesale-card').forEach(card => {
      const btn = card.querySelector('.btn-order-wholesale');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const title = card.querySelector('.wholesale-card__title')?.textContent || btn.dataset.item;
        const priceText = card.querySelector('.wholesale-price')?.textContent || '$34.00';
        const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 34.00;
        const img = card.querySelector('.wholesale-card__img')?.src;
        const moq = card.querySelector('.wholesale-moq')?.textContent;
        openWholesaleModal(title, price, img, moq);
      });
    });

    // ── Add Product Modal ──
    const modal = document.getElementById('addProductModal');
    const openModalBtn = document.getElementById('openAddProductBtn');
    const closeModalBtn = document.getElementById('closeAddProductBtn');
    const cancelModalBtn = document.getElementById('cancelAddProductBtn');
    const addProductForm = document.getElementById('addProductForm');

    function openModal() {
      if (modal) modal.classList.add('is-open');
    }
    function closeModal() {
      if (modal) modal.classList.remove('is-open');
    }

    openModalBtn?.addEventListener('click', openModal);
    closeModalBtn?.addEventListener('click', closeModal);
    cancelModalBtn?.addEventListener('click', closeModal);

    // Preset Image selection in modal
    const presetImages = document.querySelectorAll('.preset-thumb');
    const imageUrlInput = document.getElementById('newProductImage');

    presetImages.forEach(img => {
      img.addEventListener('click', () => {
        presetImages.forEach(i => i.classList.remove('is-selected'));
        img.classList.add('is-selected');
        if (imageUrlInput) imageUrlInput.value = img.src;
      });
    });

    addProductForm?.addEventListener('submit', event => {
      event.preventDefault();
      const name = document.getElementById('newProductName').value.trim();
      const botanical = document.getElementById('newProductBotanical').value.trim() || 'Botanical Specimen';
      const category = document.getElementById('newProductCategory').value;
      const price = parseFloat(document.getElementById('newProductPrice').value) || 25.00;
      const wholesalePrice = parseFloat(document.getElementById('newProductWholesale').value) || (price * 0.75);
      const stock = parseInt(document.getElementById('newProductStock').value, 10) || 10;
      const image = document.getElementById('newProductImage').value.trim() ||
        'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&auto=format&fit=crop&q=80';
      const traits = document.getElementById('newProductTraits').value.trim() || 'Indoor Friendly · Moderate Light';

      const newProduct = {
        id: 'merch_' + Date.now(),
        name,
        botanical,
        category,
        price,
        wholesalePrice,
        stock,
        status: stock > 0 ? 'in-stock' : 'out-of-stock',
        image,
        traits,
        sold: 0
      };

      const products = getProducts();
      products.unshift(newProduct);
      saveProducts(products);

      addProductForm.reset();
      closeModal();
      renderProductList();
      showToast(isArabic() ? `تمت إضافة ${name} إلى متجرك بنجاح!` : `🌿 ${name} added to your catalog!`);
    });

    // ── Bi-directional Language Switcher Listener ──
    const handleLanguageChange = () => {
      updateHeroInfo();
      renderProductList();
      renderOrdersList();
    };
    window.addEventListener('agrismart:languagechange', handleLanguageChange);
    document.addEventListener('agrismart:languagechange', handleLanguageChange);
  });
})();

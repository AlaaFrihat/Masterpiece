document.addEventListener('DOMContentLoaded', () => {
  const getLang = () => localStorage.getItem('agrismartLanguage') || localStorage.getItem('agrismartAdminLang') || 'en';
  
  const toast = msg => {
    const el = document.getElementById('adminToast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2400);
  };

  const initialOrders = [
    { id: '#AG-9024', priority: 'Priority', customer: 'Lina Al-Husseini', phone: '+962 79 554 1120', zone: 'Abdoun', zoneFull: 'Abdoun, Sector 4', specimen: 'Fiddle Leaf Fig (1.2m)', items: '2 items', care: 'Eco-Fiber Root Wrap Applied', climate: 'Van-01 (Zone A)', state: 'packing', time: 'Today, 09:42 AM', amount: '$86.50', room: 'Indoor Living', packaging: 'Eco-Fiber' },
    { id: '#AG-9025', priority: 'Standard', customer: 'Tariq Mansour', phone: '+962 78 890 2419', zone: 'Jabal Al-Weibdeh', zoneFull: 'Jabal Al-Weibdeh', specimen: 'Monstera Deliciosa (Medium, 70cm)', items: '1 item', care: 'Requires Soil Moisture Verification', climate: 'Staging Bay 2', state: 'packing', time: 'Today, 10:15 AM', amount: '$45.00', room: 'Indoor Living', packaging: 'Moisture' },
    { id: '#AG-9026', priority: 'Standard', customer: 'Maya Qasemi', phone: '+962 77 100 4883', zone: 'Dabouq', zoneFull: 'Dabouq, Villas Quarter', specimen: '2× Snake Plant Laurentii, 1× Peace Lily', items: '3 items', care: 'Cushioned Ceramic Packaging Certified', climate: 'Eco-Express Fleet 1', state: 'courier', time: 'Today, 10:45 AM', amount: '$110.00', room: 'Bedroom', packaging: 'Cushioned' },
    { id: '#AG-9027', priority: 'Fragile Bloom', customer: 'Kareem Nabulsi', phone: '+962 79 321 0028', zone: 'Khalda', zoneFull: 'Khalda, Circle 1', specimen: 'White Cascade Orchid (Double Spike)', items: '1 item', care: 'Staked & Bloom Support Ring Installed', climate: 'Van-02 (Climate Spec)', state: 'out', time: 'Today, 11:02 AM', amount: '$62.00', room: 'Tropical Flowering', packaging: 'Staked' },
    { id: '#AG-9028', priority: 'Standard', customer: 'Zaid Qasim', phone: '+962 79 811 4455', zone: 'Abdoun', zoneFull: 'Abdoun North', specimen: 'ZZ Raven (Mature Pot)', items: '1 item', care: 'Eco-Fiber Root Wrap Applied', climate: 'Van-03', state: 'complete', time: 'Today, 08:30 AM', amount: '$54.00', room: 'Workspace', packaging: 'Eco-Fiber' }
  ];

  let orders = [...initialOrders];
  const rows = document.getElementById('liveOrderRows');

  const updateCounts = () => {
    const counts = {
      all: orders.length,
      packing: orders.filter(o => o.state === 'packing').length,
      courier: orders.filter(o => o.state === 'courier').length,
      out: orders.filter(o => o.state === 'out').length,
      complete: orders.filter(o => o.state === 'complete').length
    };

    const cAll = document.getElementById('countAll'); if (cAll) cAll.textContent = counts.all;
    const cPack = document.getElementById('countPacking'); if (cPack) cPack.textContent = counts.packing;
    const cCour = document.getElementById('countCourier'); if (cCour) cCour.textContent = counts.courier;
    const cOut = document.getElementById('countOut'); if (cOut) cOut.textContent = counts.out;
    const cComp = document.getElementById('countComplete'); if (cComp) cComp.textContent = counts.complete;

    const mToday = document.getElementById('metricTodayOrders'); if (mToday) mToday.textContent = counts.all;
    const mPack = document.getElementById('metricPrePack'); if (mPack) mPack.textContent = counts.packing;
  };

  const getFilteredOrders = () => {
    const term = (document.getElementById('orderFilter')?.value || '').trim().toLowerCase();
    const activeTab = document.querySelector('.status-tabs button.active')?.dataset.status || 'all';
    const room = document.getElementById('liveRoomFilter')?.value || 'all';
    const zone = document.getElementById('liveZoneFilter')?.value || 'all';
    const packaging = document.getElementById('livePackagingFilter')?.value || 'all';

    return orders.filter(order => {
      // Tab
      if (activeTab !== 'all' && order.state !== activeTab) return false;
      // Search
      if (term && !`${order.id} ${order.customer} ${order.specimen} ${order.phone} ${order.zoneFull}`.toLowerCase().includes(term)) return false;
      // Room
      if (room !== 'all' && !order.room.toLowerCase().includes(room.toLowerCase())) return false;
      // Zone
      if (zone !== 'all' && !order.zone.toLowerCase().includes(zone.toLowerCase())) return false;
      // Packaging
      if (packaging !== 'all' && !order.packaging.toLowerCase().includes(packaging.toLowerCase())) return false;

      return true;
    });
  };

  const advanceOrderState = id => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const flow = {
      packing: { next: 'courier', labelEn: 'Ready for Courier Pickup', labelAr: 'جاهز للاستلام من المندوب' },
      courier: { next: 'out', labelEn: 'Dispatched (Out for Delivery)', labelAr: 'خرج مع المندوب للتوصيل' },
      out: { next: 'complete', labelEn: 'Delivered Safely to Customer', labelAr: 'تم التسليم بأمان للعميل' },
      complete: { next: 'packing', labelEn: 'Reset to Packing Stage', labelAr: 'إعادة مرحلة التغليف' }
    };

    const step = flow[order.state] || flow.packing;
    order.state = step.next;
    updateCounts();
    render();
    const isAr = getLang() === 'ar';
    toast(`${order.id}: ${isAr ? step.labelAr : step.labelEn}`);
  };

  const render = () => {
    if (!rows) return;
    const filtered = getFilteredOrders();
    const isAr = getLang() === 'ar';

    if (filtered.length === 0) {
      rows.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:36px;color:#7a867f;font-size:13px;">${isAr ? 'لا توجد طلبات مطابقة للمعايير المحددة.' : 'No live orders match the active filters.'}</td></tr>`;
      return;
    }

    const stateLabels = {
      packing: isAr ? 'بحاجة لتغليف' : 'Needs Packing',
      courier: isAr ? 'جاهز للمندوب' : 'Ready Courier',
      out: isAr ? 'قيد التوصيل' : 'In Transit',
      complete: isAr ? 'مكتمل' : 'Delivered'
    };

    rows.innerHTML = filtered.map(order => `
      <tr data-state="${order.state}">
        <td><input type="checkbox" aria-label="Select ${order.id}"></td>
        <td>
          <div class="specimen">
            <div class="plant-thumb">♧</div>
            <span>
              <strong>${order.id}</strong><em>${order.priority}</em>
              <small>${order.time}<br>Visa · ${order.amount} Paid</small>
            </span>
          </div>
        </td>
        <td>
          <strong>${order.customer}</strong>
          <small>${order.phone}</small>
          <small>⌖ ${order.zoneFull}</small>
        </td>
        <td>
          <span class="care-tag">${order.room}</span>
          <small>${order.items}</small>
          <span class="care-note">◉ ${order.care}</span>
          <small>${order.specimen}</small>
        </td>
        <td>
          <strong class="climate">♧ ${order.climate}</strong>
          <small style="color:#1b7430;font-weight:600;">● ${stateLabels[order.state] || order.state}</small>
          <small class="eta">${order.state === 'complete' ? (isAr ? 'تم بنجاح' : 'Fulfilled') : 'ETA: 45m'}</small>
        </td>
        <td>
          <button class="row-action" data-order-action="${order.id}" title="${isAr ? 'تحديث حالة الطلب' : 'Advance Order Stage'}">›</button>
        </td>
      </tr>
    `).join('');

    rows.querySelectorAll('[data-order-action]').forEach(btn => {
      btn.addEventListener('click', () => advanceOrderState(btn.dataset.orderAction));
    });
  };

  // Status Tab Clicks
  document.querySelectorAll('.status-tabs button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.status-tabs button').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      render();
    });
  });

  // Filter Listeners
  const orderFilterInput = document.getElementById('orderFilter');
  if (orderFilterInput) orderFilterInput.addEventListener('input', render);

  const topSearch = document.getElementById('liveSearch');
  if (topSearch) {
    topSearch.addEventListener('input', e => {
      if (orderFilterInput) orderFilterInput.value = e.target.value;
      render();
    });
  }

  const roomFilter = document.getElementById('liveRoomFilter');
  if (roomFilter) roomFilter.addEventListener('change', render);

  const zoneFilter = document.getElementById('liveZoneFilter');
  if (zoneFilter) zoneFilter.addEventListener('change', render);

  const packFilter = document.getElementById('livePackagingFilter');
  if (packFilter) packFilter.addEventListener('change', render);

  const clearBtn = document.getElementById('liveFilterClear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (orderFilterInput) orderFilterInput.value = '';
      if (topSearch) topSearch.value = '';
      if (roomFilter) roomFilter.value = 'all';
      if (zoneFilter) zoneFilter.value = 'all';
      if (packFilter) packFilter.value = 'all';
      document.querySelectorAll('.status-tabs button').forEach(b => b.classList.toggle('active', b.dataset.status === 'all'));
      render();
      toast(getLang() === 'ar' ? 'تمت إعادة ضبط فلاتر الطلبات' : 'Order filters cleared');
    });
  }

  // Heading Buttons
  const scanBtn = document.getElementById('scanPlantQrBtn');
  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      toast(getLang() === 'ar' ? 'ماسح الباركود نشط: تم التحقق من سلامة شتلة Monstera' : 'QR Scanner Active: Verified specimen Monstera Deliciosa');
    });
  }

  const batchBtn = document.getElementById('batchPassportsBtn');
  if (batchBtn) {
    batchBtn.addEventListener('click', () => {
      toast(getLang() === 'ar' ? 'تم إصدار 14 جواز صحة نباتية لرحلات اليوم' : 'Generated 14 phytosanitary transit passports');
    });
  }

  const manualOrderBtn = document.getElementById('manualOrderBtn');
  if (manualOrderBtn) {
    manualOrderBtn.addEventListener('click', () => {
      const newId = `#AG-${Math.floor(9030 + Math.random() * 90)}`;
      orders.unshift({
        id: newId,
        priority: 'Priority',
        customer: 'Hana Al-Majali',
        phone: '+962 79 123 4567',
        zone: 'Abdoun',
        zoneFull: 'Abdoun, Diplomatic Quarter',
        specimen: 'Calathea Medallion (Large)',
        items: '1 item',
        care: 'Eco-Fiber Root Wrap Applied',
        climate: 'Van-01 (Zone A)',
        state: 'packing',
        time: 'Just now',
        amount: '$34.00',
        room: 'Indoor Living',
        packaging: 'Eco-Fiber'
      });
      updateCounts();
      render();
      toast(getLang() === 'ar' ? `تم إنشاء طلب جديد برقم ${newId}` : `Created manual order ${newId}`);
    });
  }

  const signoffBtn = document.querySelector('.signoff');
  if (signoffBtn) {
    signoffBtn.addEventListener('click', event => {
      const isAr = getLang() === 'ar';
      event.currentTarget.textContent = isAr ? '✓ تم توثيق الفحص الصحي' : '✓ Health Verification Signed';
      event.currentTarget.classList.add('signed');
      toast(isAr ? 'تم اعتماد الفحص البيولوجي بنجاح' : 'Biological check certified for driver release');
    });
  }

  // Initial setup
  updateCounts();
  render();
});

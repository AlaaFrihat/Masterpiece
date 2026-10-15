document.addEventListener('DOMContentLoaded', () => {
  const getLang = () => localStorage.getItem('agrismartLanguage') || localStorage.getItem('agrismartAdminLang') || 'en';

  let toastEl = document.getElementById('categoriesToast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'categoriesToast';
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }

  const toast = msg => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  };

  const data = [
    ['Ornamental Foliage Plants', 'Primary Botanical Division', '/categories/ornamental-foliage', '118 SKUs', 'Fiddle Leaf Fig ($28.99)', '$34,890', 'Active & Featured'],
    ['Succulent Varieties', 'Low Maintenance & Arid', '/categories/succulents', '64 SKUs', 'Echeveria Elegans ($12.00)', '$15,220', 'Active & Featured'],
    ['Tropical Flowering Plants', 'Exotic Blooms & Flora', '/categories/tropical-flowering', '47 SKUs', 'Phalaenopsis Orchid ($27.00)', '$19,640', 'Active & Featured'],
    ['Cacti Collection', 'Desert & Xerophyte', '/categories/cacti-collection', '35 SKUs', 'Golden Barrel Cactus ($18.00)', '$8,930', 'Active & Featured'],
    ['Indoor Air-Purifying Plants', 'NASA Clean Air', '/categories/air-purifying', '52 SKUs', 'Peace Lily Supreme ($18.50)', '$23,400', 'Active & Featured'],
    ['Pots & Accessories', 'Ceramics, Baskets, Tools', '/pots-and-accessories', '94 SKUs', 'Handcrafted Terracotta ($10)', '$14,180', 'Active in Top Nav'],
    ['Seeds & Propagation', 'Heirloom seeds, rooting kits', '/seeds', '68 SKUs', 'Wild Lavender Seed Pods', '$7,890', 'Active in Top Nav']
  ];

  const root = document.getElementById('categoryRows');
  const render = list => {
    if (!root) return;
    root.innerHTML = list.map(c => `
      <div class="taxonomy-row">
        <span><b class="category-thumb">♧</b><strong>${c[0]}<small>${c[1]}</small></strong></span>
        <code>${c[2]}</code>
        <span>${c[3]}</span>
        <span>● ${c[4]}</span>
        <strong class="gmv">${c[5]}</strong>
        <em class="visibility">${c[6]}</em>
        <span>
          <button style="font-size:14px;color:#18732f;" title="Edit" onclick="window._editTaxonomy('${c[0]}')">✎</button>
        </span>
      </div>
    `).join('');
  };

  window._editTaxonomy = name => {
    const isAr = getLang() === 'ar';
    toast(`${isAr ? 'تعديل بيانات التصنيف:' : 'Editing taxonomy:'} ${name}`);
  };

  render(data);

  // Search input
  const searchInput = document.getElementById('categorySearch');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      render(data.filter(c => c.join(' ').toLowerCase().includes(q)));
    });
  }

  // Room Toggles
  document.querySelectorAll('.toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
      const isAr = getLang() === 'ar';
      toast(toggle.classList.contains('on') ? (isAr ? 'تم تفعيل العرض في الصفحة الرئيسية' : 'Room collection active on home feed') : (isAr ? 'تم إخفاء الغرفة من الصفحة الرئيسية' : 'Room collection hidden from home feed'));
    });
  });

  // Reorder Storefront button
  const reorderBtn = document.querySelector('.categories-heading button:first-child');
  if (reorderBtn) {
    reorderBtn.addEventListener('click', () => {
      const isAr = getLang() === 'ar';
      toast(isAr ? 'تم حفظ الترتيب الجديد لواجهة المتجر' : 'Storefront layout order updated');
    });
  }

  // Create Collection / Room
  const createBtn = document.querySelector('.category-primary');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const isAr = getLang() === 'ar';
      const name = prompt(isAr ? 'أدخل اسم الغرفة أو التشكيلة الجديدة:' : 'Enter new collection / room name:', isAr ? 'شرفة مظللة' : 'Sunroom Sanctuary');
      if (!name) return;
      toast(isAr ? `تم إنشاء تشكيلة ${name} بنجاح` : `Collection "${name}" created successfully`);
    });
  }

  // Export Taxonomy
  const exportBtn = document.querySelector('.taxonomy-section button');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const csv = [
        ['Category', 'Division', 'Slug', 'SKUs Attached', 'Top Item', '30-Day GMV', 'Status'],
        ...data
      ].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'agrismart-taxonomy.csv';
      link.click();
      URL.revokeObjectURL(link.href);
      toast(getLang() === 'ar' ? 'تم تصدير ملف التصنيفات بنجاح' : 'Taxonomy classifications exported as CSV');
    });
  }

  // Campaign Banners
  document.querySelectorAll('.campaign-grid footer button').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.textContent.trim();
      const isAr = getLang() === 'ar';
      if (action.includes('Pause') || action.includes('إيقاف')) {
        btn.textContent = isAr ? 'تشغيل' : 'Resume';
        toast(isAr ? 'تم إيقاف الحملة مؤقتاً' : 'Campaign paused');
      } else if (action.includes('Resume') || action.includes('تشغيل')) {
        btn.textContent = isAr ? 'إيقاف مؤقت' : 'Pause';
        toast(isAr ? 'تم استئناف الحملة بنجاح' : 'Campaign resumed');
      } else {
        toast(`${action}: ${isAr ? 'جاري فتح الإعدادات' : 'Opening configuration'}`);
      }
    });
  });
});

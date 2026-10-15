(() => {
  const cityData = {
    amman: { name: 'Amman', center: [31.9539, 35.9106], radius: 10000 },
    abdoun: { name: 'Abdoun', center: [31.9478, 35.8836], radius: 5500 },
    rabieh: { name: 'Al-Rabieh', center: [31.9881, 35.8655], radius: 5500 },
    sweifieh: { name: 'Sweifieh', center: [31.9566, 35.8618], radius: 5500 },
    zarqa: { name: 'Zarqa', center: [32.0728, 36.0880], radius: 10000 },
    irbid: { name: 'Irbid', center: [32.5556, 35.8500], radius: 10000 },
    salt: { name: 'As-Salt', center: [32.0392, 35.7272], radius: 8000 },
    madaba: { name: 'Madaba', center: [31.7167, 35.7939], radius: 8000 },
    aqaba: { name: 'Aqaba', center: [29.5267, 35.0078], radius: 10000 }
  };

  const cityNamesAr = {
    amman: 'عمان',
    abdoun: 'عبدون',
    rabieh: 'الرابية',
    sweifieh: 'الصويفية',
    zarqa: 'الزرقاء',
    irbid: 'إربد',
    salt: 'السلط',
    madaba: 'مأدبا',
    aqaba: 'العقبة'
  };

  const isArabic = () => document.documentElement.lang === 'ar' || document.documentElement.getAttribute('dir') === 'rtl';
  const getCityName = key => {
    return isArabic() ? (cityNamesAr[key] || cityData[key]?.name || key) : (cityData[key]?.name || key);
  };

  const $ = (s, root = document) => root.querySelector(s);
  const mapEl = $('#nearbyMap');
  const statusEl = $('#mapStatus');
  const resultsMessage = $('#resultsMessage');
  const storeList = $('#storeList');
  const countEl = $('#resultCount');
  if (!mapEl) return;

  if (!window.L) {
    statusEl.textContent = isArabic() ? 'تعذر تحميل مكتبة الخريطة. تحقق من اتصالك وأعد المحاولة.' : 'Map library could not load. Check your connection and refresh.';
    statusEl.parentElement.classList.add('is-error');
    resultsMessage.textContent = isArabic() ? 'الخريطة التفاعلية غير متاحة أثناء انقطاع الاتصال.' : 'The interactive map is unavailable while the map library is offline.';
    return;
  }

  const map = L.map(mapEl, { scrollWheelZoom: false }).setView(cityData.amman.center, 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'
  }).addTo(map);

  const markerLayer = L.layerGroup().addTo(map);
  let allStores = [];
  let filteredStores = [];
  let activeArea = 'amman';
  let activeKind = 'all';
  let pageSize = 6;
  let requestController;
  const storeMarkers = new Map();
  const endpoints = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];

  const loggedIn = () => !window.AgrismartAuth || window.AgrismartAuth.requireLogin('nearby store search');
  const escapeHtml = value => String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const distanceKm = (a, b) => {
    const rad = value => value * Math.PI / 180;
    const dLat = rad(b[0] - a[0]); const dLon = rad(b[1] - a[1]);
    const n = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(n), Math.sqrt(1 - n));
  };

  const storeType = tags => {
    if (tags.shop === 'garden_centre' || tags.landuse === 'plant_nursery') return 'nursery';
    if (tags.shop === 'florist') return 'garden';
    return 'supplies';
  };

  const storeTypeLabel = store => {
    if (isArabic()) {
      return ({
        nursery: 'مشتل / مركز نباتات',
        garden: 'محل زهور ونباتات',
        supplies: 'مستلزمات زراعية'
      })[store.kind] || 'متجر حدائق';
    }
    return ({
      nursery: 'Nursery / garden centre',
      garden: 'Florist / plant shop',
      supplies: 'Agricultural supplies'
    })[store.kind] || 'Garden shop';
  };

  const coordinates = element => {
    if (Number.isFinite(element.lat) && Number.isFinite(element.lon)) return [element.lat, element.lon];
    if (element.center && Number.isFinite(element.center.lat) && Number.isFinite(element.center.lon)) return [element.center.lat, element.center.lon];
    return null;
  };

  function setStatus(message, state = '') {
    statusEl.textContent = message;
    statusEl.parentElement.classList.toggle('is-loading', state === 'loading');
    statusEl.parentElement.classList.toggle('is-error', state === 'error');
  }

  function normalize(elements, center) {
    return elements.map(element => {
      const pos = coordinates(element); const tags = element.tags || {};
      if (!pos || !tags.name) return null;
      const kind = storeType(tags);
      return {
        id: `${element.type}/${element.id}`, name: tags.name, tags, kind, pos,
        distance: distanceKm(center, pos),
        address: [tags['addr:street'], tags['addr:suburb'] || tags['addr:city']].filter(Boolean).join(', '),
        osmUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`
      };
    }).filter(Boolean);
  }

  async function requestStores(center, radiusMeters) {
    requestController?.abort();
    requestController = new AbortController();
    const timeout = setTimeout(() => requestController?.abort(), 28000);
    const lat = center[0].toFixed(5); const lon = center[1].toFixed(5);
    const query = `[out:json][timeout:25];(nwr["shop"~"^(garden_centre|florist|agrarian|farm)$"](around:${radiusMeters},${lat},${lon});nwr["landuse"="plant_nursery"](around:${radiusMeters},${lat},${lon}););out center tags;`;
    let lastError;
    try {
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: `data=${encodeURIComponent(query)}`, signal: requestController.signal });
          if (!response.ok) throw new Error(`Map data service returned ${response.status}`);
          const data = await response.json();
          clearTimeout(timeout);
          const list = normalize(data.elements || [], center);
          try {
            if (window.AgrismartStores) {
              const partnerStores = window.AgrismartStores.getStores();
              partnerStores.forEach(ps => {
                if (ps.lat && ps.lng) {
                  const dist = distanceKm(center, [ps.lat, ps.lng]);
                  list.unshift({
                    id: 'partner/' + ps.id,
                    name: (isArabic() && ps.nameAr) ? ps.nameAr : ps.name,
                    nameEn: ps.name,
                    nameAr: ps.nameAr,
                    tags: { verified: (isArabic() ? 'مشتل معتمد من أجري سمارت' : 'Agrismart Partner'), produce: ps.category || 'botanical' },
                    kind: 'nursery',
                    pos: [ps.lat, ps.lng],
                    distance: dist,
                    address: (isArabic() && ps.addressAr) ? ps.addressAr : (ps.address || ps.city),
                    addressEn: ps.address || ps.city,
                    addressAr: ps.addressAr,
                    osmUrl: `store.html?id=${ps.id}`
                  });
                }
              });
            }
          } catch { /* ignore */ }
          return list;
        } catch (error) { lastError = error; if (error.name === 'AbortError') throw error; }
      }
      throw lastError || new Error('Map data could not be reached');
    } finally { clearTimeout(timeout); }
  }

  function visibleStores() {
    const radius = Number($('#nearbyRadius').value || 10);
    const query = $('#storeSearch').value.trim().toLocaleLowerCase();
    return allStores.filter(store => store.distance <= radius && (activeKind === 'all' || store.kind === activeKind) && (!query || `${store.name} ${store.address} ${Object.values(store.tags).join(' ')}`.toLocaleLowerCase().includes(query)))
      .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name));
  }

  function render() {
    const isAr = isArabic();
    filteredStores = visibleStores();
    const visible = filteredStores.slice(0, pageSize);
    countEl.textContent = isAr
      ? `${filteredStores.length} ${filteredStores.length === 1 ? 'موقع' : 'مواقع'}`
      : `${filteredStores.length} ${filteredStores.length === 1 ? 'place' : 'places'}`;

    const loadMoreBtn = $('#loadMoreStores');
    if (loadMoreBtn) {
      loadMoreBtn.hidden = visible.length >= filteredStores.length;
      loadMoreBtn.textContent = isAr ? 'عرض المزيد من المتاجر' : 'Load more stores';
    }

    if (!allStores.length) {
      storeList.innerHTML = isAr
        ? '<div class="nearby-empty"><strong>لم يتم العثور على أماكن مسجلة في هذه المنطقة بعد.</strong>جرّب توسيع نطاق البحث أو اختيار مدينة أخرى. تغطية OpenStreetMap تختلف حسب المنطقة.</div>'
        : '<div class="nearby-empty"><strong>No mapped places found in this area yet.</strong>Try a wider radius or another city. OpenStreetMap coverage varies by area.</div>';
    } else if (!visible.length) {
      storeList.innerHTML = isAr
        ? '<div class="nearby-empty"><strong>لا توجد نتائج مطابقة لهذه التصفية.</strong>غيّر خيارات البحث أو الفئة أو المسافة لعرض المزيد من الأماكن.</div>'
        : '<div class="nearby-empty"><strong>No matches for these filters.</strong>Change the search, category, or distance to see more places.</div>';
    } else {
      storeList.innerHTML = visible.map(store => {
        const typeLabel = escapeHtml(storeTypeLabel(store));
        const distText = isAr ? `${store.distance.toFixed(1)} كم` : `${store.distance.toFixed(1)} km`;
        const addrText = escapeHtml(store.address || (isAr ? 'العنوان غير مدرج على الخريطة' : 'Address not listed in OpenStreetMap'));
        const hoursText = store.tags.opening_hours
          ? (isAr ? `ساعات العمل: ${escapeHtml(store.tags.opening_hours)}` : `Hours: ${escapeHtml(store.tags.opening_hours)}`)
          : (isAr ? 'ساعات العمل غير مدرجة' : 'Opening hours not listed');
        const dirText = isAr ? 'الاتجاهات' : 'Get directions';
        const detailsText = isAr ? 'تفاصيل الخريطة' : 'Map details';
        const tagDefault = isAr ? '<span class="store-tag">مسجل على الخريطة</span>' : '<span class="store-tag">Map listing</span>';
        const tagsHtml = [store.tags.cuisine, store.tags.produce, store.tags.brand, store.tags.operator]
          .filter(Boolean).slice(0, 3)
          .map(tag => `<span class="store-tag">${escapeHtml(tag)}</span>`).join('') || tagDefault;

        return `<article class="store-card" data-store-id="${escapeHtml(store.id)}"><div class="store-card__top"><div><h3>${escapeHtml(store.name)}</h3><span class="store-type">${typeLabel}</span></div><span class="store-distance">${distText}</span></div><p class="store-address">${addrText}</p><div class="store-tags">${tagsHtml}</div><p class="store-hours">${hoursText}</p><div class="store-actions"><a href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${encodeURIComponent(`${map.getCenter().lat},${map.getCenter().lng}`)}%3B${encodeURIComponent(`${store.pos[0]},${store.pos[1]}`)}" target="_blank" rel="noopener" data-store-action="directions">${dirText}</a><a href="${store.osmUrl}" target="_blank" rel="noopener" data-store-action="details">${detailsText}</a></div></article>`;
      }).join('');
    }

    markerLayer.clearLayers();
    storeMarkers.clear();
    filteredStores.forEach(store => {
      const openMapText = isAr ? 'فتح تفاصيل الخريطة' : 'Open map listing';
      const icon = L.divIcon({ className: '', html: '<div class="nearby-pin"><span>✿</span></div>', iconSize: [32, 36], iconAnchor: [16, 34], popupAnchor: [0, -30] });
      const marker = L.marker(store.pos, { icon }).bindPopup(`<b>${escapeHtml(store.name)}</b><br>${escapeHtml(storeTypeLabel(store))}<br><a href="${store.osmUrl}" target="_blank" rel="noopener">${openMapText}</a>`);
      marker.on('click', () => highlightCard(store.id));
      marker.addTo(markerLayer);
      storeMarkers.set(store.id, marker);
    });

    const currentCityName = getCityName(activeArea);
    resultsMessage.textContent = allStores.length
      ? (isAr ? `عرض أماكن OpenStreetMap في محيط ${currentCityName}. تعتمد التفاصيل على المساهمات المحلية.` : `Showing OpenStreetMap listings around ${cityData[activeArea]?.name || activeArea}. Details depend on local map contributions.`)
      : resultsMessage.textContent;
  }

  function highlightCard(id) {
    document.querySelectorAll('.store-card').forEach(card => card.classList.toggle('is-active', card.dataset.storeId === id));
    const card = $(`[data-store-id="${CSS.escape(id)}"]`);
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  async function loadArea(areaKey, radius = Number($('#nearbyRadius').value || 10), fit = true) {
    const isAr = isArabic();
    const area = cityData[areaKey] || cityData.amman;
    activeArea = areaKey;
    const currentCityName = getCityName(areaKey);
    if (['amman', 'zarqa', 'irbid', 'salt', 'madaba', 'aqaba'].includes(areaKey)) $('#nearbyCity').value = areaKey;
    if (fit) map.setView(area.center, radius <= 6 ? 13 : radius <= 10 ? 12 : 11);
    setStatus(isAr ? `جاري تحميل بيانات خريطة ${currentCityName}…` : `Loading ${area.name} map data…`, 'loading');
    resultsMessage.textContent = isAr ? `جاري البحث عن المشاتل والمتاجر الزراعية في ${currentCityName}…` : `Looking for mapped nurseries and agricultural shops around ${area.name}…`;
    try {
      allStores = await requestStores(area.center, radius * 1000);
      if (activeArea !== areaKey) return;
      setStatus(isAr ? `${allStores.length} موقع مسجل · ${currentCityName}` : `${allStores.length} map listing${allStores.length === 1 ? '' : 's'} · ${area.name}`);
      render();
    } catch (error) {
      if (error.name === 'AbortError') return;
      if (window.AgrismartStores && typeof window.AgrismartStores.getStores === 'function') {
        try {
          const partnerStores = window.AgrismartStores.getStores();
          const fallbackList = [];
          partnerStores.forEach(ps => {
            if (ps.lat && ps.lng) {
              const dist = distanceKm(area.center, [ps.lat, ps.lng]);
              fallbackList.push({
                id: 'partner/' + ps.id,
                name: (isAr && ps.nameAr) ? ps.nameAr : ps.name,
                nameEn: ps.name,
                nameAr: ps.nameAr,
                tags: { verified: (isAr ? 'مشتل معتمد من أجري سمارت' : 'Agrismart Partner'), produce: ps.category || 'botanical' },
                kind: 'nursery',
                pos: [ps.lat, ps.lng],
                distance: dist,
                address: (isAr && ps.addressAr) ? ps.addressAr : (ps.address || ps.city),
                addressEn: ps.address || ps.city,
                addressAr: ps.addressAr,
                osmUrl: `store.html?id=${ps.id}`
              });
            }
          });
          if (fallbackList.length) {
            allStores = fallbackList;
            setStatus(isAr ? `المشاتل المعتمدة الشريكة · ${currentCityName}` : `Partner Nurseries · ${area.name}`);
            render();
            return;
          }
        } catch { /* proceed to error UI */ }
      }
      allStores = [];
      setStatus(isAr ? 'تعذر الاتصال بدليل الخريطة' : 'Could not connect to the map directory', 'error');
      countEl.textContent = isAr ? 'غير متوفر' : 'Unavailable';
      resultsMessage.innerHTML = isAr
        ? 'تعذر الوصول إلى بيانات الدليل المباشرة. تظل الخريطة نفسها متاحة؛ حاول مرة أخرى بعد لحظات.'
        : 'Live directory data could not be reached. The map itself remains available; try again in a moment.';
      storeList.innerHTML = isAr
        ? '<div class="nearby-empty"><strong>دليل الخريطة غير متاح مؤقتًا.</strong>تحقق من اتصال الإنترنت واستخدم "ابحث في هذه المنطقة" لإعادة المحاولة.</div>'
        : '<div class="nearby-empty"><strong>Map directory is temporarily unavailable.</strong>Check your internet connection and use “Search this map area” to retry.</div>';
    }
  }

  $('#storeSearchForm').addEventListener('submit', event => { event.preventDefault(); if (!loggedIn()) return; pageSize = 6; loadArea($('#nearbyCity').value, Number($('#nearbyRadius').value), true); });
  $('#nearbyCity').addEventListener('change', () => { if (!loggedIn()) return; pageSize = 6; loadArea($('#nearbyCity').value, Number($('#nearbyRadius').value), true); });
  $('#nearbyRadius').addEventListener('change', () => { if (!loggedIn()) return; pageSize = 6; loadArea(activeArea, Number($('#nearbyRadius').value), false); });
  document.querySelectorAll('.nearby-chip').forEach(button => button.addEventListener('click', () => {
    if (!loggedIn()) return;
    document.querySelectorAll('.nearby-chip').forEach(chip => chip.classList.toggle('is-selected', chip === button));
    activeKind = button.dataset.kind; pageSize = 6; render();
  }));
  document.querySelectorAll('[data-area]').forEach(button => button.addEventListener('click', () => {
    if (!loggedIn()) return;
    document.querySelectorAll('[data-area]').forEach(area => area.classList.toggle('is-active', area === button));
    $('#storeSearch').value = ''; pageSize = 6; loadArea(button.dataset.area, Number($('#nearbyRadius').value), true);
  }));
  $('#refreshMap').addEventListener('click', () => {
    if (!loggedIn()) return;
    const isAr = isArabic();
    const bounds = map.getBounds(); const center = map.getCenter(); const radius = Math.min(25000, Math.max(2000, Math.round(distanceKm([center.lat, center.lng], [bounds.getNorth(), center.lng]) * 1000)));
    activeArea = $('#nearbyCity').value; pageSize = 6;
    setStatus(isAr ? 'جاري البحث في المنطقة المعروضة…' : 'Searching visible map area…', 'loading');
    requestStores([center.lat, center.lng], radius).then(stores => {
      allStores = stores;
      setStatus(isAr ? `${stores.length} موقع مسجل · المنطقة المعروضة` : `${stores.length} map listing${stores.length === 1 ? '' : 's'} · visible area`);
      render();
    }).catch(error => {
      if (error.name !== 'AbortError') setStatus(isAr ? 'تعذر تحميل هذه المنطقة من الخريطة' : 'Could not load this map area', 'error');
    });
  });
  $('#loadMoreStores').addEventListener('click', () => { if (!loggedIn()) return; pageSize += 6; render(); });
  storeList.addEventListener('click', event => {
    const action = event.target.closest('[data-store-action]');
    if (action && !loggedIn()) event.preventDefault();
    const card = event.target.closest('[data-store-id]');
    if (card && !action) storeMarkers.get(card.dataset.storeId)?.openPopup();
  });
  map.on('click', () => { if (window.innerWidth < 980) map.scrollWheelZoom.disable(); });
  setTimeout(() => map.invalidateSize(), 120);

  document.addEventListener('agrismart:languagechange', () => {
    const isAr = isArabic();
    allStores.forEach(store => {
      if (store.nameAr) store.name = isAr ? store.nameAr : (store.nameEn || store.name);
      if (store.addressAr) store.address = isAr ? store.addressAr : (store.addressEn || store.address);
      if (store.tags?.verified) store.tags.verified = isAr ? 'مشتل معتمد من أجري سمارت' : 'Agrismart Partner';
    });
    render();
    if (allStores.length) {
      const currentCityName = getCityName(activeArea);
      setStatus(isAr ? `${allStores.length} موقع مسجل · ${currentCityName}` : `${allStores.length} map listing${allStores.length === 1 ? '' : 's'} · ${cityData[activeArea]?.name || activeArea}`);
    }
  });

  loadArea('amman', 10, false);
})();

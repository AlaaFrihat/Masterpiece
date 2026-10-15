/**
 * Agrismart - Merchant Profile & Storefront Customizer
 */

(() => {
  const SESSION_KEY = 'agrismartSession';
  const PROFILE_KEY = 'agrismartMerchantStoreProfile';

  const isArabic = () => document.documentElement.lang === 'ar';

  const DEFAULT_PROFILE = {
    id: 'rawabi',
    name: 'Al-Rawabi Botanical Nursery',
    nameAr: 'مشتل الروابي النباتي',
    owner: 'Eng. Tariq Al-Rawabi',
    category: 'exotic',
    tagline: 'Specializing in certified Mediterranean specimens, acclimated rare aroids, organic seedling starters, and artisan clay pottery since 2018.',
    taglineAr: 'متخصصون في الشتلات المتوسطية المعتمدة، نباتات الأرويد النادرة، البذور العضوية، ومراكن الفخار اليدوية منذ عام ٢٠١٨.',
    city: 'Amman - Gardens',
    cityAr: 'عمان - الجاردنز',
    address: 'Wasfi Al-Tal St, Gardens, Amman, Jordan',
    lat: 31.9881,
    lng: 35.8655,
    phone: '+962 7 9811 2233',
    whatsapp: '+962 7 9811 2233',
    email: 'wholesale@alrawabi-nursery.jo',
    cover: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&auto=format&fit=crop&q=80',
    avatar: 'R',
    avatarColor: 'linear-gradient(135deg, #10b951, #028532)',
    specialties: ['Mediterranean Flora', 'Acclimated Aroids', 'Artisan Pottery', 'Greenhouse Pickup'],
    specialtiesAr: ['نباتات متوسطية', 'أرويد متأقلم', 'فخار يدوي', 'استلام من البيت الزجاجي'],
    deliveryTime: 'Same-day Amman Dispatch',
    deliveryTimeAr: 'توصيل في نفس اليوم داخل عمان',
    pickupNote: 'Greenhouse pickup available daily from 9:00 AM to 7:00 PM at our Wasfi Al-Tal greenhouse facility.',
    pickupNoteAr: 'متاح الاستلام الذاتي يومياً من ٩:٠٠ صباحاً حتى ٧:٠٠ مساءً من بيتنا الزجاجي في شارع وصفي التل.',
    regNo: 'JO-REG-88291',
    taxId: 'TAX-99214-JO',
    payoutMethod: 'cliq',
    cliqAlias: 'RAWABI-PLANTS',
    bankName: 'Arab Bank - Jordan',
    iban: 'JO94 ARAB 0120 0000 8829 1102 4401',
    hours: 'Sat - Thu: 8:30 AM - 7:30 PM, Fri: 1:30 PM - 7:00 PM',
    hoursAr: 'السبت - الخميس: ٨:٣٠ ص - ٧:٣٠ م، الجمعة: ١:٣٠ م - ٧:٠٠ م',
    instagram: '@alrawabi.botanical',
    facebook: 'fb.com/alrawabi.nursery.jo',
    followers: 1420,
    dispatched: '1,420+ fulfilled orders',
    vacationMode: false,
    vacationReturn: '',
    vacationNote: 'Our greenhouse is currently undergoing seasonal soil conditioning and propagation. Browsing is open; instant order fulfillment will resume shortly.',
    vacationNoteAr: 'المشتل في فترة جرد زراعي وإكثار موسمي. تصفح النباتات متاح وسيتم استئناف تسليم الطلبات قريباً.',
    announcementActive: true,
    announcement: '🌿 Spring Nursery Fair: 15% off all Mediterranean trees and indoor aroids this week!',
    announcementAr: '🌿 مهرجان الربيع النباتي: خصم ١٥٪ على جميع أشجار البحر المتوسط ونباتات الأرويد هذا الأسبوع!'
  };

  function getSavedProfile() {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  function saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('agrismart:store-profile-updated', { detail: profile }));
    document.dispatchEvent(new CustomEvent('agrismart:store-profile-updated', { detail: profile }));
  }

  function showToast(message, isError = false) {
    let toast = document.getElementById('merchantToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'merchantToast';
      toast.style.cssText = 'position:fixed;bottom:24px;inset-inline-end:24px;padding:12px 22px;border-radius:12px;background:#17231c;color:#fff;font-weight:600;font-size:0.92rem;box-shadow:0 8px 24px rgba(0,0,0,0.25);z-index:9999;transition:all 0.3s ease;opacity:0;transform:translateY(10px);pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = isError ? '#dc2626' : '#10b951';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 3200);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Session Authentication
    const session = (() => {
      try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
      catch { return null; }
    })();

    if (!session) {
      location.replace('login.html?required=1');
      return;
    }

    let profile = getSavedProfile();

    // If session has business name, sync it
    if (session.businessName && session.businessName !== 'Al-Rawabi Botanical Nursery' && session.businessName !== 'مشتل الروابي النباتي') {
      profile.name = session.businessName;
    }

    // 2. Subtabs Switching
    let mapInstance = null;
    let markerInstance = null;

    const subtabButtons = document.querySelectorAll('.profile-subtab-btn');
    const subtabPanels = document.querySelectorAll('.profile-section-panel');

    subtabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        subtabButtons.forEach(b => b.classList.remove('is-active'));
        subtabPanels.forEach(p => p.classList.remove('is-active'));

        btn.classList.add('is-active');
        const panel = document.getElementById(`panel-${target}`);
        if (panel) panel.classList.add('is-active');

        // Refresh Leaflet size when location panel becomes visible
        if (target === 'location' && mapInstance) {
          setTimeout(() => {
            mapInstance.invalidateSize();
            if (profile.lat && profile.lng) {
              mapInstance.setView([profile.lat, profile.lng], mapInstance.getZoom());
            }
          }, 120);
        }
      });
    });

    // 3. Populate Form Fields
    const el = id => document.getElementById(id);

    function populateForm() {
      if (el('profileStoreName')) el('profileStoreName').value = profile.name || '';
      if (el('profileStoreNameAr')) el('profileStoreNameAr').value = profile.nameAr || '';
      if (el('profileOwnerName')) el('profileOwnerName').value = profile.owner || '';
      if (el('profilePhone')) el('profilePhone').value = profile.phone || '';
      if (el('profileWhatsapp')) el('profileWhatsapp').value = profile.whatsapp || '';
      if (el('profileEmail')) el('profileEmail').value = profile.email || '';
      if (el('profileTagline')) el('profileTagline').value = profile.tagline || '';
      if (el('profileTaglineAr')) el('profileTaglineAr').value = profile.taglineAr || '';
      if (el('profileCategory')) el('profileCategory').value = profile.category || 'exotic';
      if (el('profileCoverUrl')) el('profileCoverUrl').value = profile.cover || '';
      if (el('profileAvatarLetter')) el('profileAvatarLetter').value = profile.avatar || 'R';
      if (el('profileCity')) el('profileCity').value = profile.city || '';
      if (el('profileCityAr')) el('profileCityAr').value = profile.cityAr || '';
      if (el('profileAddress')) el('profileAddress').value = profile.address || '';
      if (el('profileLat')) el('profileLat').value = (profile.lat || 31.9881).toFixed(6);
      if (el('profileLng')) el('profileLng').value = (profile.lng || 35.8655).toFixed(6);
      if (el('profilePickupNote')) el('profilePickupNote').value = profile.pickupNote || '';
      if (el('profileDeliveryTime')) el('profileDeliveryTime').value = profile.deliveryTime || 'Same-day Amman Dispatch';
      if (el('profileRegNo')) el('profileRegNo').value = profile.regNo || '';
      if (el('profileTaxId')) el('profileTaxId').value = profile.taxId || '';
      if (el('profilePayoutMethod')) el('profilePayoutMethod').value = profile.payoutMethod || 'cliq';
      if (el('profileCliqAlias')) el('profileCliqAlias').value = profile.cliqAlias || '';
      if (el('profileBankName')) el('profileBankName').value = profile.bankName || '';
      if (el('profileIban')) el('profileIban').value = profile.iban || '';
      if (el('profileHours')) el('profileHours').value = profile.hours || '';
      if (el('profileInstagram')) el('profileInstagram').value = profile.instagram || '';
      if (el('profileFacebook')) el('profileFacebook').value = profile.facebook || '';

      // Vacation Mode & Announcement Fields
      const vacCheckbox = el('profileVacationMode');
      if (vacCheckbox) {
        vacCheckbox.checked = !!profile.vacationMode;
        const vacCard = el('vacationSettingCard');
        const vacDetails = el('vacationDetailsSection');
        const vacStatus = el('vacationStatusText');
        if (vacCard) vacCard.classList.toggle('is-active-vacation', !!profile.vacationMode);
        if (vacDetails) vacDetails.style.display = profile.vacationMode ? 'block' : 'none';
        if (vacStatus) {
          vacStatus.textContent = profile.vacationMode
            ? (isArabic() ? 'إجازة / مغلق مؤقتاً' : 'Vacation / Paused')
            : (isArabic() ? 'مفتوح للطلبات' : 'Open for Orders');
          vacStatus.style.color = profile.vacationMode ? '#f59e0b' : '#10b951';
        }
      }
      if (el('profileVacationReturn')) el('profileVacationReturn').value = profile.vacationReturn || '';
      if (el('profileVacationNote')) el('profileVacationNote').value = profile.vacationNote || '';
      if (el('profileVacationNoteAr')) el('profileVacationNoteAr').value = profile.vacationNoteAr || '';

      if (el('profileAnnouncementActive')) el('profileAnnouncementActive').checked = profile.announcementActive !== false;
      if (el('profileAnnouncement')) el('profileAnnouncement').value = profile.announcement || '';
      if (el('profileAnnouncementAr')) el('profileAnnouncementAr').value = profile.announcementAr || '';

      // QR Code links update
      const storeUrl = `${window.location.origin}${window.location.pathname.replace('merchant-profile.html', 'store.html?id=' + (profile.id || 'rawabi'))}`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(storeUrl)}&color=122119`;
      if (el('counterStandQrImg')) el('counterStandQrImg').src = qrApiUrl;
      if (el('printStandQrImg')) el('printStandQrImg').src = qrApiUrl;

      // Preset cover card selection
      document.querySelectorAll('.preset-cover-card').forEach(card => {
        card.classList.toggle('is-selected', card.dataset.url === profile.cover);
      });

      // Avatar color swatch selection
      document.querySelectorAll('.avatar-color-swatch').forEach(swatch => {
        swatch.classList.toggle('is-selected', swatch.dataset.color === profile.avatarColor);
      });

      // Specialties tags
      document.querySelectorAll('.specialty-chip-toggle').forEach(chip => {
        const val = chip.dataset.specialty;
        chip.classList.toggle('is-checked', (profile.specialties || []).includes(val));
      });
    }

    // 4. Live Storefront Preview Renderer
    function updateLivePreview() {
      const isAr = isArabic();

      const nameVal = el('profileStoreName')?.value.trim() || profile.name;
      const nameArVal = el('profileStoreNameAr')?.value.trim() || profile.nameAr;
      const displayName = (isAr && nameArVal) ? nameArVal : nameVal;

      const taglineVal = el('profileTagline')?.value.trim() || profile.tagline;
      const taglineArVal = el('profileTaglineAr')?.value.trim() || profile.taglineAr;
      const displayTagline = (isAr && taglineArVal) ? taglineArVal : taglineVal;

      const cityVal = el('profileCity')?.value.trim() || profile.city;
      const cityArVal = el('profileCityAr')?.value.trim() || profile.cityAr;
      const displayCity = (isAr && cityArVal) ? cityArVal : cityVal;

      const phoneVal = el('profilePhone')?.value.trim() || profile.phone;
      const coverVal = el('profileCoverUrl')?.value.trim() || profile.cover;
      const avatarVal = el('profileAvatarLetter')?.value.trim().charAt(0).toUpperCase() || (displayName.charAt(0).toUpperCase() || 'R');
      const avatarColor = profile.avatarColor || 'linear-gradient(135deg, #10b951, #028532)';

      const deliveryVal = el('profileDeliveryTime')?.value.trim() || profile.deliveryTime;

      // Update Preview Card elements
      const previewCover = el('previewCover');
      if (previewCover && coverVal) previewCover.src = coverVal;

      const previewAvatar = el('previewAvatar');
      if (previewAvatar) {
        previewAvatar.textContent = avatarVal;
        previewAvatar.style.background = avatarColor;
      }

      const previewName = el('previewName');
      if (previewName) previewName.textContent = displayName;

      const previewTagline = el('previewTagline');
      if (previewTagline) previewTagline.textContent = displayTagline;

      const previewCity = el('previewCity');
      if (previewCity) previewCity.textContent = displayCity;

      const previewPhone = el('previewPhone');
      if (previewPhone) previewPhone.textContent = phoneVal;

      const previewDelivery = el('previewDelivery');
      if (previewDelivery) previewDelivery.textContent = deliveryVal;

      // Update Top Strip and Hero Bar too
      const topStripStoreName = el('topStripStoreName');
      if (topStripStoreName) topStripStoreName.textContent = displayName;

      const storeHeroName = el('storeHeroName');
      if (storeHeroName) storeHeroName.textContent = displayName;

      const storeHeroInitial = el('storeHeroInitial');
      if (storeHeroInitial) {
        storeHeroInitial.textContent = avatarVal;
        storeHeroInitial.style.background = avatarColor;
      }

      // Update Preview Card Announcement and Vacation Banners
      const annActive = el('profileAnnouncementActive')?.checked ?? (profile.announcementActive !== false);
      const annVal = isAr
        ? (el('profileAnnouncementAr')?.value.trim() || profile.announcementAr || el('profileAnnouncement')?.value.trim() || profile.announcement)
        : (el('profileAnnouncement')?.value.trim() || profile.announcement);
      const previewAnn = el('previewAnnouncementBanner');
      const previewAnnText = el('previewAnnouncementText');
      if (previewAnn && previewAnnText) {
        if (annActive && annVal) {
          previewAnn.style.display = 'flex';
          previewAnnText.textContent = annVal;
        } else {
          previewAnn.style.display = 'none';
        }
      }

      const vacActive = el('profileVacationMode')?.checked ?? !!profile.vacationMode;
      const previewVac = el('previewVacationBanner');
      const previewVacText = el('previewVacationText');
      if (previewVac && previewVacText) {
        if (vacActive) {
          previewVac.style.display = 'flex';
          const returnDate = el('profileVacationReturn')?.value || profile.vacationReturn;
          previewVacText.textContent = isAr
            ? (returnDate ? `المشتل في إجازة حتى ${returnDate}` : 'وضع الإجازة مفعل')
            : (returnDate ? `On Vacation until ${returnDate}` : 'Vacation Mode Active');
        } else {
          previewVac.style.display = 'none';
        }
      }

      // Update QR Stand Preview Titles
      const qrTitle = el('qrStandStoreTitle');
      if (qrTitle) qrTitle.textContent = displayName;
      const printTitle = el('printStandTitle');
      if (printTitle) printTitle.textContent = displayName;
      const printCity = el('printStandCity');
      if (printCity) printCity.textContent = `${displayCity} · ${el('profileAddress')?.value.trim() || profile.address}`;
    }

    // Initialize Form, Preview, and Map Picker
    populateForm();
    updateLivePreview();
    initMapPicker();

    // Vacation mode checkbox toggle handler
    el('profileVacationMode')?.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const vacCard = el('vacationSettingCard');
      const vacDetails = el('vacationDetailsSection');
      const vacStatus = el('vacationStatusText');
      if (vacCard) vacCard.classList.toggle('is-active-vacation', isChecked);
      if (vacDetails) vacDetails.style.display = isChecked ? 'block' : 'none';
      if (vacStatus) {
        vacStatus.textContent = isChecked
          ? (isArabic() ? 'إجازة / مغلق مؤقتاً' : 'Vacation / Paused')
          : (isArabic() ? 'مفتوح للطلبات' : 'Open for Orders');
        vacStatus.style.color = isChecked ? '#f59e0b' : '#10b951';
      }
      updateLivePreview();
    });

    el('profileAnnouncementActive')?.addEventListener('change', updateLivePreview);
    el('profileAnnouncement')?.addEventListener('input', updateLivePreview);
    el('profileAnnouncementAr')?.addEventListener('input', updateLivePreview);
    el('profileVacationReturn')?.addEventListener('change', updateLivePreview);

    // Print QR Stand
    el('btnPrintQrStand')?.addEventListener('click', () => {
      const root = el('printableStandRoot');
      if (!root) return;
      root.style.display = 'flex';
      window.print();
      setTimeout(() => { root.style.display = 'none'; }, 1000);
    });

    // Download QR Code
    el('btnDownloadQrPng')?.addEventListener('click', () => {
      const qrImg = el('counterStandQrImg');
      if (!qrImg || !qrImg.src) return;
      const a = document.createElement('a');
      a.href = qrImg.src;
      a.download = `agrismart-${profile.id || 'nursery'}-qr-stand.png`;
      a.target = '_blank';
      a.click();
      showToast(isArabic() ? '✓ جاري تنزيل رمز QR للطباعة...' : '✓ Downloading printable QR code...');
    });

    // Copy Storefront Link
    el('btnCopyStoreQrLink')?.addEventListener('click', () => {
      const storeUrl = `${window.location.origin}${window.location.pathname.replace('merchant-profile.html', 'store.html?id=' + (profile.id || 'rawabi'))}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(storeUrl).then(() => {
          showToast(isArabic() ? '✓ تم نسخ رابط المتجر بنجاح!' : '✓ Storefront link copied to clipboard!');
        });
      } else {
        prompt(isArabic() ? 'انسخ الرابط:' : 'Copy link:', storeUrl);
      }
    });

    // ── Interactive Leaflet Map Picker Setup ──
    function initMapPicker() {
      const mapEl = document.getElementById('storeMapPicker');
      if (!mapEl || !window.L) return;

      const currentLat = parseFloat(profile.lat) || 31.9881;
      const currentLng = parseFloat(profile.lng) || 35.8655;

      try {
        mapInstance = L.map(mapEl, {
          scrollWheelZoom: true,
          touchZoom: true
        }).setView([currentLat, currentLng], 14);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
        }).addTo(mapInstance);

        const customPinIcon = L.divIcon({
          className: 'nursery-pin-wrapper',
          html: '<div class="nursery-map-marker-pin"><span>🌿</span></div>',
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -38]
        });

        markerInstance = L.marker([currentLat, currentLng], {
          icon: customPinIcon,
          draggable: true,
          title: profile.name || 'Store Location'
        }).addTo(mapInstance);

        function updateMarkerLocation(lat, lng, pan = false) {
          lat = parseFloat(lat);
          lng = parseFloat(lng);
          if (isNaN(lat) || isNaN(lng)) return;

          profile.lat = lat;
          profile.lng = lng;

          markerInstance.setLatLng([lat, lng]);
          if (pan) mapInstance.setView([lat, lng], mapInstance.getZoom());

          if (el('profileLat')) el('profileLat').value = lat.toFixed(6);
          if (el('profileLng')) el('profileLng').value = lng.toFixed(6);

          const statusEl = el('mapPinStatus');
          if (statusEl) {
            statusEl.textContent = isArabic()
              ? `تم تحديد الموقع: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
              : `Location Pinned: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          }

          const gmapsLink = el('openInGoogleMapsLink');
          if (gmapsLink) {
            gmapsLink.href = `https://maps.google.com/?q=${lat},${lng}`;
          }

          document.querySelectorAll('.btn-city-jump').forEach(btn => {
            const bLat = parseFloat(btn.dataset.lat);
            const bLng = parseFloat(btn.dataset.lng);
            const isNear = Math.abs(bLat - lat) < 0.02 && Math.abs(bLng - lng) < 0.02;
            btn.classList.toggle('is-active', isNear);
          });
        }

        // Drag marker
        markerInstance.on('dragend', (e) => {
          const { lat, lng } = e.target.getLatLng();
          updateMarkerLocation(lat, lng, false);
        });

        // Click on map to place pin
        mapInstance.on('click', (e) => {
          const { lat, lng } = e.latlng;
          updateMarkerLocation(lat, lng, true);
        });

        // Manual coordinate typing
        const onCoordInput = () => {
          const lat = parseFloat(el('profileLat')?.value);
          const lng = parseFloat(el('profileLng')?.value);
          if (!isNaN(lat) && !isNaN(lng)) {
            updateMarkerLocation(lat, lng, true);
          }
        };
        el('profileLat')?.addEventListener('change', onCoordInput);
        el('profileLng')?.addEventListener('change', onCoordInput);

        // City shortcut buttons
        document.querySelectorAll('.btn-city-jump').forEach(btn => {
          btn.addEventListener('click', () => {
            const lat = parseFloat(btn.dataset.lat);
            const lng = parseFloat(btn.dataset.lng);
            if (!isNaN(lat) && !isNaN(lng)) {
              updateMarkerLocation(lat, lng, true);
              const cityName = btn.dataset.city;
              const cityNameAr = btn.dataset.cityAr;
              if (cityName && el('profileCity')) el('profileCity').value = cityName;
              if (cityNameAr && el('profileCityAr')) el('profileCityAr').value = cityNameAr;
              updateLivePreview();
            }
          });
        });

        // GPS Geolocation button
        el('btnGeolocate')?.addEventListener('click', () => {
          if (!navigator.geolocation) {
            alert(isArabic()
              ? 'خاصية تحديد الموقع غير مدعومة في متصفحك.'
              : 'Geolocation is not supported by your browser.');
            return;
          }

          const geoBtn = el('btnGeolocate');
          const origHtml = geoBtn.innerHTML;
          geoBtn.innerHTML = isArabic() ? '<span>⏳ جاري التحديد...</span>' : '<span>⏳ Locating GPS...</span>';
          geoBtn.disabled = true;

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              geoBtn.innerHTML = origHtml;
              geoBtn.disabled = false;
              const userLat = pos.coords.latitude;
              const userLng = pos.coords.longitude;
              updateMarkerLocation(userLat, userLng, true);
              mapInstance.setZoom(16);
              showToast(isArabic()
                ? '✓ تم تحديد موقعك الحالي عبر GPS بنجاح!'
                : '✓ Current GPS location acquired!');
            },
            (err) => {
              geoBtn.innerHTML = origHtml;
              geoBtn.disabled = false;
              alert(isArabic()
                ? 'تعذر الوصول إلى موقعك. يرجى تفعيل إذن الموقع في المتصفح أو اختيار المدينة من الأزرار.'
                : 'Unable to access your location. Please check location permissions or choose a city shortcut.');
            },
            { enableHighAccuracy: true, timeout: 8000 }
          );
        });

        // Initial setup
        updateMarkerLocation(currentLat, currentLng, false);
      } catch (err) {
        console.warn('Leaflet map initialization skipped or deferred:', err);
      }
    }

    // Preview Card Map Button handler (switch to location subtab and focus map)
    el('previewMapBtn')?.addEventListener('click', () => {
      const locationSubtabBtn = document.querySelector('.profile-subtab-btn[data-tab="location"]');
      if (locationSubtabBtn) {
        locationSubtabBtn.click();
        setTimeout(() => {
          document.getElementById('storeMapPicker')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    });

    // 5. Preset Cover Photo Click Handlers
    document.querySelectorAll('.preset-cover-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.preset-cover-card').forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        const url = card.dataset.url;
        if (el('profileCoverUrl')) el('profileCoverUrl').value = url;
        profile.cover = url;
        updateLivePreview();
      });
    });

    // 6. Avatar Color Swatch Handlers
    document.querySelectorAll('.avatar-color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.avatar-color-swatch').forEach(s => s.classList.remove('is-selected'));
        swatch.classList.add('is-selected');
        profile.avatarColor = swatch.dataset.color;
        updateLivePreview();
      });
    });

    // 7. Specialty Chip Toggles
    document.querySelectorAll('.specialty-chip-toggle').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('is-checked');
        const checkedValues = Array.from(document.querySelectorAll('.specialty-chip-toggle.is-checked'))
          .map(c => c.dataset.specialty);
        profile.specialties = checkedValues;
      });
    });

    // 8. Real-time Live Preview on Input Typing
    const form = el('storeProfileForm');
    form?.addEventListener('input', updateLivePreview);
    form?.addEventListener('change', updateLivePreview);

    // 9. Form Submission (Save Profile)
    form?.addEventListener('submit', event => {
      event.preventDefault();

      const updatedName = el('profileStoreName').value.trim() || profile.name;
      const updatedNameAr = el('profileStoreNameAr').value.trim() || profile.nameAr;
      const updatedOwner = el('profileOwnerName').value.trim();
      const updatedPhone = el('profilePhone').value.trim() || profile.phone;
      const updatedWhatsapp = el('profileWhatsapp').value.trim() || profile.whatsapp;
      const updatedEmail = el('profileEmail').value.trim();
      const updatedTagline = el('profileTagline').value.trim();
      const updatedTaglineAr = el('profileTaglineAr').value.trim();
      const updatedCategory = el('profileCategory').value;
      const updatedCover = el('profileCoverUrl').value.trim() || profile.cover;
      const updatedAvatar = el('profileAvatarLetter').value.trim().charAt(0).toUpperCase() || updatedName.charAt(0).toUpperCase();
      const updatedCity = el('profileCity').value.trim() || profile.city;
      const updatedCityAr = el('profileCityAr').value.trim() || profile.cityAr;
      const updatedAddress = el('profileAddress').value.trim();
      const updatedLat = parseFloat(el('profileLat')?.value) || profile.lat || 31.9881;
      const updatedLng = parseFloat(el('profileLng')?.value) || profile.lng || 35.8655;
      const updatedPickup = el('profilePickupNote').value.trim();
      const updatedDelivery = el('profileDeliveryTime').value.trim();
      const updatedRegNo = el('profileRegNo').value.trim();
      const updatedTaxId = el('profileTaxId').value.trim();
      const updatedPayoutMethod = el('profilePayoutMethod').value;
      const updatedCliq = el('profileCliqAlias').value.trim();
      const updatedBank = el('profileBankName').value.trim();
      const updatedIban = el('profileIban').value.trim();
      const updatedHours = el('profileHours').value.trim();
      const updatedInstagram = el('profileInstagram').value.trim();
      const updatedFacebook = el('profileFacebook').value.trim();

      const updatedVacationMode = el('profileVacationMode') ? el('profileVacationMode').checked : false;
      const updatedVacationReturn = el('profileVacationReturn')?.value || '';
      const updatedVacationNote = el('profileVacationNote')?.value.trim() || '';
      const updatedVacationNoteAr = el('profileVacationNoteAr')?.value.trim() || '';
      const updatedAnnouncementActive = el('profileAnnouncementActive') ? el('profileAnnouncementActive').checked : true;
      const updatedAnnouncement = el('profileAnnouncement')?.value.trim() || '';
      const updatedAnnouncementAr = el('profileAnnouncementAr')?.value.trim() || '';

      const checkedSpecialties = Array.from(document.querySelectorAll('.specialty-chip-toggle.is-checked'))
        .map(c => c.dataset.specialty);

      profile = {
        ...profile,
        name: updatedName,
        nameAr: updatedNameAr,
        owner: updatedOwner,
        phone: updatedPhone,
        whatsapp: updatedWhatsapp,
        email: updatedEmail,
        tagline: updatedTagline,
        taglineAr: updatedTaglineAr,
        category: updatedCategory,
        cover: updatedCover,
        avatar: updatedAvatar,
        city: updatedCity,
        cityAr: updatedCityAr,
        address: updatedAddress,
        lat: updatedLat,
        lng: updatedLng,
        pickupNote: updatedPickup,
        deliveryTime: updatedDelivery,
        regNo: updatedRegNo,
        taxId: updatedTaxId,
        payoutMethod: updatedPayoutMethod,
        cliqAlias: updatedCliq,
        bankName: updatedBank,
        iban: updatedIban,
        hours: updatedHours,
        instagram: updatedInstagram,
        facebook: updatedFacebook,
        vacationMode: updatedVacationMode,
        vacationReturn: updatedVacationReturn,
        vacationNote: updatedVacationNote,
        vacationNoteAr: updatedVacationNoteAr,
        announcementActive: updatedAnnouncementActive,
        announcement: updatedAnnouncement,
        announcementAr: updatedAnnouncementAr,
        specialties: checkedSpecialties.length ? checkedSpecialties : profile.specialties
      };

      // 1. Save to custom profile registry
      saveProfile(profile);

      // 2. Sync essential business data into session
      session.businessName = updatedName;
      session.phone = updatedPhone;
      session.city = updatedCity;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      // 3. Update preview and header
      updateLivePreview();

      showToast(isArabic()
        ? '✓ تم حفظ وتحديث ملف المشتل وموقع الخريطة بنجاح!'
        : '✓ Nursery profile and map location saved successfully!');
    });

    // 10. Language Switcher listener
    const onLanguageChange = () => {
      updateLivePreview();
      const statusEl = el('mapPinStatus');
      if (statusEl && profile.lat && profile.lng) {
        statusEl.textContent = isArabic()
          ? `تم تحديد الموقع: ${profile.lat.toFixed(4)}, ${profile.lng.toFixed(4)}`
          : `Location Pinned: ${profile.lat.toFixed(4)}, ${profile.lng.toFixed(4)}`;
      }
    };
    window.addEventListener('agrismart:languagechange', onLanguageChange);
    document.addEventListener('agrismart:languagechange', onLanguageChange);
  });
})();

/**
 * Agrismart - Merchant Public Storefront Controller
 */
document.addEventListener("DOMContentLoaded", () => {
  const isArabic = () =>
    document.documentElement.lang === "ar" ||
    document.documentElement.getAttribute("dir") === "rtl";

  // 1. Determine active store from URL or merchant profile
  const params = new URLSearchParams(window.location.search);
  const profile = JSON.parse(
    localStorage.getItem("agrismartMerchantProfile") || "{}",
  );
  const storeId = params.get("id") || profile.id || "rawabi";

  const defaultStoreEn = "Al-Rawabi Botanical Nursery";
  const defaultStoreAr = "مشتل الروابي النباتي";

  let baseStore = window.AgrismartStores
    ? window.AgrismartStores.getStoreById(storeId)
    : null;

  if (!baseStore) {
    baseStore = {
      id: "rawabi",
      name: "Al-Rawabi Botanical Nursery",
      nameAr: "مشتل الروابي النباتي",
      avatar: "R",
      avatarColor: "linear-gradient(135deg, #10b951, #028532)",
      cover:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1600&auto=format&fit=crop&q=80",
      tagline:
        "Specializing in certified Mediterranean specimens, acclimated rare aroids, and organic seedling starters since 2018.",
      taglineAr:
        "متخصصون في الشتلات المتوسطية المعتمدة، ونوادر النباتات الداخلية المتأقلمة، والتربة العضوية منذ عام ٢٠١٨.",
      city: "Amman - Gardens",
      cityAr: "عمان - الجاردنز",
      address: "Wasfi Al-Tal St, Gardens, Amman",
      addressAr: "شارع وصفي التل، الجاردنز، عمان",
      phone: "+962 7 9811 2233",
      whatsapp: "+962798112233",
      rating: 4.9,
      reviewsCount: 148,
      followers: 1420,
    };
  }

  // Merge localStorage customizations if available
  const store = Object.assign({}, baseStore, {
    name: profile.storeName || baseStore.name,
    phone: profile.phone || baseStore.phone,
    address: profile.address || baseStore.address,
    city: profile.city || baseStore.city,
    tagline: profile.bio || baseStore.tagline,
    vacationMode:
      profile.vacationMode !== undefined
        ? profile.vacationMode
        : baseStore.vacationMode,
    vacationReturn: profile.vacationReturn || baseStore.vacationReturn,
    announcement: profile.announcement || baseStore.announcement,
    announcementActive:
      profile.announcementActive !== undefined
        ? profile.announcementActive
        : baseStore.announcementActive,
    pickupNote: profile.pickupNote || baseStore.pickupNote,
    pickupNoteAr: profile.pickupNoteAr || baseStore.pickupNoteAr,
  });

  // Top Strip Store Name
  const topStripStoreName = document.getElementById("topStripStoreName");
  if (topStripStoreName) {
    topStripStoreName.textContent =
      isArabic() && store.nameAr ? store.nameAr : store.name;
  }

  // 2. Populate store header & meta
  function updateStoreHeader() {
    const isAr = isArabic();
    const storeName = isAr && store.nameAr ? store.nameAr : store.name;
    const storeCity =
      isAr && store.cityAr ? store.cityAr : store.address || store.city;
    const storeTagline =
      isAr && store.taglineAr ? store.taglineAr : store.tagline;

    document.title = `${storeName} | Agrismart Merchant Hub`;

    const breadcrumbEl = document.getElementById("breadcrumbStoreName");
    if (breadcrumbEl) breadcrumbEl.textContent = storeName;

    const coverEl = document.getElementById("storeCoverImg");
    if (coverEl && store.cover) {
      coverEl.src = store.cover;
      coverEl.alt = storeName;
    }

    const logoEl = document.getElementById("storeLogoBadge");
    if (logoEl) {
      logoEl.textContent = store.avatar || storeName.charAt(0).toUpperCase();
      if (store.avatarColor) logoEl.style.background = store.avatarColor;
    }

    const titleEl = document.getElementById("storeHeaderTitle");
    if (titleEl) titleEl.textContent = storeName;

    const taglineEl = document.getElementById("storeHeaderTagline");
    if (taglineEl) taglineEl.textContent = storeTagline;

    const locEl = document.getElementById("chipStoreLocation");
    if (locEl) locEl.textContent = `📍 ${storeCity}`;

    const phoneEl = document.getElementById("chipStorePhone");
    if (phoneEl) phoneEl.textContent = `📞 ${store.phone}`;

    const ratingEl = document.getElementById("chipStoreRating");
    if (ratingEl)
      ratingEl.textContent = `⭐ ${store.rating} (${store.reviewsCount || 148} ${isAr ? "تقييم" : "reviews"})`;

    const waLink = document.getElementById("storeWhatsAppLink");
    if (waLink && store.whatsapp) {
      waLink.href = `https://wa.me/${store.whatsapp.replace(/[^0-9]/g, "")}`;
    }

    const followersEl = document.getElementById("followersCount");
    if (followersEl)
      followersEl.textContent = (store.followers || 1420).toLocaleString();

    // Vacation Mode Banner
    const vacBanner = document.getElementById("storeVacationBanner");
    if (vacBanner) {
      if (store.vacationMode) {
        vacBanner.style.display = "flex";
        const vacTitleEl = document.getElementById("storeVacationTitle");
        const vacDescEl = document.getElementById("storeVacationDesc");
        if (vacTitleEl) {
          vacTitleEl.textContent = isAr
            ? store.vacationReturn
              ? `المشتل في إجازة / صيانة حتى ${store.vacationReturn}`
              : "المشتل في فترة صيانة زراعية مؤقتة"
            : store.vacationReturn
              ? `Nursery on Vacation / Maintenance until ${store.vacationReturn}`
              : "Nursery is currently in Maintenance / Vacation Mode";
        }
        if (vacDescEl) {
          vacDescEl.textContent = isAr
            ? store.vacationNoteAr ||
              store.vacationNote ||
              "المشتل في فترة جرد زراعي وتحديث الشتلات. تصفح النباتات متاح وسيتم استئناف تسليم الطلبات قريباً."
            : store.vacationNote ||
              "Our greenhouse staff is currently attending to botanical propagation. Specimen browsing is open; regular order fulfillment will resume shortly.";
        }
      } else {
        vacBanner.style.display = "none";
      }
    }

    // Promotional Announcement Banner
    const annBanner = document.getElementById("storeAnnouncementBanner");
    if (annBanner) {
      const annText =
        isAr && store.announcementAr
          ? store.announcementAr
          : store.announcement;
      if (store.announcementActive !== false && annText) {
        annBanner.style.display = "flex";
        const annTextEl = document.getElementById("storeAnnouncementText");
        if (annTextEl) annTextEl.textContent = annText;
      } else {
        annBanner.style.display = "none";
      }
    }

    // Pickup Note
    const pickupEl = document.getElementById("pickupNoteText");
    if (pickupEl) {
      pickupEl.textContent =
        isAr && store.pickupNoteAr
          ? store.pickupNoteAr
          : store.pickupNote ||
            "Prefer selecting your plant in person? Pick up at our Amman greenhouse anytime during opening hours.";
    }

    const expertTitle = document.getElementById("expertModalTitle");
    if (expertTitle) {
      expertTitle.textContent = isAr
        ? `🌿 استشارة الخبير الزراعي في ${storeName}`
        : `🌿 Ask the Nursery Horticulturist at ${storeName}`;
    }
  }

  // 3. Render Catalog
  function renderCatalog() {
    const grid = document.getElementById("storefrontCatalogGrid");
    if (!grid || !window.AgrismartStores) return;

    const isAr = isArabic();
    const search = (document.getElementById("nurserySearchInput")?.value || "")
      .toLowerCase()
      .trim();
    const cat =
      document.getElementById("nurseryCategoryFilter")?.value || "all";
    const products = window.AgrismartStores.getStoreProducts(storeId);

    const filtered = products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search) ||
        (p.nameAr && p.nameAr.includes(search)) ||
        (p.botanical && p.botanical.toLowerCase().includes(search));
      const matchCat = cat === "all" || p.category === cat;
      return matchSearch && matchCat;
    });

    const countEl = document.getElementById("catalogResultCount");
    if (countEl) {
      countEl.textContent = isAr
        ? `عرض ${filtered.length} من نباتات ومستلزمات هذا المشتل`
        : `Showing ${filtered.length} nursery specimens`;
    }

    if (!filtered.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; padding:3.5rem; text-align:center; color:var(--m-text-muted); background:var(--m-surface); border-radius:var(--m-radius); border:1px solid var(--m-border);">
          <span style="font-size:2.5rem; display:block; margin-bottom:0.5rem;">🌱</span>
          <p style="margin:0;">${isAr ? "لا توجد نباتات تطابق البحث في هذا المشتل حالياً." : "No specimens found matching your search in this nursery."}</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered
      .map((item) => {
        const itemName = isAr && item.nameAr ? item.nameAr : item.name;
        const itemTraits =
          isAr && item.traitsAr
            ? item.traitsAr
            : item.traits || "Botanical Specimen";

        return `
        <article class="storefront-card">
          <img class="storefront-card__img" src="${item.image}" alt="${itemName}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&auto=format&fit=crop&q=80';">
          <div class="storefront-card__body">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="category-tag">${item.category}</span>
              <span style="font-size:0.75rem; color:#10b951; font-weight:700;">● In Greenhouse</span>
            </div>
            <h3 style="margin:0; font-size:1.15rem; font-weight:700; color:var(--m-text);">${itemName}</h3>
            <small style="color:var(--m-text-muted); font-style:italic;">${item.botanical || "Botanical Specimen"}</small>
            <p style="font-size:0.85rem; color:var(--m-text-muted); margin:0.3rem 0 auto;">${itemTraits}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem; border-top:1px solid var(--m-border); padding-top:0.75rem;">
              <div>
                <span style="font-size:0.75rem; color:var(--m-text-muted); display:block;">Retail Price</span>
                <strong style="font-size:1.25rem; color:var(--m-primary-dark);">$${Number(item.price).toFixed(2)}</strong>
              </div>
              <a href="merchant-dashboard.html#inventory" class="btn-merchant btn-merchant--outline" style="font-size:0.8rem; padding:0.4rem 0.8rem;" title="Edit product in inventory">
                ✏️ Edit Item
              </a>
            </div>
          </div>
        </article>
      `;
      })
      .join("");
  }

  updateStoreHeader();
  renderCatalog();

  document
    .getElementById("nurserySearchInput")
    ?.addEventListener("input", renderCatalog);
  document
    .getElementById("nurseryCategoryFilter")
    ?.addEventListener("change", renderCatalog);

  // 4. Copy Public Store Link Button
  const shareBtn = document.getElementById("shareStoreBtn");
  const copyPublicLinkBtn = document.getElementById("copyPublicLinkBtn");

  const handleCopyLink = () => {
    const isAr = isArabic();
    const publicUrl = `${window.location.origin}${window.location.pathname.replace("merchant-store.html", "store.html?id=" + storeId)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl);
      alert(
        isAr
          ? "🔗 تم نسخ رابط المتجر العام للزبائن إلى الحافظة!"
          : "🔗 Public store URL copied to clipboard!",
      );
    } else {
      prompt(
        isAr ? "انسخ رابط المتجر العام:" : "Copy public store URL:",
        publicUrl,
      );
    }
  };

  shareBtn?.addEventListener("click", handleCopyLink);
  copyPublicLinkBtn?.addEventListener("click", handleCopyLink);

  // 5. Follow Nursery Button
  const followBtn = document.getElementById("followStoreBtn");
  const followersEl = document.getElementById("followersCount");
  let isFollowing = false;
  let count = store ? store.followers || 1420 : 1420;

  followBtn?.addEventListener("click", () => {
    isFollowing = !isFollowing;
    count = isFollowing ? count + 1 : count - 1;
    if (followersEl) followersEl.textContent = count.toLocaleString();
    const isAr = isArabic();
    followBtn.innerHTML = isFollowing
      ? isAr
        ? `✓ تتم متابعة المشتل (${count.toLocaleString()})`
        : `✓ Following Nursery (${count.toLocaleString()})`
      : isAr
        ? `❤️ متابعة المشتل (${count.toLocaleString()})`
        : `❤️ Follow Nursery (${count.toLocaleString()})`;
  });

  // 6. Ask Expert Modal
  const modal = document.getElementById("expertModal");
  const openBtn = document.getElementById("askExpertBtn");
  const closeBtn = document.getElementById("closeExpertModalBtn");
  const cancelBtn = document.getElementById("cancelExpertModalBtn");
  const form = document.getElementById("expertForm");

  const closeModal = () => modal?.classList.remove("is-open");
  openBtn?.addEventListener("click", () => modal?.classList.add("is-open"));
  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const plant = document.getElementById("inquiryPlant").value;
    const storeName =
      isArabic() && store && store.nameAr
        ? store.nameAr
        : store
          ? store.name
          : "Nursery";
    closeModal();
    form.reset();
    alert(
      isArabic()
        ? `🌿 شكراً لك! استلم الفريق الزراعي في ${storeName} سؤالك حول "${plant}" وسيتواصلون معك عبر واتساب قريباً.`
        : `🌿 Thank you! The greenhouse team at ${storeName} received your question about "${plant}" and will WhatsApp you shortly.`,
    );
  });

  // 7. Re-render on language change
  const handleLanguageChange = () => {
    updateStoreHeader();
    renderCatalog();
  };
  window.addEventListener("agrismart:languagechange", handleLanguageChange);
  document.addEventListener("agrismart:languagechange", handleLanguageChange);
  window.addEventListener("languagechange", handleLanguageChange);
});

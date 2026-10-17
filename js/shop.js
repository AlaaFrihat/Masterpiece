/* ─── Shop Page Script ─────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Prepend merchant listed products if available
  const merchantProducts = (() => {
    try {
      const list = JSON.parse(
        localStorage.getItem("agrismartMerchantProducts") || "[]",
      );
      let changed = false;
      list.forEach((p) => {
        if (p.id === "merch_4" && (p.image?.includes("photo-1592417817098") || !p.image)) {
          p.image = "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&auto=format&fit=crop&q=80";
          changed = true;
        }
      });
      if (changed) {
        try { localStorage.setItem("agrismartMerchantProducts", JSON.stringify(list)); } catch (_) {}
      }
      return list;
    } catch {
      return [];
    }
  })();

  const grid = document.querySelector(".product-grid");
  if (grid && merchantProducts.length) {
    merchantProducts.forEach((mp, i) => {
      const card = document.createElement("div");
      card.className = "shop-card is-merchant-product";
      card.style.cursor = "pointer";
      card.dataset.categories = mp.category || "indoor";
      card.dataset.price = String(mp.price);
      card.dataset.rating = "4.9";
      card.dataset.potSize = "medium";
      card.dataset.availability = mp.status || "in-stock";
      card.dataset.originalOrder = String(-10 - i);
      const imgSrc = (mp.id === "merch_4" && mp.image?.includes("photo-1592417817098"))
        ? "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&auto=format&fit=crop&q=80"
        : (mp.image || "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&auto=format&fit=crop&q=80");
      card.innerHTML = `
        <div class="shop-card__img-wrap">
          <a href="store.html" class="shop-card__tag" style="background:#10b951;color:#fff;text-decoration:none;z-index:2;" title="View Nursery Storefront">🏪 Al-Rawabi Nursery</a>
          <button class="shop-card__wish"><i data-lucide="heart"></i></button>
          <img class="shop-card__img" alt="${mp.name}" src="${imgSrc}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&auto=format&fit=crop&q=80';" />
        </div>
        <div class="shop-card__header">
          <h4 class="shop-card__name">${mp.name}</h4>
          <small style="color:#627468;font-size:0.75rem;display:block;">${mp.botanical || "Certified Nursery Specimen"}</small>
        </div>
        <div class="shop-card__meta">
          <i class="shop-card__star" data-lucide="star"></i>
          <span class="shop-card__rating">4.9</span><span>(24)</span><span>·</span><span>${mp.sold || 12} sold</span>
        </div>
        <div class="shop-card__footer">
          <span class="shop-card__price">$${Number(mp.price).toFixed(2)}</span>
        </div>
      `;
      grid.prepend(card);
    });
    if (window.lucide) window.lucide.createIcons();
  }

  // Hook up wishlist buttons for cards
  const cards = document.querySelectorAll(".shop-card");
  const roomCategories = [
    ["workspace"],
    ["bedroom", "bathroom"],
    ["bedroom", "workspace"],
    ["bedroom", "workspace"],
    ["workspace"],
    ["bedroom", "bathroom"],
    ["bedroom", "workspace"],
    ["bedroom"],
    ["outdoor"],
    ["bedroom", "workspace"],
    ["workspace"],
    ["workspace"],
  ];
  const potSizes = [
    "large",
    "medium",
    "large",
    "medium",
    "medium",
    "small",
    "medium",
    "small",
    "large",
    "small",
    "small",
    "medium",
  ];
  const outOfStock = new Set(["Hibiscus", "Ficus"]);
  cards.forEach((card, index) => {
    const nameEl = card.querySelector(".shop-card__name");
    const priceEl = card.querySelector(".shop-card__price");
    const imgEl = card.querySelector(".shop-card__img");
    const wishBtn = card.querySelector(".shop-card__wish");
    const price = priceEl
      ? parseFloat(priceEl.textContent.replace("$", ""))
      : NaN;
    const image = imgEl ? imgEl.src : "";
    const id = "shop_" + index;

    const primaryCategory =
      card.querySelector(".shop-card__tag")?.textContent.trim().toLowerCase() ||
      "indoor";
    card.dataset.categories = [
      ...new Set([primaryCategory, ...(roomCategories[index] || [])]),
    ].join(" ");
    card.dataset.price = String(price);
    card.dataset.rating =
      card.querySelector(".shop-card__rating")?.textContent.trim() || "0";
    card.dataset.potSize = potSizes[index] || "medium";
    card.dataset.availability = outOfStock.has(nameEl?.textContent.trim())
      ? "out-of-stock"
      : "in-stock";
    card.dataset.originalOrder = String(index);
    if (card.dataset.availability === "out-of-stock") {
      const badge = document.createElement("span");
      badge.className = "shop-card__stock-badge";
      badge.textContent = "Out of Stock";
      card.querySelector(".shop-card__img-wrap")?.append(badge);
    }

    if (nameEl && priceEl && imgEl && !card.querySelector(".shop-card__add")) {
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "shop-card__add";
      addButton.textContent = "Add to Cart";
      addButton.setAttribute(
        "aria-label",
        `Add ${nameEl.textContent.trim()} to cart`,
      );
      if (card.dataset.availability === "out-of-stock") {
        addButton.disabled = true;
        addButton.textContent = "Out of Stock";
      }
      addButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (typeof addToCart === "function") {
          addToCart(id, nameEl.textContent.trim(), price, image);
        }
      });
      card.appendChild(addButton);
    }

    if (nameEl && priceEl && imgEl && wishBtn) {
      const name = nameEl.textContent;
      const price = parseFloat(priceEl.textContent.replace("$", ""));
      const img = imgEl.src;
      const id = "shop_card_" + index; // Generate ID for hardcoded card

      wishBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent card click (navigation)
        e.preventDefault();
        if (
          window.AgrismartAuth &&
          !window.AgrismartAuth.requireLogin("your wishlist")
        )
          return;

        if (typeof wishlist !== "undefined") {
          const filled = wishlist[id] ? true : false;
          const svg = wishBtn.querySelector("svg");

          if (filled) {
            delete wishlist[id];
            if (svg) {
              svg.setAttribute("fill", "none");
              svg.setAttribute("stroke", "currentColor");
            }
            if (typeof showToast === "function")
              showToast("Item removed from wishlist.");
          } else {
            wishlist[id] = { name, price, img };
            if (svg) {
              svg.setAttribute("fill", "#f84141");
              svg.setAttribute("stroke", "#f84141");
            }
            if (typeof showToast === "function")
              showToast("❤️ Added to wishlist!", "success");
          }

          if (typeof saveWishlist === "function") saveWishlist();
          if (typeof updateWishUI === "function") updateWishUI();
        }
      });

      // Initialize state after Lucide renders SVGs
      setTimeout(() => {
        if (typeof wishlist !== "undefined" && wishlist[id]) {
          const svg = wishBtn.querySelector("svg");
          if (svg) {
            svg.setAttribute("fill", "#f84141");
            svg.setAttribute("stroke", "#f84141");
          }
        }
      }, 100);
    }
  });

  const categoryFilters = [...document.querySelectorAll(".category-filter")];
  const ratingFilters = [
    ...document.querySelectorAll(".review-stars__checkbox"),
  ];
  const sizeFilters = [...document.querySelectorAll(".pot-size-filter")];
  const availabilityFilters = [
    ...document.querySelectorAll(".availability-filter"),
  ];
  const minRange = document.getElementById("shopMinPrice");
  const maxRange = document.getElementById("shopMaxPrice");
  const minLabel = document.getElementById("shopMinPriceLabel");
  const maxLabel = document.getElementById("shopMaxPriceLabel");
  const priceFill = document.getElementById("shopPriceFill");
  const resultLabel = document.getElementById("shopResultCount");
  const activeFilters = document.getElementById("shopActiveFilters");
  const emptyState = document.getElementById("shopEmptyState");
  const sort = document.getElementById("shopSort");
  const isArabic = () => document.documentElement.lang === "ar";
  const money = (value) => `$${Number(value).toFixed(2)}`;

  function updatePriceLabels() {
    minLabel.value = money(minRange.value);
    maxLabel.value = money(maxRange.value);
    const lower = (Number(minRange.value) / Number(minRange.max)) * 100;
    const upper = (Number(maxRange.value) / Number(maxRange.max)) * 100;
    priceFill.style.left = `${lower}%`;
    priceFill.style.width = `${Math.max(0, upper - lower)}%`;
  }

  function renderActiveFilters() {
    activeFilters.innerHTML =
      '<span class="sort-bar__filter-label">Active Filter:</span>';
    const chips = [
      ...categoryFilters
        .filter((input) => input.checked)
        .map((input) => ({
          label: input.nextElementSibling?.textContent.trim() || input.value,
          input,
        })),
      ...ratingFilters
        .filter((input) => input.checked)
        .map((input) => ({
          label: isArabic() ? `${input.value}+ نجوم` : `${input.value}+ Stars`,
          input,
        })),
      ...sizeFilters
        .filter((input) => input.checked)
        .map((input) => ({
          label: isArabic()
            ? { small: "أصيص صغير", medium: "أصيص متوسط", large: "أصيص كبير" }[
                input.value
              ]
            : `${input.value[0].toUpperCase()}${input.value.slice(1)} pot`,
          input,
        })),
      ...availabilityFilters
        .filter((input) => input.checked)
        .map((input) => ({
          label: isArabic()
            ? input.value === "in-stock"
              ? "متوفر"
              : "غير متوفر"
            : input.value === "in-stock"
              ? "In Stock"
              : "Out of Stock",
          input,
        })),
    ];
    if (
      Number(minRange.value) > Number(minRange.min) ||
      Number(maxRange.value) < Number(maxRange.max)
    ) {
      chips.push({
        label: `${money(minRange.value)}–${money(maxRange.value)}`,
        clearPrice: true,
      });
    }
    chips.forEach((chip) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sort-bar__filter-chip";
      button.textContent = `${chip.label} ×`;
      button.setAttribute("aria-label", `Remove ${chip.label} filter`);
      button.addEventListener("click", () => {
        if (chip.clearPrice) {
          minRange.value = minRange.min;
          maxRange.value = maxRange.max;
          updatePriceLabels();
        } else chip.input.checked = false;
        updateShopResults();
      });
      activeFilters.append(button);
    });
  }

  function updateShopResults() {
    const categories = categoryFilters
      .filter((input) => input.checked)
      .map((input) => input.value);
    const ratings = ratingFilters
      .filter((input) => input.checked)
      .map((input) => Number(input.value));
    const sizes = sizeFilters
      .filter((input) => input.checked)
      .map((input) => input.value);
    const availability = availabilityFilters
      .filter((input) => input.checked)
      .map((input) => input.value);
    const min = Number(minRange.value);
    const max = Number(maxRange.value);
    let visibleCount = 0;

    [...cards].forEach((card) => {
      const cardCategories = card.dataset.categories.split(" ");
      const matches =
        (!categories.length ||
          categories.some((category) => cardCategories.includes(category))) &&
        Number(card.dataset.price) >= min &&
        Number(card.dataset.price) <= max &&
        (!ratings.length ||
          ratings.some((rating) => Number(card.dataset.rating) >= rating)) &&
        (!sizes.length || sizes.includes(card.dataset.potSize)) &&
        (!availability.length ||
          availability.includes(card.dataset.availability));
      card.classList.toggle("is-filtered-out", !matches);
      if (matches) visibleCount += 1;
    });

    const sortOrder = sort.value;
    [...cards]
      .sort((a, b) => {
        if (sortOrder === "price-asc")
          return Number(a.dataset.price) - Number(b.dataset.price);
        if (sortOrder === "price-desc")
          return Number(b.dataset.price) - Number(a.dataset.price);
        if (sortOrder === "rating")
          return Number(b.dataset.rating) - Number(a.dataset.rating);
        return (
          Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder)
        );
      })
      .forEach((card) => card.parentNode.append(card));

    resultLabel.textContent = isArabic()
      ? `عرض ${visibleCount} من أصل ${cards.length} نبتة`
      : `Showing ${visibleCount} of ${cards.length} plants`;
    emptyState.hidden = visibleCount !== 0;
    document.querySelector(".pagination").hidden = visibleCount === 0;
    categoryFilters.forEach((input) => {
      const label = input.closest(".filter-label");
      label
        ?.querySelector(".filter-label__text--active")
        ?.classList.remove("filter-label__text--active");
      const text = label?.querySelector("span:not(.filter-indicator)");
      if (input.checked) text?.classList.add("filter-label__text--active");
      const indicator = label?.querySelector(".filter-indicator");
      if (indicator) indicator.hidden = !input.checked;
    });
    updatePriceLabels();
    renderActiveFilters();
  }

  [
    ...categoryFilters,
    ...ratingFilters,
    ...sizeFilters,
    ...availabilityFilters,
  ].forEach((input) => input.addEventListener("change", updateShopResults));
  minRange.addEventListener("input", () => {
    if (Number(minRange.value) > Number(maxRange.value))
      minRange.value = maxRange.value;
    updateShopResults();
  });
  maxRange.addEventListener("input", () => {
    if (Number(maxRange.value) < Number(minRange.value))
      maxRange.value = minRange.value;
    updateShopResults();
  });
  sort.addEventListener("change", updateShopResults);
  document.addEventListener("agrismart:languagechange", updateShopResults);
  document.getElementById("clearShopFilters").addEventListener("click", () => {
    [
      ...categoryFilters,
      ...ratingFilters,
      ...sizeFilters,
      ...availabilityFilters,
    ].forEach((input) => {
      input.checked = false;
    });
    minRange.value = minRange.min;
    maxRange.value = maxRange.max;
    sort.value = "default";
    updateShopResults();
  });
  updateShopResults();
});

document.addEventListener("DOMContentLoaded", () => {
  const toast = (msg) => {
    const el = document.getElementById("inventoryToast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("show"), 2400);
  };

  const getLang = () =>
    localStorage.getItem("agrismartLanguage") ||
    localStorage.getItem("agrismartAdminLang") ||
    "en";

  const initialPlants = [
    [
      "Fiddle Leaf Fig",
      "Ficus lyrata",
      "Indoor Room",
      "Foliage Plants",
      "High",
      "1x/wk",
      "$28.99",
      "48 in stock",
      "BESTSELLER",
      520,
      true,
    ],
    [
      "Snake Plant",
      "Sansevieria trifasciata",
      "Workspace",
      "Air-Purifying",
      "Low/Mod",
      "1x/2wk",
      "$22.50",
      "32 in stock",
      "HARDY",
      410,
      true,
    ],
    [
      "ZZ Plant",
      "Zamioculcas zamiifolia",
      "Bedroom",
      "Foliage Plants",
      "Low",
      "Dry",
      "$24.00",
      "26 in stock",
      "",
      350,
      true,
    ],
    [
      "Peace Lily",
      "Spathiphyllum wallisii",
      "Bathroom",
      "Tropical Flowering",
      "Medium",
      "2x/wk",
      "$18.50",
      "8 left (Low Stock)",
      "",
      280,
      false,
    ],
    [
      "Monstera Deliciosa",
      "Monstera deliciosa",
      "Indoor Room",
      "Foliage Plants",
      "Indirect",
      "1x/wk",
      "$25.99",
      "0 units (Sold Out)",
      "DEPLETED",
      450,
      false,
    ],
    [
      "Phalaenopsis Orchid",
      "Orchidaceae",
      "Outdoor / Balcony",
      "Tropical Flowering",
      "Filtered",
      "Ice Cube/wk",
      "$27.00",
      "19 in stock",
      "50% OFF",
      132,
      false,
    ],
    [
      "Lucky Bamboo",
      "Dracaena sanderiana",
      "Workspace",
      "Air-Purifying",
      "Moderate",
      "Hydro",
      "$22.00",
      "40 in stock",
      "",
      150,
      false,
    ],
    [
      "French Lavender",
      "Lavandula dentata",
      "Outdoor / Balcony",
      "Flowering & Herbs",
      "Full Sun",
      "Low",
      "$15.00",
      "35 in stock",
      "50% OFF",
      300,
      false,
    ],
    [
      "Aloe Vera Medicinal",
      "Aloe barbadensis",
      "Workspace",
      "Succulents & Cacti",
      "High Sun",
      "1x/3wk",
      "$14.50",
      "52 in stock",
      "HARDY",
      290,
      false,
    ],
    [
      "Bird of Paradise",
      "Strelitzia nicolai",
      "Indoor Room",
      "Tropical Flowering",
      "High Sun",
      "2x/wk",
      "$45.00",
      "12 in stock",
      "BESTSELLER",
      180,
      false,
    ],
    [
      "Golden Pothos Devil’s Ivy",
      "Epipremnum aureum",
      "Bedroom",
      "Air-Purifying",
      "Low/Mod",
      "1x/wk",
      "$16.00",
      "64 in stock",
      "",
      480,
      false,
    ],
    [
      "Jade Plant Money Tree",
      "Crassula ovata",
      "Workspace",
      "Succulents & Cacti",
      "Bright Sun",
      "1x/2wk",
      "$19.00",
      "28 in stock",
      "HARDY",
      210,
      false,
    ],
  ];

  let plants = [...initialPlants];

  // Filters State
  let searchQuery = "";
  let fastFocus = "all";
  let categoryFilter = "all";
  let roomFilter = "all";
  let stockFilter = "all";

  const rowsContainer = document.getElementById("inventoryRows");
  const selectedCountEl = document.getElementById("selectedCount");
  const selectAllEl = document.getElementById("selectAllCheckbox");
  const metricActiveEl = document.getElementById("metricActiveCount");
  const paginationInfo = document.getElementById("inventoryPaginationInfo");

  const updateSelectedCount = () => {
    const selected = plants.filter((p) => p[10]).length;
    const isAr = getLang() === "ar";
    if (selectedCountEl) {
      selectedCountEl.textContent = isAr
        ? `${selected} عناصر محددة`
        : `${selected} items selected`;
    }
  };

  const getFilteredPlants = () => {
    return plants.filter((p) => {
      const [name, genus, room, category, , , , stock, badge] = p;
      const fullText = `${name} ${genus} ${room} ${category}`.toLowerCase();

      // Search term
      if (searchQuery && !fullText.includes(searchQuery)) return false;

      // Fast Focus
      if (
        fastFocus === "foliage" &&
        !category.toLowerCase().includes("foliage")
      )
        return false;
      if (
        fastFocus === "succulents" &&
        !category.toLowerCase().includes("succulent") &&
        !category.toLowerCase().includes("cacti")
      )
        return false;
      if (
        fastFocus === "flowering" &&
        !category.toLowerCase().includes("flowering")
      )
        return false;
      if (
        fastFocus === "pots" &&
        !category.toLowerCase().includes("pot") &&
        !room.toLowerCase().includes("pot")
      )
        return false;
      if (
        fastFocus === "deals" &&
        !badge.includes("50%") &&
        !badge.includes("OFF")
      )
        return false;

      // Dropdown Category
      if (
        categoryFilter !== "all" &&
        !category.toLowerCase().includes(categoryFilter.toLowerCase())
      )
        return false;

      // Dropdown Room
      if (
        roomFilter !== "all" &&
        !room.toLowerCase().includes(roomFilter.toLowerCase())
      )
        return false;

      // Dropdown Stock
      if (
        stockFilter === "in-stock" &&
        (stock.includes("0 units") || stock.includes("left"))
      )
        return false;
      if (
        stockFilter === "low" &&
        !stock.includes("left") &&
        !stock.includes("Low")
      )
        return false;
      if (
        stockFilter === "depleted" &&
        !stock.includes("0 units") &&
        badge !== "DEPLETED"
      )
        return false;

      return true;
    });
  };

  const render = () => {
    const filtered = getFilteredPlants();
    if (!rowsContainer) return;

    if (filtered.length === 0) {
      const isAr = getLang() === "ar";
      rowsContainer.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:36px;color:#7a867f;font-size:13px;">${isAr ? "لم يتم العثور على نباتات مطابقة لخيارات التصفية." : "No botanical specimens match the active filters."}</td></tr>`;
      if (selectAllEl) selectAllEl.checked = false;
      if (paginationInfo)
        paginationInfo.textContent = isAr
          ? "عرض 0 من 0 شتلة"
          : "Showing 0 of 0 specimens";
      updateSelectedCount();
      return;
    }

    rowsContainer.innerHTML = filtered
      .map((p, i) => {
        const isDepleted = p[7].includes("0 units");
        const isLow = p[7].includes("left");
        const stockWidth = isDepleted
          ? 0
          : isLow
            ? 15
            : Math.max(25, 82 - i * 5);
        const isChecked = Boolean(p[10]);

        return `
        <tr data-index="${i}">
          <td><input type="checkbox" class="plant-check" data-name="${p[0]}" ${isChecked ? "checked" : ""} aria-label="Select ${p[0]}"></td>
          <td>
            <div class="inventory-specimen">
              <span class="inventory-thumb">♧</span>
              <span>
                <strong>${p[0]}</strong>${p[8] ? `<em>${p[8]}</em>` : ""}
                <small>${p[1]} · SKU-${String.fromCharCode(65 + (i % 26))}L-${String(i + 1).padStart(2, "0")}</small>
              </span>
            </div>
          </td>
          <td><strong>${p[2]}</strong><small>${p[3]}</small></td>
          <td><span class="soft-tag">☼ ${p[4]}</span><span class="soft-tag">♧ ${p[5]}</span></td>
          <td><strong>${p[6]}</strong><small>${p[8] === "50% OFF" ? "50% Special Deal" : "Standard Rate"}</small></td>
          <td>
            <strong class="stock ${isDepleted ? "empty" : ""}">${p[7]}</strong>
            <i class="stock-bar"><em style="width:${stockWidth}%"></em></i>
          </td>
          <td>♧ ${p[9]}</td>
        </tr>
      `;
      })
      .join("");

    // Update select-all state
    if (selectAllEl) {
      const allChecked = filtered.every((p) => p[10]);
      selectAllEl.checked = allChecked;
    }

    // Bind row checkbox clicks
    rowsContainer.querySelectorAll(".plant-check").forEach((input) => {
      input.addEventListener("change", (e) => {
        const name = e.target.dataset.name;
        const targetPlant = plants.find((p) => p[0] === name);
        if (targetPlant) {
          targetPlant[10] = e.target.checked;
        }
        updateSelectedCount();
        if (selectAllEl) {
          const allChecked = getFilteredPlants().every((p) => p[10]);
          selectAllEl.checked = allChecked;
        }
      });
    });

    updateSelectedCount();

    if (metricActiveEl) {
      metricActiveEl.innerHTML = `${plants.length} <em>SKUs total</em>`;
    }

    if (paginationInfo) {
      const isAr = getLang() === "ar";
      paginationInfo.textContent = isAr
        ? `عرض 1 إلى ${filtered.length} من أصل ${plants.length} شتلة`
        : `Showing 1 to ${filtered.length} of ${plants.length} specimens`;
    }
  };

  // Select all toggle
  if (selectAllEl) {
    selectAllEl.addEventListener("change", (e) => {
      const checked = e.target.checked;
      const filtered = getFilteredPlants();
      filtered.forEach((p) => {
        p[10] = checked;
      });
      render();
    });
  }

  // Fast focus filters
  document.querySelectorAll(".focus-row button[data-focus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".focus-row button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      fastFocus = btn.dataset.focus || "all";
      render();
    });
  });

  // Dropdown Category Filter
  const catFilterEl = document.getElementById("catFilter");
  if (catFilterEl) {
    catFilterEl.addEventListener("change", (e) => {
      categoryFilter = e.target.value;
      render();
    });
  }

  // Dropdown Room Filter
  const roomFilterEl = document.getElementById("roomFilter");
  if (roomFilterEl) {
    roomFilterEl.addEventListener("change", (e) => {
      roomFilter = e.target.value;
      render();
    });
  }

  // Dropdown Stock Filter
  const stockFilterEl = document.getElementById("stockFilter");
  if (stockFilterEl) {
    stockFilterEl.addEventListener("change", (e) => {
      stockFilter = e.target.value;
      render();
    });
  }

  // Reset Filters
  const resetBtn = document.getElementById("resetFiltersBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      searchQuery = "";
      fastFocus = "all";
      categoryFilter = "all";
      roomFilter = "all";
      stockFilter = "all";

      const plantSearch = document.getElementById("plantSearch");
      if (plantSearch) plantSearch.value = "";
      const invSearch = document.getElementById("inventorySearch");
      if (invSearch) invSearch.value = "";

      if (catFilterEl) catFilterEl.value = "all";
      if (roomFilterEl) roomFilterEl.value = "all";
      if (stockFilterEl) stockFilterEl.value = "all";

      document.querySelectorAll(".focus-row button").forEach((b) => {
        b.classList.toggle("active", b.dataset.focus === "all");
      });

      render();
      toast(
        getLang() === "ar"
          ? "تمت إعادة ضبط فلاتر البحث"
          : "Filters reset to default",
      );
    });
  }

  // Search Inputs
  const handleSearch = (val) => {
    searchQuery = val.trim().toLowerCase();
    render();
  };

  const plantSearchInput = document.getElementById("plantSearch");
  if (plantSearchInput) {
    plantSearchInput.addEventListener("input", (e) =>
      handleSearch(e.target.value),
    );
  }

  const topSearchInput = document.getElementById("inventorySearch");
  if (topSearchInput) {
    topSearchInput.addEventListener("input", (e) => {
      if (plantSearchInput) plantSearchInput.value = e.target.value;
      handleSearch(e.target.value);
    });
  }

  // Bulk Actions
  const bulkDiscountBtn = document.getElementById("bulkDiscountBtn");
  if (bulkDiscountBtn) {
    bulkDiscountBtn.addEventListener("click", () => {
      const selected = plants.filter((p) => p[10]);
      if (!selected.length) {
        toast(
          getLang() === "ar"
            ? "يرجى تحديد شتلات أولاً"
            : "Select botanical items first",
        );
        return;
      }
      selected.forEach((p) => {
        const numeric = parseFloat(p[6].replace("$", "")) || 25;
        p[6] = `$${(numeric * 0.85).toFixed(2)}`;
        p[8] = "15% OFF";
      });
      render();
      toast(
        getLang() === "ar"
          ? `تم تطبيق خصم 15% على ${selected.length} نبتة`
          : `Applied 15% discount to ${selected.length} items`,
      );
    });
  }

  const bulkCareTagBtn = document.getElementById("bulkCareTagBtn");
  if (bulkCareTagBtn) {
    bulkCareTagBtn.addEventListener("click", () => {
      const selected = plants.filter((p) => p[10]);
      if (!selected.length) {
        toast(
          getLang() === "ar"
            ? "يرجى تحديد شتلات أولاً"
            : "Select botanical items first",
        );
        return;
      }
      selected.forEach((p) => {
        p[8] = "VERIFIED CARE";
      });
      render();
      toast(
        getLang() === "ar"
          ? `تم تحديث بطاقات الرعاية لـ ${selected.length} نبتة`
          : `Care tags updated for ${selected.length} items`,
      );
    });
  }

  const bulkAssignRoomBtn = document.getElementById("bulkAssignRoomBtn");
  if (bulkAssignRoomBtn) {
    bulkAssignRoomBtn.addEventListener("click", () => {
      const selected = plants.filter((p) => p[10]);
      if (!selected.length) {
        toast(
          getLang() === "ar"
            ? "يرجى تحديد شتلات أولاً"
            : "Select botanical items first",
        );
        return;
      }
      selected.forEach((p) => {
        p[2] = "Indoor Room";
      });
      render();
      toast(
        getLang() === "ar"
          ? `تم تعيين الغرفة كـ (غرفة معيشة) لـ ${selected.length} نبتة`
          : `Assigned to Indoor Living for ${selected.length} items`,
      );
    });
  }

  const bulkArchiveBtn = document.getElementById("bulkArchiveBtn");
  if (bulkArchiveBtn) {
    bulkArchiveBtn.addEventListener("click", () => {
      const selectedCount = plants.filter((p) => p[10]).length;
      if (!selectedCount) {
        toast(
          getLang() === "ar"
            ? "يرجى تحديد شتلات أولاً للأرشفة"
            : "Select botanical items to archive",
        );
        return;
      }
      plants = plants.filter((p) => !p[10]);
      render();
      toast(
        getLang() === "ar"
          ? `تمت أرشفة ${selectedCount} نبتة من الكتالوج`
          : `Archived ${selectedCount} items from live catalog`,
      );
    });
  }

  // Header Export Buttons
  const exportTagsBtn = document.getElementById("exportTagsBtn");
  if (exportTagsBtn) {
    exportTagsBtn.addEventListener("click", () => {
      const csv = [
        [
          "Common Name",
          "Latin Genus",
          "Placement Room",
          "Category",
          "Light",
          "Watering",
          "Price",
          "Stock",
          "Badge",
          "Sales Volume",
        ],
        ...plants.map((p) => [
          p[0],
          p[1],
          p[2],
          p[3],
          p[4],
          p[5],
          p[6],
          p[7],
          p[8],
          p[9],
        ]),
      ]
        .map((r) =>
          r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
        )
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "agrismart-botanicals-inventory.csv";
      link.click();
      URL.revokeObjectURL(link.href);
      toast(
        getLang() === "ar"
          ? "تم تصدير ملف الباركود والمخزون بنجاح"
          : "Botanical tags exported as CSV",
      );
    });
  }

  const bulkPriceBtn = document.getElementById("bulkPriceBtn");
  if (bulkPriceBtn) {
    bulkPriceBtn.addEventListener("click", () => {
      plants.forEach((p) => {
        const val = parseFloat(p[6].replace("$", "")) || 20;
        p[6] = `$${(val * 1.05).toFixed(2)}`;
      });
      render();
      toast(
        getLang() === "ar"
          ? "تم تحديث أسعار الكتالوج (+5% تعديل موسمي)"
          : "Prices updated across catalog (+5% seasonal adjustment)",
      );
    });
  }

  const printBtn = document.getElementById("printTagsBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      toast(
        getLang() === "ar"
          ? "تم إرسال بطاقات النباتات للطباعة"
          : "Botanical tags queued for printing",
      );
    });
  }

  // Modal: Add New Botanical
  const modal = document.getElementById("botanicalModal");
  const addBtn = document.getElementById("addBotanicalBtn");
  const closeBtn = document.getElementById("closeBotanicalModal");
  const form = document.getElementById("botanicalForm");

  if (addBtn && modal) {
    addBtn.addEventListener("click", () => {
      modal.hidden = false;
      document.getElementById("botanicalName")?.focus();
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.hidden = true;
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.hidden = true;
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("botanicalName").value.trim();
      const genus = document.getElementById("botanicalGenus").value.trim();
      const room = document.getElementById("botanicalRoom").value;
      const category = document.getElementById("botanicalCategory").value;
      const sun =
        document.getElementById("botanicalSun").value.trim() ||
        "Bright Indirect";
      const water =
        document.getElementById("botanicalWater").value.trim() || "1x/wk";
      const price = `$${parseFloat(document.getElementById("botanicalPrice").value || 25).toFixed(2)}`;
      const stockNum = parseInt(
        document.getElementById("botanicalStock").value || 30,
        10,
      );
      const stock = `${stockNum} in stock`;
      const badge = document.getElementById("botanicalBadge").value || "NEW";

      if (!name || !genus) return;

      plants.unshift([
        name,
        genus,
        room,
        category,
        sun,
        water,
        price,
        stock,
        badge,
        0,
        false,
      ]);
      form.reset();
      modal.hidden = true;
      render();
      toast(
        getLang() === "ar"
          ? `تمت إضافة ${name} إلى الكتالوج بنجاح`
          : `Added ${name} to live catalog`,
      );
    });
  }

  // Range switch listener
  window.addEventListener("agrismart:rangechange", (e) => {
    toast(
      `${getLang() === "ar" ? "الفترة المحددة:" : "Range switched:"} ${e.detail.range}`,
    );
  });

  // Language change listener
  window.addEventListener("agrismart:languagechange", () => {
    updateSelectedCount();
    render();
  });

  // Initial render
  render();
});

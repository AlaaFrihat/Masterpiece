document.addEventListener("DOMContentLoaded", () => {
  const getLang = () =>
    localStorage.getItem("agrismartLanguage") ||
    localStorage.getItem("agrismartAdminLang") ||
    "en";

  const toast = (text) => {
    const el = document.getElementById("adminToast");
    if (!el) return;
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("show"), 2400);
  };

  const session = window.AgrismartAdmin?.session();
  if (session && document.getElementById("adminName")) {
    document.getElementById("adminName").textContent =
      session.name || "Sarah Alaa";
  }

  const rows = [
    [
      "#AG-8941",
      "Layla Al-Khatib",
      "Fiddle Leaf Fig (L) + Terracotta Pot",
      "Amman, Abdoun",
      "$45.00",
      "Moss Hydrated",
      "green",
    ],
    [
      "#AG-8940",
      "Tariq Mansour",
      "Monstera Deliciosa + Self-Watering Base",
      "Dubai, Marina",
      "$62.50",
      "In Transit (Courier)",
      "blue",
    ],
    [
      "#AG-8939",
      "Nour Haddad",
      "Sansevieria Laurentii + Bedroom Low-light",
      "Amman, Dabouq",
      "$28.99",
      "Delivered",
      "green",
    ],
    [
      "#AG-8938",
      "Zaid Qasim",
      "Cascade White Orchid + Gift Wrap",
      "Riyadh, Olaya",
      "$54.00",
      "Prep Station 2",
      "amber",
    ],
  ];

  const renderShipments = (list) => {
    const tbody = document.getElementById("shipmentRows");
    if (!tbody) return;
    tbody.innerHTML = list
      .map(
        (row) => `
      <tr>
        <td><strong>${row[0]}</strong></td>
        <td><span class="customer-avatar">${row[1]
          .split(" ")
          .map((v) => v[0])
          .join("")}</span>${row[1]}</td>
        <td>${row[2]}</td>
        <td>⌖ ${row[3]}</td>
        <td><strong>${row[4]}</strong></td>
        <td><span class="status-pill ${row[6]}">● ${row[5]}</span></td>
        <td><button class="row-action" aria-label="Open order" title="View Order">›</button></td>
      </tr>
    `,
      )
      .join("");
  };

  renderShipments(rows);

  // Range Switcher Data
  const rangeData = {
    Today: {
      sales: "$3,480.00",
      orders: "18",
      peak: "● Today Peak: $3,480.00",
      growth: "+4.2%",
    },
    "Last 7 Days": {
      sales: "$48,920.50",
      orders: "142",
      peak: "● 7-Day Peak: $8,940.00",
      growth: "+18.4%",
    },
    "This Month": {
      sales: "$148,250.00",
      orders: "520",
      peak: "● Month Peak: $14,200.00",
      growth: "+24.1%",
    },
  };

  window.addEventListener("agrismart:rangechange", (e) => {
    const range = e.detail?.range;
    const data = rangeData[range];
    if (!data) return;

    const salesEl = document.querySelector(
      ".metric-grid article:nth-child(1) strong",
    );
    const ordersEl = document.querySelector(
      ".metric-grid article:nth-child(2) strong",
    );
    const growthEl = document.querySelector(
      ".metric-grid article:nth-child(1) footer b",
    );
    const peakEl = document.querySelector(".chart .peak");

    if (salesEl) salesEl.textContent = data.sales;
    if (ordersEl) ordersEl.textContent = data.orders;
    if (growthEl) growthEl.textContent = `↗ ${data.growth}`;
    if (peakEl) peakEl.textContent = data.peak;

    const isAr = getLang() === "ar";
    toast(`${isAr ? "تم تحديث البيانات إلى:" : "Viewing range:"} ${range}`);
  });

  // Chart Tabs
  document.querySelectorAll(".sales-panel .tabs button").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".sales-panel .tabs button")
        .forEach((b) => b.classList.remove("active"));
      tab.classList.add("active");
      const text = tab.textContent.trim();
      const peakEl = document.querySelector(".chart .peak");
      const isAr = getLang() === "ar";

      if (text.includes("Specimens") || text.includes("الشتلات")) {
        if (peakEl)
          peakEl.textContent = isAr
            ? "● ذروة المبيعات: 182 شتلة اليوم"
            : "● Today Volume: 182 specimens";
      } else if (text.includes("Season") || text.includes("الموسم")) {
        if (peakEl)
          peakEl.textContent = isAr
            ? "● موسم الخريف: نمو +32% في النباتات الداخلية"
            : "● Autumn Cycle: +32% Foliage Growth";
      } else {
        if (peakEl)
          peakEl.textContent = isAr
            ? "● ذروة اليوم: $3,480.00"
            : "● Today Peak: $3,480.00";
      }
      toast(`${tab.textContent.trim()} ${isAr ? "محدد" : "view selected"}`);
    });
  });

  // Quick Dispatch Action
  const dispatchBtn = document.querySelector(".dispatch-action");
  if (dispatchBtn) {
    dispatchBtn.addEventListener("click", () => {
      rows.forEach((r) => {
        if (r[6] === "amber") {
          r[5] = "In Transit (Courier)";
          r[6] = "blue";
        }
      });
      renderShipments(rows);
      const isAr = getLang() === "ar";
      toast(
        isAr
          ? "تم إرسال الشحنات الجاهزة مع المناديب"
          : "Dispatched queued orders to courier vans",
      );
    });
  }

  // Export CSV
  const exportBtn = document.getElementById("exportButton");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const csv = [
        "Order ID,Customer,Item,Location,Amount,Status",
        ...rows.map((row) => row.map((value) => `"${value}"`).join(",")),
      ].join("\n");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      link.download = "agrismart-shipments.csv";
      link.click();
      URL.revokeObjectURL(link.href);
      const isAr = getLang() === "ar";
      toast(
        isAr ? "تم تصدير تقرير الشحنات بنجاح" : "Report exported successfully",
      );
    });
  }

  // Live Feed Table Refresh
  const refreshTableBtn = document.querySelector(
    ".table-tools button:nth-child(2)",
  );
  if (refreshTableBtn) {
    refreshTableBtn.addEventListener("click", () => {
      renderShipments(rows);
      toast(
        getLang() === "ar"
          ? "تم تحديث سجل الشحنات المباشر"
          : "Live shipments feed refreshed",
      );
    });
  }

  // Search in Dashboard
  const searchInput = document.getElementById("adminSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const term = event.target.value.toLowerCase();
      document.querySelectorAll("#shipmentRows tr").forEach((row) => {
        row.hidden = !row.textContent.toLowerCase().includes(term);
      });
    });
  }

  // Modal: Add Plant
  const modal = document.getElementById("plantModal");
  const addPlantBtn = document.getElementById("addPlantButton");
  const closePlantModalBtn = document.getElementById("closePlantModal");
  const savePlantBtn = document.getElementById("savePlant");

  if (addPlantBtn && modal) {
    addPlantBtn.addEventListener("click", () => {
      modal.hidden = false;
      document.getElementById("newPlantName")?.focus();
    });
  }

  if (closePlantModalBtn && modal) {
    closePlantModalBtn.addEventListener("click", () => {
      modal.hidden = true;
    });
  }

  if (savePlantBtn && modal) {
    savePlantBtn.addEventListener("click", () => {
      const nameInput = document.getElementById("newPlantName");
      const priceInput = document.getElementById("newPlantPrice");
      const name = nameInput?.value.trim();
      const price = priceInput?.value.trim() || "25.00";

      if (!name) return;

      modal.hidden = true;
      if (nameInput) nameInput.value = "";
      if (priceInput) priceInput.value = "";

      const isAr = getLang() === "ar";
      toast(
        isAr
          ? `تمت إضافة ${name} إلى الكتالوج`
          : `Saved ${name} ($${price}) to your catalogue`,
      );
    });
  }
});

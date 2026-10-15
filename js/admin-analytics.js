document.addEventListener("DOMContentLoaded", () => {
  const rooms = [
    [
      "Indoor Living Room",
      "Large Statement Floor Plants",
      "$42,100",
      28.4,
      "4.8%",
      "Ficus Lyrata (Fiddle Leaf)",
      "$84.50",
      "⌂",
    ],
    [
      "Workspace & Studio",
      "Low Maintenance & Air Purifying",
      "$34,800",
      23.5,
      "5.6%",
      "ZZ Raven & Snake Plant",
      "$48.20",
      "▤",
    ],
    [
      "Outdoor Patio & Balcony",
      "Sun Tolerant & Citrus Foliage",
      "$28,500",
      19.2,
      "3.9%",
      "Dwarf Olive Tree & Citrus",
      "$92.00",
      "☼",
    ],
    [
      "Bedroom Sanctuary",
      "Night Oxygenating Plants",
      "$24,200",
      16.3,
      "4.2%",
      "Snake Plant Laurentii",
      "$42.10",
      "▱",
    ],
    [
      "Bathroom & Spa",
      "Humidity Lovers & Ferns",
      "$18,650",
      12.6,
      "4.6%",
      "Boston Fern & Calathea",
      "$34.90",
      "♧",
    ],
  ];
  document.getElementById("roomRows").innerHTML = rooms
    .map(
      (r, i) =>
        `<tr><td><div class="room-cell"><span class="room-icon ${i === 2 ? "amber" : ""}">${r[7]}</span><span><strong>${r[0]}</strong><small>${r[1]}</small></span></div></td><td><strong>${r[2]}</strong></td><td><div class="share-cell"><i><em style="width:${r[3]}%"></em></i>${r[3]}%</div></td><td><span class="conversion">● ${r[4]}</span></td><td><span class="top-specimen"><span class="specimen-thumb">🌿</span>${r[5]}</span></td><td>${r[6]}</td></tr>`,
    )
    .join("");
  const varieties = [
    [
      "Fiddle Leaf Fig (Large)",
      "SKU: AGR-FLF-09 · 182 units sold",
      "$18,400",
      "94% Turnover",
    ],
    [
      "Monstera Deliciosa (Mature)",
      "SKU: AGR-MON-04 · 245 units sold",
      "$15,200",
      "88% Turnover",
    ],
    [
      "Peace Lily Supreme",
      "SKU: AGR-PCL-12 · 288 units sold",
      "$12,100",
      "92% Turnover",
    ],
    [
      "Snake Plant Laurentii",
      "SKU: AGR-SNK-01 · 310 units sold",
      "$9,800",
      "79% Turnover",
    ],
    [
      "White Cascade Orchid",
      "SKU: AGR-ORC-88 · 65 units sold",
      "$8,450",
      "96% Turnover",
    ],
  ];
  document.getElementById("varietyRows").innerHTML = varieties
    .map(
      (v, i) =>
        `<div class="variety-row"><span class="plant-thumb">${["🪴", "🌱", "🌿", "♧", "✿"][i]}</span><span class="variety-name">${v[0]} <b class="rank">Rank #${i + 1}</b><small>${v[1]}</small></span><span class="variety-value">${v[2]}<small>${v[3]}</small></span></div>`,
    )
    .join("");
  const channels = [
    ["Instagram Botanical Reels", "54,200 Rev", "ROAS 5.8×", 86],
    ["Google Search “Buy Plants Amman”", "41,800 Rev", "ROAS 4.6×", 68],
    ["Loyalty & Plant Care Referrals", "32,150 Rev", "ROAS 14.2×", 91],
    ["Seasonal Repotting Newsletter", "20,100 Rev", "ROAS 22.0×", 74],
  ];
  document.getElementById("channelRows").innerHTML = channels
    .map(
      (c) =>
        `<div class="channel-row"><span>● ${c[0]}<br><small>Conv. efficiency &amp; CAC</small></span><strong>${c[1]} <small>${c[2]}</small></strong><i><em style="width:${c[3]}%"></em></i></div>`,
    )
    .join("");

  const toast = (message) => {
    const el = document.getElementById("analyticsToast");
    el.textContent = message;
    el.classList.add("show");
    window.setTimeout(() => el.classList.remove("show"), 2300);
  };
  document
    .getElementById("mobileMenu")
    ?.addEventListener("click", () =>
      document.getElementById("adminSidebar")?.classList.toggle("open"),
    );
  document
    .querySelectorAll(".analytics-period [data-period]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        document
          .querySelectorAll(".analytics-period button")
          .forEach((item) => item.classList.toggle("active", item === button));
        toast(`Showing sample analytics: ${button.dataset.period}`);
      }),
    );
  document.querySelectorAll(".series-tabs [data-series]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".series-tabs button")
        .forEach((item) => item.classList.toggle("active", item === button));
      toast(`${button.textContent} view selected`);
    }),
  );
  document
    .getElementById("forecastToggle")
    ?.addEventListener("change", (event) => {
      document.querySelector(".forecast-line").style.display = event.target
        .checked
        ? ""
        : "none";
      document.querySelector(".legend-forecast").parentElement.style.opacity =
        event.target.checked ? "1" : ".45";
    });
  document
    .getElementById("adminSearch")
    ?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && event.target.value.trim())
        toast("Search is ready to connect to your analytics data");
    });
  document.getElementById("exportAnalytics")?.addEventListener("click", () => {
    const csv = [
      [
        "Room",
        "Gross Revenue",
        "Share of Sales",
        "Conversion Rate",
        "Top Specimen",
        "AOV",
      ],
      ...rooms.map((r) => [r[0], r[2], `${r[3]}%`, r[4], r[5], r[6]]),
      [],
      ["Top variety", "SKU / units", "Revenue", "Turnover"],
      ...varieties,
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    link.download = "agrismart-analytics-revenue.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    toast("Analytics dossier exported");
  });
  const sort = document.querySelector(".room-tools select");
  sort?.addEventListener("change", () => {
    const sorted = [...rooms];
    if (sort.value.includes("Conversion"))
      sorted.sort((a, b) => parseFloat(b[4]) - parseFloat(a[4]));
    else if (sort.value.includes("AOV"))
      sorted.sort(
        (a, b) => parseFloat(b[6].slice(1)) - parseFloat(a[6].slice(1)),
      );
    else
      sorted.sort(
        (a, b) =>
          parseFloat(b[2].replace(/[$,]/g, "")) -
          parseFloat(a[2].replace(/[$,]/g, "")),
      );
    document.getElementById("roomRows").innerHTML = sorted
      .map(
        (r, i) =>
          `<tr><td><div class="room-cell"><span class="room-icon ${r[7] === "☼" ? "amber" : ""}">${r[7]}</span><span><strong>${r[0]}</strong><small>${r[1]}</small></span></div></td><td><strong>${r[2]}</strong></td><td><div class="share-cell"><i><em style="width:${r[3]}%"></em></i>${r[3]}%</div></td><td><span class="conversion">● ${r[4]}</span></td><td><span class="top-specimen"><span class="specimen-thumb">🌿</span>${r[5]}</span></td><td>${r[6]}</td></tr>`,
      )
      .join("");
  });
});

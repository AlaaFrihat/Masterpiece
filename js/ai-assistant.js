(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const catalog = [
    {
      id: "shop_0",
      name: "Fiddle Leaf Fig",
      price: 28.99,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA_L4cTO3ar9Qc7G98PzFmzbuGdY6qTgulnq3k7CDjmFsmgD_DaJIe6dNINqe8vDZ-G0qfc0pJdxNny4bkz0E4HaF7lk5yIdZQs9NojIEQ9swpJF6dzpp5ctCQmpO6CkByYxiThWF_1BBnXFAtayAh4RS9y5v5QF3pJkrZ7uZSHmm_nBUUrGUT96GCSh58kqHau4NJZlxoiZrCkQHvh28Kas-_XPbfJLAiglezWvBU",
      traits: "bright light statement upright",
    },
    {
      id: "shop_1",
      name: "Peace Lily",
      price: 18.5,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBiCLRIwpBaf_oISx8JvwjGS7rsX8bbq3oGKo8bdAVZ4HECVQtpqfyFy85E1C-HOSUoJYcuZZV5_dIH4TNjDapNax6yUsM5xsUqJRI0u1rIfK9yfveeA1ITl8_-RTq2OxQIvN2EXrkMpm-szPvji1eUfprAZ6mNbb7JJZo0d9u1ncJd3SXEYYOGeLNoS6U5GDcIxtEG59PZ5SdWH8njLIRcWLP0IRgR9SfBQ1Qpr4o",
      traits: "indirect light flowering humidity",
    },
    {
      id: "shop_2",
      name: "Monstera Deliciosa",
      price: 25.99,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAPrqRJnPE-vWiyezGmEus-FJNFeh_i3YPmHkJyLgFe_JdatXW4ZVJQqIoXblsfSxx6PlDpQGmVZqQkPtES8nAUHNaMCRaDfxPjucvWW5pvcp8WaMPneTFUH66M9LuaGdsRrInbMS3ZwPOK_weL2S57aiAEy7hhrBkK7d0UM512QQ2xoMSnqoj4H_gaAU0NWzXYv3EVqtw77x6mB4a0U3aCCbvpTwRFp9jaMP4bOwI",
      traits: "indirect light tropical large leaves",
    },
    {
      id: "shop_3",
      name: "Snake Plant",
      price: 22.5,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCKXARjf0gVPNC3kU-dNNyitZsSwFE7cRhw9nNsf6oYq4zRl76DCai_5R86v_aQqsNBN3hrYMVt66QFzoAEBuaEWJP-QVXHPTAItuuk-GInXfIcVZL_UwbAi7djHZKLB4_MMmEgzCf-CTGzXrSDGbv8HUbzamORDbTueRoXuZZqOi8GYQcLJN_1vRRVh_d_go-ZBjP4lB0WzV6dLea0LPjqEFiCh5VK_qWiR1cKgkE",
      traits: "easy care low light drought tolerant hardy",
    },
    {
      id: "shop_4",
      name: "ZZ Plant",
      price: 24.0,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDQO_VZuU8JeP2Bt1xnA4bChtzC7yJFh8-g_cK0cVQDv3-H7QefXz9cCfwX2gvehi_4N1C5eYlYVvjq9IsQsBWJeV2UsM15Im_LZLtZ1ylYGRD1fUGjS5DWtWRpW8pCHveLVayVWgI5K8K8QlbgEuXGiTQtpEb8sLqfIajY_eaxccJd2bCUTwRUgwhV9zHGdVMmUij5axqj-sVbff2qS-W5PBb_U_nHTES_5wpWHVg",
      traits: "easy care low light drought tolerant hardy",
    },
    {
      id: "shop_5",
      name: "Spider Plant",
      price: 15.0,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBdSaXdq9RUMt9Hk-R16fHUq_JLYN8QpvLlAYubwD-1e65fJ8hhKNSHcaSndOGVv_C9flReALihHWmtFi8shg2G8fz7KDZh4NC--e23Bbd3C7Icl85TmTQKmZA5aZ6WCykwXvHdzmmloi_9jfCI9c3B5lxx8bOM8pNHd9F3K1M9dsrCAq5IysVNbV9tXpbAl07R30uGsL7T2_SueDnoSFjvvSVwzYGSTQl2L2qpdJQ",
      traits: "easy care indirect light beginner pet friendly",
    },
    {
      id: "shop_7",
      name: "Lavender",
      price: 15.0,
      image:
        "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=720&q=85",
      traits: "sun outdoor fragrant flowering",
    },
    {
      id: "shop_9",
      name: "Bamboo",
      price: 22.0,
      image:
        "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=720&q=85",
      traits: "indirect light easy care calm",
    },
    {
      id: "pots-ceramic-planter",
      name: "Ceramic Planter",
      price: 24.5,
      image:
        "https://images.unsplash.com/photo-1599067900192-1e0ecf2ce134?auto=format&fit=crop&w=720&q=85",
      traits: "pot ceramic planter indoor drainage",
    },
    {
      id: "pots-green-plastic-planter",
      name: "Green Plastic Planter",
      price: 12.0,
      image:
        "https://images.unsplash.com/photo-1545239705-1564e58b9e4a?auto=format&fit=crop&w=720&q=85",
      traits: "pot planter plastic lightweight green",
    },
    {
      id: "pots-garden-care-kit",
      name: "Garden Care Kit",
      price: 16.0,
      image:
        "https://images.unsplash.com/photo-1783149173467-74e30fc23434?auto=format&fit=crop&w=720&q=85",
      traits: "care tools watering gardening kit",
    },
    {
      id: "seed-cherry-tomato-seeds",
      name: "Cherry Tomato Seeds",
      price: 3.5,
      image: "assets/logo.svg",
      traits: "seed vegetable edible beginner garden",
    },
    {
      id: "seed-sweet-basil-seeds",
      name: "Sweet Basil Seeds",
      price: 2.95,
      image: "assets/logo.svg",
      traits: "seed herb edible kitchen garden",
    },
    {
      id: "seed-sunflower-seeds",
      name: "Sunflower Seeds",
      price: 3.25,
      image: "assets/logo.svg",
      traits: "seed flower outdoor sunny garden",
    },
    {
      id: "seed-coriander-seeds",
      name: "Coriander Seeds",
      price: 2.25,
      image: "assets/logo.svg",
      traits: "seed herb edible kitchen garden",
    },
    {
      id: "fertilizer-organic-plant-food",
      name: "Organic Plant Food Concentrate",
      price: 10.5,
      image: "assets/fertilizers/organic-plant-food.svg",
      traits: "fertilizer organic liquid plant food indoor outdoor",
    },
    {
      id: "fertilizer-balanced-indoor-feed",
      name: "Balanced Indoor Plant Fertilizer",
      price: 8.75,
      image: "assets/fertilizers/indoor-balanced-feed.svg",
      traits: "fertilizer balanced indoor houseplant feed beginner",
    },
    {
      id: "fertilizer-seaweed-extract",
      name: "Seaweed Plant Tonic",
      price: 12.5,
      image: "assets/fertilizers/seaweed-tonic.svg",
      traits: "fertilizer seaweed organic garden tonic",
    },
    {
      id: "fertilizer-cactus-succulent-feed",
      name: "Cactus & Succulent Feed",
      price: 7.5,
      image: "assets/fertilizers/cactus-feed.svg",
      traits: "fertilizer cactus succulent feed low maintenance",
    },
    {
      id: "fertilizer-slow-release-pellets",
      name: "Slow-Release Plant Food Pellets",
      price: 9.25,
      image: "assets/fertilizers/slow-release-pellets.svg",
      traits:
        "fertilizer slow release pellets granules indoor outdoor steady feeding",
    },
    {
      id: "fertilizer-orchid-bloom-feed",
      name: "Orchid Bloom Fertilizer",
      price: 8.5,
      image: "assets/fertilizers/orchid-bloom-feed.svg",
      traits: "fertilizer orchid flowering bloom liquid feed",
    },
    {
      id: "fertilizer-tomato-vegetable-feed",
      name: "Tomato & Vegetable Fertilizer",
      price: 11.75,
      image: "assets/fertilizers/tomato-vegetable-feed.svg",
      traits: "fertilizer tomato vegetable fruiting garden organic",
    },
    {
      id: "fertilizer-root-growth-starter",
      name: "Root Growth Starter",
      price: 9.75,
      image: "assets/fertilizers/root-growth-starter.svg",
      traits: "fertilizer root growth transplant starter powder planting",
    },
    {
      id: "fertilizer-premium-worm-castings",
      name: "Premium Worm Castings",
      price: 13.5,
      image: "assets/fertilizers/worm-castings.svg",
      traits: "fertilizer worm castings organic soil amendment compost garden",
    },
    {
      id: "fertilizer-citrus-plant-feed",
      name: "Citrus Plant Fertilizer",
      price: 10.25,
      image: "assets/fertilizers/citrus-plant-feed.svg",
      traits: "fertilizer citrus lemon fruit tree liquid feed organic",
    },
  ];
  const cities = {
    Amman: {
      ar: "عمّان",
      point: "Amman service area",
      pointAr: "نطاق خدمة عمّان",
      note: "Home delivery and prototype partner pickup options are available to explore.",
      noteAr:
        "تتوفر خيارات استكشافية للتوصيل المنزلي والاستلام من نقاط الشركاء التجريبية.",
    },
    Zarqa: {
      ar: "الزرقاء",
      point: "Zarqa service area",
      pointAr: "نطاق خدمة الزرقاء",
      note: "Check online delivery for this area; local pickup partners are still being added.",
      noteAr:
        "تحقق من التوصيل الإلكتروني لهذه المنطقة؛ يجري إعداد نقاط الاستلام المحلية.",
    },
    Irbid: {
      ar: "إربد",
      point: "Irbid service area",
      pointAr: "نطاق خدمة إربد",
      note: "Check online delivery for this area; local pickup partners are still being added.",
      noteAr:
        "تحقق من التوصيل الإلكتروني لهذه المنطقة؛ يجري إعداد نقاط الاستلام المحلية.",
    },
    Salt: {
      ar: "السلط",
      point: "Salt service area",
      pointAr: "نطاق خدمة السلط",
      note: "Check online delivery for this area; local pickup partners are still being added.",
      noteAr:
        "تحقق من التوصيل الإلكتروني لهذه المنطقة؛ يجري إعداد نقاط الاستلام المحلية.",
    },
    Aqaba: {
      ar: "العقبة",
      point: "Aqaba service area",
      pointAr: "نطاق خدمة العقبة",
      note: "Check online delivery for this area; local pickup partners are still being added.",
      noteAr:
        "تحقق من التوصيل الإلكتروني لهذه المنطقة؛ يجري إعداد نقاط الاستلام المحلية.",
    },
    Madaba: {
      ar: "مادبا",
      point: "Madaba service area",
      pointAr: "نطاق خدمة مادبا",
      note: "Check online delivery for this area; local pickup partners are still being added.",
      noteAr:
        "تحقق من التوصيل الإلكتروني لهذه المنطقة؛ يجري إعداد نقاط الاستلام المحلية.",
    },
  };

  const isAr = () => document.documentElement.lang === "ar";
  const text = (en, ar) => (isAr() ? ar : en);
  const safe = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const money = (value) => "$" + Number(value || 0).toFixed(2);

  // Main navigation tabs.
  $$(".ai-tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      $$(".ai-tab").forEach((item) => {
        item.classList.toggle("is-active", item === tab);
        item.setAttribute("aria-selected", String(item === tab));
      });
      $$(".ai-panel").forEach((panel) => {
        const active = panel.id === `panel-${tab.dataset.panel}`;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    }),
  );

  // Symptom chips help users describe the issue; they do not claim to diagnose an uploaded image.
  $$(".ai-chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      chip.classList.toggle("is-selected");
      const input = $("#symptomText");
      const phrase = chip.dataset.symptom;
      const labels = {
        yellow: text("Yellow leaves", "اصفرار الأوراق"),
        droop: text("Drooping", "تدلّي الأوراق"),
        spots: text("Spots or pests", "بقع أو آفات"),
        dry: text("Dry leaf edges", "جفاف أطراف الأوراق"),
      };
      const chosen = $$(".ai-chip.is-selected").map(
        (item) => labels[item.dataset.symptom],
      );
      input.value = chosen.join(", ");
    }),
  );

  let photoUrl = "";
  $("#plantPhoto").addEventListener("change", (event) => {
    if (
      window.AgrismartAuth &&
      !window.AgrismartAuth.requireLogin("plant diagnosis")
    ) {
      event.target.value = "";
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrl = URL.createObjectURL(file);
    $("#photoPreviewImage").src = photoUrl;
    $("#photoFileName").textContent = file.name;
    $("#photoPreview").hidden = false;
  });
  $("#removePhoto").addEventListener("click", () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrl = "";
    $("#plantPhoto").value = "";
    $("#photoPreview").hidden = true;
  });

  function renderProductMini(product) {
    return `<article class="ai-product-mini"><img src="${safe(product.image)}" alt="${safe(product.name)}"><div><h5>${safe(product.name)}</h5><p>${money(product.price)}</p><button type="button" data-add-product="${safe(product.id)}">${text("Add to cart", "أضف إلى السلة")}</button></div></article>`;
  }
  let lastDiagnosisSubmitted = false;
  let lastDiagnosisData = null;
  function readSaved(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }
  function lookupOrders(query) {
    const raw = query.trim().toLowerCase();
    const orders = window.AgrismartAuth
      ? window.AgrismartAuth.readUserData("agrismartOrders", [])
      : readSaved("agrismartOrders", []);
    const last = window.AgrismartAuth
      ? window.AgrismartAuth.readUserData("agrismartLastOrder", null)
      : readSaved("agrismartLastOrder", null);
    const all = Array.isArray(orders) ? [...orders] : [];
    if (last && !all.some((order) => order.id === last.id)) all.unshift(last);
    return all.filter(
      (order) =>
        String(order.id || "")
          .toLowerCase()
          .includes(raw) ||
        String(order.customerEmail || "").toLowerCase() === raw,
    );
  }
  $("#orderSearchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (
      window.AgrismartAuth &&
      !window.AgrismartAuth.requireLogin("order lookup")
    )
      return;
    const query = $("#orderQuery").value;
    const results = lookupOrders(query);
    const target = $("#orderResults");
    if (!results.length) {
      target.innerHTML = `<div class="ai-empty-message">${text("No saved order matched. Check the order ID or email used at checkout, or sign in to My Account.", "لم نعثر على طلب محفوظ. تحقق من رقم الطلب أو البريد المستخدم عند الدفع، أو افتح حسابي.")}</div><p><a class="ai-text-link" href="my-account.html">${text("Open My Account", "افتح حسابي")} →</a></p>`;
      return;
    }
    target.innerHTML = results
      .map((order) => {
        const products = Array.isArray(order.items)
          ? order.items
              .map((item) => `${safe(item.name)} × ${Number(item.qty) || 1}`)
              .join(" · ")
          : text("Order details are not available.", "تفاصيل الطلب غير متاحة.");
        const date = order.createdAt
          ? new Date(order.createdAt).toLocaleDateString(
              isAr() ? "ar-JO" : "en-US",
            )
          : text("Date unavailable", "التاريخ غير متاح");
        const status =
          order.status === "demo-recorded"
            ? text("Order received", "تم استلام الطلب")
            : safe(order.status || text("Processing", "قيد المعالجة"));
        return `<article class="ai-order-card"><div class="ai-order-card__top"><div><strong>${safe(order.id || text("Order", "طلب"))}</strong><small>${date}</small></div><span class="ai-order-status">${status}</span></div><div class="ai-order-items">${products}</div><div class="ai-order-card__top"><small>${text("Order total", "إجمالي الطلب")}</small><strong>${money(order.total)}</strong></div></article>`;
      })
      .join("");
  });

  function productCard(product) {
    return `<article class="ai-catalog-card"><img loading="lazy" src="${safe(product.image)}" alt="${safe(product.name)}"><div class="ai-catalog-card__body"><h4>${safe(product.name)}</h4><p>${safe(product.traits.split(" ").slice(0, 3).join(" · "))}</p><div class="ai-catalog-card__foot"><b>${money(product.price)}</b><button type="button" data-add-product="${safe(product.id)}">${text("Add", "أضف")}</button></div></div></article>`;
  }
  function searchProducts(query) {
    const q = query.trim().toLowerCase();
    const aliases = {
      نبتة: "plant",
      نبات: "plant",
      نباتات: "plant",
      "سهلة العناية": "easy care",
      "قليلة العناية": "easy care",
      "إضاءة منخفضة": "low light",
      "ضوء منخفض": "low light",
      بذور: "seed",
      سماد: "fertilizer",
      أسمدة: "fertilizer",
      تسميد: "fertilizer",
      زهور: "flower",
      أعشاب: "herb",
      خضروات: "vegetable",
      فراولة: "strawberry",
      ريحان: "basil",
      طماطم: "tomato",
      لافندر: "lavender",
      "زنبق السلام": "peace lily",
      مونستيرا: "monstera",
      "نبات العنكبوت": "spider plant",
      "نبات الثعبان": "snake plant",
      "نبات الزاميا": "zz plant",
      "دوار الشمس": "sunflower",
      أصيص: "planter",
      أصص: "planter",
      وعاء: "pot",
      ري: "watering",
      "أدوات العناية": "care tools",
    };
    const searchQuery = Object.entries(aliases).reduce(
      (value, [arabic, english]) => value.replaceAll(arabic, english),
      q,
    );
    const filtered = searchQuery
      ? catalog.filter((product) =>
          `${product.name} ${product.traits}`
            .toLowerCase()
            .includes(searchQuery),
        )
      : catalog.slice(0, 6);
    const target = $("#productResults");
    if (!filtered.length) {
      target.innerHTML = `<div class="ai-empty-message">${text("No close match in the current catalog. Try a plant name, “easy care”, “low light”, or browse by category.", "لا توجد نتيجة قريبة في الكتالوج الحالي. جرّب اسم نبتة أو «سهلة العناية» أو «إضاءة منخفضة»، أو تصفح حسب الفئة.")}</div>`;
      return;
    }
    target.innerHTML = filtered.map(productCard).join("");
    attachAddButtons(target);
  }
  $("#productSearchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (
      window.AgrismartAuth &&
      !window.AgrismartAuth.requireLogin("the AI product finder")
    )
      return;
    searchProducts($("#productQuery").value);
  });
  $("#productQuery").addEventListener("input", () => {
    if (window.AgrismartAuth && !window.AgrismartAuth.isLoggedIn()) return;
    searchProducts($("#productQuery").value);
  });

  function showLocation(persist = false) {
    const key = $("#customerCity").value;
    const city = cities[key] || cities.Amman;
    if (persist) localStorage.setItem("agrismartPreferredCity", key);
    $("#storeResults").innerHTML =
      `<article class="ai-store-card"><div class="ai-store-card__top"><div><strong>${safe(isAr() ? city.pointAr : city.point)}</strong><small>${safe(city.ar ? (isAr() ? city.ar : key) : key)} · Jordan</small></div><span class="ai-order-status">${text("Area selected", "تم اختيار المنطقة")}</span></div><p class="ai-order-items">${safe(isAr() ? city.noteAr : city.note)}</p><span class="ai-store-card__tag">${text("Prototype coverage · confirm at checkout", "تغطية تجريبية · أكد التوفر عند الدفع")}</span><p><a class="ai-text-link" href="shop.html">${text("Shop products", "تسوق المنتجات")} →</a></p></article>`;
  }
  $("#locationForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (
      window.AgrismartAuth &&
      !window.AgrismartAuth.requireLogin("nearby store and delivery options")
    )
      return;
    showLocation(true);
  });
  $("#useLocation").addEventListener("click", () => {
    if (
      window.AgrismartAuth &&
      !window.AgrismartAuth.requireLogin("nearby store and delivery options")
    )
      return;
    const button = $("#useLocation");
    if (!navigator.geolocation) {
      $("#storeResults").innerHTML =
        `<div class="ai-empty-message">${text("Location is not available in this browser. Choose your city instead.", "الموقع الجغرافي غير متاح في هذا المتصفح. اختر مدينتك بدلًا من ذلك.")}</div>`;
      return;
    }
    button.disabled = true;
    button.textContent = text("Finding your area…", "جارٍ تحديد منطقتك…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const centers = {
          Amman: [31.9539, 35.9106],
          Zarqa: [32.0728, 36.088],
          Irbid: [32.5556, 35.85],
          Salt: [32.0392, 35.7272],
          Aqaba: [29.5321, 35.0063],
          Madaba: [31.7167, 35.7931],
        };
        let nearest = "Amman";
        let min = Infinity;
        Object.entries(centers).forEach(([city, point]) => {
          const distance = Math.hypot(
            latitude - point[0],
            (longitude - point[1]) * Math.cos((latitude * Math.PI) / 180),
          );
          if (distance < min) {
            min = distance;
            nearest = city;
          }
        });
        $("#customerCity").value = nearest;
        button.disabled = false;
        button.textContent = "⌖ " + text("Use my location", "استخدم موقعي");
        showLocation(true);
      },
      () => {
        button.disabled = false;
        button.textContent = "⌖ " + text("Use my location", "استخدم موقعي");
        $("#storeResults").innerHTML =
          `<div class="ai-empty-message">${text("Location permission was not granted. Choose your city from the list.", "لم يتم السماح بمشاركة الموقع. اختر مدينتك من القائمة.")}</div>`;
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  });

  function attachAddButtons(root = document) {
    $$("[data-add-product]", root).forEach((button) => {
      if (button.dataset.bound) return;
      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        if (
          window.AgrismartAuth &&
          !window.AgrismartAuth.requireLogin("the shopping cart")
        )
          return;
        const product = catalog.find(
          (item) => item.id === button.dataset.addProduct,
        );
        if (!product) return;
        let cart = window.AgrismartAuth
          ? window.AgrismartAuth.readUserData("agrismartCart", {})
          : readSaved("agrismartCart", {});
        if (!cart[product.id])
          cart[product.id] = {
            name: product.name,
            price: product.price,
            img: product.image,
            qty: 0,
            category: product.id.startsWith("seed-")
              ? "Seeds"
              : product.id.startsWith("fertilizer-")
                ? "Fertilizers"
                : product.id.startsWith("pots-")
                  ? "Pots & Accessories"
                  : "Plant",
          };
        cart[product.id].qty += 1;
        if (window.AgrismartAuth)
          window.AgrismartAuth.writeUserData("agrismartCart", cart);
        else localStorage.setItem("agrismartCart", JSON.stringify(cart));
        window.dispatchEvent(new Event("agrismart:cartchange"));
        const original = button.textContent;
        button.textContent = text("Added ✓", "أُضيف ✓");
        button.disabled = true;
        window.setTimeout(() => {
          button.textContent = original;
          button.disabled = false;
        }, 1100);
      });
    });
  }

  searchProducts("");
  const globalSearch = new URLSearchParams(window.location.search).get(
    "search",
  );
  if (globalSearch) {
    const productsTab = $('[data-panel="products"]');
    productsTab?.click();
    $("#productQuery").value = globalSearch;
    searchProducts(globalSearch);
    $("#productQuery").focus({ preventScroll: true });
  }
  const preferredCity = localStorage.getItem("agrismartPreferredCity");
  if (
    preferredCity &&
    $("#customerCity").querySelector(
      `option[value="${CSS.escape(preferredCity)}"]`,
    )
  )
    $("#customerCity").value = preferredCity;
  showLocation();
  document.addEventListener("agrismart:languagechange", () => {
    if ($("#productResults")) searchProducts($("#productQuery").value);
    if ($("#storeResults")) showLocation();
    if ($("#orderResults") && $("#orderQuery").value)
      $("#orderSearchForm").requestSubmit();
    if (lastDiagnosisSubmitted && lastDiagnosisData)
      renderDiagnosisResult(lastDiagnosisData);
  });

  // Live, open-ended assistant backed by the Responses API on the local Node server.
  const chatMessages = $("#liveMessages");
  const chatForm = $("#chatForm");
  const chatInput = $("#chatInput");
  const serviceStatus = $("#aiServiceStatus");
  let conversation = [];
  let pendingPhoto = null;
  const welcomeMarkup = chatMessages.innerHTML;

  function renderDiagnosisResult(data) {
    const result = $("#diagnosisResult");
    const plant = $("#plantName").value.trim();
    const photo = data.image
      ? `<figure class="ai-report-photo"><img src="${safe(data.image)}" alt="${text("Plant photo provided for this assessment", "صورة النبتة المرفقة للتقييم")}"><figcaption>${text("Photo you shared", "الصورة التي أرفقتها")}</figcaption></figure>`
      : `<div class="ai-report-photo ai-report-photo--empty"><span>✿</span><strong>${text("No photo attached", "لم تُرفق صورة")}</strong><small>${text("The assessment uses the details you provided.", "يعتمد التقييم على التفاصيل التي كتبتها.")}</small></div>`;
    const products = data.products.length
      ? data.products.map(renderProductMini).join("")
      : `<p class="ai-report-no-products">${text("No specific catalog product was recommended for this assessment.", "لم يُقترح منتج محدد من الكتالوج لهذا التقييم.")}</p>`;
    result.classList.add("is-report");
    result.innerHTML = `<div class="ai-report"><header class="ai-report-toolbar"><div><button class="ai-report-back" type="button" id="backToDiagnosis">← ${text("Back to AI Assistant", "العودة إلى المساعد")}</button><p class="ai-kicker">${text("AI-ASSISTED PLANT CARE", "إرشاد ذكي للعناية بالنباتات")}</p><h2>${text("AI Diagnosis Result", "نتيجة تحليل النبات")}${plant ? ` · ${safe(plant)}` : ""}</h2><p>${text("Assessment based on your description and any photo you shared.", "تقييم استرشادي بناءً على وصفك والصورة التي أرفقتها إن وجدت.")}</p></div><div class="ai-report-actions"><button class="ai-secondary" type="button" id="shareDiagnosis">${text("Share report", "مشاركة النتيجة")}</button><button class="ai-primary" type="button" id="exportDiagnosis">${text("Export PDF", "حفظ PDF")}</button></div></header><div class="ai-report-grid"><section class="ai-card ai-report-assessment">${photo}<div class="ai-report-answer"><span class="ai-report-badge">✿ ${text("AI assessment · review before acting", "تحليل ذكي · راجع التوصيات قبل تطبيقها")}</span><h3>${text("What the assistant found", "نتيجة تحليل المساعد")}</h3><div class="ai-report-copy">${renderMessageText(data.reply)}</div></div></section><section class="ai-card ai-report-products"><div class="ai-report-section-title"><span class="ai-icon">⌂</span><div><h3>${text("Suggested products", "منتجات مقترحة")}</h3><p>${text("Catalog items selected as potentially helpful. They are not a diagnosis or treatment.", "منتجات من الكتالوج قد تساعدك. لا تُعد تشخيصًا أو علاجًا.")}</p></div></div><div class="ai-recommendations">${products}</div><a class="ai-text-link" href="shop.html">${text("Browse the full collection", "تصفح جميع المنتجات")} →</a></section><section class="ai-card ai-report-next"><div class="ai-report-section-title"><span class="ai-icon">⌖</span><div><h3>${text("Shopping near you", "التسوق في منطقتك")}</h3><p>${text("Explore delivery and pickup coverage for your city. Store inventory is not live yet.", "اطّلع على خيارات التوصيل والاستلام في مدينتك. بيانات مخزون المتاجر غير متاحة مباشرة حاليًا.")}</p></div></div><button class="ai-secondary" type="button" id="viewNearbyOptions">${text("View nearby options", "عرض خيارات منطقتك")} →</button></section><aside class="ai-report-disclaimer"><span>ⓘ</span><p><strong>${text("Please note", "ملاحظة")}</strong> ${text("AI guidance is informational, may be incomplete, and is not a confirmed diagnosis. For severe or spreading plant damage, consult a local plant specialist.", "إرشادات الذكاء الاصطناعي معلومات أولية وقد تكون غير مكتملة، ولا تمثل تشخيصًا مؤكدًا. عند تفاقم الضرر أو انتشاره، استشر مختصًا محليًا بالنباتات.")}</p></aside></div></div>`;
    const completedAt = new Date(data.completedAt || Date.now());
    const reportMeta = document.createElement("div");
    reportMeta.className = "ai-report-meta";
    reportMeta.innerHTML = `<span>${text(data.image ? "Scan ID" : "Report ID", data.image ? "رقم الفحص" : "رقم التقرير")}: <b>${safe(data.reportId || "AG-DIAG")}</b></span><span>${text("Completed", "اكتمل")}: <b>${safe(completedAt.toLocaleString(isAr() ? "ar-JO" : "en-US", { dateStyle: "medium", timeStyle: "short" }))}</b></span><span>${text("AI assessment", "تحليل بالذكاء الاصطناعي")}</span>`;
    const report = result.querySelector(".ai-report");
    const reportHeader = report.querySelector(".ai-report-toolbar");
    reportHeader.after(reportMeta);
    const reportGrid = report.querySelector(".ai-report-grid");
    const assessment = reportGrid.querySelector(".ai-report-assessment");
    assessment.querySelector(".ai-report-answer").innerHTML =
      `<span class="ai-report-badge">✿ ${text("Your submitted concern", "المشكلة التي أرسلتها")}</span><h3>${text("Plant details", "تفاصيل النبتة")}</h3><p>${safe(data.query || text("Plant care question", "استفسار حول العناية بالنبتة"))}</p>`;
    const carePlan = document.createElement("section");
    carePlan.className = "ai-card ai-report-care";
    carePlan.innerHTML = `<div class="ai-report-section-title"><span class="ai-icon">✿</span><div><h3>${text("Care steps &amp; analysis", "خطوات العناية والتحليل")}</h3><p>${text("Guidance generated from the details in this report.", "إرشادات مبنية على التفاصيل الواردة في هذا التقرير.")}</p></div></div><div class="ai-report-copy">${renderMessageText(data.reply)}</div>`;
    reportGrid.insertBefore(
      carePlan,
      reportGrid.querySelector(".ai-report-products"),
    );
    const followUp = document.createElement("section");
    followUp.className = "ai-report-tips";
    followUp.innerHTML = `<h3>${text("Helpful follow-up checks", "فحوصات متابعة مفيدة")}</h3><div><article><b>01</b><strong>${text("Check before watering", "افحص قبل الري")}</strong><p>${text("Feel the soil first and follow the needs of your plant.", "تحسس التربة أولًا وراعِ احتياج نبتتك.")}</p></article><article><b>02</b><strong>${text("Inspect leaves closely", "افحص الأوراق عن قرب")}</strong><p>${text("Look at both sides when checking for visible changes.", "افحص وجهي الورقة عند البحث عن أي تغيرات ظاهرة.")}</p></article><article><b>03</b><strong>${text("Note recent changes", "دوّن التغييرات الأخيرة")}</strong><p>${text("Keep track of light, watering, and any recent move.", "سجّل تغييرات الإضاءة والري وأي نقل حديث للنبتة.")}</p></article><article><b>04</b><strong>${text("Keep tools clean", "حافظ على نظافة الأدوات")}</strong><p>${text("Clean cutting tools between plants.", "نظّف أدوات التقليم بين نبتة وأخرى.")}</p></article></div>`;
    report.append(followUp);
    attachAddButtons(result);
    $("#backToDiagnosis").addEventListener("click", () => {
      result.classList.remove("is-report");
      $("#diagnosisForm").closest(".ai-diagnose-card").hidden = false;
      result.innerHTML = `<div class="ai-result-empty"><div class="ai-result-illustration"><span>✧</span><b>✿</b></div><p class="ai-kicker">${text("A LITTLE MORE ABOUT YOUR PLANT", "معلومات إضافية عن نبتتك")}</p><h3>${text("Your care plan starts here", "ابدأ خطة العناية بنبتتك")}</h3><p>${text("Share what you’re seeing and I’ll suggest practical checks, care steps, and products from the Agrismart collection.", "صف ما تلاحظه للحصول على إرشادات عملية ومنتجات مناسبة من مجموعة أجري سمارت.")}</p><div class="ai-result-steps"><span><i>1</i> ${text("Describe the signs", "صف العلامات")}</span><span><i>2</i> ${text("Review likely causes", "راجع الأسباب")}</span><span><i>3</i> ${text("Choose your next step", "اختر الخطوة التالية")}</span></div></div>`;
      lastDiagnosisSubmitted = false;
      $("#diagnosisForm").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
    $("#shareDiagnosis").addEventListener("click", async (event) => {
      try {
        const reportText = `${text("Report ID", "رقم التقرير")}: ${data.reportId || "AG-DIAG"}\n\n${data.reply}`;
        if (navigator.share)
          await navigator.share({
            title: text(
              "Agrismart Plant Assessment",
              "تقييم أجري سمارت للنبات",
            ),
            text: reportText,
            url: location.href,
          });
        else {
          await navigator.clipboard.writeText(
            `${text("Agrismart Plant Assessment", "تقييم أجري سمارت للنبات")}\n\n${reportText}`,
          );
          event.currentTarget.textContent = text("Copied", "تم النسخ");
        }
      } catch (error) {
        if (error.name !== "AbortError")
          event.currentTarget.textContent = text(
            "Could not share",
            "تعذرت المشاركة",
          );
      }
    });
    $("#exportDiagnosis").addEventListener("click", () => window.print());
    $("#viewNearbyOptions").addEventListener("click", () => {
      $('[data-panel="stores"]').click();
      $("#panel-stores").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function renderDiagnosis() {
    if (
      window.AgrismartAuth &&
      !window.AgrismartAuth.requireLogin("plant diagnosis")
    )
      return;
    const plant = $("#plantName").value.trim();
    const symptoms = $("#symptomText").value.trim();
    const query =
      `${plant ? `${text("Plant", "النبتة")}: ${plant}. ` : ""}${symptoms ? `${text("Observed signs", "العلامات التي ألاحظها")}: ${symptoms}` : ""}`.trim();
    const file = $("#plantPhoto").files[0];
    const result = $("#diagnosisResult");
    if (!query && !file) {
      $("#symptomText").focus();
      result.innerHTML = `<div class="ai-empty-message">${text("Please describe a symptom or attach a plant photo first.", "يرجى وصف الأعراض أو إرفاق صورة للنبتة أولًا.")}</div>`;
      return;
    }
    if (file && file.size > 900 * 1024) {
      result.innerHTML = `<div class="ai-empty-message">${text("Please choose an image smaller than 900 KB.", "اختر صورة يقل حجمها عن ٩٠٠ كيلوبايت.")}</div>`;
      return;
    }
    const submit = $("#diagnosisForm").querySelector('[type="submit"]');
    submit.disabled = true;
    submit.querySelector("span:first-child").textContent = text(
      "Analyzing your plant…",
      "جارٍ تحليل النبتة…",
    );
    result.innerHTML = `<div class="ai-diagnosis-loading" role="status"><span class="ai-diagnosis-spinner"></span><strong>${text("Preparing your diagnosis result…", "جارٍ تجهيز نتيجة التحليل…")}</strong><small>${text("The AI assistant is reviewing the details you shared.", "يراجع المساعد الذكي التفاصيل التي أرسلتها.")}</small></div>`;
    try {
      const image = file
        ? {
            dataUrl: await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = () =>
                reject(
                  new Error(
                    text("The photo could not be read.", "تعذرت قراءة الصورة."),
                  ),
                );
              reader.readAsDataURL(file);
            }),
          }
        : null;
      const instruction = text(
        "Give a careful initial plant-care assessment. Explain plausible causes and why, state what cannot be confirmed, and provide clear safe next steps and warning signs. Do not invent confidence scores, lab results, disease confirmation, store availability, or product claims. Recommend catalog products only when genuinely useful.",
        "قدّم تقييمًا أوليًا حذرًا للعناية بالنبتة. اشرح الأسباب المحتملة وسببها، ووضّح ما لا يمكن تأكيده، وقدّم خطوات آمنة وعلامات تستدعي الانتباه. لا تخترع نسب ثقة أو نتائج مخبرية أو تأكيد مرض أو توفر متجر أو ادعاءات عن منتج. اقترح منتجات الكتالوج عند فائدتها فقط.",
      );
      const data = await requestAssistantApi(
        [
          {
            role: "user",
            content: `${query || text("Please assess the attached plant photo.", "يرجى تقييم صورة النبتة المرفقة.")}\n\n${instruction}`,
          },
        ],
        image,
      );
      const createdAt = new Date();
      lastDiagnosisData = {
        reply: data.reply,
        products: Array.isArray(data.products) ? data.products : [],
        image: image?.dataUrl || "",
        query:
          query || text("Photo assessment requested", "طلب تقييم صورة النبتة"),
        completedAt: createdAt.toISOString(),
        reportId: `AG-DIAG-${createdAt.getTime().toString().slice(-8)}`,
      };
      lastDiagnosisSubmitted = true;
      $("#diagnosisForm").closest(".ai-diagnose-card").hidden = true;
      renderDiagnosisResult(lastDiagnosisData);
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      result.innerHTML = `<div class="ai-empty-message">${safe(error.message)}<br><small>${text("Try again, or continue in the AI chat above.", "حاول مجددًا أو تابع المحادثة مع المساعد أعلاه.")}</small></div>`;
    } finally {
      submit.disabled = false;
      submit.querySelector("span:first-child").textContent = text(
        "Get care suggestions",
        "احصل على اقتراحات العناية",
      );
    }
  }
  $("#diagnosisForm").addEventListener("submit", (event) => {
    event.preventDefault();
    renderDiagnosis();
  });
  const exampleDialog = $("#diagnosisExampleDialog");
  $("#openDiagnosisExample").addEventListener("click", () =>
    exampleDialog.showModal(),
  );
  $("#closeDiagnosisExample").addEventListener("click", () =>
    exampleDialog.close(),
  );
  exampleDialog.addEventListener("click", (event) => {
    if (event.target === exampleDialog) exampleDialog.close();
  });
  $("#startDiagnosisFromExample").addEventListener("click", () => {
    exampleDialog.close();
    $("#symptomText").focus({ preventScroll: true });
    $("#diagnosisForm").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  function setServiceStatus(online, label) {
    serviceStatus.classList.toggle("is-online", online);
    serviceStatus.classList.toggle("is-offline", !online);
    $("span", serviceStatus).textContent = label;
  }

  async function checkService() {
    try {
      const response = await fetch("/api/status", {
        headers: { accept: "application/json" },
      });
      if (!response.ok) throw new Error("Server is unavailable");
      const status = await response.json();
      if (status.configured)
        setServiceStatus(
          true,
          text("API key configured", "تم إعداد مفتاح API"),
        );
      else
        setServiceStatus(
          false,
          text("Add your API key to activate", "أضف مفتاح API للتفعيل"),
        );
    } catch {
      setServiceStatus(
        false,
        text("Start the Agrismart server", "شغّل خادم أجري سمارت"),
      );
    }
  }

  function escapeHtml(value) {
    return String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  }
  function renderMessageText(value) {
    const lines = String(value).split(/\r?\n/);
    let html = "";
    let inList = false;
    const inline = (line) =>
      escapeHtml(line)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
    lines.forEach((line) => {
      const bullet = /^\s*(?:[-*•]|\d+[.)])\s+(.+)$/.exec(line);
      if (bullet) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += `<li>${inline(bullet[1])}</li>`;
      } else {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        if (line.trim()) html += `<p>${inline(line)}</p>`;
      }
    });
    if (inList) html += "</ul>";
    return html;
  }
  function scrollChat() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addChatMessage(role, value, imageData = "") {
    const article = document.createElement("article");
    article.className = `ai-chat-message ai-chat-message--${role}`;
    const avatar = document.createElement("span");
    avatar.className = "ai-chat-avatar";
    avatar.textContent = role === "assistant" ? "✿" : "●";
    const bubble = document.createElement("div");
    bubble.className = "ai-chat-bubble";
    if (imageData) {
      const image = document.createElement("img");
      image.className = "ai-chat-image";
      image.src = imageData;
      image.alt = text(
        "Plant photo attached to your question",
        "صورة النبتة المرفقة مع سؤالك",
      );
      bubble.append(image);
    }
    bubble.insertAdjacentHTML("beforeend", renderMessageText(value));
    article.append(avatar, bubble);
    chatMessages.append(article);
    scrollChat();
    return { article, bubble };
  }

  function attachChatProducts(bubble, products) {
    if (!Array.isArray(products) || !products.length) return;
    const list = document.createElement("div");
    list.className = "ai-chat-products";
    products.forEach((product) => {
      const card = document.createElement("article");
      card.className = "ai-chat-product";
      const link = document.createElement("a");
      link.href = product.url || "shop.html";
      link.setAttribute("aria-label", product.name);
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = "";
      link.append(image);
      const details = document.createElement("span");
      const name = document.createElement("b");
      name.textContent = product.name;
      const price = document.createElement("small");
      price.textContent = money(product.price);
      details.append(name, price);
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = text("Add", "أضف");
      button.addEventListener("click", () => {
        if (
          window.AgrismartAuth &&
          !window.AgrismartAuth.requireLogin("the shopping cart")
        )
          return;
        if (typeof window.addToCart === "function") {
          window.addToCart(
            product.id,
            product.name,
            Number(product.price),
            product.image,
            1,
            product.category,
          );
        } else {
          const cart = readSaved("agrismartCart", {});
          if (!cart[product.id])
            cart[product.id] = {
              name: product.name,
              price: Number(product.price),
              img: product.image,
              qty: 0,
              category: product.category,
            };
          cart[product.id].qty += 1;
          localStorage.setItem("agrismartCart", JSON.stringify(cart));
          window.dispatchEvent(new Event("agrismart:cartchange"));
        }
        button.textContent = text("Added ✓", "أُضيف ✓");
        button.disabled = true;
      });
      card.append(link, details, button);
      list.append(card);
    });
    bubble.append(list);
  }

  function addTypingIndicator() {
    const article = document.createElement("article");
    article.className = "ai-chat-message ai-chat-message--assistant";
    article.id = "aiTypingMessage";
    article.innerHTML =
      '<span class="ai-chat-avatar">✿</span><div class="ai-chat-bubble ai-chat-typing" aria-label="Thinking"><i></i><i></i><i></i></div>';
    chatMessages.append(article);
    scrollChat();
    return article;
  }

  function maybeHandleLocalOrder(prompt) {
    const intent =
      /\b(order|track|tracking|delivery status)\b|طلب|طلبي|الطلب|تتبع|الشحنة/i.test(
        prompt,
      );
    if (!intent) return false;
    const orderId = prompt.match(/AG-\d{8}-[A-Z0-9]+/i)?.[0];
    const email = prompt.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
    if (!orderId && !email) {
      addChatMessage(
        "assistant",
        text(
          "I can search order records saved in this browser. Send me the order number (for example, AG-20261010-ABC123), or use the “Find an order” tool below. I won’t send your order details to the AI service.",
          "أستطيع البحث في الطلبات المحفوظة على هذا الجهاز. أرسل رقم الطلب (مثل AG-20261010-ABC123)، أو استخدم أداة «ابحث عن طلب» بالأسفل. لن أرسل تفاصيل طلبك إلى خدمة الذكاء الاصطناعي.",
        ),
      );
      return true;
    }
    const found = lookupOrders(orderId || email);
    if (!found.length) {
      addChatMessage(
        "assistant",
        text(
          "I couldn’t find that in the orders saved on this device. Check the ID/email, or sign in to My Account.",
          "لم أعثر على هذا الطلب ضمن الطلبات المحفوظة على هذا الجهاز. تحقق من الرقم أو البريد، أو سجّل الدخول إلى حسابي.",
        ),
      );
      return true;
    }
    found.slice(0, 3).forEach((order) => {
      const itemLines = Array.isArray(order.items)
        ? order.items
            .map((item) => `${item.name} × ${Number(item.qty) || 1}`)
            .join("\n")
        : "";
      const state =
        order.status === "demo-recorded"
          ? text("Received", "تم استلامه")
          : order.status || text("Processing", "قيد المعالجة");
      addChatMessage(
        "assistant",
        `${text("Order", "الطلب")} ${order.id}\n${text("Status", "الحالة")}: ${state}\n${text("Total", "الإجمالي")}: ${money(order.total)}\n${itemLines}`,
      );
    });
    return true;
  }

  function clearPendingPhoto() {
    pendingPhoto = null;
    $("#chatImageInput").value = "";
    $("#chatAttachment").hidden = true;
    $("#chatAttachmentPreview").removeAttribute("src");
  }

  $("#chatImageInput").addEventListener("change", (event) => {
    if (
      window.AgrismartAuth &&
      !window.AgrismartAuth.requireLogin("AI plant analysis")
    ) {
      event.target.value = "";
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 900_000
    ) {
      addChatMessage(
        "assistant",
        text(
          "Please choose a PNG, JPEG, or WebP image smaller than 900 KB.",
          "اختر صورة PNG أو JPEG أو WebP بحجم أقل من ٩٠٠ كيلوبايت.",
        ),
      );
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      pendingPhoto = { dataUrl: String(reader.result), name: file.name };
      $("#chatAttachmentPreview").src = pendingPhoto.dataUrl;
      $("#chatAttachmentName").textContent = file.name;
      $("#chatAttachment").hidden = false;
    };
    reader.readAsDataURL(file);
  });
  $("#removeChatAttachment").addEventListener("click", clearPendingPhoto);

  async function requestAssistantApi(messages, image = null) {
    if (
      window.AgrismartAuth &&
      !window.AgrismartAuth.requireLogin("Agrismart AI")
    )
      throw new Error(
        text(
          "Sign in to use Agrismart AI.",
          "سجّل الدخول لاستخدام مساعد أجري سمارت.",
        ),
      );
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        messages,
        image: image ? { dataUrl: image.dataUrl } : null,
        language: isAr() ? "ar" : "en",
        city: localStorage.getItem("agrismartPreferredCity") || "",
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(
        data.error ||
          text(
            "The AI service is unavailable right now.",
            "خدمة الذكاء الاصطناعي غير متاحة حاليًا.",
          ),
      );
    return data;
  }

  async function sendChatMessage(value) {
    if (
      window.AgrismartAuth &&
      !window.AgrismartAuth.requireLogin("Agrismart AI")
    )
      return;
    const prompt = value.trim();
    if (!prompt && !pendingPhoto) return;
    const image = pendingPhoto;
    const messageText =
      prompt ||
      text(
        "Please look at this plant photo and tell me what you notice.",
        "انظر إلى صورة النبتة وأخبرني بما تلاحظه.",
      );
    addChatMessage("user", messageText, image?.dataUrl || "");
    $("#chatSuggestions")?.remove();
    conversation.push({ role: "user", content: messageText });
    chatInput.value = "";
    chatInput.style.height = "auto";
    clearPendingPhoto();

    if (maybeHandleLocalOrder(messageText)) return;

    const typing = addTypingIndicator();
    $("#chatSendButton").disabled = true;
    try {
      const data = await requestAssistantApi(conversation.slice(-16), image);
      typing.remove();
      conversation.push({ role: "assistant", content: data.reply });
      const rendered = addChatMessage("assistant", data.reply);
      attachChatProducts(rendered.bubble, data.products);
    } catch (error) {
      typing.remove();
      const explanation = /API key|not configured/i.test(error.message)
        ? text(
            "The chat page is ready, but the AI key has not been set on the server yet. Follow the setup notes in README_AI_ASSISTANT.md, then restart the server. The key stays on the server and is never added to browser code.",
            "واجهة المحادثة جاهزة، لكن مفتاح الذكاء الاصطناعي لم يُضف إلى الخادم بعد. اتبع خطوات README_AI_ASSISTANT.md ثم أعد تشغيل الخادم. يبقى المفتاح على الخادم ولا يوضع في ملفات المتصفح.",
          )
        : error.message;
      addChatMessage("assistant", explanation);
    } finally {
      $("#chatSendButton").disabled = false;
      chatInput.focus();
      checkService();
    }
  }

  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendChatMessage(chatInput.value);
  });
  chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      chatForm.requestSubmit();
    }
  });
  chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 125)}px`;
  });
  $$(".ai-chat-suggestions [data-prompt]").forEach((button) =>
    button.addEventListener("click", () =>
      sendChatMessage(button.dataset.prompt),
    ),
  );
  $("#newChatButton").addEventListener("click", () => {
    conversation = [];
    chatMessages.innerHTML = welcomeMarkup;
    $$(".ai-chat-suggestions [data-prompt]").forEach((button) =>
      button.addEventListener("click", () =>
        sendChatMessage(button.dataset.prompt),
      ),
    );
    chatInput.value = "";
    clearPendingPhoto();
    chatInput.focus();
  });
  checkService();
})();

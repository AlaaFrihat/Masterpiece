(() => {
  const CART_KEY = "agrismartCart";
  const DISCOUNT_KEY = "agrismartCouponDiscount";
  const ORDER_KEY = "agrismartLastOrder";
  const ORDERS_KEY = "agrismartOrders";
  const cart = readCart();
  const form = document.getElementById("paymentForm");
  const notice = document.getElementById("paymentNotice");
  const placeOrderButton = document.getElementById("placeOrderButton");
  const cardEntry = document.getElementById("paymentCardEntry");
  const cardStatus = document.getElementById("paymentCardStatus");
  let cardReady = false;
  let cardLastFour = "";

  function renderCardStatus() {
    const isArabic = document.documentElement.lang === "ar";
    cardStatus.textContent = isArabic
      ? `البطاقة جاهزة لهذا الطلب وتنتهي بـ ${cardLastFour}. لم يتم حفظ بيانات البطاقة.`
      : `Card ready for this checkout •••• ${cardLastFour}. Card details are not stored.`;
  }

  function readCart() {
    if (window.AgrismartAuth)
      return window.AgrismartAuth.readUserData(CART_KEY, {});
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || {};
    } catch {
      return {};
    }
  }

  function money(value) {
    return "$" + Number(value || 0).toFixed(2);
  }
  function getItems() {
    return Object.values(cart).filter((item) => item && Number(item.qty) > 0);
  }

  function createOrder(method) {
    const items = getItems().map((item) => ({
      name: String(item.name || "Plant"),
      category: String(item.category || ""),
      image: String(item.img || item.image || ""),
      price: Number(item.price) || 0,
      qty: Number(item.qty) || 0,
    }));
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    const discountRate = window.AgrismartAuth
      ? Number(window.AgrismartAuth.readUserData(DISCOUNT_KEY, 0)) || 0
      : Number(localStorage.getItem(DISCOUNT_KEY)) || 0;
    const discount = subtotal * discountRate;
    const today = new Date();
    const deliveryStart = new Date(today);
    const deliveryEnd = new Date(today);
    deliveryStart.setDate(today.getDate() + 5);
    deliveryEnd.setDate(today.getDate() + 7);
    const reference = `AGR-${Date.now().toString(36).toUpperCase()}`;
    const id = `AG-${today.toISOString().slice(0, 10).replace(/-/g, "")}-${reference.slice(-6)}`;
    const activeAccount = safeJson(localStorage.getItem("agrismartSession"));
    const billingDetails = safeJson(
      sessionStorage.getItem("agrismartCheckoutDetails"),
    );
    const order = {
      id,
      customerEmail: String(
        activeAccount?.email ||
          billingDetails?.emailAddress ||
          billingDetails?.email ||
          "",
      )
        .trim()
        .toLowerCase(),
      paymentReference: reference,
      paymentMethod: method,
      cardLastFour: method === "card" ? cardLastFour : "",
      createdAt: today.toISOString(),
      deliveryStart: deliveryStart.toISOString(),
      deliveryEnd: deliveryEnd.toISOString(),
      items,
      subtotal,
      shipping: 0,
      taxes: 0,
      discount,
      total: Math.max(0, subtotal - discount),
      status: "demo-recorded",
    };
    if (window.AgrismartAuth)
      window.AgrismartAuth.writeUserData(ORDER_KEY, order);
    else localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    const history = window.AgrismartAuth?.readUserData(ORDERS_KEY, []) || [];
    const orders = Array.isArray(history) ? history : [];
    orders.unshift(order);
    if (window.AgrismartAuth)
      window.AgrismartAuth.writeUserData(ORDERS_KEY, orders);
    else localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Also record incoming order for merchant portal
    try {
      const merchantOrders = JSON.parse(
        localStorage.getItem("agrismartMerchantOrders") || "[]",
      );
      const customerName =
        `${billingDetails?.firstName || activeAccount?.name || "Customer"} ${billingDetails?.lastName || ""}`.trim();
      const customerPhone = billingDetails?.phoneNumber || "+962 7 9000 0000";
      const city = billingDetails?.city || "Amman";
      const itemsSummary = items.map((i) => `${i.qty}× ${i.name}`).join(", ");
      merchantOrders.unshift({
        id: `#AG-M${Math.floor(810 + Math.random() * 90)}`,
        customer: customerName,
        phone: customerPhone,
        location: `${city} - Delivery`,
        items: itemsSummary || "Plant selection",
        amount: order.total,
        date: "Just now",
        status: "new",
      });
      localStorage.setItem(
        "agrismartMerchantOrders",
        JSON.stringify(merchantOrders),
      );
    } catch {
      /* continue */
    }

    if (window.AgrismartAuth) window.AgrismartAuth.writeUserData(CART_KEY, {});
    else localStorage.setItem(CART_KEY, JSON.stringify({}));
    if (window.AgrismartAuth)
      window.AgrismartAuth.writeUserData(DISCOUNT_KEY, 0);
    else localStorage.removeItem(DISCOUNT_KEY);
    sessionStorage.removeItem("agrismartCheckoutDetails");
    window.location.href = "order-complete.html";
  }

  function safeJson(value) {
    try {
      return JSON.parse(value || "null");
    } catch {
      return null;
    }
  }

  function renderSummary() {
    const items = getItems();
    const count = items.reduce((sum, item) => sum + Number(item.qty), 0);
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0,
    );
    const discount =
      subtotal * (Number(localStorage.getItem(DISCOUNT_KEY)) || 0);
    document.getElementById("paymentItemCount").textContent = count;
    document.getElementById("paymentSubtotal").textContent = money(subtotal);
    document.getElementById("paymentDiscount").textContent =
      "-" + money(discount);
    document.getElementById("paymentTotal").textContent = money(
      Math.max(0, subtotal - discount),
    );
    placeOrderButton.disabled = items.length === 0;
    if (!items.length)
      showNotice(
        "Your cart is empty. Return to the store and add products before continuing.",
      );
  }

  function showNotice(message) {
    notice.textContent = message;
    notice.hidden = false;
  }

  function updateMethodSelection() {
    const selected = form.querySelector('input[name="paymentMethod"]:checked');
    document.querySelectorAll(".payment-method-card").forEach((card) => {
      const radio = card.querySelector('input[type="radio"]');
      card.classList.toggle("is-selected", Boolean(radio?.checked));
    });
    const cardSelected = selected?.value === "card";
    cardEntry.hidden = !cardSelected || cardReady;
    cardStatus.hidden = !cardSelected || !cardReady;
    cardEntry.querySelectorAll("input").forEach((input) => {
      if (input.type === "checkbox") return;
      input.disabled = !cardSelected || cardReady;
      input.required = cardSelected && !cardReady;
    });
    if (notice && !notice.hidden) notice.hidden = true;
  }

  form.addEventListener("change", (event) => {
    if (event.target.name === "paymentMethod") updateMethodSelection();
  });

  document.getElementById("addCardButton").addEventListener("click", () => {
    if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin("payment"))
      return;
    const cardNumber = document.getElementById("cardNumber");
    const digits = cardNumber.value.replace(/\D/g, "");
    if (!form.reportValidity()) return;
    if (!/^\d{12,19}$/.test(digits)) {
      cardNumber.setCustomValidity("Enter a valid card number.");
      cardNumber.reportValidity();
      cardNumber.setCustomValidity("");
      return;
    }
    cardLastFour = digits.slice(-4);
    cardReady = true;
    renderCardStatus();
    cardStatus.hidden = false;
    cardNumber.value = "";
    document.getElementById("cardHolder").value = "";
    document.getElementById("cardExpiry").value = "";
    document.getElementById("cardCvv").value = "";
    updateMethodSelection();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (
      window.AgrismartAuth &&
      !window.AgrismartAuth.requireLogin("placing an order")
    )
      return;
    if (!getItems().length) {
      showNotice(
        "Your cart is empty. Return to the store and add products before continuing.",
      );
      return;
    }
    const method = form.querySelector(
      'input[name="paymentMethod"]:checked',
    )?.value;
    if (method === "card" && !cardReady) {
      showNotice("Add your card details to continue.");
      return;
    }
    createOrder(method);
  });

  document
    .getElementById("checkoutNewsletterForm")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = event.currentTarget.querySelector('input[type="email"]');
      if (input?.checkValidity()) {
        input.value = "";
        input.placeholder = "Thank you for subscribing!";
      }
    });

  document.addEventListener("agrismart:languagechange", () => {
    if (cardReady) renderCardStatus();
  });

  renderSummary();
  updateMethodSelection();
})();

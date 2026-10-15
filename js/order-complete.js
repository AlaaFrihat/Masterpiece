(() => {
  const ORDER_KEY = "agrismartLastOrder";
  const itemsRoot = document.getElementById("orderItems");
  const invoiceButton = document.getElementById("downloadInvoiceButton");
  let order = readOrder();

  function readOrder() {
    if (window.AgrismartAuth)
      return window.AgrismartAuth.readUserData(ORDER_KEY, null);
    try {
      return JSON.parse(localStorage.getItem(ORDER_KEY) || "null");
    } catch {
      return null;
    }
  }

  function money(value) {
    return "$" + Number(value || 0).toFixed(2);
  }

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const locale = document.documentElement.lang === "ar" ? "ar-JO" : "en-JO";
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function paymentMethodLabel() {
    const arabic = document.documentElement.lang === "ar";
    if (order.paymentMethod === "card") {
      const base = arabic ? "بطاقة ائتمان أو خصم" : "Credit or Debit Card";
      return order.cardLastFour ? `${base} •••• ${order.cardLastFour}` : base;
    }
    if (order.paymentMethod === "googlepay") return "Google Pay";
    if (order.paymentMethod === "paypal") return "PayPal";
    return arabic ? "الدفع عند الاستلام" : "Cash on Delivery";
  }

  function renderOrder() {
    if (!order) {
      document.getElementById("orderGreeting").textContent =
        "No recent order was found.";
      document.getElementById("orderSubheading").textContent =
        "Start shopping to place your first order.";
      document.getElementById("orderItems").innerHTML =
        '<p class="order-empty-state">Your order details will appear here after checkout.</p>';
      document.getElementById("orderMetaStrip").hidden = true;
      document.getElementById("orderReceipt").hidden = true;
      document.getElementById("orderPrototypeNote").hidden = true;
      return;
    }

    document.getElementById("orderId").textContent = order.id;
    document.getElementById("orderPaymentMethod").textContent =
      paymentMethodLabel();
    document.getElementById("orderReference").textContent =
      order.paymentReference;
    document.getElementById("orderDeliveryDate").textContent =
      `${formatDate(order.deliveryStart)} – ${formatDate(order.deliveryEnd)}`;
    document.getElementById("orderItems").innerHTML = order.items
      .map(
        (item) => `
      <article class="order-item-row">
        <div class="order-item-info">
          <img class="order-item-image" src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.name)}">
          <div class="min-w-0"><h3 class="order-item-name">${escapeText(item.name)}</h3><p class="order-item-meta">${escapeText(item.category || (document.documentElement.lang === "ar" ? "نبتة" : "Plant"))} · ${document.documentElement.lang === "ar" ? "الكمية" : "Qty"} ${Number(item.qty)}</p></div>
        </div>
        <span class="order-item-price">${money(Number(item.price) * Number(item.qty))}</span>
      </article>`,
      )
      .join("");
    document.getElementById("orderSubtotal").textContent = money(
      order.subtotal,
    );
    document.getElementById("orderShipping").textContent = money(
      order.shipping,
    );
    document.getElementById("orderTaxes").textContent = money(order.taxes);
    document.getElementById("orderDiscount").textContent =
      "-" + money(order.discount);
    document.getElementById("orderTotal").textContent = money(order.total);
  }

  function escapeText(value) {
    const el = document.createElement("span");
    el.textContent = value == null ? "" : String(value);
    return el.innerHTML;
  }
  function escapeAttribute(value) {
    return escapeText(value).replace(/"/g, "&quot;");
  }

  invoiceButton.addEventListener("click", () => {
    if (!order) return;
    const arabic = document.documentElement.lang === "ar";
    const lines = [
      arabic ? "أجري سمارت — فاتورة الطلب" : "AGRISMART — ORDER INVOICE",
      `${arabic ? "رقم الطلب" : "Order"}: ${order.id}`,
      `${arabic ? "طريقة الدفع" : "Payment method"}: ${paymentMethodLabel()}`,
      `${arabic ? "مرجع الطلب" : "Order reference"}: ${order.paymentReference}`,
      `${arabic ? "موعد التوصيل المتوقع" : "Estimated delivery"}: ${formatDate(order.deliveryStart)} – ${formatDate(order.deliveryEnd)}`,
      "",
      ...order.items.map(
        (item) =>
          `${item.name} × ${item.qty} — ${money(item.price * item.qty)}`,
      ),
      "",
      `${arabic ? "المجموع الفرعي" : "Subtotal"}: ${money(order.subtotal)}`,
      `${arabic ? "الشحن" : "Shipping"}: ${money(order.shipping)}`,
      `${arabic ? "الضرائب" : "Taxes"}: ${money(order.taxes)}`,
      `${arabic ? "خصم القسيمة" : "Coupon discount"}: -${money(order.discount)}`,
      `${arabic ? "الإجمالي" : "Total"}: ${money(order.total)}`,
      "",
      arabic
        ? "هذه فاتورة لطلب تجريبي محفوظ محليًا. الدفع والتوصيل غير مربوطين."
        : "Demo order record. Online payment and fulfillment are not connected.",
    ];
    const file = new Blob([lines.join("\r\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `agrismart-invoice-${order.id}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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

  document.addEventListener("agrismart:languagechange", renderOrder);
  renderOrder();
})();

(() => {
  const money = (amount) =>
    new Intl.NumberFormat(
      document.documentElement.lang === "ar" ? "ar-JO" : "en-JO",
      { style: "currency", currency: "USD" },
    ).format(Number(amount) || 0);
  const date = (value) => {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "—";
    return new Intl.DateTimeFormat(
      document.documentElement.lang === "ar" ? "ar-JO" : "en-JO",
      { day: "numeric", month: "short", year: "numeric" },
    ).format(parsed);
  };
  const payment = (order) =>
    order.paymentMethod === "card"
      ? `Credit or Debit Card${order.cardLastFour ? ` •••• ${order.cardLastFour}` : ""}`
      : order.paymentMethod === "paypal"
        ? "PayPal"
        : order.paymentMethod === "googlepay"
          ? "Google Pay"
          : "Cash on Delivery";
  const text = (parent, tag, className, value) => {
    const el = document.createElement(tag);
    el.className = className;
    el.textContent = value;
    parent.append(el);
    return el;
  };

  document.addEventListener("DOMContentLoaded", () => {
    const ordersValue =
      window.AgrismartAuth?.readUserData("agrismartOrders", []) || [];
    const orders = Array.isArray(ordersValue) ? [...ordersValue] : [];
    const latest = window.AgrismartAuth?.readUserData(
      "agrismartLastOrder",
      null,
    );
    if (latest && !orders.some((order) => order.id === latest.id))
      orders.unshift(latest);
    const queryId = new URLSearchParams(location.search).get("id");
    const order = queryId
      ? orders.find((item) => String(item.id) === queryId)
      : latest || orders[0];
    const notice = document.getElementById("trackingNotice");
    const timelineCard = document.querySelector(".tracking-timeline-card");
    const productsCard = document.querySelector(".tracking-products-card");
    if (!order) {
      document.getElementById("trackingOrderId").textContent = "Not found";
      notice.textContent =
        "No matching order is saved to this account in this browser. Use the lookup form with your order ID and billing email.";
      notice.classList.add("is-cancelled");
      return;
    }

    timelineCard.hidden = false;
    productsCard.hidden = false;
    document.getElementById("trackingOrderId").textContent = order.id;
    document.getElementById("trackingDelivery").textContent = order.deliveryEnd
      ? date(order.deliveryEnd)
      : "To be confirmed";
    document.getElementById("placedDate").textContent = date(order.createdAt);
    document.getElementById("acceptedDate").textContent = date(order.createdAt);
    document.getElementById("deliveredDate").textContent =
      order.status === "delivered"
        ? date(order.deliveredAt || order.deliveryEnd)
        : "Expected";

    const stepOrder = [
      "placed",
      "accepted",
      "processing",
      "transit",
      "delivered",
    ];
    const state = String(order.status || "demo-recorded").toLowerCase();
    const stage =
      state === "delivered"
        ? 4
        : state === "in-transit" || state === "shipped"
          ? 3
          : state === "processing"
            ? 2
            : 1;
    document.querySelectorAll("#trackingTimeline li").forEach((item, index) => {
      if (index <= stage) item.classList.add("is-complete");
      if (index === stage && state !== "delivered")
        item.classList.add("is-current");
    });
    const progress = stage === 4 ? "80%" : `${Math.max(0, stage) * 20}%`;
    document
      .getElementById("trackingTimeline")
      .style.setProperty("--progress", progress);
    if (state === "cancelled") {
      notice.textContent =
        "This order was cancelled. If you have questions, contact Agrismart support.";
      notice.classList.add("is-cancelled");
    } else {
      const label =
        state === "delivered"
          ? "Delivered"
          : state === "in-transit" || state === "shipped"
            ? "On the way"
            : state === "processing"
              ? "In progress"
              : "Accepted";
      notice.textContent = `Current update: ${label}. The delivery estimate may change as the order progresses.`;
    }

    const items = Array.isArray(order.items) ? order.items : [];
    document.getElementById("trackingItemCount").textContent =
      `${items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0)} items`;
    const root = document.getElementById("trackingItems");
    items.forEach((item) => {
      const row = document.createElement("article");
      row.className = "tracking-product-row";
      const info = document.createElement("div");
      info.className = "tracking-product-info";
      const image = document.createElement("img");
      image.src = item.image || "assets/logo.svg";
      image.alt = item.name || "Product";
      image.loading = "lazy";
      const copy = document.createElement("div");
      copy.className = "tracking-product-copy";
      text(copy, "small", "", item.category || "Agrismart product");
      text(copy, "strong", "", item.name || "Product");
      text(copy, "span", "", `Quantity: ${Number(item.qty) || 0}`);
      info.append(image, copy);
      text(
        row,
        "strong",
        "tracking-product-price",
        money((Number(item.price) || 0) * (Number(item.qty) || 0)),
      );
      row.prepend(info);
      root.append(row);
    });
    if (!items.length)
      text(
        root,
        "p",
        "tracking-notice",
        "No product details were saved with this order.",
      );
    document.getElementById("trackingPayment").textContent = payment(order);
    document.getElementById("trackingTotal").textContent = money(order.total);
  });
})();

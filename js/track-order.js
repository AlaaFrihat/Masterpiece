document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("trackLookupForm");
  const message = document.getElementById("trackLookupMessage");
  if (!form) return;
  form.elements.email.value = window.AgrismartAuth?.currentUser()?.email || "";
  const readOrders = () => {
    const records =
      window.AgrismartAuth?.readUserData("agrismartOrders", []) || [];
    const orders = Array.isArray(records) ? [...records] : [];
    const latest = window.AgrismartAuth?.readUserData(
      "agrismartLastOrder",
      null,
    );
    if (latest && !orders.some((order) => order.id === latest.id))
      orders.unshift(latest);
    return orders;
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const orderId = form.elements.orderId.value.trim().toUpperCase();
    const email = form.elements.email.value.trim().toLowerCase();
    const order = readOrders().find(
      (item) =>
        String(item.id || "").toUpperCase() === orderId &&
        String(
          item.customerEmail ||
            window.AgrismartAuth?.currentUser()?.email ||
            "",
        )
          .trim()
          .toLowerCase() === email,
    );
    if (!order) {
      message.textContent =
        "We couldn’t find an order matching that ID and billing email in this account.";
      message.classList.add("is-error");
      return;
    }
    location.href = `order-tracking.html?id=${encodeURIComponent(order.id)}`;
  });
});

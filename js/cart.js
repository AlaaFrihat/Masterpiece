// Global Cart State
let cart = {};

function readCartForCurrentUser() {
  if (window.AgrismartAuth)
    return window.AgrismartAuth.readUserData("agrismartCart", {});
  try {
    return JSON.parse(localStorage.getItem("agrismartCart")) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  if (window.AgrismartAuth)
    window.AgrismartAuth.writeUserData("agrismartCart", cart);
  else localStorage.setItem("agrismartCart", JSON.stringify(cart));
  window.dispatchEvent(new Event("agrismart:cartchange"));
}

function addToCart(id, name, price, img, qty = 1, category = "Plant") {
  if (
    window.AgrismartAuth &&
    !window.AgrismartAuth.requireLogin("the shopping cart")
  )
    return false;
  if (!cart[id]) cart[id] = { name, price, img, qty: 0, category };
  else {
    cart[id].name = name;
    cart[id].price = price;
    cart[id].img = img;
    cart[id].category = category;
  }
  cart[id].qty += qty;
  saveCart();
  updateCartUI();
  triggerCartAnimation();
  showToast(`🌿 ${name} added to cart!`, "success");
  openCart();
}

function triggerCartAnimation() {
  const icons = document.querySelectorAll(
    '.lucide-cart-animated, [data-floating-action="cart"] svg, .site-nav__cart svg',
  );
  icons.forEach((icon) => {
    icon.classList.remove("is-animating");
    // Trigger reflow to restart CSS animation
    void icon.offsetWidth;
    icon.classList.add("is-animating");
    setTimeout(() => icon.classList.remove("is-animating"), 600);
  });
}

function updateCartUI() {
  const keys = Object.keys(cart);
  const total = keys.reduce((s, k) => s + cart[k].price * cart[k].qty, 0);
  const count = keys.reduce((s, k) => s + cart[k].qty, 0);

  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) cartCountEl.textContent = count;

  const cartEmpty = document.getElementById("cartEmpty");
  if (cartEmpty) cartEmpty.style.display = keys.length ? "none" : "block";

  const cartFooter = document.getElementById("cartFooter");
  if (cartFooter) cartFooter.style.display = keys.length ? "block" : "none";

  const cartTotal = document.getElementById("cartTotal");
  if (cartTotal) cartTotal.textContent = "$" + total.toFixed(2);

  const cartItems = document.getElementById("cartItems");
  if (cartItems) {
    cartItems.innerHTML = keys
      .map((k) => {
        const item = cart[k];
        return `
        <div class="cart-item">
          <div class="cart-item__img"><img src="${item.img}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;"></div>
          <div class="cart-item__info">
            <div class="cart-item__name">${item.name}</div>
            <div class="cart-item__price">$${item.price.toFixed(2)}</div>
            <div class="cart-item__qty">
              <button onclick="changeQty('${k}',-1)">−</button>
              <span>${item.qty}</span>
              <button onclick="changeQty('${k}',1)">+</button>
              <span class="cart-item__remove" onclick="removeItem('${k}')">🗑️ï¸</span>
            </div>
          </div>
        </div>`;
      })
      .join("");
  }
}

function changeQty(id, delta) {
  if (
    window.AgrismartAuth &&
    !window.AgrismartAuth.requireLogin("the shopping cart")
  )
    return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  saveCart();
  updateCartUI();
}

function removeItem(id) {
  if (
    window.AgrismartAuth &&
    !window.AgrismartAuth.requireLogin("the shopping cart")
  )
    return;
  delete cart[id];
  saveCart();
  updateCartUI();
  showToast("Item removed.");
}

function openCart() {
  if (
    window.AgrismartAuth &&
    !window.AgrismartAuth.requireLogin("the shopping cart", "cart.html")
  )
    return;
  const sidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("cartOverlay");
  if (sidebar) sidebar.classList.add("open");
  if (overlay) overlay.classList.add("open");
}

function closeCart() {
  const sidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("cartOverlay");
  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
}

function checkout() {
  if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin("checkout"))
    return;
  if (!Object.keys(cart).length) return;
  showToast("🎉 Order placed! Thank you for shopping at Agrismart!", "success");
  Object.keys(cart).forEach((k) => delete cart[k]);
  saveCart();
  updateCartUI();
  closeCart();
}

// Simple Toast function if not defined
function showToast(msg, type = "info") {
  if (typeof window.showToastFunc === "function") {
    window.showToastFunc(msg, type);
    return;
  }
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.style.cssText =
      "position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;";
    document.body.appendChild(toastContainer);
  }
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.cssText = `background: ${type === "success" ? "#1aa349" : "#333"}; color: #fff; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: sans-serif; font-size: 14px; opacity: 0; transform: translateY(20px); transition: all 0.3s ease;`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 10);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Inject HTML if missing
function initCart() {
  cart = readCartForCurrentUser();

  // Attach event listeners to all cart toggles (shopping cart icons)
  const cartToggles = document.querySelectorAll(
    '.fa-cart-shopping, [aria-label="Shopping Cart"], [aria-label="Cart"], #cartToggle',
  );
  cartToggles.forEach((toggle) => {
    // Find closest parent a or button tag if it exists
    const clickable = toggle.closest("a") || toggle.closest("button") || toggle;
    clickable.addEventListener("click", (e) => {
      if (document.getElementById("cartSidebar")) {
        e.preventDefault();
        openCart();
      }
    });
  });

  updateCartUI();
}

document.addEventListener("DOMContentLoaded", initCart, { once: true });

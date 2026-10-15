document.addEventListener("DOMContentLoaded", () => {
  const isMerchantNav = (list) => {
    const path = location.pathname.toLowerCase();
    const isMerchantPath = path.includes("merchant-");
    const hasMerchantTag = Boolean(
      document.querySelector(".nav-merchant-tag, .merchant-top-strip"),
    );
    const hasMerchantLinks = Boolean(
      list && list.querySelector('a[href*="merchant-"]'),
    );
    return isMerchantPath || hasMerchantTag || hasMerchantLinks;
  };

  // Clean up AI Assistant and Nearby Stores links from merchant navigation
  document.querySelectorAll(".site-nav__links, .nav__links").forEach((list) => {
    if (isMerchantNav(list)) {
      list
        .querySelectorAll(
          'a[href*="ai-assistant.html"], a[href*="nearby-stores.html"]',
        )
        .forEach((a) => {
          a.closest("li")?.remove();
        });
    }
  });

  // Consumer site navigation management
  const currentPath = (location.pathname || "").toLowerCase();
  const isShop =
    currentPath.endsWith("shop.html") ||
    currentPath.endsWith("/shop.html") ||
    currentPath.endsWith("/shop");
  const isPots =
    currentPath.endsWith("pots-accessories.html") ||
    currentPath.endsWith("/pots-accessories.html") ||
    currentPath.endsWith("/pots-accessories");
  const isSeeds =
    currentPath.endsWith("seeds.html") ||
    currentPath.endsWith("/seeds.html") ||
    currentPath.endsWith("/seeds");
  const isBotanicalHub = isShop || isPots || isSeeds;

  document.querySelectorAll(".site-nav__links, .nav__links").forEach((list) => {
    if (isMerchantNav(list)) return;

    // Remove Pots & Accessories, Seeds & Fertilizers, and Blog from consumer navigation header
    list
      .querySelectorAll(
        'a[href*="pots-accessories.html"], a[href*="seeds.html"], a[href*="#blog"], a[href*="blog.html"]',
      )
      .forEach((a) => {
        a.closest("li")?.remove();
      });

    if (isBotanicalHub) {
      const plantAnchor = [...list.querySelectorAll("a")].find((a) =>
        /(?:shop\.html(?:[?#].*)?)$/.test(a.getAttribute("href") || ""),
      );
      if (plantAnchor) {
        plantAnchor.classList.toggle("active", isShop);
        plantAnchor.classList.toggle("is-active", isShop);
        if (isShop) plantAnchor.setAttribute("aria-current", "page");
        else plantAnchor.removeAttribute("aria-current");
      }
    }
  });

  // Keep the plant-care assistant reachable from consumer site navigation.
  document.querySelectorAll(".site-nav__links, .nav__links").forEach((list) => {
    if (isMerchantNav(list)) return;
    if (list.querySelector('a[href="ai-assistant.html"]')) return;
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = "ai-assistant.html";
    link.textContent = "AI Assistant";
    if (location.pathname.toLowerCase().endsWith("/ai-assistant.html")) {
      link.classList.add("is-active", "active");
      link.setAttribute("aria-current", "page");
    }
    item.appendChild(link);
    const about = [...list.querySelectorAll("a")].find((anchor) =>
      /(?:about\.html(?:[?#].*)?|#about)$/.test(
        anchor.getAttribute("href") || "",
      ),
    );
    if (about?.parentElement) about.parentElement.before(item);
    else list.appendChild(item);
  });

  // Nearby store discovery is a first-class destination across consumer shop navigation.
  document.querySelectorAll(".site-nav__links, .nav__links").forEach((list) => {
    if (isMerchantNav(list)) return;
    let link = list.querySelector('a[href="nearby-stores.html"]');
    if (!link) {
      const item = document.createElement("li");
      link = document.createElement("a");
      link.href = "nearby-stores.html";
      link.textContent = "Nearby Stores";
      item.appendChild(link);
      const assistant = [...list.querySelectorAll("a")].find((anchor) =>
        /(?:ai-assistant\.html(?:[?#].*)?)/.test(
          anchor.getAttribute("href") || "",
        ),
      );
      if (assistant?.parentElement) assistant.parentElement.after(item);
      else list.appendChild(item);
    }
    if (location.pathname.toLowerCase().endsWith("/nearby-stores.html")) {
      link.classList.add("active", "is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  const floatingActions = document.createElement("div");
  floatingActions.className = "floating-shop-widget";
  if (isMerchantNav()) {
    floatingActions.style.display = "none";
  }
  floatingActions.innerHTML = `
    <nav class="floating-shop-popup" id="floatingShopPopup" aria-label="Quick shopping links" hidden>
      <form class="floating-shop-search" id="floatingShopSearch" role="search">
        <input id="floatingShopSearchInput" type="search" aria-label="Search products" placeholder="Search plants, pots, seeds…" autocomplete="off">
        <button type="submit" aria-label="Search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m16 16 4 4"></path></svg></button>
      </form>
      <a class="floating-shop-item" href="cart.html" data-floating-action="cart" aria-label="Cart">
        <span class="floating-shop-item__icon"><svg class="lucide-cart-animated" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"/></svg></span>
        <span class="floating-shop-item__text"><b>Cart</b><small>View items in your cart</small></span>
        <span class="floating-shop-action__count" data-floating-count="cart" hidden></span>
      </a>
      <a class="floating-shop-item" href="shop.html#wishlist" data-floating-action="wishlist" aria-label="Wishlist">
        <span class="floating-shop-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"></path></svg></span>
        <span class="floating-shop-item__text"><b>Wishlist</b><small>See your saved favorites</small></span>
        <span class="floating-shop-action__count" data-floating-count="wishlist" hidden></span>
      </a>
    </nav>
    <button class="floating-shop-toggle" type="button" aria-label="Open shopping menu" title="Open shopping menu" aria-expanded="false" aria-controls="floatingShopPopup">
      <svg class="floating-shop-toggle__bag lucide-cart-animated" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"/></svg>
      <svg class="floating-shop-toggle__close" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>
      <span class="floating-shop-action__count floating-shop-toggle__count" data-floating-count="total" hidden></span>
    </button>`;
  document.body.appendChild(floatingActions);

  const popup = floatingActions.querySelector(".floating-shop-popup");
  const toggle = floatingActions.querySelector(".floating-shop-toggle");
  floatingActions
    .querySelector("#floatingShopSearch")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      if (
        window.AgrismartAuth &&
        !window.AgrismartAuth.requireLogin("the AI product finder")
      )
        return;
      const query = floatingActions
        .querySelector("#floatingShopSearchInput")
        .value.trim();
      if (!query) return;
      window.location.href = `ai-assistant.html?search=${encodeURIComponent(query)}`;
    });
  const setPopupOpen = (open) => {
    popup.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close shopping menu" : "Open shopping menu",
    );
    toggle.setAttribute(
      "title",
      open ? "Close shopping menu" : "Open shopping menu",
    );
  };
  toggle.addEventListener("click", () => setPopupOpen(popup.hidden));
  document.addEventListener("click", (event) => {
    if (!floatingActions.contains(event.target)) setPopupOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !popup.hidden) {
      setPopupOpen(false);
      toggle.focus();
    }
  });

  const updateFloatingCounts = () => {
    if (window.AgrismartAuth && !window.AgrismartAuth.isLoggedIn()) {
      floatingActions
        .querySelectorAll("[data-floating-count]")
        .forEach((badge) => {
          badge.hidden = true;
        });
      return;
    }
    let cart = {};
    let wishlist = {};
    try {
      cart = window.AgrismartAuth
        ? window.AgrismartAuth.readUserData("agrismartCart", {})
        : JSON.parse(localStorage.getItem("agrismartCart") || "{}") || {};
      wishlist = window.AgrismartAuth
        ? window.AgrismartAuth.readUserData("agrismartWishlist", {})
        : JSON.parse(localStorage.getItem("agrismartWishlist") || "{}") || {};
    } catch (_) {
      /* Keep the floating controls usable if saved data is unreadable. */
    }
    const cartCount = Object.values(cart).reduce(
      (total, item) => total + (Number(item?.qty) || 0),
      0,
    );
    const wishlistCount = Object.keys(wishlist).length;
    floatingActions
      .querySelectorAll("[data-floating-count]")
      .forEach((badge) => {
        const count =
          badge.dataset.floatingCount === "cart"
            ? cartCount
            : badge.dataset.floatingCount === "wishlist"
              ? wishlistCount
              : cartCount + wishlistCount;
        badge.textContent = count > 99 ? "99+" : String(count);
        badge.hidden = count < 1;
      });
  };
  updateFloatingCounts();
  window.addEventListener("storage", updateFloatingCounts);
  window.addEventListener("agrismart:cartchange", updateFloatingCounts);
  window.addEventListener("agrismart:wishlistchange", updateFloatingCounts);
  document.addEventListener("agrismart:sessionchange", updateFloatingCounts);

  floatingActions.addEventListener("click", (event) => {
    const link = event.target.closest("[data-floating-action]");
    if (!link) return;
    const isCart = link.dataset.floatingAction === "cart";
    const panelId = isCart ? "cartSidebar" : "wishSidebar";
    const openPanel = isCart ? window.openCart : window.openWish;
    if (document.getElementById(panelId) && typeof openPanel === "function") {
      event.preventDefault();
      setPopupOpen(false);
      openPanel();
    }
  });

  if (
    window.location.hash === "#wishlist" &&
    document.getElementById("wishSidebar") &&
    typeof window.openWish === "function"
  ) {
    window.openWish();
  }

  function setNavMenuState(open) {
    const navLists = document.querySelectorAll(
      ".nav__links, #navLinks, .site-nav__links",
    );
    const triggers = document.querySelectorAll(
      ".hamburger, #menuToggle, #hamburger, .site-nav__menu",
    );
    navLists.forEach((list) => {
      list.classList.toggle("open", open);
      list.classList.toggle("is-open", open);
    });
    triggers.forEach((btn) => {
      btn.classList.toggle("is-active", open);
      btn.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  }

  window.toggleMenu = function () {
    const navLinksEl =
      document.getElementById("navLinks") ||
      document.querySelector(".nav__links");
    const isOpen = navLinksEl
      ? navLinksEl.classList.contains("open") ||
        navLinksEl.classList.contains("is-open")
      : false;
    setNavMenuState(!isOpen);
  };

  // Wire click events on hamburger / menuToggle buttons across all pages
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(
      ".hamburger, #menuToggle, #hamburger, .site-nav__menu",
    );
    if (trigger) {
      event.preventDefault();
      window.toggleMenu();
      return;
    }

    // Close on outside click
    const openMenu = document.querySelector(
      ".nav__links.open, .nav__links.is-open, .site-nav__links.is-open, .site-nav__links.open",
    );
    if (openMenu && !event.target.closest(".nav, .site-nav")) {
      setNavMenuState(false);
    }
  });

  // Close mobile drawer when clicking a navigation link
  document.addEventListener("click", (event) => {
    const link = event.target.closest(".nav__links a, .site-nav__links a");
    if (link) {
      setNavMenuState(false);
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavMenuState(false);
    }
  });

  document
    .querySelectorAll('.site-nav__cart, .site-nav__icon[aria-label="Wishlist"]')
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        const isCart = link.classList.contains("site-nav__cart");
        const panelId = isCart ? "cartSidebar" : "wishSidebar";
        const openPanel = isCart ? window.openCart : window.openWish;
        if (
          document.getElementById(panelId) &&
          typeof openPanel === "function"
        ) {
          event.preventDefault();
          openPanel();
        }
      });
    });
});

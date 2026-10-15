(() => {
  const USERS_KEY = "agrismartUsers";
  const SESSION_KEY = "agrismartSession";
  const RETURN_KEY = "agrismartReturnAfterLogin";
  let seedUsers = null;
  let loginRedirectInProgress = false;
  const read = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  };
  const currentUser = () => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  };
  const scopedKey = (key) => {
    const user = currentUser();
    return user?.email
      ? `${key}:${encodeURIComponent(String(user.email).trim().toLowerCase())}`
      : "";
  };
  function readUserData(key, fallback = {}) {
    const scoped = scopedKey(key);
    if (!scoped) return fallback;
    try {
      let value = localStorage.getItem(scoped);
      if (value === null) {
        const legacy = localStorage.getItem(key);
        if (legacy !== null) {
          value = legacy;
          localStorage.setItem(scoped, legacy);
          localStorage.removeItem(key);
        }
      }
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  function writeUserData(key, value) {
    const scoped = scopedKey(key);
    if (!scoped) return false;
    try {
      localStorage.setItem(scoped, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const DEFAULT_SEED_USERS = [
    {
      name: "Agrismart Demo",
      email: "demo@agrismart.com",
      passwordHash:
        "588c55f3ce2b8569b153c5abbf13f9f74308b88a20017cc699b835cc93195d16",
      accountType: "personal",
    },
    {
      name: "Al-Rawabi Botanical Nursery",
      email: "trader@agrismart.com",
      passwordHash:
        "9946f05fee680fce966e41def648a94967505b624b40ace6ccf58c0688cca89e",
      accountType: "business",
      business: {
        name: "Al-Rawabi Botanical Nursery",
        type: "Plant nursery",
        phone: "+962 7 9811 2233",
        country: "Jordan",
        city: "Amman",
        address: "Wasfi Al-Tal St, Al-Gardens, Amman",
        contactEmail: "rawabi.nursery@agrismart.com",
      },
    },
    {
      name: "Sarah Alaa",
      email: "admin@agrismart.com",
      passwordHash:
        "3eb3fe66b31e3b4d10fa70b5cad49c7112294af6ae4e476a1c405155d45aa121",
      accountType: "admin",
      role: "admin",
    },
  ];

  async function getUsers() {
    const savedUsers = read(USERS_KEY);
    if (seedUsers === null) {
      try {
        const response = await fetch("data/users.json", { cache: "no-store" });
        seedUsers = response.ok ? await response.json() : DEFAULT_SEED_USERS;
      } catch {
        seedUsers = DEFAULT_SEED_USERS;
      }
    }
    const usersByEmail = new Map();
    [...seedUsers, ...savedUsers].forEach((user) =>
      usersByEmail.set(user.email, user),
    );
    return [...usersByEmail.values()];
  }
  const hash = async (value) => {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  };
  const isArabic = () => document.documentElement.lang === "ar";
  const message = (english, arabic) =>
    window.alert(isArabic() ? arabic : english);

  function safeReturnPath(value) {
    if (
      !value ||
      typeof value !== "string" ||
      value.startsWith("//") ||
      /^[a-z]+:/i.test(value)
    )
      return "";
    const target = new URL(value, location.href);
    if (location.protocol !== "file:" && target.origin !== location.origin)
      return "";
    if (/\/(?:login|register)\.html$/i.test(target.pathname)) return "";
    return `${target.pathname}${target.search}${target.hash}`;
  }

  function requireLogin(feature = "", returnToOverride = "") {
    if (currentUser()) return true;
    if (loginRedirectInProgress) return false;
    loginRedirectInProgress = true;
    const returnPath =
      returnToOverride ||
      `${location.pathname}${location.search}${location.hash}`;
    try {
      sessionStorage.setItem(RETURN_KEY, safeReturnPath(returnPath));
    } catch {
      /* Login still works without storage. */
    }
    const labels = {
      "the shopping cart": ["the shopping cart", "سلة التسوق"],
      "your wishlist": ["your wishlist", "قائمة المفضلة"],
      checkout: ["checkout", "إتمام الشراء"],
      payment: ["payment", "الدفع"],
      "placing an order": ["placing an order", "إتمام الطلب"],
      "cart coupons": ["cart coupons", "قسائم السلة"],
      "plant diagnosis": ["plant diagnosis", "تحليل النباتات"],
      "AI plant analysis": [
        "AI plant analysis",
        "تحليل النباتات بالذكاء الاصطناعي",
      ],
      "Agrismart AI": ["Agrismart AI", "مساعد أجري سمارت"],
      "the AI product finder": [
        "the AI product finder",
        "البحث الذكي عن المنتجات",
      ],
      "order lookup": ["order lookup", "البحث عن طلب"],
      "nearby store and delivery options": [
        "nearby store and delivery options",
        "خيارات المتاجر والتوصيل القريبة",
      ],
    };
    const label = labels[feature];
    const prompt = label
      ? [`Sign in to use ${label[0]}.`, `سجّل الدخول لاستخدام ${label[1]}.`]
      : [
          "Please sign in to use this feature.",
          "سجّل الدخول لاستخدام هذه الميزة.",
        ];
    message(prompt[0], prompt[1]);
    location.href = `login.html?required=1&returnTo=${encodeURIComponent(safeReturnPath(returnPath))}`;
    return false;
  }

  window.AgrismartAuth = {
    isLoggedIn: () => Boolean(currentUser()),
    isMerchant: () => currentUser()?.accountType === "business",
    currentUser,
    requireLogin,
    readUserData,
    writeUserData,
  };

  function renderControls() {
    const user = currentUser();
    const isMerchant = user?.accountType === "business";
    document.querySelectorAll("[data-auth-control]").forEach((control) => {
      const label = user
        ? isArabic()
          ? "تسجيل الخروج"
          : "Logout"
        : isArabic()
          ? "تسجيل الدخول"
          : "Login";
      const accountLabel = isArabic()
        ? isMerchant
          ? "الملف الشخصي للتاجر"
          : "الحساب"
        : isMerchant
          ? "Merchant Profile"
          : "Account";
      const targetPage = user
        ? isMerchant
          ? "merchant-account.html"
          : "my-account.html"
        : "login.html";
      const isSiteNav = control.classList.contains("site-nav__icon");
      const icon = control.querySelector("svg");
      if (icon && !control.dataset.authSplit) {
        const accountIcon = document.createElement("a");
        accountIcon.className = isSiteNav ? "site-nav__icon" : "btn-icon";
        accountIcon.href = targetPage;
        accountIcon.setAttribute("aria-label", accountLabel);
        accountIcon.title = accountLabel;
        accountIcon.dataset.accountIcon = "";
        accountIcon.append(icon.cloneNode(true));
        control.before(accountIcon);
        control.replaceChildren();
        control.classList.remove(isSiteNav ? "site-nav__icon" : "btn-icon");
        control.classList.add(
          isSiteNav ? "site-nav__auth-link" : "btn-auth-link",
        );
        control.dataset.authSplit = "true";
      }
      const accountIcon = control.previousElementSibling?.matches(
        "[data-account-icon]",
      )
        ? control.previousElementSibling
        : null;
      if (accountIcon) {
        accountIcon.href = targetPage;
        accountIcon.setAttribute("aria-label", accountLabel);
        accountIcon.title = accountLabel;
      }
      control.setAttribute("aria-label", label);
      control.setAttribute(
        "title",
        user ? `${label} (${user.name || user.email})` : label,
      );
      control.dataset.authState = user ? "signed-in" : "signed-out";
      if (control.tagName === "A") control.href = user ? "#" : "login.html";
      control.textContent = label;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.requiresAuth === "true" && !currentUser()) {
      const target = safeReturnPath(
        `${location.pathname}${location.search}${location.hash}`,
      );
      try {
        sessionStorage.setItem(RETURN_KEY, target);
      } catch {
        /* Continue to sign-in. */
      }
      location.replace(
        `login.html?required=1&returnTo=${encodeURIComponent(target)}`,
      );
      return;
    }
    renderControls();
    document.addEventListener("agrismart:languagechange", renderControls);
    document.addEventListener("agrismart:sessionchange", renderControls);
    document.addEventListener("click", (event) => {
      const control = event.target.closest("[data-auth-control]");
      if (!control || !currentUser()) return;
      event.preventDefault();
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem("agrismartCheckoutDetails");
      renderControls();
      document.dispatchEvent(new Event("agrismart:sessionchange"));
      message("You have signed out.", "تم تسجيل خروجك.");
      if (!/index\.html?$/.test(location.pathname) && location.pathname !== "/")
        location.href = "index.html";
    });

    const loginForm = document.getElementById("auth-form");
    if (loginForm) {
      if (new URLSearchParams(location.search).get("required") === "1") {
        const notice = document.createElement("p");
        notice.setAttribute("role", "status");
        notice.style.cssText =
          "margin:0 0 1rem;padding:.85rem 1rem;border:1px solid #b7e4c7;border-radius:12px;background:#effaf2;color:#14532d;font-size:.92rem;line-height:1.55";
        notice.textContent = isArabic()
          ? "تحتاج إلى تسجيل الدخول لاستخدام هذه الميزة. بعد الدخول ستعود إلى الصفحة التي كنت تتصفحها."
          : "Sign in to use this feature. After signing in, you will return to the page you were browsing.";
        loginForm.before(notice);
      }
      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document
          .getElementById("email")
          ?.value.trim()
          .toLowerCase();
        const password = document.getElementById("password")?.value || "";
        const user = (await getUsers()).find((entry) => entry.email === email);
        if (!user || user.passwordHash !== (await hash(password))) {
          message(
            "Email or password is incorrect.",
            "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
          );
          return;
        }
        save(SESSION_KEY, {
          email: user.email,
          name: user.name,
          accountType: user.accountType || "personal",
          businessName: user.business?.name || "",
        });
        if (
          user.accountType === "admin" ||
          user.role === "admin" ||
          user.email === "admin@agrismart.com"
        ) {
          localStorage.setItem(
            "agrismartAdminSession",
            JSON.stringify({
              name: user.name || "Sarah Alaa",
              email: user.email,
              role: "admin",
              title: "Operations Lead",
            }),
          );
          location.href = "admin-dashboard.html";
          return;
        }
        let returnTo = "";
        try {
          returnTo = safeReturnPath(
            new URLSearchParams(location.search).get("returnTo") ||
              sessionStorage.getItem(RETURN_KEY) ||
              "",
          );
        } catch {
          /* Use the default destination. */
        }
        try {
          sessionStorage.removeItem(RETURN_KEY);
        } catch {
          /* Ignore unavailable storage. */
        }
        if (!returnTo) {
          returnTo =
            user.accountType === "business"
              ? "merchant-dashboard.html"
              : "my-account.html";
        }
        location.href = returnTo;
      });
    }

    const registerForm = document.getElementById("createAccountForm");
    if (registerForm) {
      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("fullName")?.value.trim();
        const email = document
          .getElementById("userEmail")
          ?.value.trim()
          .toLowerCase();
        const password = document.getElementById("passwordField")?.value || "";
        const accountType =
          document.getElementById("accountType")?.value || "personal";
        if (!name || !email || password.length < 8) {
          message(
            "Enter your name and email, and use a password with at least 8 characters.",
            "أدخل الاسم والبريد الإلكتروني، واستخدم كلمة مرور من 8 أحرف على الأقل.",
          );
          return;
        }
        const users = read(USERS_KEY);
        const allUsers = await getUsers();
        if (allUsers.some((user) => user.email === email)) {
          message(
            "An account with this email already exists.",
            "يوجد حساب مسجل بهذا البريد الإلكتروني.",
          );
          return;
        }
        const business =
          accountType === "business"
            ? {
                name: document.getElementById("businessName").value.trim(),
                type: document.getElementById("businessType").value,
                phone: document.getElementById("businessPhone").value.trim(),
                country: document.getElementById("businessCountry").value,
                city: document.getElementById("businessCity").value.trim(),
                address: document
                  .getElementById("businessAddress")
                  .value.trim(),
                contactEmail: document
                  .getElementById("businessEmail")
                  .value.trim()
                  .toLowerCase(),
                salesModel: document.getElementById("businessModel").value,
                locations: document.getElementById("businessBranches").value,
                serviceArea: document
                  .getElementById("businessServiceArea")
                  .value.trim(),
                registrationNumber: document
                  .getElementById("businessRegistration")
                  .value.trim(),
                taxNumber: document
                  .getElementById("businessTaxId")
                  .value.trim(),
                website: document
                  .getElementById("businessWebsite")
                  .value.trim(),
                yearsInBusiness: document.getElementById("businessYears").value,
                monthlyWholesaleOrders:
                  document.getElementById("wholesaleVolume").value,
                productCategories: [
                  ...document.querySelectorAll(
                    '[name="productCategories"]:checked',
                  ),
                ].map((field) => field.value),
                notes: document.getElementById("businessNotes").value.trim(),
              }
            : null;
        users.push({
          name,
          email,
          passwordHash: await hash(password),
          accountType,
          business,
        });
        save(USERS_KEY, users);
        save(SESSION_KEY, {
          name,
          email,
          accountType,
          businessName: business?.name || "",
        });
        let returnTo = "";
        try {
          returnTo = safeReturnPath(
            new URLSearchParams(location.search).get("returnTo") ||
              sessionStorage.getItem(RETURN_KEY) ||
              "",
          );
        } catch {
          /* Use the default destination. */
        }
        try {
          sessionStorage.removeItem(RETURN_KEY);
        } catch {
          /* Ignore unavailable storage. */
        }
        if (!returnTo) {
          returnTo =
            accountType === "business"
              ? "merchant-dashboard.html"
              : "my-account.html";
        }
        location.href = returnTo;
      });
    }
  });
})();

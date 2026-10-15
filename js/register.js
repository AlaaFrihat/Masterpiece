document.addEventListener("DOMContentLoaded", () => {
  // Simple Micro-Interactions for Account Form
  const rolePersonal = document.getElementById("role-personal");
  const roleTrader = document.getElementById("role-trader");
  const rolePersonalCheck = document.getElementById("role-personal-check");
  const roleTraderCheck = document.getElementById("role-trader-check");
  const traderBadgeField = document.getElementById("traderBadgeField");
  const businessFields = document.getElementById("businessFields");
  const accountType = document.getElementById("accountType");
  const registrationCard = document.querySelector(".reg-card");

  function setAccountType(type) {
    const isTrader = type === "business";
    registrationCard?.classList.toggle("is-business", isTrader);
    accountType.value = isTrader ? "business" : "personal";
    document.getElementById("registrationHeading").textContent = isTrader
      ? "Create your business account"
      : "Create your account";
    document.getElementById("registrationDescription").textContent = isTrader
      ? "Set up your shop profile and request wholesale access."
      : "Start nurturing your smart botanical sanctuary today.";
    document.getElementById("registrationSubmitText").textContent = isTrader
      ? "Create Business Account"
      : "Create Account";
    businessFields.hidden = !isTrader;
    businessFields
      .querySelectorAll("input, select, textarea")
      .forEach((field) => {
        field.disabled = !isTrader;
      });
    rolePersonal.className = `reg-role-btn ${isTrader ? "inactive" : "active"}`;
    roleTrader.className = `reg-role-btn ${isTrader ? "active" : "inactive"}`;
    rolePersonal.setAttribute("aria-pressed", String(!isTrader));
    roleTrader.setAttribute("aria-pressed", String(isTrader));
    rolePersonal.setAttribute("aria-expanded", "false");
    roleTrader.setAttribute("aria-expanded", String(isTrader));
    rolePersonalCheck.classList.toggle("hidden", isTrader);
    roleTraderCheck.classList.toggle("hidden", !isTrader);
    traderBadgeField.classList.toggle("hidden", !isTrader);
  }

  if (rolePersonal && roleTrader) {
    setAccountType("personal");
    rolePersonal.addEventListener("click", () => setAccountType("personal"));
    roleTrader.addEventListener("click", () => setAccountType("business"));
  }

  // Password Visibility Toggle
  const togglePasswordBtn = document.getElementById("togglePasswordBtn");
  const passwordField = document.getElementById("passwordField");
  const passwordIconState = document.getElementById("passwordIconState");

  if (togglePasswordBtn && passwordField && passwordIconState) {
    togglePasswordBtn.addEventListener("click", () => {
      const isPassword = passwordField.getAttribute("type") === "password";
      passwordField.setAttribute("type", isPassword ? "text" : "password");
      passwordIconState.textContent = isPassword
        ? "visibility_off"
        : "visibility";
      togglePasswordBtn.setAttribute("aria-pressed", String(isPassword));
      togglePasswordBtn.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password",
      );
    });
  }

  const strengthValue = document.getElementById("passwordStrengthValue");
  const strengthMeter = document.getElementById("passwordStrengthMeter");
  const strengthSegments = [...document.querySelectorAll(".reg-pwd-segment")];
  const passwordRules = [...document.querySelectorAll("[data-password-rule]")];
  if (passwordField && strengthValue && strengthMeter) {
    const updatePasswordStrength = () => {
      const password = passwordField.value;
      const rules = {
        length: password.length >= 8,
        case: /[a-z]/.test(password) && /[A-Z]/.test(password),
        number: /\d/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
      };
      passwordRules.forEach((rule) => {
        const met = Boolean(rules[rule.dataset.passwordRule]);
        rule.classList.toggle("is-met", met);
        rule.querySelector("span").textContent = met ? "✓" : "○";
      });

      const score = password
        ? Object.values(rules).filter(Boolean).length +
          Number(password.length >= 12)
        : 0;
      const level = !password
        ? "empty"
        : score <= 1
          ? "weak"
          : score === 2
            ? "fair"
            : score <= 4
              ? "good"
              : "strong";
      const labels = {
        empty: "Add a password to see its strength",
        weak: "Weak — add more variety",
        fair: "Fair — add another requirement",
        good: "Good password",
        strong: "Strong password",
      };
      const activeSegments = password
        ? Math.max(1, Math.ceil((score * strengthSegments.length) / 5))
        : 0;
      strengthValue.textContent = labels[level];
      strengthValue.dataset.strength = level;
      strengthMeter.dataset.strength = level;
      strengthMeter.setAttribute("aria-valuenow", String(score));
      strengthMeter.setAttribute("aria-valuetext", labels[level]);
      strengthSegments.forEach((segment, index) =>
        segment.classList.toggle("is-active", index < activeSegments),
      );
    };
    passwordField.addEventListener("input", updatePasswordStrength);
    updatePasswordStrength();
  }

  // Segment Tab Switchers Visual Feedback
  const tabSignIn = document.getElementById("tab-signin");
  const tabSignUp = document.getElementById("tab-signup");
  if (tabSignIn && tabSignUp) {
    tabSignIn.addEventListener("click", () => {
      tabSignIn.className = "reg-tab active";
      tabSignUp.className = "reg-tab inactive";
    });

    tabSignUp.addEventListener("click", () => {
      tabSignUp.className = "reg-tab active";
      tabSignIn.className = "reg-tab inactive";
    });
  }
});

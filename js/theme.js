(() => {
  const root = document.documentElement;
  const storageKey = "agrismartTheme";

  function applyTheme(theme) {
    const dark = theme === "dark";
    root.dataset.theme = dark ? "dark" : "light";
    root.classList.toggle("dark", dark);
    root.classList.toggle("dark-mode", dark);
    document.body?.classList.toggle("dark", dark);
    document.body?.classList.toggle("dark-mode", dark);

    // Sync all Honeybee & Firefly toggle checkboxes
    document
      .querySelectorAll(".agri-toggle__checkbox, #bee-theme-checkbox")
      .forEach((checkbox) => {
        checkbox.checked = dark;
      });

    // Sync labels / accessibility
    document.querySelectorAll(".agri-toggle, #themeToggle").forEach((el) => {
      el.setAttribute("aria-pressed", String(dark));
      const labelText = dark ? "Switch to light mode" : "Switch to dark mode";
      el.setAttribute("aria-label", labelText);
      el.title = labelText;

      const sun = el.querySelector("#themeIconLight");
      const moon = el.querySelector("#themeIconDark");
      if (sun && moon) {
        sun.classList.toggle("hidden-icon", !dark);
        moon.classList.toggle("hidden-icon", dark);
      } else {
        const icon =
          el.querySelector("[data-theme-icon]") || el.querySelector("span");
        if (icon) icon.textContent = dark ? "☀" : "☾";
      }
    });
  }

  function saveAndApplyTheme(nextTheme) {
    try {
      localStorage.setItem(storageKey, nextTheme);
      localStorage.setItem("theme", nextTheme);
    } catch (e) {}
    applyTheme(nextTheme);
  }

  const savedTheme =
    localStorage.getItem(storageKey) || localStorage.getItem("theme");
  applyTheme(savedTheme === "dark" ? "dark" : "light");

  // Checkbox change listener
  document.addEventListener("change", (event) => {
    const checkbox = event.target.closest(
      ".agri-toggle__checkbox, #bee-theme-checkbox",
    );
    if (!checkbox) return;
    const nextTheme = checkbox.checked ? "dark" : "light";
    saveAndApplyTheme(nextTheme);
  });

  // Legacy button click listener (if button element)
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button#themeToggle");
    if (!button) return;
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    saveAndApplyTheme(nextTheme);
  });

  // Sync on DOMContentLoaded in case script ran before elements parsed
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      const currentTheme =
        root.dataset.theme ||
        localStorage.getItem(storageKey) ||
        localStorage.getItem("theme") ||
        "light";
      applyTheme(currentTheme);
    });
  }
})();

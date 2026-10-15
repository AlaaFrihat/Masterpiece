(() => {
  const root = document.documentElement;
  const storageKey = "agrismartTheme";

  function applyTheme(theme) {
    const dark = theme === "dark";
    root.dataset.theme = dark ? "dark" : "light";
    root.classList.toggle("dark", dark);
    document.body?.classList.toggle("dark", dark);

    document.querySelectorAll("#themeToggle").forEach((button) => {
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode",
      );
      button.title = dark ? "Switch to light mode" : "Switch to dark mode";

      const sun = button.querySelector("#themeIconLight");
      const moon = button.querySelector("#themeIconDark");
      if (sun && moon) {
        sun.classList.toggle("hidden-icon", !dark);
        moon.classList.toggle("hidden-icon", dark);
      } else {
        const icon =
          button.querySelector("[data-theme-icon]") ||
          button.querySelector("span");
        if (icon) icon.textContent = dark ? "☀" : "☾";
      }
    });
  }

  const savedTheme = localStorage.getItem(storageKey);
  applyTheme(savedTheme === "dark" ? "dark" : "light");

  document.addEventListener("click", (event) => {
    const button = event.target.closest("#themeToggle");
    if (!button) return;
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  });
})();

(() => {
  const escapeXml = (value) =>
    String(value || "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&apos;",
        })[char],
    );

  window.createSeedThumbnail = (name) => {
    const palette =
      name.toLowerCase().includes("flower") ||
      name.toLowerCase().includes("zinnia")
        ? ["#fff0ec", "#c95768"]
        : name.toLowerCase().includes("sunflower") ||
            name.toLowerCase().includes("lemon")
          ? ["#fff6d9", "#d6a42e"]
          : ["#edf4e8", "#4f8053"];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180"><rect width="160" height="180" rx="18" fill="#f1f5ef"/><g transform="rotate(-3 80 90)"><rect x="37" y="18" width="86" height="144" rx="10" fill="${palette[0]}" stroke="#d8dfd4" stroke-width="2"/><path d="M37 29a11 11 0 0 1 11-11h64a11 11 0 0 1 11 11v5H37z" fill="${palette[1]}"/><text x="80" y="49" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" font-weight="700" fill="#294330">AGRISMART SEEDS</text><path d="M80 112V67m0 27c-20 0-24-12-22-22 12 1 19 8 22 17m0 5c20 0 24-12 22-22-12 1-19 8-22 17" fill="none" stroke="#4f8053" stroke-width="4" stroke-linecap="round"/><text x="80" y="134" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="700" fill="#26382b">${escapeXml(name.replace(/\s+Seeds?$/i, ""))}</text><text x="80" y="148" text-anchor="middle" font-family="Arial,sans-serif" font-size="6" letter-spacing="1" fill="#718174">PREMIUM SEEDS</text></g></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };
})();

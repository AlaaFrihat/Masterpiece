(() => {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const fertilizerProducts = [
    {
      id: "fertilizer-organic-plant-food",
      name: "Organic Plant Food Concentrate",
      price: 10.5,
      pack: "250 ML",
      quality: "organic beginner",
      description: "Gentle liquid feed for indoor and outdoor plants.",
      image: "assets/fertilizers/organic-plant-food.svg",
      rank: 13,
      newest: 15,
    },
    {
      id: "fertilizer-balanced-indoor-feed",
      name: "Balanced Indoor Plant Fertilizer",
      price: 8.75,
      pack: "250 ML",
      quality: "beginner",
      description: "Everyday nutrition for leafy houseplants.",
      image: "assets/fertilizers/indoor-balanced-feed.svg",
      rank: 14,
      newest: 14,
    },
    {
      id: "fertilizer-seaweed-extract",
      name: "Seaweed Plant Tonic",
      price: 12.5,
      pack: "250 ML",
      quality: "organic",
      description: "Seaweed-based tonic for a thriving garden.",
      image: "assets/fertilizers/seaweed-tonic.svg",
      rank: 15,
      newest: 16,
    },
    {
      id: "fertilizer-cactus-succulent-feed",
      name: "Cactus & Succulent Feed",
      price: 7.5,
      pack: "200 ML",
      quality: "beginner",
      description: "A measured feed made for succulents and cacti.",
      image: "assets/fertilizers/cactus-feed.svg",
      rank: 16,
      newest: 13,
    },
    {
      id: "fertilizer-slow-release-pellets",
      name: "Slow-Release Plant Food Pellets",
      price: 9.25,
      pack: "250 G",
      quality: "beginner",
      description: "Easy-to-measure pellets for steady, long-lasting feeding.",
      image: "assets/fertilizers/slow-release-pellets.svg",
      rank: 17,
      newest: 17,
    },
    {
      id: "fertilizer-orchid-bloom-feed",
      name: "Orchid Bloom Fertilizer",
      price: 8.5,
      pack: "200 ML",
      quality: "beginner",
      description: "A gentle liquid feed formulated for healthy orchid blooms.",
      image: "assets/fertilizers/orchid-bloom-feed.svg",
      rank: 18,
      newest: 18,
    },
    {
      id: "fertilizer-tomato-vegetable-feed",
      name: "Tomato & Vegetable Fertilizer",
      price: 11.75,
      pack: "500 ML",
      quality: "organic",
      description: "Garden nutrition for productive tomatoes and vegetables.",
      image: "assets/fertilizers/tomato-vegetable-feed.svg",
      rank: 19,
      newest: 19,
    },
    {
      id: "fertilizer-root-growth-starter",
      name: "Root Growth Starter",
      price: 9.75,
      pack: "250 G",
      quality: "beginner",
      description: "A planting-time starter to support strong new roots.",
      image: "assets/fertilizers/root-growth-starter.svg",
      rank: 20,
      newest: 20,
    },
    {
      id: "fertilizer-premium-worm-castings",
      name: "Premium Worm Castings",
      price: 13.5,
      pack: "1 KG",
      quality: "organic",
      description: "A rich, natural soil amendment for garden beds and pots.",
      image: "assets/fertilizers/worm-castings.svg",
      rank: 21,
      newest: 21,
    },
    {
      id: "fertilizer-citrus-plant-feed",
      name: "Citrus Plant Fertilizer",
      price: 10.25,
      pack: "500 ML",
      quality: "organic beginner",
      description:
        "Balanced liquid nutrition for lemon and other citrus trees.",
      image: "assets/fertilizers/citrus-plant-feed.svg",
      rank: 22,
      newest: 22,
    },
  ];

  fertilizerProducts.forEach((product) => {
    const column = document.createElement("div");
    column.className = "col product-column";
    Object.assign(column.dataset, {
      category: "fertilizers",
      quality: product.quality,
      price: String(product.price),
      productImage: product.image,
      rank: String(product.rank),
      newest: String(product.newest),
      productId: product.id,
    });
    column.innerHTML = `<article class="product-card h-100"><div class="product-image-wrap fertilizer-image-wrap"><span class="product-badge">Plant care</span><button class="wishlist-button" type="button" aria-label="Add ${product.name} to wishlist" aria-pressed="false">♡</button><img class="fertilizer-product-image" src="${product.image}" alt="${product.name}, ${product.pack}" loading="lazy"></div><div class="product-info"><p class="product-category">Fertilizers</p><h3>${product.name}</h3><p class="fertilizer-description">${product.description}</p><div class="product-price"><span>$${product.price.toFixed(2)}</span></div><button class="btn add-cart-button" type="button" data-product-name="${product.name}">Add to Cart</button></div></article>`;
    grid.append(column);
  });

  const cards = [...grid.querySelectorAll(".product-column")];
  const count = document.getElementById("resultCount");
  const emptyState = document.getElementById("emptyState");
  const sortSelect = document.getElementById("sortProducts");
  const minPrice = document.getElementById("minPrice");
  const maxPrice = document.getElementById("maxPrice");
  const selected = (selector) =>
    [...document.querySelectorAll(`${selector}:checked`)].map(
      (input) => input.value,
    );

  function updateProducts() {
    const categories = selected(".category-filter");
    const qualities = selected(".quality-filter");
    const low = Number(minPrice.value || 0);
    const high = Number(maxPrice.value || Infinity);
    let visible = 0;

    cards.forEach((card) => {
      const cardQualities = card.dataset.quality.split(" ");
      const matches =
        (!categories.length || categories.includes(card.dataset.category)) &&
        qualities.every((quality) => cardQualities.includes(quality)) &&
        Number(card.dataset.price) >= low &&
        Number(card.dataset.price) <= high;
      card.classList.toggle("d-none", !matches);
      if (matches) visible += 1;
    });

    const order = sortSelect.value;
    cards
      .sort((a, b) => {
        if (order === "price-asc")
          return Number(a.dataset.price) - Number(b.dataset.price);
        if (order === "newest")
          return Number(b.dataset.newest) - Number(a.dataset.newest);
        return Number(a.dataset.rank) - Number(b.dataset.rank);
      })
      .forEach((card) => grid.append(card));

    count.textContent = visible;
    emptyState.classList.toggle("d-none", visible > 0);
  }

  document
    .querySelectorAll(".category-filter, .quality-filter")
    .forEach((input) => input.addEventListener("change", updateProducts));
  [minPrice, maxPrice].forEach((input) =>
    input.addEventListener("input", updateProducts),
  );
  sortSelect.addEventListener("change", updateProducts);
  document.getElementById("clearFilters").addEventListener("click", () => {
    document
      .querySelectorAll(".category-filter, .quality-filter")
      .forEach((input) => {
        input.checked = false;
      });
    minPrice.value = "0";
    maxPrice.value = "30";
    sortSelect.value = "featured";
    updateProducts();
  });

  document.querySelectorAll(".add-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (
        window.AgrismartAuth &&
        !window.AgrismartAuth.requireLogin("the shopping cart")
      )
        return;
      const name = button.dataset.productName;
      const card = button.closest(".product-column");
      const priceText = card.querySelector(
        ".sale-price, .product-price > span",
      ).textContent;
      const price = Number(priceText.replace(/[^\d.]/g, ""));
      const id =
        card.dataset.productId ||
        `seed-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      const isFertilizer = card.dataset.category === "fertilizers";
      const image = isFertilizer
        ? card.dataset.productImage
        : typeof window.createSeedThumbnail === "function"
          ? window.createSeedThumbnail(name)
          : "assets/logo.svg";
      if (typeof window.addToCart === "function")
        window.addToCart(
          id,
          name,
          price,
          image,
          1,
          isFertilizer ? "Fertilizers" : "Seeds",
        );
      const original = button.textContent;
      button.textContent = "Added ✓";
      button.classList.add("added");
      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove("added");
      }, 1200);
    });
  });

  document.querySelectorAll(".wishlist-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (
        window.AgrismartAuth &&
        !window.AgrismartAuth.requireLogin("your wishlist")
      )
        return;
      const active = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(active));
      button.textContent = active ? "♥" : "♡";
    });
  });

  updateProducts();
})();

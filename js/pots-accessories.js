(() => {
  const grid = document.getElementById('productGrid');
  const productCards = [...grid.querySelectorAll('.product-column')];
  const count = document.getElementById('resultCount');
  const emptyState = document.getElementById('emptyState');
  const sortSelect = document.getElementById('sortProducts');
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');

  function selectedValues(selector) {
    return [...document.querySelectorAll(`${selector}:checked`)].map(input => input.value);
  }

  function applyFilters() {
    const categories = selectedValues('.category-filter');
    const colors = selectedValues('.color-filter');
    const low = Number(minPrice.value || 0);
    const high = Number(maxPrice.value || Infinity);
    let visible = 0;

    productCards.forEach(card => {
      const show = (!categories.length || categories.includes(card.dataset.category))
        && (!colors.length || colors.includes(card.dataset.color))
        && Number(card.dataset.price) >= low
        && Number(card.dataset.price) <= high;
      card.classList.toggle('d-none', !show);
      if (show) visible += 1;
    });

    const order = sortSelect.value;
    productCards.sort((a, b) => {
      if (order === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
      if (order === 'newest') return Number(b.dataset.newest) - Number(a.dataset.newest);
      return Number(a.dataset.rank) - Number(b.dataset.rank);
    }).forEach(card => grid.append(card));

    count.textContent = visible;
    emptyState.classList.toggle('d-none', visible > 0);
  }

  document.querySelectorAll('.category-filter, .color-filter').forEach(input => input.addEventListener('change', applyFilters));
  [minPrice, maxPrice].forEach(input => input.addEventListener('input', applyFilters));
  sortSelect.addEventListener('change', applyFilters);
  document.getElementById('clearFilters').addEventListener('click', () => {
    document.querySelectorAll('.category-filter, .color-filter').forEach(input => { input.checked = false; });
    minPrice.value = '0';
    maxPrice.value = '100';
    sortSelect.value = 'featured';
    applyFilters();
  });

  document.querySelectorAll('.add-cart-button').forEach(button => {
    button.addEventListener('click', () => {
      if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin('the shopping cart')) return;
      const productName = button.dataset.productName;
      const card = button.closest('.product-column');
      const id = `pots-${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      const priceText = card.querySelector('.sale-price, .product-price > span').textContent;
      const price = Number(priceText.replace(/[^\d.]/g, ''));
      const image = card.querySelector('.product-image').src;
      console.log(`${productName} added to cart`);
      if (typeof window.addToCart === 'function') window.addToCart(id, productName, price, image);
      const originalText = button.textContent;
      button.textContent = 'Added ✓';
      button.classList.add('added');
      window.setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('added');
      }, 1200);
    });
  });

  document.querySelectorAll('.wishlist-button').forEach(button => {
    button.addEventListener('click', () => {
      if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin('your wishlist')) return;
      const selected = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(selected));
      button.textContent = selected ? '♥' : '♡';
    });
  });

  applyFilters();
})();

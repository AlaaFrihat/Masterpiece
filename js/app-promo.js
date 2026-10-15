(() => {
  const footer = document.querySelector("footer.footer");
  if (!footer || document.querySelector(".app-promo")) return;

  const markup = `
    <section class="app-promo" aria-labelledby="app-promo-title">
      <div class="app-promo__panel">
        <div class="app-promo__copy">
          <span class="app-promo__eyebrow">Agrismart Mobile Experience</span>
          <h2 class="app-promo__title" id="app-promo-title">Your whole garden shop<span>in your pocket.</span></h2>
          <p class="app-promo__description">Explore the Agrismart experience on your phone: discover plants, check care details, save favorites, manage your cart, and follow your orders.</p>
          <div class="app-promo__features" aria-label="App features">
            <span class="app-promo__feature">Browse &amp; Search</span>
            <span class="app-promo__feature">Plant Care Guides</span>
            <span class="app-promo__feature">Favorites &amp; Cart</span>
            <span class="app-promo__feature">Checkout &amp; Orders</span>
            <span class="app-promo__feature">Account &amp; Order Tracking</span>
          </div>
          <div class="app-promo__stores" aria-label="Mobile app availability">
            <div class="app-promo__store"><span class="app-promo__store-icon" aria-hidden="true">▶</span><span><small>GET IT ON</small><strong>Google Play</strong></span><span class="app-promo__soon">COMING SOON</span></div>
            <div class="app-promo__store"><span class="app-promo__store-icon" aria-hidden="true">●</span><span><small>DOWNLOAD ON THE</small><strong>App Store</strong></span><span class="app-promo__soon">COMING SOON</span></div>
          </div>
        </div>

        <div class="app-promo__stage" aria-label="Agrismart app screen previews">
          <div class="app-phone app-phone--back">
            <div class="app-phone__screen">
              <span class="app-phone__island"></span><div class="app-phone__status"><span>9:41</span><span>●●●  ▰</span></div>
              <div class="app-phone__bar"><span class="app-phone__brand"><img src="assets/logo.svg" alt=""><span>Agrismart</span></span><span class="app-phone__icon">♡　♙</span></div>
              <div class="app-phone__search">⌕ &nbsp; Search plants, pots, seeds...</div>
              <div class="app-phone__content">
                <div class="app-phone__hero"><b>Bring more green into your home</b><span>Explore plants →</span></div>
                <div class="app-phone__section-title"><b>Shop by category</b><span>See all</span></div>
                <div class="app-phone__categories"><span class="app-phone__category is-active">Indoor</span><span class="app-phone__category">Outdoor</span><span class="app-phone__category">Succulents</span></div>
                <div class="app-phone__section-title"><b>Popular plants</b><span>View all</span></div>
                <div class="app-phone__product"><span class="app-phone__plant"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_L4cTO3ar9Qc7G98PzFmzbuGdY6qTgulnq3k7CDjmFsmgD_DaJIe6dNINqe8vDZ-G0qfc0pJdxNny4bkz0E4HaF7lk5yIdZQs9NojIEQ9swpJF6dzpp5ctCQmpO6CkByYxiThWF_1BBnXFAtayAh4RS9y5v5QF3pJkrZ7uZSHmm_nBUUrGUT96GCSh58kqHau4NJZlxoiZrCkQHvh28Kas-_XPbfJLAiglezWvBU" alt=""></span><span class="app-phone__product-copy"><b>Fiddle Leaf Fig</b><span>Indoor · ★ 4.9</span></span><span class="app-phone__price">$28.99</span></div>
                <div class="app-phone__product"><span class="app-phone__plant"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKXARjf0gVPNC3kU-dNNyitZsSwFE7cRhw9nNsf6oYq4zRl76DCai_5R86v_aQqsNBN3hrYMVt66QFzoAEBuaEWJP-QVXHPTAItuuk-GInXfIcVZL_UwbAi7djHZKLB4_MMmEgzCf-CTGzXrSDGbv8HUbzamORDbTueRoXuZZqOi8GYQcLJN_1vRRVh_d_go-ZBjP4lB0WzV6dLea0LPjqEFiCh5VK_qWiR1cKgkE" alt=""></span><span class="app-phone__product-copy"><b>Snake Plant</b><span>Indoor · ★ 4.8</span></span><span class="app-phone__price">$22.50</span></div>
              </div>
              <div class="app-phone__nav"><span class="is-active">⌂<br>Home</span><span>▦<br>Shop</span><span>♡<br>Saved</span><span>▣<br>Cart</span><span>♙<br>Account</span></div>
            </div>
          </div>

          <div class="app-phone app-phone--front">
            <div class="app-phone__screen">
              <span class="app-phone__island"></span><div class="app-phone__status"><span>9:41</span><span>●●●  ▰</span></div>
              <div class="app-phone__bar"><span class="app-phone__icon">‹</span><span class="app-phone__brand"><img src="assets/logo.svg" alt=""><span>Agrismart</span></span><span class="app-phone__icon">♡</span></div>
              <div class="app-phone__content">
                <div class="app-phone__product-photo"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYAawGrGqAPn8W_QBX71xI7sxzGQO65vsyPbVX_UzKhkIHUyLULu7sq5xiS0X-4bSmFgqVQZwLij3q44MKw3_etTLaSDnjbd1RzzmYOJxCWBiKaET-9igevEVol-rKfDGJsePTA-X4rBn9sn8PG8R13fngg11H8qZeA3m8AvKtVh-2VqadUs5eNaJW1gvrIK8eE7ntKr0pyi018Tee4c4nL_jL6Iot48X8dIZvQrKUoOFGOm3n1fsP" alt="Peace lily plant"></div>
                <div class="app-phone__section-title"><b>Peace Lily</b><span>♡ Save</span></div>
                <div class="app-phone__rating">★★★★★ &nbsp; 4.8 (128 reviews)</div>
                <div style="margin-top:6px;color:#07823e;font-weight:800;font-size:12px">$18.50</div>
                <div class="app-phone__care"><b>Plant care at a glance</b>Bright, indirect light<br>Water when the top soil feels dry<br>Great for living rooms &amp; bedrooms</div>
                <div class="app-phone__categories" style="margin-top:8px"><span class="app-phone__category is-active">Overview</span><span class="app-phone__category">Care guide</span><span class="app-phone__category">Reviews</span></div>
                <span class="app-phone__button">Add to Cart　＋</span>
              </div>
              <div class="app-phone__nav"><span>⌂<br>Home</span><span class="is-active">▦<br>Shop</span><span>♡<br>Saved</span><span>▣<br>Cart</span><span>♙<br>Account</span></div>
            </div>
          </div>

          <div class="app-phone app-phone--back">
            <div class="app-phone__screen">
              <span class="app-phone__island"></span><div class="app-phone__status"><span>9:41</span><span>●●●  ▰</span></div>
              <div class="app-phone__bar"><span class="app-phone__icon">‹</span><span class="app-phone__brand"><img src="assets/logo.svg" alt=""><span>Your Cart</span></span><span class="app-phone__icon">♡</span></div>
              <div class="app-phone__content">
                <div class="app-phone__cartline"><span class="app-phone__plant">🪴</span><span class="app-phone__product-copy"><b>Peace Lily</b><span>$18.50 · Qty 1</span></span><span class="app-phone__qty">−　1　＋</span></div>
                <div class="app-phone__cartline"><span class="app-phone__plant">🌿</span><span class="app-phone__product-copy"><b>Snake Plant</b><span>$22.50 · Qty 1</span></span><span class="app-phone__qty">−　1　＋</span></div>
                <div class="app-phone__categories" style="margin-top:9px"><span class="app-phone__category">Apply coupon</span><span class="app-phone__category">GREEN10</span></div>
                <div class="app-phone__summary"><div><span>Subtotal</span><b>$41.00</b></div><div><span>Shipping</span><b>Free</b></div><div><span>Discount</span><b>−$4.10</b></div><div class="app-phone__total"><span>Total</span><b>$36.90</b></div></div>
                <span class="app-phone__button">Proceed to Checkout →</span>
                <div class="app-phone__care"><b>Secure checkout</b>Delivery details · Order summary · Support</div>
              </div>
              <div class="app-phone__nav"><span>⌂<br>Home</span><span>▦<br>Shop</span><span>♡<br>Saved</span><span class="is-active">▣<br>Cart</span><span>♙<br>Account</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  footer.insertAdjacentHTML("beforebegin", markup);
})();

/* ── Product Data ──────────────────────────────────────── */
const plants = [
  { id:1,  img:'https://lh3.googleusercontent.com/aida-public/AB6AXuCxX4pPq1zdbYROEtBXgdiUtWCht8t_OO6dniyG6fVHd-ldECOadQl_mdwEC3SBtfnZ-tbzYLKXD48ip8bI7eK-YN4KLVVD_Ljhz0oY00JSNF23bBGSZeamdRSwPry6yJsbWoWB47R_dnEBz-T2IS9Cw4od-sv-8N2WqHiTNV25KwvgJoWIrNvNzNPOyvMUAda4iNOsh0SaBFXPkd9pMWEpRpCmMZLMoYZPIqhfw3w', name:'Monstera Deliciosa', category:'indoor',    price:34.99, oldPrice:49.99, stars:5, reviews:128, badge:'sale',  cart:'monstera'  },
  { id:2,  img:'https://lh3.googleusercontent.com/aida-public/AB6AXuBosZUPKaF_Di0bCi28TwVspppqzcU2AiFrhMOTcpztSTWsjr_3JrbJMOmpVba8O2MVTTiz-wOcjoW2Q4rv8YvZJyhWGb810pSUMt-Ht3H3_JvNLWAiaRg-01EjfuPfSuZp7MA5NfefkIOuY4N7lDs1LeJ3k3_-L7LnfojH_edLzZILozBOHVPgxYM06mXJFKaY3miocuYRWDyLvqMwU8EHclagy4JygLCfbpyCiZg', name:'Desert Rose Cactus', category:'succulent', price:18.99, oldPrice:null,  stars:4, reviews:84,  badge:'new',   cart:'cactus'    },
  { id:3,  img:'https://lh3.googleusercontent.com/aida-public/AB6AXuCIMW8MffwIr8QZPKwgLHX8aIuQLA4_BTnTilOPQJzS7W-F7O1LNfj_up_cdRkIRUjhVNaTB-M9X37U-I3bR3pzXYwChPedg5QwmxSGc3XLRJRVNfxzSoLj90x3P-VGYWPBHwr12msjfxgW_56aqfdqhsyMgb3krRn7WD0eGxjkwcmNGUFubs3uaOHA6RF_Qx1JB9cbWcjTpGuIFrCg9IjMVm2BrG0KI1ipSLx1avQ', name:'Areca Palm',         category:'tropical',  price:42.99, oldPrice:55.00, stars:5, reviews:203, badge:'hot',   cart:'palm'      },
  { id:4,  img:'https://lh3.googleusercontent.com/aida-public/AB6AXuCAEKb5emxrkGB2PFIQawi5MwO69Rot6n32xMXlhU_-ekARPSR03B6kjo3Q32OorgxmZL5qhgUFG5OsiipD2XpYsn8azvLKVCPVoTgmgyruqFAwrD052XMSp3XdY6fBY0ev0HjXQIz2EZT_dvb7OGOOmPQKimmkbOvZZFfWE9tjP6gd55J0-0xEX0O-I7pHfkmQDOKeuwAg4q9GCoh6LeHWNktC2PBXF3xBVjXSQhY', name:'Peace Lily',         category:'flowering', price:24.99, oldPrice:null,  stars:4, reviews:67,  badge:null,    cart:'lily'      },
  { id:5,  img:'https://lh3.googleusercontent.com/aida-public/AB6AXuCv1RLXMu_iFFM_SvHDdNxlbd6whH5Ag2tTAB4A9n95QdbrwDJdCGl7DmrreS9vSEZPa-cWv9uwTWuqt_Fk-czgBzTB0scf2xlgkRSORW0TSKcvzwryTYLdnXebXSVk7azleo2ocAD_qzDiK6YpwgAtpWqGY_O2D1F0FEeXGDjIw7UT5r22msiHZYOR3rSPVk5Ue1m1gAZbez02EpP6GSOJs8L18txR-rxthG1CcTI', name:'Snake Plant',        category:'indoor',    price:19.99, oldPrice:27.00, stars:5, reviews:341, badge:'sale',  cart:'snake'     },
  { id:6,  img:'https://lh3.googleusercontent.com/aida-public/AB6AXuB6BBf__l8CssXvNhPKxocP292b2PE9bB_xM40MCHP_AWg1P7gXoyly-u-pujYBhOIi1U0qiGZQq_UTJZQuwXf2eczCDgYvUXmTokTQMB4tNkU_Po5cj6OTarhnm8Hi_Pl8q-IZI9MBn9obrPG9UMleAcdQcAq-30mHJgH98GvDV2mFMTApx7Ch_ei9OnCxZkC_BJTQgwxQmw_BNTYcU7qx2skk-j2A5Y2YIMwhYQ8', name:'Basil Herb Pot',     category:'herb',      price:9.99,  oldPrice:null,  stars:4, reviews:55,  badge:'new',   cart:'basil'     },
  { id:7,  img:'https://lh3.googleusercontent.com/aida-public/AB6AXuAjXsAMfHm7T0GoAFutNpsDbha0Iy7FTYio1zl50FcEQg55qmPboc-raNXeLv_Z4UUMawehy0rTVGatnqECvclck_UZFEm76i37o8_nCUHqi3DR0pPkRKn5uCbAfInEGLAlC52qg7NRJ5e5JhQu88QiYpCCzsrYPH1A1bsd-Mmj42ig5xCrmBECKfJx_fxsOKwlpC74_xRqZoh0zxCqnaDxcUHSOHWTPupVMe4WQxU', name:'Lucky Bamboo',       category:'bonsai',    price:29.99, oldPrice:38.00, stars:5, reviews:176, badge:null,    cart:'bamboo'    },
  { id:8,  img:'https://lh3.googleusercontent.com/aida-public/AB6AXuAm2nm3_muuIKWwrA3kHfKMSgHXm53okMCHq98xFv6m-qbkFwhQcqRgDO2ymWhpfIT2rTaGENRrm1zj2Q0UzALb5WG0eEXcLVVXjgiEoxLYRLf2g_20687uWOyyvba0XJZ5XBBIYHHUEQH_aQ89mH4bkL3CfHVI-R84GZbQZdBfCKGJvPKE5hbPTKfDtX6JL9ysxZBKfJ7Uvxb-mxjbHo_mF2ogog00GZG8cLaW1V4', name:'Hibiscus Outdoor',   category:'outdoor',   price:27.99, oldPrice:null,  stars:4, reviews:91,  badge:'hot',   cart:'hibiscus'  },
  { id:9,  img:'https://lh3.googleusercontent.com/aida-public/AB6AXuAOAyVF9MIFQ1Z-mrhJlcrHXr5Fqmj5inDKjwNVHc1GovHDxN1RJmYmcNbpvqFacuEA2wz-bIgdJ-K6vyl0zABYkh_dQ4m5VB7KokNCX_635TIMn9ElzwIqhmepVzOBiLUXS_CS4Hw9nE0ts6mMLdkRkmBCjHMY1agbZSNw9crsHNUSRFVQPOWovDc98by0zf11PzGY45Fnt5qDI1_mCncQxtHE2d97w-7b-pE0weE', name:'Sunflower Potted',   category:'outdoor',   price:14.99, oldPrice:null,  stars:4, reviews:44,  badge:'new',   cart:'sunflower' },
  { id:10, img:'https://lh3.googleusercontent.com/aida-public/AB6AXuCIvlF04MdPiaurfzGSHsaXXSdbVTxA7f1c4j_BO1s0D-NFr8sycZgwm3FYD0YCeCIoGPZdXXL7dLQk6FlJVdxvjKxZ83oxSqlyC-XTQHlYiIOPL4x4z_kgzGHSR24R7qEPcJnrqXlbXts41eFg_ap3BliwOC531prFjn5mfXkewSgpxdLN-m0VLIpIJLBgtN2iznIdGqKHhdtJZy7JzXux5AckQTKvnH0kOcqqmgA', name:'Shamrock Plant',      category:'indoor',    price:16.99, oldPrice:22.00, stars:5, reviews:88,  badge:'sale',  cart:'shamrock'  },
  { id:11, img:'https://lh3.googleusercontent.com/aida-public/AB6AXuCLljzOKaHsjXn4LEwfGVDeMM29a8Z4dAzIZ2Eyjk0lXoS7Np9ZjEzZYHFyEEaRBPzKvr_XoM0pEnJVBIYWkE_YuTm3wYDxkfAxesT_wqJKJuRkHhrU2mv-0jpk3ZvV0tnMXR6tT-jDtywE-Ik2lpnocYwutGoJd2QZNMsGTvF0RBRI3cKDaB-GXswGItFGoPx2cNrVX1eHS6FYB8XlhkDZesL2i_2a98TTaZjDV0U', name:'Pampas Grass',        category:'outdoor',   price:31.99, oldPrice:null,  stars:4, reviews:62,  badge:null,    cart:'pampas'    },
  { id:12, img:'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ37DHSqs7ZzDEvVVz40jLttSVzztXfYYUGEBf-zYYobSSo7rCekg3OIqP6vN18WIJkgJi10FfIQ0h87TjzqUsTpHoZSvGq5419O5h8bz7CSt-f7FM064IUaIPj875eziC8bB3JPgQGuFkqtiLeHbv5lpXfZrjJMMiRLTaz9_F2XFxstcR-n_kQOGoL7AupUSUXdWOZF0QXlnh2uzlTKU2GkbI9MhfcaIs0XbkZNA', name:'Aloe Vera',           category:'succulent', price:12.99, oldPrice:null,  stars:5, reviews:298, badge:'hot',   cart:'aloe'      },
];

const plants2 = [
  { id:13, img:'https://lh3.googleusercontent.com/aida-public/AB6AXuAbo7zqVPMA8yVN7zjG4XNWxBxrQDnyO3iA0iPilKM2Bt2qjr2EbOsgWwcnSmhDv5CgmATUWwx0KbKIU0FHCnMvdvFZOMTs6PcEcWoVaMF-1Efbu_nptj3zeCqsOw-jO-FWMyvuyEhE1IJ9erznUVuM4AOznLgEC79zrFKbxr92K7T0N2iyvm5igdjNo9zGPcOnlajjysCJIik8nDaTXu2KIpjsN-IffnosgO6Kz8c', name:'Fiddle Leaf Fig',    category:'indoor',    price:54.99, oldPrice:70.00, stars:5, reviews:412, badge:'sale',  cart:'fiddle'    },
  { id:14, img:'https://lh3.googleusercontent.com/aida-public/AB6AXuCfQG6KMXQofogWFZh2C3KGmDoMjwfYWbNlQPrRggX-KINEYNDiR2_yeazdzelGwKd6I0hWPkrtPxZWGD79Bh1xk1CYapA2v9jNW5kofaT-lEBW2MCxkLcq8bsTC2WpLXttJJ3gUHAOXYiqdo22AaQN6LmpURmS0Ro7m9qALEVPzNlvtmv58ek3xS0IIVhUk7ghRpXfZkZLSzzmC_paAsJWD_D0u1wjUyEyhk9U6w4', name:'Orchid Phalaenopsis',category:'flowering', price:38.99, oldPrice:null,  stars:5, reviews:234, badge:'new',   cart:'orchid'    },
  { id:15, img:'https://lh3.googleusercontent.com/aida-public/AB6AXuDPk-sLJExU4ZYeOfb1baAHJKHt2eYs-TFSYBe3OqXpaQS3y5Hb7UxsuhU0nIj3WHsXn-M0192EN5yQgxjOXxLZCbqH-GyNeSNyH1div_I-NisnJPBufiB3QteyFMkh30Tdfkx2osMrh0lpCvqVP9Nix-_q1ZHfvLhHWcC60L0m8qWCF8gIREQiJ9PaoPqzoXvdTkkD5j60d9Y_NwmBZ6n-Gt7iPUVxLwW8SdZk1SU', name:'Pothos Golden',      category:'indoor',    price:15.99, oldPrice:null,  stars:5, reviews:519, badge:'hot',   cart:'pothos'    },
  { id:16, img:'https://lh3.googleusercontent.com/aida-public/AB6AXuAb1xPeptStLUvMTyiD_3scMnwF67X9U8c2MQvH_AB9s-ro84gDLJh7Xum_wMbT4Ck1V2vY00qndIt7oRj_KZ_oB_OSbVM_J6w_abBU8w7MrKJ-BNy9qJDcM0EBdsv-PYN8pI-GQKjDpXrhVJPlRjmIRag71YC1GqcvqxwKbdyNpTAZaSJCrf3tnbspNab-YZHuT3M707ycNmpb-xbqg4LQM9PxthGVFKV_JCOKaDs', name:'ZZ Plant',           category:'indoor',    price:22.99, oldPrice:30.00, stars:4, reviews:147, badge:'sale',  cart:'zz'        },
];

/* ── Cart State ────────────────────────────────────────── */
// const cart = {};

/* ── Star Renderer ─────────────────────────────────────── */
function renderStars(n, reviews) {
  let html = '<div class="product-card__stars">';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="product-card__star${i > n ? ' half' : ''}">★</span>`;
  }
  html += `<span class="product-card__reviews">(${reviews})</span></div>`;
  return html;
}

/* ── Badge Renderer ────────────────────────────────────── */
function renderBadge(b) {
  if (!b) return '';
  const map = { sale:'badge--sale', new:'badge--new', hot:'badge--hot' };
  const lbl = { sale:'Sale', new:'New', hot:'🔥 Hot' };
  return `<span class="badge ${map[b]}">${lbl[b]}</span>`;
}

/* ── Wishlist State ──────────────────────────────────────── */
let wishlist = window.AgrismartAuth?.readUserData('agrismartWishlist', {}) || {};
document.addEventListener('DOMContentLoaded', () => {
  if (!window.AgrismartAuth) return;
  wishlist = window.AgrismartAuth.readUserData('agrismartWishlist', {});
  updateWishUI();
  if (document.getElementById('productGrid')) {
    renderGrid('productGrid', plants);
    renderGrid('productGrid2', plants2);
  }
});

function saveWishlist() {
  if (window.AgrismartAuth) window.AgrismartAuth.writeUserData('agrismartWishlist', wishlist);
  else localStorage.setItem('agrismartWishlist', JSON.stringify(wishlist));
  window.dispatchEvent(new Event('agrismart:wishlistchange'));
}

function updateWishUI() {
  const keys = Object.keys(wishlist);
  const wishEmpty = document.getElementById('wishEmpty');
  if (wishEmpty) wishEmpty.style.display = keys.length ? 'none' : 'block';

  const wishItems = document.getElementById('wishItems');
  if (wishItems) {
    wishItems.innerHTML = keys.map(k => {
      const item = wishlist[k];
      return `
        <div class="cart-item">
          <div class="cart-item__img"><img src="${item.img}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;"></div>
          <div class="cart-item__info">
            <div class="cart-item__name">${item.name}</div>
            <div class="cart-item__price">$${item.price.toFixed(2)}</div>
            <div class="cart-item__qty" style="justify-content: space-between; width: 100%;">
              <button onclick="addToCart('${k}','${item.name}',${item.price},'${item.img}')" style="width:auto;padding:0 10px;">Add to Cart</button>
              <span class="cart-item__remove" onclick="removeWish('${k}')">🗑️</span>
            </div>
          </div>
        </div>`;
    }).join('');
  }
}

function removeWish(id) {
  if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin('your wishlist')) return;
  delete wishlist[id];
  saveWishlist();
  updateWishUI();
  showToast('Item removed from wishlist.');
  // Refresh grids if present to update hearts
  if (document.getElementById('productGrid')) {
    renderGrid('productGrid', plants);
    renderGrid('productGrid2', plants2);
  }
}

function openWish() {
  if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin('your wishlist')) return;
  const sidebar = document.getElementById('wishSidebar');
  const overlay = document.getElementById('wishOverlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('open');
  updateWishUI();
}

function closeWish() {
  const sidebar = document.getElementById('wishSidebar');
  const overlay = document.getElementById('wishOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

/* ── Product Card Builder ──────────────────────────────── */
function buildCard(p) {
  const oldPriceHtml = p.oldPrice
    ? `<span class="product-card__price-old">$${p.oldPrice.toFixed(2)}</span>` : '';
  const isWished = wishlist[p.id] ? '1' : '0';
  const fill = wishlist[p.id] ? '#f84141' : 'none';
  const stroke = wishlist[p.id] ? '#f84141' : 'currentColor';
  
  return `
    <div class="product-card">
      <div class="product-card__img-wrap">
        <div class="product-card__img-placeholder"><img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;"></div>
        <div class="product-card__badge-wrap">${renderBadge(p.badge)}</div>
        <div class="product-card__wish" onclick="toggleWish(this, '${p.id}', '${p.name}', ${p.price}, '${p.img}')" data-wished="${isWished}">
          <svg viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
      </div>
      <div class="product-card__info">
        <div class="product-card__category">${p.category}</div>
        <div class="product-card__name">${p.name}</div>
        ${renderStars(p.stars, p.reviews)}
        <div class="product-card__footer">
          <div>
            <span class="product-card__price">$${p.price.toFixed(2)}</span>
            ${oldPriceHtml}
          </div>
          <div class="product-card__add" onclick="addToCart('${p.id}','${p.name}',${p.price},'${p.img}')">+</div>
        </div>
      </div>
    </div>`;
}

/* ── Render Grids ──────────────────────────────────────── */
function renderGrid(containerId, data) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = data.map(buildCard).join('');
}
renderGrid('productGrid', plants);
renderGrid('productGrid2', plants2);

/* ── Category Filter ───────────────────────────────────── */
function filterProducts(cat) {
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  event.currentTarget.classList.add('active');
  const filtered = cat === 'all' ? plants : plants.filter(p => p.category === cat);
  document.getElementById('productGrid').innerHTML = filtered.length
    ? filtered.map(buildCard).join('')
    : '<p style="color:var(--gray);padding:24px 0">No plants found in this category.</p>';
}

/* ── Wishlist Toggle ───────────────────────────────────── */
function toggleWish(el, id, name, price, img) {
  if (window.AgrismartAuth && !window.AgrismartAuth.requireLogin('your wishlist')) return;
  const svg = el.querySelector('path').parentNode;
  const filled = el.dataset.wished === '1';
  
  if (filled) {
    delete wishlist[id];
  } else {
    wishlist[id] = { name, price, img };
  }
  
  svg.setAttribute('fill', !filled ? '#f84141' : 'none');
  svg.setAttribute('stroke', !filled ? '#f84141' : 'currentColor');
  el.dataset.wished = !filled ? '1' : '0';
  
  saveWishlist();
  updateWishUI();
  showToast(!filled ? '❤️ Added to wishlist!' : 'Removed from wishlist', !filled ? 'success' : '');
}


/* ── Newsletter ────────────────────────────────────────── */
function subscribeNewsletter(e) {
  e.preventDefault();
  showToast('You\'re subscribed! Welcome to the Agrismart family!', 'success');
  e.target.reset();
}

/* ── Toast ─────────────────────────────────────────────── */
function showToast(msg, type = '') {
  const tc = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast' + (type ? ' ' + type : '');
  t.textContent = msg;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ── Mobile Nav ────────────────────────────────────────── */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

/* ── Scroll Top ────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTop');
  btn.classList.toggle('visible', window.scrollY > 400);
});

/* ── Scroll Animations ─────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ── Active Nav Link on Scroll ─────────────────────────── */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav__links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}, { passive: true });

/* ── Hero 3D Card Tilt Interaction ─────────────────────── */
const heroCard = document.getElementById('heroPlantCard');
if (heroCard && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let bounds = heroCard.getBoundingClientRect();
  window.addEventListener('resize', () => { bounds = heroCard.getBoundingClientRect(); });
  
  heroCard.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const rotateX = -(y / (rect.height / 2)) * 7;
    const rotateY = (x / (rect.width / 2)) * 7;
    heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}



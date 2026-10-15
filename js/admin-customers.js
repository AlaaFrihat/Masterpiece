document.addEventListener('DOMContentLoaded', () => {
  const customers = [
    {name:'Sarah Mansour',email:'sarah.m@botanicmail.com',tier:'vip',tierLabel:'Emerald VIP',spend:'$540.00',orders:'11 Orders fulfilled',room:'Living Room · Foliage',health:'9/9 Alive',initials:'SM'},
    {name:'Tariq Haddad',email:'tariq.h@ammanstore.jo',tier:'gold',tierLabel:'Gold Planter',spend:'$315.50',orders:'6 Orders fulfilled',room:'Workspace · Bonsai',health:'4/5 Alive',initials:'TH'},
    {name:'Lina Al-Husseini',email:'lina.plantnook@gmail.com',tier:'vip',tierLabel:'Emerald VIP',spend:'$892.00',orders:'18 Orders fulfilled',room:'Terrace · Exotic Palms',health:'14/14 Alive',initials:'LH'},
    {name:'Omar Qasim',email:'omar.qasim@outlook.com',tier:'sprout',tierLabel:'New Sprout',spend:'$89.00',orders:'1 Order fulfilled',room:'Bedroom · Air Purifying',health:'1/1 Alive',initials:'OQ'}
  ];
  const reviews = [
    {name:'Sarah Mansour',product:'Fiddle Leaf Fig (XL)',initials:'SM',quote:'“The Fiddle Leaf arrived perfectly hydrated in organic moss wrap! Not a single creased leaf. The temperature indicator sticker was bright green upon arrival.”',meta:'Delivered in 22 hrs',city:'Amman, Jordan · 2 hours ago',tag:'Verified Buyer'},
    {name:'Tariq Haddad',product:'Japanese Juniper Bonsai',initials:'TH',quote:'“Nursery pruning shears included in the kit made the first trim seamless. Soil moisture meter read 60% right out of the crate.”',meta:'Climate Packaging Pass',city:'Dubai, UAE · 5 hours ago',tag:'Verified Buyer'}
  ];
  const customerRows = document.getElementById('customerRows');
  const renderCustomers = list => {
    customerRows.innerHTML = list.map((customer, index) => `<tr><td><div class="customer-identity"><span class="customer-avatar avatar-${index}">${customer.initials}</span><span><strong>${customer.name}${customer.tier === 'vip' ? '　✿' : ''}</strong><small>${customer.email}</small></span></div></td><td><span class="tier-chip ${customer.tier}">${customer.tier === 'vip' ? '♧ ' : customer.tier === 'gold' ? '♜ ' : '◉ '}${customer.tierLabel}</span></td><td><strong>${customer.spend}</strong><small>${customer.orders}</small></td><td>${customer.room}</td><td><div class="health-score"><i><em style="width:${customer.health.startsWith('4/')?'80%':'100%'}"></em></i><strong>${customer.health}</strong></div></td></tr>`).join('');
  };
  const renderReviews = () => { document.getElementById('reviewGrid').innerHTML = reviews.map(review => `<article class="review-card"><div class="review-person"><span>${review.initials}</span><div><strong>${review.name}</strong><small>✿ ${review.tag} · ${review.product}</small></div><b>★★★★★</b></div><div class="review-content"><span class="review-plant">♧</span><blockquote>${review.quote}</blockquote></div><div class="review-meta"><span>${review.meta}</span><span>${review.city}</span></div><div class="review-actions"><label><input type="checkbox" checked> Feature on Storefront</label><button>Public Reply</button><button aria-label="Save review">♧</button></div></article>`).join(''); };
  renderCustomers(customers); renderReviews();
  const applyCustomerFilters = () => {
    const search = document.getElementById('profileSearch').value.trim().toLowerCase();
    const tier = document.getElementById('tierFilter').value;
    renderCustomers(customers.filter(customer => (tier === 'all' || customer.tier === tier) && `${customer.name} ${customer.email} ${customer.room}`.toLowerCase().includes(search)));
  };
  document.getElementById('profileSearch').addEventListener('input', applyCustomerFilters);
  document.getElementById('globalCustomerSearch').addEventListener('input', event => { document.getElementById('profileSearch').value = event.target.value; applyCustomerFilters(); });
  document.getElementById('tierFilter').addEventListener('change', applyCustomerFilters);
  document.querySelectorAll('.profile-tabs button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.profile-tabs button').forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');
    const tier = button.dataset.tier === 'vip' ? 'vip' : 'all';
    document.getElementById('tierFilter').value = tier;
    applyCustomerFilters();
  }));
  document.getElementById('mobileMenu').addEventListener('click', () => document.getElementById('adminSidebar').classList.toggle('open'));
  const notify = text => { const toast = document.getElementById('customerToast'); toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2400); };
  document.getElementById('vipPerks').addEventListener('click', () => notify('VIP care perks are ready to issue to selected members.'));
  document.getElementById('moreFilters').addEventListener('click', () => notify('Choose a club tier or room preference to refine profiles.'));
  document.querySelectorAll('.doctor-case button').forEach(button => button.addEventListener('click', () => notify(`Care response prepared: ${button.textContent.trim()}`)));
  document.getElementById('exportCohort').addEventListener('click', () => {
    const csv = ['Name,Email,Tier,Customer Lifetime Value,Orders,Room Preference,Plant Health', ...customers.map(customer => [customer.name, customer.email, customer.tierLabel, customer.spend, customer.orders, customer.room, customer.health].map(value => `"${value}"`).join(','))].join('\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], {type:'text/csv'})); link.download = 'agrismart-customer-cohort.csv'; link.click(); URL.revokeObjectURL(link.href); notify('Customer cohort CSV exported.');
  });
  window.addEventListener('agrismart:languagechange', () => applyCustomerFilters());
});

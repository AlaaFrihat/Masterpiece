(() => {
  const SESSION_KEY = 'agrismartAdminSession';
  const LANG_KEY = 'agrismartAdminLang';
  const DEFAULT_ADMINS = [
    {
      name: 'Sarah Alaa',
      email: 'admin@agrismart.com',
      password: 'Admin123!',
      role: 'admin',
      title: 'Operations Lead'
    }
  ];

  const read = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
  const isAdminPage = document.body?.dataset.adminPage === 'true';
  const session = () => read(SESSION_KEY);
  const logout = () => { localStorage.removeItem(SESSION_KEY); location.href = 'admin-login.html'; };
  const isSignedIn = () => session()?.role === 'admin';

  window.AgrismartAdmin = { session, logout, isSignedIn };

  // Language management (LTR / RTL)
  const setLanguage = lang => {
    localStorage.setItem(LANG_KEY, lang);
    localStorage.setItem('agrismartLanguage', lang);
    if (window.applyLanguage) {
      window.applyLanguage(lang);
    } else {
      const isAr = lang === 'ar';
      document.documentElement.setAttribute('lang', isAr ? 'ar' : 'en');
      document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    }
  };

  window.addEventListener('agrismart:languagechange', e => {
    const lang = (e.detail?.language || localStorage.getItem('agrismartLanguage') || 'en').toUpperCase();
    document.querySelectorAll('.top-actions .lang').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim().toUpperCase() === lang);
    });
  });

  document.addEventListener('DOMContentLoaded', async () => {
    // Restore language preference
    const savedLang = (localStorage.getItem('agrismartLanguage') || localStorage.getItem(LANG_KEY) || 'en').toUpperCase();
    document.querySelectorAll('.top-actions .lang').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim().toUpperCase() === savedLang);
      btn.addEventListener('click', () => {
        const lang = btn.textContent.trim().toLowerCase();
        setLanguage(lang);
      });
    });

    const form = document.getElementById('adminLoginForm');

    // Route guard for protected admin pages
    if (isAdminPage && !isSignedIn()) {
      location.replace('admin-login.html?required=1');
      return;
    }

    // Auto-redirect if already signed in on login page
    if (form && isSignedIn()) {
      location.replace('admin-dashboard.html');
      return;
    }

    // Login Form Handler
    if (form) {
      const error = document.getElementById('adminLoginError');
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const email = form.elements.email.value.trim().toLowerCase();
        const password = form.elements.password.value;
        let admins = DEFAULT_ADMINS;

        try {
          const response = await fetch('data/admins.json', { cache: 'no-store' });
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length) admins = data;
          }
        } catch {
          // Use DEFAULT_ADMINS fallback for local file:/// preview
        }

        const match = admins.find(admin =>
          admin.email.toLowerCase() === email &&
          admin.password === password &&
          admin.role === 'admin'
        );

        if (!match) {
          if (error) error.hidden = false;
          return;
        }

        localStorage.setItem(SESSION_KEY, JSON.stringify({
          name: match.name,
          email: match.email,
          role: match.role,
          title: match.title || 'Operations Lead'
        }));
        location.href = 'admin-dashboard.html';
      });
    }

    // Logout triggers
    document.querySelectorAll('[data-admin-logout]').forEach(button => {
      button.addEventListener('click', logout);
    });

    // Dynamic session sync for UI elements across all admin pages
    const currentSession = session();
    if (currentSession && isAdminPage) {
      document.querySelectorAll('.admin-profile').forEach(profile => {
        const strong = profile.querySelector('strong');
        const small = profile.querySelector('small');
        const avatar = profile.querySelector('.avatar');
        if (strong) strong.textContent = currentSession.name || 'Sarah Alaa';
        if (small && currentSession.title) small.textContent = currentSession.title;
        if (avatar && currentSession.name) {
          avatar.textContent = currentSession.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        }
      });
      const nameHeading = document.getElementById('adminName');
      if (nameHeading) nameHeading.textContent = currentSession.name || 'Sarah Alaa';
    }

    // Unified Admin Navigation & Active State Sync
    const SECTION_PAGE_MAP = {
      overview: 'admin-dashboard.html',
      orders: 'admin-dashboard-live.html',
      inventory: 'admin-inventory.html',
      categories: 'admin-categories.html',
      customers: 'admin-customers.html',
      analytics: 'admin-analytics.html',
      settings: 'admin-settings.html'
    };

    const determineCurrentSection = () => {
      const path = location.pathname.toLowerCase();
      if (path.includes('admin-dashboard-live.html')) return 'orders';
      if (path.includes('admin-inventory.html')) return 'inventory';
      if (path.includes('admin-categories.html')) return 'categories';
      if (path.includes('admin-customers.html')) return 'customers';
      if (path.includes('admin-analytics.html')) return 'analytics';
      if (path.includes('admin-settings.html')) return 'settings';
      if (path.includes('admin-dashboard.html')) {
        const p = new URLSearchParams(location.search).get('section');
        if (p && p !== 'overview' && SECTION_PAGE_MAP[p]) {
          location.replace(SECTION_PAGE_MAP[p]);
          return p;
        }
        return 'overview';
      }
      return 'overview';
    };

    const currentActiveSection = determineCurrentSection();

    document.querySelectorAll('.admin-nav button').forEach(button => {
      button.removeAttribute('onclick');
      if (!button.dataset.section) {
        const text = button.textContent.toLowerCase();
        if (text.includes('overview') || text.includes('نظرة عامة')) button.dataset.section = 'overview';
        else if (text.includes('orders') || text.includes('fulfillment') || text.includes('طلبات')) button.dataset.section = 'orders';
        else if (text.includes('products') || text.includes('inventory') || text.includes('مخزون')) button.dataset.section = 'inventory';
        else if (text.includes('categories') || text.includes('rooms') || text.includes('تصنيفات')) button.dataset.section = 'categories';
        else if (text.includes('customers') || text.includes('reviews') || text.includes('عملاء')) button.dataset.section = 'customers';
        else if (text.includes('analytics') || text.includes('revenue') || text.includes('تحليلات')) button.dataset.section = 'analytics';
        else if (text.includes('settings') || text.includes('إعدادات')) button.dataset.section = 'settings';
      }

      const sec = button.dataset.section;
      if (sec) {
        button.classList.toggle('active', sec === currentActiveSection);
      }

      button.addEventListener('click', e => {
        e.preventDefault();
        const section = button.dataset.section;
        if (!section || !SECTION_PAGE_MAP[section]) return;

        const targetUrl = SECTION_PAGE_MAP[section];
        if (!location.pathname.endsWith(targetUrl)) {
          location.href = targetUrl;
        }
      });
    });

    // Date range switch buttons sync
    document.querySelectorAll('.range-switch button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.range-switch button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        window.dispatchEvent(new CustomEvent('agrismart:rangechange', { detail: { range: btn.textContent.trim() } }));
      });
    });

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobileMenu');
    const sidebar = document.getElementById('adminSidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    // Close mobile menu on outside click
    if (sidebar) {
      document.addEventListener('click', e => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
          const mobileMenuBtn = document.getElementById('mobileMenu');
          if (!sidebar.contains(e.target) && (!mobileMenuBtn || !mobileMenuBtn.contains(e.target))) {
            sidebar.classList.remove('open');
          }
        }
      });
    }

    // ==========================================================================
    // Topbar Notifications & Profile Dropdown
    // ==========================================================================
    const initAdminTopDropdowns = () => {
      const topActions = document.querySelector('.admin-topbar .top-actions') || document.querySelector('.top-actions');
      if (!topActions) return;

      const notifyBtn = topActions.querySelector('.notify');
      const profileBtn = topActions.querySelector('.admin-profile');
      if (!notifyBtn && !profileBtn) return;

      let notifDropdown = document.getElementById('notificationsDropdown');
      let profileDropdown = document.getElementById('profileDropdown');

      if (!notifDropdown) {
        notifDropdown = document.createElement('div');
        notifDropdown.className = 'notifications-dropdown';
        notifDropdown.id = 'notificationsDropdown';
        notifDropdown.setAttribute('role', 'menu');
        notifDropdown.setAttribute('aria-label', 'Notifications');
        notifDropdown.innerHTML = `
          <div class="dropdown-header">
            <div class="dropdown-header-title">
              <strong data-i18n="Notifications">Notifications</strong>
              <span class="notif-count-pill" id="notifUnreadBadge" data-i18n="3 Unread">3 Unread</span>
            </div>
            <button type="button" class="dropdown-action-btn" id="markAllReadBtn" data-i18n="Mark all as read">Mark all as read</button>
          </div>
          <div class="dropdown-list" id="notificationsList">
            <div class="dropdown-item unread" data-notif-link="admin-dashboard-live.html">
              <div class="dropdown-item-icon green">🌿</div>
              <div class="dropdown-item-content">
                <strong data-i18n="New Order #AG-9482 awaiting moss hydration">New Order #AG-9482 awaiting moss hydration</strong>
                <p data-i18n="Customer: Razan Haddad · 2x Monstera Albo · $84.00">Customer: Razan Haddad · 2x Monstera Albo · $84.00</p>
                <span class="dropdown-item-time" data-i18n="4m ago">4m ago</span>
              </div>
              <div class="unread-dot"></div>
            </div>
            <div class="dropdown-item unread" data-notif-link="admin-inventory.html">
              <div class="dropdown-item-icon amber">⚠️</div>
              <div class="dropdown-item-content">
                <strong data-i18n="Critical Stock Alert: Variegated Monstera">Critical Stock Alert: Variegated Monstera</strong>
                <p data-i18n="Only 2 pots left in Bay 3 · Urgent greenhouse repotting">Only 2 pots left in Bay 3 · Urgent greenhouse repotting</p>
                <span class="dropdown-item-time" data-i18n="18m ago">18m ago</span>
              </div>
              <div class="unread-dot"></div>
            </div>
            <div class="dropdown-item unread" data-notif-link="admin-customers.html">
              <div class="dropdown-item-icon gold">★</div>
              <div class="dropdown-item-content">
                <strong data-i18n="New 5-Star Botanical Review">New 5-Star Botanical Review</strong>
                <p data-i18n="Kristin Watson: Pristine moss packaging, fast delivery">Kristin Watson: Pristine moss packaging, fast delivery</p>
                <span class="dropdown-item-time" data-i18n="42m ago">42m ago</span>
              </div>
              <div class="unread-dot"></div>
            </div>
            <div class="dropdown-item" data-notif-link="admin-dashboard-live.html">
              <div class="dropdown-item-icon blue">🚚</div>
              <div class="dropdown-item-content">
                <strong data-i18n="Climate Fleet Van 4 Dispatched">Climate Fleet Van 4 Dispatched</strong>
                <p data-i18n="14 parcels departed for Amman West route (21.8°C / 64% RH)">14 parcels departed for Amman West route (21.8°C / 64% RH)</p>
                <span class="dropdown-item-time" data-i18n="1h ago">1h ago</span>
              </div>
            </div>
          </div>
          <div class="dropdown-footer">
            <a href="admin-dashboard-live.html" data-i18n="View all orders &amp; dispatches →">View all orders &amp; dispatches →</a>
          </div>
        `;
        topActions.appendChild(notifDropdown);
      }

      if (!profileDropdown) {
        const sess = session() || { name: 'Sarah Alaa', email: 'admin@agrismart.com', title: 'Operations Lead' };
        const initials = sess.name ? sess.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() : 'SA';
        const curLang = localStorage.getItem('agrismartLanguage') || 'en';
        const isAr = curLang === 'ar';

        profileDropdown = document.createElement('div');
        profileDropdown.className = 'profile-dropdown';
        profileDropdown.id = 'profileDropdown';
        profileDropdown.setAttribute('role', 'menu');
        profileDropdown.setAttribute('aria-label', 'Admin Profile Menu');
        profileDropdown.innerHTML = `
          <div class="profile-dropdown-card">
            <div class="profile-dropdown-avatar">${initials}</div>
            <div class="profile-dropdown-meta">
              <strong id="dropdownUserName">${sess.name}</strong>
              <small id="dropdownUserEmail">${sess.email || 'admin@agrismart.com'}</small>
              <span class="profile-role-badge" data-i18n="Operations Lead">${sess.title || 'Operations Lead'}</span>
            </div>
          </div>
          <div class="profile-session-status">
            <span class="dot-green"></span>
            <span data-i18n="2FA Session Verified · Amman Regional Hub">2FA Session Verified · Amman Regional Hub</span>
          </div>
          <div class="profile-dropdown-menu">
            <a href="admin-settings.html" class="profile-menu-item">
              <span class="menu-item-icon">⚙️</span>
              <span data-i18n="Settings &amp; Operations">Settings &amp; Operations</span>
            </a>
            <a href="admin-dashboard-live.html" class="profile-menu-item">
              <span class="menu-item-icon">▣</span>
              <span data-i18n="Orders &amp; Fulfillment">Orders &amp; Fulfillment</span>
            </a>
            <a href="admin-inventory.html" class="profile-menu-item">
              <span class="menu-item-icon">♧</span>
              <span data-i18n="Products &amp; Inventory">Products &amp; Inventory</span>
            </a>
            <a href="ai-assistant.html" class="profile-menu-item">
              <span class="menu-item-icon">📖</span>
              <span data-i18n="Plant Care Wiki">Plant Care Wiki</span>
            </a>
            <a href="index.html" class="profile-menu-item">
              <span class="menu-item-icon">↗</span>
              <span data-i18n="View Live Store">View Live Store</span>
            </a>
            <button type="button" class="profile-menu-item" id="dropdownLangToggle">
              <span class="menu-item-icon">🌐</span>
              <span id="dropdownLangText" data-i18n="${isAr ? 'Switch to English' : 'Switch to العربية'}">${isAr ? 'Switch to English' : 'Switch to العربية'}</span>
            </button>
          </div>
          <div class="profile-dropdown-footer">
            <button type="button" class="profile-logout-btn" id="dropdownLogoutBtn">
              <span>🚪</span>
              <span data-i18n="Log out">Log out</span>
            </button>
          </div>
        `;
        topActions.appendChild(profileDropdown);
      }

      // Toggle Notifications
      if (notifyBtn) {
        notifyBtn.setAttribute('title', 'Notifications / الإشعارات');
        notifyBtn.addEventListener('click', e => {
          e.stopPropagation();
          const isOpen = notifDropdown.classList.contains('show');
          profileDropdown.classList.remove('show');
          notifDropdown.classList.toggle('show', !isOpen);
        });
      }

      // Toggle Profile
      if (profileBtn) {
        profileBtn.setAttribute('title', 'Account Profile / حساب المشرف');
        profileBtn.addEventListener('click', e => {
          e.stopPropagation();
          const isOpen = profileDropdown.classList.contains('show');
          notifDropdown.classList.remove('show');
          profileDropdown.classList.toggle('show', !isOpen);
        });
      }

      // Click on notification items to open link and mark as read
      notifDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          item.classList.remove('unread');
          const unreadCount = notifDropdown.querySelectorAll('.dropdown-item.unread').length;
          const badge = document.getElementById('notifUnreadBadge');
          if (badge) {
            const isAr = (localStorage.getItem('agrismartLanguage') || 'en') === 'ar';
            badge.textContent = isAr ? `${unreadCount} غير مقروءة` : `${unreadCount} Unread`;
            badge.classList.toggle('empty', unreadCount === 0);
          }
          if (unreadCount === 0) {
            const dot = notifyBtn?.querySelector('i');
            if (dot) dot.classList.add('read');
          }
          const link = item.dataset.notifLink;
          if (link) {
            setTimeout(() => { location.href = link; }, 180);
          }
        });
      });

      // Mark all as read button
      const markAllBtn = document.getElementById('markAllReadBtn');
      if (markAllBtn) {
        markAllBtn.addEventListener('click', e => {
          e.stopPropagation();
          notifDropdown.querySelectorAll('.dropdown-item.unread').forEach(item => {
            item.classList.remove('unread');
          });
          const badge = document.getElementById('notifUnreadBadge');
          const isAr = (localStorage.getItem('agrismartLanguage') || 'en') === 'ar';
          if (badge) {
            badge.textContent = isAr ? '0 غير مقروءة' : '0 Unread';
            badge.classList.add('empty');
          }
          const dot = notifyBtn?.querySelector('i');
          if (dot) dot.classList.add('read');
          const toast = document.getElementById('adminToast') || document.querySelector('.toast');
          if (toast) {
            toast.textContent = isAr ? 'تم تعليم جميع الإشعارات كمقروءة' : 'All notifications marked as read';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2200);
          }
        });
      }

      // Language toggle inside dropdown
      const langToggleBtn = document.getElementById('dropdownLangToggle');
      if (langToggleBtn) {
        langToggleBtn.addEventListener('click', e => {
          e.stopPropagation();
          const cur = localStorage.getItem('agrismartLanguage') || 'en';
          const next = cur === 'ar' ? 'en' : 'ar';
          setLanguage(next);
          profileDropdown.classList.remove('show');
        });
      }

      // Logout button inside dropdown
      const dropdownLogoutBtn = document.getElementById('dropdownLogoutBtn');
      if (dropdownLogoutBtn) {
        dropdownLogoutBtn.addEventListener('click', e => {
          e.stopPropagation();
          logout();
        });
      }

      // Close on outside click
      document.addEventListener('click', e => {
        if (!e.target.closest('.notifications-dropdown') && !e.target.closest('.notify')) {
          notifDropdown.classList.remove('show');
        }
        if (!e.target.closest('.profile-dropdown') && !e.target.closest('.admin-profile')) {
          profileDropdown.classList.remove('show');
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          notifDropdown.classList.remove('show');
          profileDropdown.classList.remove('show');
        }
      });
    };

    initAdminTopDropdowns();
  });
})();

/**
 * Agrismart - Merchant Account & Profile Settings Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const isArabic = () => document.documentElement.lang === 'ar' || document.documentElement.getAttribute('dir') === 'rtl';

  // 1. Check Authentication
  const user = window.AgrismartAuth ? window.AgrismartAuth.currentUser() : null;
  const profile = JSON.parse(localStorage.getItem('agrismartMerchantProfile') || '{}');

  const defaultStoreEn = 'Al-Rawabi Botanical Nursery';
  const defaultStoreAr = 'مشتل الروابي النباتي';

  // Sync Top Strip Store Name
  const topStripStoreName = document.getElementById('topStripStoreName');
  if (topStripStoreName) {
    topStripStoreName.textContent = isArabic()
      ? (profile.storeNameAr || user?.businessNameAr || defaultStoreAr)
      : (profile.storeName || user?.businessName || defaultStoreEn);
  }

  // 2. Populate Form Fields
  function populateFields() {
    const isAr = isArabic();
    const fullName = user?.name || profile.managerName || 'Eng. Tariq Al-Rawabi';
    const parts = fullName.split(' ');
    const firstName = parts[0] || 'Tariq';
    const lastName = parts.slice(1).join(' ') || 'Al-Rawabi';

    const el = id => document.getElementById(id);

    if (el('merchantFirstName')) el('merchantFirstName').value = firstName;
    if (el('merchantLastName')) el('merchantLastName').value = lastName;
    if (el('merchantEmail')) el('merchantEmail').value = user?.email || 'tareq@alrawabi.jo';
    if (el('merchantPhone')) el('merchantPhone').value = user?.phone || profile.phone || '+962 7 9811 2233';
    if (el('merchantWhatsapp')) el('merchantWhatsapp').value = profile.whatsapp || user?.phone || '+962 7 9811 2233';
    if (el('merchantRole')) el('merchantRole').value = profile.role || 'Lead Horticulturist & Owner';
    if (el('merchantStoreName')) el('merchantStoreName').value = profile.storeName || user?.businessName || defaultStoreEn;
    if (el('merchantStoreNameAr')) el('merchantStoreNameAr').value = profile.storeNameAr || defaultStoreAr;
    if (el('merchantCrNumber')) el('merchantCrNumber').value = profile.crNumber || 'CR-98214-AMN';
    if (el('merchantFacilitySize')) el('merchantFacilitySize').value = profile.facilitySize || '4.5 Hectares';
    if (el('merchantCliqAlias')) el('merchantCliqAlias').value = profile.cliqAlias || 'RAWABI-PLANTS';
    if (el('merchantBankName')) el('merchantBankName').value = profile.bankName || 'Arab Bank (البنك العربي)';
    if (el('merchantIban')) el('merchantIban').value = profile.iban || 'JO94 ARAB 1200 0000 0012 3456 7890 01';

    // Sidebar Meta Sync
    if (el('sidebarManagerName')) el('sidebarManagerName').textContent = fullName;
    if (el('sidebarStoreName')) el('sidebarStoreName').textContent = profile.storeName || user?.businessName || defaultStoreEn;
    if (el('sidebarAvatarInitial')) {
      const initial = (firstName.charAt(0) || 'T').toUpperCase();
      el('sidebarAvatarInitial').textContent = initial;
    }
  }

  populateFields();

  // 3. Tab Navigation
  const tabBtns = document.querySelectorAll('.account-nav-btn');
  const panels = document.querySelectorAll('.account-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('is-active'));
      panels.forEach(p => p.classList.remove('is-active'));

      btn.classList.add('is-active');
      const targetPanel = document.getElementById(`panel-${targetTab}`);
      if (targetPanel) targetPanel.classList.add('is-active');
    });
  });

  // 4. Toast Notification Helper
  const toast = document.getElementById('accountToast');
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // 5. Handle Personal & Account Form Submit
  const personalForm = document.getElementById('merchantPersonalForm');
  if (personalForm) {
    personalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isAr = isArabic();

      const fName = document.getElementById('merchantFirstName')?.value.trim() || 'Tariq';
      const lName = document.getElementById('merchantLastName')?.value.trim() || 'Al-Rawabi';
      const fullName = `${fName} ${lName}`.trim();
      const phone = document.getElementById('merchantPhone')?.value.trim() || '';
      const whatsapp = document.getElementById('merchantWhatsapp')?.value.trim() || '';
      const role = document.getElementById('merchantRole')?.value || 'Owner';

      // Update Session
      let sessionData = {};
      try {
        sessionData = JSON.parse(localStorage.getItem('agrismartSession') || '{}');
      } catch (err) {}
      sessionData.name = fullName;
      sessionData.phone = phone;
      localStorage.setItem('agrismartSession', JSON.stringify(sessionData));

      // Update Profile
      profile.managerName = fullName;
      profile.phone = phone;
      profile.whatsapp = whatsapp;
      profile.role = role;
      localStorage.setItem('agrismartMerchantProfile', JSON.stringify(profile));

      populateFields();
      document.dispatchEvent(new CustomEvent('agrismart:sessionchange'));

      showToast(isAr
        ? '✓ تم حفظ وتحديث البيانات الشخصية بنجاح!'
        : '✓ Personal details updated and saved successfully!');
    });
  }

  // 6. Handle Business Credentials Form Submit
  const businessForm = document.getElementById('merchantBusinessForm');
  if (businessForm) {
    businessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isAr = isArabic();

      const storeName = document.getElementById('merchantStoreName')?.value.trim() || defaultStoreEn;
      const storeNameAr = document.getElementById('merchantStoreNameAr')?.value.trim() || defaultStoreAr;
      const crNumber = document.getElementById('merchantCrNumber')?.value.trim() || '';
      const facilitySize = document.getElementById('merchantFacilitySize')?.value.trim() || '';

      profile.storeName = storeName;
      profile.storeNameAr = storeNameAr;
      profile.crNumber = crNumber;
      profile.facilitySize = facilitySize;
      localStorage.setItem('agrismartMerchantProfile', JSON.stringify(profile));

      // Update Session business name
      let sessionData = {};
      try {
        sessionData = JSON.parse(localStorage.getItem('agrismartSession') || '{}');
      } catch (err) {}
      sessionData.businessName = storeName;
      localStorage.setItem('agrismartSession', JSON.stringify(sessionData));

      populateFields();
      document.dispatchEvent(new CustomEvent('agrismart:sessionchange'));

      showToast(isAr
        ? '✓ تم تحديث بيانات المشتل والسجل التجاري بنجاح!'
        : '✓ Nursery credentials and commercial registration saved!');
    });
  }

  // 7. Handle Security Form Submit
  const securityForm = document.getElementById('merchantSecurityForm');
  if (securityForm) {
    securityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isAr = isArabic();
      const newPass = document.getElementById('newPassword')?.value;
      const confirmPass = document.getElementById('confirmPassword')?.value;

      if (newPass !== confirmPass) {
        alert(isAr ? '⚠️ كلمتا المرور غير متطابقتين!' : '⚠️ Passwords do not match!');
        return;
      }

      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';

      showToast(isAr
        ? '🔒 تم تحديث كلمة المرور وحماية حساب التاجر بنجاح!'
        : '🔒 Password updated and merchant account secured!');
    });
  }

  // 8. Handle Payout Form Submit
  const payoutForm = document.getElementById('merchantPayoutForm');
  if (payoutForm) {
    payoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isAr = isArabic();

      profile.cliqAlias = document.getElementById('merchantCliqAlias')?.value.trim() || 'RAWABI-PLANTS';
      profile.bankName = document.getElementById('merchantBankName')?.value.trim() || '';
      profile.iban = document.getElementById('merchantIban')?.value.trim() || '';
      localStorage.setItem('agrismartMerchantProfile', JSON.stringify(profile));

      showToast(isAr
        ? '💳 تم حفظ إعدادات التحويل المالي ومعرف كليك بنجاح!'
        : '💳 Settlement preferences and CliQ alias saved!');
    });
  }

  // 9. Re-render on language change
  window.addEventListener('agrismart:languagechange', populateFields);
  window.addEventListener('languagechange', populateFields);
});

/**
 * Agrismart - Merchant Support & Nursery Operations Desk Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Sync Merchant Identity
  const session = window.AgrismartAuth ? window.AgrismartAuth.currentUser() : null;
  const profile = JSON.parse(localStorage.getItem('agrismartMerchantProfile') || '{}');
  
  const isArabic = () => document.documentElement.lang === 'ar' || document.documentElement.getAttribute('dir') === 'rtl';

  const defaultStoreEn = 'Al-Rawabi Botanical Nursery';
  const defaultStoreAr = 'مشتل الروابي النباتي';

  let businessName = profile.storeName || session?.businessName || session?.name;
  if (!businessName || businessName === defaultStoreEn || businessName === defaultStoreAr) {
    businessName = isArabic() ? defaultStoreAr : defaultStoreEn;
  }

  const topStripStoreName = document.getElementById('topStripStoreName');
  if (topStripStoreName) topStripStoreName.textContent = businessName;

  const formStoreName = document.getElementById('ticketStoreName');
  if (formStoreName) formStoreName.value = businessName;

  const formContactPerson = document.getElementById('ticketContactPerson');
  if (formContactPerson && !formContactPerson.value) {
    formContactPerson.value = profile.managerName || session?.name || 'Tareq Al-Rawabi';
  }

  const formPhone = document.getElementById('ticketPhone');
  if (formPhone && !formPhone.value) {
    formPhone.value = profile.phone || session?.phone || '+962 7 9811 2233';
  }

  // 2. Initial Sample Tickets if none exist
  const STORAGE_KEY = 'agrismartMerchantTickets';
  let tickets = [];
  try {
    tickets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    tickets = [];
  }

  if (!tickets || tickets.length === 0) {
    tickets = [
      {
        id: 'TKT-2026-0849',
        subject: 'Driver Crate Exchange at Greenhouse Gate',
        department: 'Courier & Driver Dispatch',
        departmentAr: 'مندوبو التوصيل واستلام الشتلات',
        priority: 'high',
        status: 'open',
        date: 'Today, 10:15 AM',
        dateAr: 'اليوم، ١٠:١٥ ص',
        orderId: '#AG-M804',
        message: 'Driver arrived without insulated horticultural carriers for delicate orchids. Requested dispatch support.'
      },
      {
        id: 'TKT-2026-0812',
        subject: 'CliQ Payout Settlement Verification',
        department: 'CliQ Payouts & Finance',
        departmentAr: 'أرباح كليك والتحويلات المالية',
        priority: 'normal',
        status: 'resolved',
        date: 'Yesterday, 04:30 PM',
        dateAr: 'أمس، ٠٤:٣٠ م',
        orderId: '#AG-M801',
        message: 'Settlement of 145 JOD transferred successfully to RAWABI-PLANTS CliQ alias.'
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }

  // 3. Render Tickets
  const container = document.getElementById('ticketsListContainer');
  function renderTickets() {
    if (!container) return;
    const isAr = isArabic();
    
    if (tickets.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--m-text-muted); font-size:0.9rem;">
        ${isAr ? 'لا توجد تذاكر دعم مفتوحة حالياً.' : 'No active support tickets found.'}
      </div>`;
      return;
    }

    container.innerHTML = tickets.map(t => {
      const priorityLabel = t.priority === 'urgent' 
        ? (isAr ? '🚨 طارئ جداً' : '🚨 Urgent') 
        : t.priority === 'high' 
          ? (isAr ? '⚠️ عالي' : '⚠️ High') 
          : (isAr ? 'عادي' : 'Normal');

      const statusLabel = t.status === 'resolved' 
        ? (isAr ? '✓ تم الحل' : '✓ Resolved') 
        : (isAr ? '⏳ قيد المتابعة' : '⏳ In Progress');

      const statusClass = t.status === 'resolved' ? 'badge-status-resolved' : 'badge-status-open';
      const priorityClass = `badge-priority-${t.priority}`;
      const deptName = isAr && t.departmentAr ? t.departmentAr : t.department;
      const dateText = isAr && t.dateAr ? t.dateAr : t.date;

      return `
        <article class="ticket-item">
          <div class="ticket-item__top">
            <span class="ticket-id">${t.id}</span>
            <div class="ticket-badges">
              <span class="ticket-badge ${priorityClass}">${priorityLabel}</span>
              <span class="ticket-badge ${statusClass}">${statusLabel}</span>
            </div>
          </div>
          <h4 class="ticket-item__title">${t.subject}</h4>
          <p class="ticket-item__desc">${t.message}</p>
          <div class="ticket-item__footer">
            <span>🏷️ ${deptName} ${t.orderId ? `· ${t.orderId}` : ''}</span>
            <span>🕒 ${dateText}</span>
          </div>
        </article>
      `;
    }).join('');
  }

  renderTickets();

  // 4. Handle Form Submission
  const form = document.getElementById('merchantTicketForm');
  const toast = document.getElementById('merchantToast');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isAr = isArabic();

      const departmentSelect = document.getElementById('ticketDepartment');
      const department = departmentSelect ? departmentSelect.options[departmentSelect.selectedIndex].text : 'General Support';
      const departmentValue = departmentSelect ? departmentSelect.value : 'general';
      const priority = document.getElementById('ticketPriority')?.value || 'normal';
      const orderId = document.getElementById('ticketOrderId')?.value.trim() || '';
      const subject = document.getElementById('ticketSubject')?.value.trim() || (isAr ? 'استفسار دعم مشتل' : 'Nursery Partner Inquiry');
      const message = document.getElementById('ticketMessage')?.value.trim() || '';

      const newTicketId = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newTicket = {
        id: newTicketId,
        subject: subject,
        department: department,
        departmentAr: department,
        priority: priority,
        status: 'open',
        date: `Today, ${timeStr}`,
        dateAr: `اليوم، ${timeStr}`,
        orderId: orderId,
        message: message
      };

      tickets.unshift(newTicket);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      } catch (err) {
        console.warn('Could not persist ticket to localStorage', err);
      }

      renderTickets();

      // Clear non-identity inputs
      if (document.getElementById('ticketSubject')) document.getElementById('ticketSubject').value = '';
      if (document.getElementById('ticketMessage')) document.getElementById('ticketMessage').value = '';
      if (document.getElementById('ticketOrderId')) document.getElementById('ticketOrderId').value = '';

      showToast(isAr 
        ? `✅ تم إرسال تذكرة المشتل (${newTicketId}) بنجاح! سيتم التواصل معكم فوراً.`
        : `✅ Merchant Ticket (${newTicketId}) submitted successfully! Our dispatch team is on it.`
      );
    });
  }

  // 5. FAQ Accordion Logic
  document.querySelectorAll('.faq-item').forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        document.querySelectorAll('.faq-item').forEach(other => other.classList.remove('is-open'));
        if (!isOpen) {
          item.classList.add('is-open');
        }
      });
    }
  });

  // 6. Listen for language changes to re-render
  window.addEventListener('languagechange', () => {
    renderTickets();
    const isAr = isArabic();
    if (topStripStoreName) {
      topStripStoreName.textContent = isAr ? defaultStoreAr : defaultStoreEn;
    }
  });
});

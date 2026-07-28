/* ==========================================================================
   JCS ELECTRICAL - MAIN INTERACTIVE JAVASCRIPT
   Mobile Menu, Accordion, Smooth Scroll & Form Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  
  // 1. Mobile Menu Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  
  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileNavDrawer.classList.toggle('is-open');
      const isExpanded = mobileNavDrawer.classList.contains('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile nav when link clicked
    const mobileLinks = mobileNavDrawer.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNavDrawer.classList.remove('is-open');
      });
    });
  }

  // 2. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('is-open');
        
        // Close other open FAQs for clean accordion feel
        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('is-open');
        });

        if (!isOpen) {
          item.classList.add('is-open');
        }
      });
    }
  });

  // 3. Contact / Free Quote Lead Form Submission & GoHighLevel CRM Ingestion
  const quoteForm = document.getElementById('quoteForm');

  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const nameInput = quoteForm.querySelector('input[placeholder*="Name"]');
      const emailInput = quoteForm.querySelector('input[type="email"]');
      const phoneInput = quoteForm.querySelector('input[type="tel"]');
      const serviceSelect = quoteForm.querySelector('select');
      const notesTextarea = quoteForm.querySelector('textarea');

      const fullName = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const service = serviceSelect ? serviceSelect.value : '';
      const notes = notesTextarea ? notesTextarea.value.trim() : '';

      const parts = fullName.split(' ');
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';

      const payload = {
        locationId: 'iDdhTAYwVIzsWgprAeiV',
        firstName: firstName,
        lastName: lastName,
        name: fullName,
        email: email,
        phone: phone,
        tags: ['Google-Ads-Lead', 'Website-Quote-Request'],
        customFields: [
          { id: '9zKDPiXPh3tePknC1S16', key: 'contact.service_needed', value: service },
          { id: 'VneiQBZ00NJvcxZLx9Ei', key: 'contact.job_notes', value: notes }
        ]
      };

      // Ingest Lead into GoHighLevel CRM
      fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer pit-6cc8ba8a-fa37-4270-baef-1e05a02cf836',
          'Version': '2021-07-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).catch(function (err) {
        console.warn('GHL Submission note:', err);
      }).finally(function () {
        // Redirect lead to clean Thank You URL (enables Google Ads conversion tracking)
        window.location.href = 'thank-you/';
      });
    });
  }

  // 4. Smooth Anchor Link Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

});

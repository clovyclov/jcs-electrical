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

  // 2.5 Dynamic Text Replacement (DTR) for Google Ads Traffic (?service=...)
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = (urlParams.get('service') || '').toLowerCase();

  const heroBadge = document.querySelector('.hero-section .heading-tag-text');
  const heroHeadline = document.querySelector('.hero-headline');
  const heroDescription = document.querySelector('.hero-description');
  const formTitle = document.querySelector('#contact .section-title');
  const serviceSelect = document.querySelector('#quoteForm select');

  const dtrConfigs = {
    'panel-upgrades': {
      badge: '⚡ Licensed Electrical Panel Upgrade Specialists',
      headline: 'Electrical Panel Upgrades Done Right.',
      description: 'Upgrading your electrical panel or replacing an outdated breaker box? Honest, upfront pricing from licensed electricians in King & Snohomish Counties.',
      formTitle: 'Get Your Panel Upgrade Quote',
      selectValue: 'Panel Upgrades'
    },
    'panel-upgrade': {
      badge: '⚡ Licensed Electrical Panel Upgrade Specialists',
      headline: 'Electrical Panel Upgrades Done Right.',
      description: 'Upgrading your electrical panel or replacing an outdated breaker box? Honest, upfront pricing from licensed electricians in King & Snohomish Counties.',
      formTitle: 'Get Your Panel Upgrade Quote',
      selectValue: 'Panel Upgrades'
    },
    'ev-charger': {
      badge: '🔌 Licensed Home EV Charger Installers',
      headline: 'Fast, Safe Home EV Charger Installation.',
      description: 'Expert Level 2 & Tesla Wall Connector installations for your home. Professional, code-compliant setup with upfront pricing.',
      formTitle: 'Get Your EV Charger Quote',
      selectValue: 'EV Charger Install'
    },
    'ev-charger-installation': {
      badge: '🔌 Licensed Home EV Charger Installers',
      headline: 'Fast, Safe Home EV Charger Installation.',
      description: 'Expert Level 2 & Tesla Wall Connector installations for your home. Professional, code-compliant setup with upfront pricing.',
      formTitle: 'Get Your EV Charger Quote',
      selectValue: 'EV Charger Install'
    },
    'emergency': {
      badge: '🚨 24/7 Emergency Electrician Available',
      headline: 'Electrical Emergency? Fast Dispatch Same-Day.',
      description: 'Power outages, buzzing breaker boxes, or sparking outlets? Fully licensed, bonded & insured emergency electricians ready to help immediately.',
      formTitle: 'Request Immediate Emergency Dispatch',
      selectValue: 'Emergency Repairs'
    },
    'emergency-electrician': {
      badge: '🚨 24/7 Emergency Electrician Available',
      headline: 'Electrical Emergency? Fast Dispatch Same-Day.',
      description: 'Power outages, buzzing breaker boxes, or sparking outlets? Fully licensed, bonded & insured emergency electricians ready to help immediately.',
      formTitle: 'Request Immediate Emergency Dispatch',
      selectValue: 'Emergency Repairs'
    },
    'lighting-outlets': {
      badge: '💡 Recessed Lighting & Outlet Specialists',
      headline: 'Expert Lighting & Outlet Installation.',
      description: 'Transform your home with modern recessed lighting, ceiling fans, or new 240V outlets. Clean, upfront-priced electrical work.',
      formTitle: 'Get Your Lighting & Outlet Quote',
      selectValue: 'Lighting Installation'
    }
  };

  if (serviceParam && dtrConfigs[serviceParam]) {
    const config = dtrConfigs[serviceParam];
    if (heroBadge) heroBadge.textContent = config.badge;
    if (heroHeadline) heroHeadline.innerHTML = config.headline;
    if (heroDescription) heroDescription.textContent = config.description;
    if (formTitle) formTitle.textContent = config.formTitle;
    if (serviceSelect && config.selectValue) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].text.includes(config.selectValue)) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

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
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.contact && data.contact.id) {
          // Auto-Create Opportunity in Sales Pipeline "Residential Electrical Leads"
          return fetch('https://services.leadconnectorhq.com/opportunities/', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer pit-6cc8ba8a-fa37-4270-baef-1e05a02cf836',
              'Version': '2021-07-28',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              pipelineId: 'X1r6FCcsbpVFuyoUVpce',
              locationId: 'iDdhTAYwVIzsWgprAeiV',
              name: (fullName || 'New Web Lead') + ' - ' + (service || 'General Inquiry'),
              pipelineStageId: 'db1328b7-6a4f-472f-84ec-c1b248e889a7',
              status: 'open',
              contactId: data.contact.id
            })
          });
        }
      })
      .catch(function (err) {
        console.warn('GHL Submission note:', err);
      })
      .finally(function () {
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

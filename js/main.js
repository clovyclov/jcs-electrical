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
      badge: 'UPFRONT-PRICED PANEL REPLACEMENTS',
      headline: 'Stop Tripping Breakers &amp; Safely Power Your Whole Home.',
      description: 'Upgrade your electrical box to cleanly run heavy appliances, AC units, and EV chargers with guaranteed upfront pricing.',
      formTitle: 'Get Your Panel Upgrade Quote',
      selectValue: 'Panel Upgrades'
    },
    'panel-upgrade': {
      badge: 'UPFRONT-PRICED PANEL REPLACEMENTS',
      headline: 'Stop Tripping Breakers &amp; Safely Power Your Whole Home.',
      description: 'Upgrade your electrical box to cleanly run heavy appliances, AC units, and EV chargers with guaranteed upfront pricing.',
      formTitle: 'Get Your Panel Upgrade Quote',
      selectValue: 'Panel Upgrades'
    },
    'ev-charger': {
      badge: 'LICENSED EV CHARGER INSTALLATION',
      headline: 'Charge Your EV 5x Faster Overnight Right at Home.',
      description: 'Skip public charging stations. Get a safe, dedicated Level 2 or Tesla Wall Connector installed professionally with zero hassle.',
      formTitle: 'Get Your EV Charger Quote',
      selectValue: 'EV Charger Install'
    },
    'ev-charger-installation': {
      badge: 'LICENSED EV CHARGER INSTALLATION',
      headline: 'Charge Your EV 5x Faster Overnight Right at Home.',
      description: 'Skip public charging stations. Get a safe, dedicated Level 2 or Tesla Wall Connector installed professionally with zero hassle.',
      formTitle: 'Get Your EV Charger Quote',
      selectValue: 'EV Charger Install'
    },
    'emergency': {
      badge: '24/7 EMERGENCY DISPATCH',
      headline: 'Get Your Power Restored Fast &amp; Eliminate Fire Hazards.',
      description: 'Sparking outlets, buzzing breaker boxes, or sudden power outage? Our licensed emergency electricians arrive same-day to make your home safe.',
      formTitle: 'Request Immediate Emergency Dispatch',
      selectValue: 'Emergency Repairs'
    },
    'emergency-electrician': {
      badge: '24/7 EMERGENCY DISPATCH',
      headline: 'Get Your Power Restored Fast &amp; Eliminate Fire Hazards.',
      description: 'Sparking outlets, buzzing breaker boxes, or sudden power outage? Our licensed emergency electricians arrive same-day to make your home safe.',
      formTitle: 'Request Immediate Emergency Dispatch',
      selectValue: 'Emergency Repairs'
    },
    'lighting-outlets': {
      badge: 'RECESSED LIGHTING &amp; OUTLETS',
      headline: 'Brighten Your Rooms &amp; Get Outlets Right Where You Need Them.',
      description: 'Transform dim spaces with custom recessed LED lighting and add heavy-duty 240V or USB outlets cleanly without messy wires.',
      formTitle: 'Get Your Lighting &amp; Outlet Quote',
      selectValue: 'Lighting Installation'
    },
    'residential': {
      badge: 'FAMILY-OWNED LICENSED ELECTRICIANS',
      headline: 'Enjoy Safe, Hassle-Free Power With Upfront Pricing.',
      description: 'No surprise fees, no shortcuts. JCS Electrical keeps your family safe and powered with guaranteed craftsmanship across King &amp; Snohomish Counties.',
      formTitle: 'Get Your Free Quote',
      selectValue: ''
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

      const webhookPayload = {
        locationId: 'iDdhTAYwVIzsWgprAeiV',
        firstName: firstName,
        lastName: lastName,
        name: fullName,
        email: email,
        phone: phone,
        service: service,
        notes: notes,
        source: 'Website Quote Request Form',
        tags: ['Google-Ads-Lead', 'Website-Quote-Request'],
        customFields: [
          { id: '9zKDPiXPh3tePknC1S16', key: 'contact.service_needed', value: service },
          { id: 'VneiQBZ00NJvcxZLx9Ei', key: 'contact.job_notes', value: notes }
        ]
      };

      const webhookUrl = 'https://services.leadconnectorhq.com/hooks/iDdhTAYwVIzsWgprAeiV/webhook-trigger/62a636e3-8991-4882-af16-4c08d0763081';

      // 1. Post to GoHighLevel Webhook Trigger
      const webhookPromise = fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookPayload)
      }).catch(function (err) {
        console.warn('Webhook post note:', err);
      });

      // 2. Ingest Lead into GoHighLevel CRM API
      const crmPromise = fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ***REMOVED-GHL-TOKEN***',
          'Version': '2021-07-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookPayload)
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.contact && data.contact.id) {
          // Auto-Create Opportunity in Sales Pipeline "Residential Electrical Leads"
          return fetch('https://services.leadconnectorhq.com/opportunities/', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ***REMOVED-GHL-TOKEN***',
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
      });

      // Wait for submissions before redirecting to Thank You page
      Promise.all([webhookPromise, crmPromise]).finally(function () {
        window.location.href = '/thank-you/';
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

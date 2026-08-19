/* ==========================================================================
   JCS ELECTRICAL - MAIN INTERACTIVE JAVASCRIPT
   Lead Modal, Mobile Menu, Accordion & GHL Lead Ingestion
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // 0. STICKY MOBILE CALL/QUOTE BAR
  // Injected before setupLeadModal() so its "Get Quote" link (.btn-primary)
  // is picked up by the generic ctaTriggers modal-open binding below.
  function setupStickyMobileCta() {
    const heroSection = document.getElementById('hero');
    if (!heroSection || document.getElementById('stickyMobileCta')) return;

    const bar = document.createElement('div');
    bar.className = 'sticky-mobile-cta';
    bar.id = 'stickyMobileCta';
    bar.innerHTML = `
      <a href="tel:4256962234" class="btn-secondary">Call Now</a>
      <a href="#contact" class="btn-primary">Get Quote</a>
    `;
    document.body.appendChild(bar);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          bar.classList.toggle('is-visible', !entry.isIntersecting);
        });
      });
      observer.observe(heroSection);
    } else {
      bar.classList.add('is-visible');
    }
  }
  setupStickyMobileCta();

  // 1. LEAD FORM MODAL INJECTION & LOGIC
  function setupLeadModal() {
    let modalOverlay = document.getElementById('leadModal');

    // Create Modal HTML if not already statically rendered
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.className = 'lead-modal-overlay';
      modalOverlay.id = 'leadModal';
      modalOverlay.setAttribute('aria-hidden', 'true');
      
      const isEvPage = window.location.pathname.includes('ev-charger-installation');
      const evSelectedAttr = isEvPage ? 'selected' : '';
      const relativePrefix = isEvPage ? '../' : './';

      modalOverlay.innerHTML = `
        <div class="lead-modal-container" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <button class="lead-modal-close" id="modalCloseBtn" aria-label="Close modal">&times;</button>
          <div class="lead-modal-header">
            <div class="heading-tag" style="margin-bottom: 8px;">
              <div class="heading-tag-line"></div>
              <span class="heading-tag-text">FAST UPFRONT ESTIMATE</span>
            </div>
            <h3 class="section-title" id="modalTitle" style="font-size: clamp(24px, 3.5vw, 32px); margin: 0 0 8px; color: var(--text-main);">Get Your Free Quote</h3>
            <p style="font-size: 14px; color: var(--text-muted); margin: 0;">Tell us about your project and we'll get back to you same-day.</p>
          </div>
          
          <form class="contact-form modal-contact-form" id="modalQuoteForm" style="display: flex; flex-direction: column; gap: 16px;">
            <div class="form-row-2">
              <input type="text" name="name" required placeholder="Full Name" class="form-control">
              <input type="tel" name="phone" required placeholder="Phone Number" class="form-control">
            </div>
            <input type="email" name="email" placeholder="Email Address" class="form-control">
            <select name="service" class="form-control">
              <option value="">What do you need help with?</option>
              <option value="EV Charger Install" ${evSelectedAttr}>EV Charger Install</option>
              <option value="Panel Upgrades">Panel Upgrades</option>
              <option value="Residential Wiring &amp; Repairs">Residential Wiring &amp; Repairs</option>
              <option value="Lighting Installation">Lighting Installation</option>
              <option value="Emergency Repairs">Emergency Repairs</option>
              <option value="Generator Installation">Generator Installation</option>
              <option value="Other Electrical Project">Other Electrical Project</option>
            </select>
            <textarea name="notes" placeholder="Vehicle model (e.g. Tesla Model Y, Rivian R1T) &amp; job details" rows="3" class="form-control"></textarea>
            <button type="submit" class="btn-primary" style="width: 100%; font-size: 16px; padding: 16px; justify-content: center; cursor: pointer;">Send My Free Quote Request</button>
            <p style="font-size: 13px; color: var(--accent-gold); font-weight: 700; margin-top: 4px; text-align: center;">We respond within 1 business hour</p>
            <p style="font-size: 11px; color: #94a3b8; margin-top: 4px; line-height: 1.4; text-align: center;">
              By submitting your request, you consent to receive SMS text messages from JCS Electrical regarding your estimate &amp; service updates. Msg &amp; data rates may apply. Reply STOP to opt out. See our <a href="${relativePrefix}privacy-policy/" style="color:var(--accent-gold); text-decoration:underline;">Privacy Policy</a> &amp; <a href="${relativePrefix}terms-of-service/" style="color:var(--accent-gold); text-decoration:underline;">Terms of Service</a>.
            </p>
          </form>

          <div class="form-success-card" id="modalFormSuccessCard" style="display: none; padding: 32px; flex-direction: column; align-items: flex-start; gap: 12px;">
            <div class="avatar-initials" style="font-size: 20px; width: 44px; height: 44px; background: var(--accent-gold); color: var(--accent-text-dark); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900;">✓</div>
            <h3 class="section-title" style="font-size: 24px;">Request Received!</h3>
            <p class="about-paragraph" style="margin: 0; color: var(--text-muted);">Thanks — we'll call you back same-day to schedule your free quote.</p>
          </div>
        </div>
      `;
      document.body.appendChild(modalOverlay);
    }

    const modalCloseBtn = document.getElementById('modalCloseBtn');

    function openModal() {
      if (modalOverlay) {
        modalOverlay.classList.add('is-active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Pre-select service based on DTR or URL if available
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = (urlParams.get('service') || '').toLowerCase();
        const modalSelect = modalOverlay.querySelector('select[name="service"]');
        if (modalSelect) {
          if (window.location.pathname.includes('ev-charger-installation') || serviceParam.includes('ev-charger')) {
            modalSelect.value = 'EV Charger Install';
          } else if (serviceParam.includes('panel')) {
            modalSelect.value = 'Panel Upgrades';
          } else if (serviceParam.includes('emergency')) {
            modalSelect.value = 'Emergency Repairs';
          }
        }

        const nameInput = modalOverlay.querySelector('input[name="name"]');
        if (nameInput) setTimeout(() => nameInput.focus(), 100);
      }
    }

    function closeModal() {
      if (modalOverlay) {
        modalOverlay.classList.remove('is-active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

    // Close button event
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    // Backdrop click close
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Escape key close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Intercept CTA Button Clicks to Open Modal
    const ctaTriggers = document.querySelectorAll('.btn-primary, a[href="#contact"], a[href="#quote"], .open-quote-modal');
    ctaTriggers.forEach(function (btn) {
      // Don't intercept if it's a phone link or form submit button
      if (btn.tagName === 'BUTTON' && btn.type === 'submit') return;
      if (btn.getAttribute('href') && btn.getAttribute('href').startsWith('tel:')) return;

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });

    // Bind form submission for Modal Lead Form
    const modalForm = document.getElementById('modalQuoteForm');
    if (modalForm) {
      bindFormSubmission(modalForm, true);
    }
  }

  // 2. FORM SUBMISSION HANDLER (GHL Webhook + GHL CRM API)
  function bindFormSubmission(formEl, isModal = false) {
    if (!formEl) return;

    formEl.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = formEl.querySelector('input[placeholder*="Name"], input[name="name"]');
      const emailInput = formEl.querySelector('input[type="email"], input[name="email"]');
      const phoneInput = formEl.querySelector('input[type="tel"], input[name="phone"]');
      const serviceSelect = formEl.querySelector('select');
      const notesTextarea = formEl.querySelector('textarea');

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
        source: isModal ? 'Website Lead Form Modal' : 'Website Quote Request Form',
        tags: ['Google-Ads-Lead', 'Website-Quote-Request'],
        customFields: [
          { id: '9zKDPiXPh3tePknC1S16', key: 'contact.service_needed', value: service },
          { id: 'VneiQBZ00NJvcxZLx9Ei', key: 'contact.job_notes', value: notes }
        ]
      };

      const webhookUrl = 'https://services.leadconnectorhq.com/hooks/iDdhTAYwVIzsWgprAeiV/webhook-trigger/62a636e3-8991-4882-af16-4c08d0763081';

      // Post to GoHighLevel Webhook Trigger. Contact upsert + opportunity
      // creation are handled by a GHL Workflow attached to this webhook,
      // not by direct authenticated API calls (a Private Integration Token
      // must never be shipped in client-side JS since it is world-readable).
      const webhookPromise = fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      }).catch(function (err) {
        console.warn('Webhook post note:', err);
      });

      // Redirect to Thank You page
      Promise.all([webhookPromise]).finally(function () {
        window.location.href = '/thank-you/';
      });
    });
  }

  // Initialize Lead Modal
  setupLeadModal();

  // Bind inline page quote form if present
  const inlineForm = document.getElementById('quoteForm');
  if (inlineForm) {
    bindFormSubmission(inlineForm, false);
  }

  // 3. Mobile Menu Drawer Toggle
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

  // 4. FAQ Accordion Toggle
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

  // 5. Dynamic Text Replacement (DTR) for Google Ads Traffic (?service=...)
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

});

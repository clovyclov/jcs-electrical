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
        
        // Optional: Close other open FAQs
        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('is-open');
        });

        if (!isOpen) {
          item.classList.add('is-open');
        }
      });
    }
  });

  // 3. Contact / Free Quote Lead Form Submission
  const quoteForm = document.getElementById('quoteForm');
  const formSuccessCard = document.getElementById('formSuccessCard');

  if (quoteForm && formSuccessCard) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Hide form and display success confirmation card
      quoteForm.style.display = 'none';
      formSuccessCard.classList.add('is-active');

      // Scroll smoothly to confirmation message if needed
      formSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

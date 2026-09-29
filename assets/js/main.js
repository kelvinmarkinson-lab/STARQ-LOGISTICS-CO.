/**
 * STARQ LOGISTICS & CO. — Main Frontend Logic
 * Air Cargo Shipping & Logistics
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initActiveNav();
  initEstimatorWidget();
  initQuoteForm();
});

/**
 * Sticky Header elevation on scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer Toggle & Accessibility
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const overlay = document.getElementById('mobileNavOverlay');

  if (!toggleBtn || !drawer || !overlay) return;

  const openMenu = () => {
    toggleBtn.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    toggleBtn.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close when clicking internal links in mobile drawer
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * Highlight active page in navigation links
 */
function initActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.toLowerCase();

    // Check matching filename
    if (
      (currentPath.endsWith(cleanHref) && cleanHref !== '') ||
      (currentPath.endsWith('/') && cleanHref === 'index.html') ||
      (currentPath === '' && cleanHref === 'index.html') ||
      (currentPath.endsWith('index.html') && cleanHref === 'index.html')
    ) {
      link.classList.add('active');
    }
  });
}

/**
 * Quick Quote Estimator on Homepage:
 * Saves data into sessionStorage and redirects to contact.html#quote-form
 */
function initEstimatorWidget() {
  const estimatorForm = document.getElementById('quickEstimatorForm');
  if (!estimatorForm) return;

  estimatorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const origin = document.getElementById('estOrigin')?.value || '';
    const destination = document.getElementById('estDestination')?.value || '';
    const cargoType = document.getElementById('estCargoType')?.value || '';
    const weight = document.getElementById('estWeight')?.value || '';

    // Save to sessionStorage
    const prepData = {
      origin,
      destination,
      cargoType,
      weight
    };

    try {
      sessionStorage.setItem('starq_quote_prep', JSON.stringify(prepData));
    } catch (err) {
      console.warn('Storage unavailable:', err);
    }

    // Redirect to contact form
    window.location.href = 'contact.html#quote-form';
  });
}

/**
 * Shipping Quote Request Form: Client-Side Validation & Transparent Handling
 */
function initQuoteForm() {
  const form = document.getElementById('shippingQuoteForm');
  if (!form) return;

  // Check if there is pre-filled data from estimator
  try {
    const rawData = sessionStorage.getItem('starq_quote_prep');
    if (rawData) {
      const data = JSON.parse(rawData);
      if (data.origin && document.getElementById('quoteOrigin')) {
        document.getElementById('quoteOrigin').value = data.origin;
      }
      if (data.destination && document.getElementById('quoteDestination')) {
        document.getElementById('quoteDestination').value = data.destination;
      }
      if (data.cargoType && document.getElementById('quoteCargoType')) {
        document.getElementById('quoteCargoType').value = data.cargoType;
      }
      if (data.weight && document.getElementById('quoteWeight')) {
        document.getElementById('quoteWeight').value = data.weight;
      }
      // Clear after populating
      sessionStorage.removeItem('starq_quote_prep');
    }
  } catch (err) {
    console.warn('Could not read pre-fill data:', err);
  }

  const statusBox = document.getElementById('formStatusBox');
  const summaryOutput = document.getElementById('inquirySummaryOutput');
  const copyBtn = document.getElementById('copyInquiryBtn');

  // Validation helper
  const validateField = (input, validator, errorMsgEl) => {
    const isValid = validator(input.value.trim());
    if (!isValid) {
      input.classList.add('is-invalid');
      if (errorMsgEl) errorMsgEl.classList.add('visible');
    } else {
      input.classList.remove('is-invalid');
      if (errorMsgEl) errorMsgEl.classList.remove('visible');
    }
    return isValid;
  };

  // Real-time blur listeners
  const fields = [
    { id: 'quoteFullName', test: v => v.length >= 2, errId: 'errFullName' },
    { id: 'quoteEmail', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), errId: 'errEmail' },
    { id: 'quotePhone', test: v => v.length >= 7, errId: 'errPhone' },
    { id: 'quoteOrigin', test: v => v.length >= 2, errId: 'errOrigin' },
    { id: 'quoteDestination', test: v => v.length >= 2, errId: 'errDestination' },
    { id: 'quoteCargoType', test: v => v.length >= 2, errId: 'errCargoType' },
    { id: 'quoteWeight', test: v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, errId: 'errWeight' }
  ];

  fields.forEach(({ id, test, errId }) => {
    const input = document.getElementById(id);
    const errEl = document.getElementById(errId);
    if (input) {
      input.addEventListener('blur', () => validateField(input, test, errEl));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateField(input, test, errEl);
        }
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    fields.forEach(({ id, test, errId }) => {
      const input = document.getElementById(id);
      const errEl = document.getElementById(errId);
      if (input && !validateField(input, test, errEl)) {
        allValid = false;
      }
    });

    if (!allValid) {
      if (statusBox) {
        statusBox.className = 'form-status-box form-status-error visible';
        statusBox.innerHTML = `
          <span class="status-badge">Required Fields Missing</span>
          <p>Please review the highlighted fields above and provide complete shipment information before proceeding.</p>
        `;
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }

    // Extract all 11 fields
    const formData = {
      fullName: document.getElementById('quoteFullName')?.value.trim(),
      businessName: document.getElementById('quoteBusinessName')?.value.trim() || 'Not specified',
      email: document.getElementById('quoteEmail')?.value.trim(),
      phone: document.getElementById('quotePhone')?.value.trim(),
      origin: document.getElementById('quoteOrigin')?.value.trim(),
      destination: document.getElementById('quoteDestination')?.value.trim(),
      cargoType: document.getElementById('quoteCargoType')?.value.trim(),
      weight: document.getElementById('quoteWeight')?.value.trim() + ' kg',
      dimensions: document.getElementById('quoteDimensions')?.value.trim() || 'Standard packaging / Unspecified',
      shippingDate: document.getElementById('quoteShippingDate')?.value.trim() || 'Flexible / As soon as possible',
      additionalNotes: document.getElementById('quoteNotes')?.value.trim() || 'None provided',
      submittedAt: new Date().toLocaleString()
    };

    // Honest display: clearly state that real submission requires backend or email service integration
    if (statusBox) {
      statusBox.className = 'form-status-box form-status-success visible';
      statusBox.innerHTML = `
        <span class="status-badge">Inquiry Validated &amp; Ready for Backend Integration</span>
        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: #166534;">
          Shipment Quote Inquiry Validated Successfully
        </h4>
        <p style="font-size: 0.92rem; line-height: 1.6; margin-bottom: 0.75rem;">
          <strong>Frontend Demonstration Notice:</strong> This client-side form has performed full input validation. Because this static website does not currently have a connected email server or backend API (such as Node.js mailer, PHP, or EmailJS), inquiries are not automatically dispatched via SMTP.
        </p>
        <p style="font-size: 0.9rem; color: #15803D;">
          The complete structured inquiry payload has been compiled below for testing and immediate integration.
        </p>
        <div class="inquiry-summary-card">
          <strong>Shipment Inquiry Summary:</strong>
          <table class="summary-table">
            <tr><td>Full Name:</td><td>${escapeHtml(formData.fullName)}</td></tr>
            <tr><td>Business Name:</td><td>${escapeHtml(formData.businessName)}</td></tr>
            <tr><td>Contact Email:</td><td>${escapeHtml(formData.email)}</td></tr>
            <tr><td>Phone / WhatsApp:</td><td>${escapeHtml(formData.phone)}</td></tr>
            <tr><td>Shipment Origin:</td><td>${escapeHtml(formData.origin)}</td></tr>
            <tr><td>Destination:</td><td>${escapeHtml(formData.destination)}</td></tr>
            <tr><td>Cargo Description:</td><td>${escapeHtml(formData.cargoType)}</td></tr>
            <tr><td>Cargo Weight:</td><td>${escapeHtml(formData.weight)}</td></tr>
            <tr><td>Dimensions:</td><td>${escapeHtml(formData.dimensions)}</td></tr>
            <tr><td>Preferred Date:</td><td>${escapeHtml(formData.shippingDate)}</td></tr>
            <tr><td>Additional Notes:</td><td>${escapeHtml(formData.additionalNotes)}</td></tr>
          </table>
          <div style="margin-top: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="copyInquiryBtn" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
              Copy Inquiry Payload
            </button>
            <button type="button" id="resetInquiryBtn" class="btn btn-outline-navy" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
              Submit Another Inquiry
            </button>
          </div>
        </div>
      `;

      statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Setup dynamic button handlers
      const newCopyBtn = document.getElementById('copyInquiryBtn');
      if (newCopyBtn) {
        newCopyBtn.addEventListener('click', () => {
          const payloadText = JSON.stringify(formData, null, 2);
          navigator.clipboard.writeText(payloadText).then(() => {
            newCopyBtn.textContent = 'Copied to Clipboard!';
            setTimeout(() => {
              newCopyBtn.textContent = 'Copy Inquiry Payload';
            }, 2500);
          }).catch(err => {
            console.error('Clipboard copy failed:', err);
          });
        });
      }

      const resetBtn = document.getElementById('resetInquiryBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          form.reset();
          statusBox.className = 'form-status-box';
          statusBox.innerHTML = '';
        });
      }
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

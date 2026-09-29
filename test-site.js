const http = require('http');
const fs = require('fs');
const path = require('path');

function checkUrl(urlPath) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let dataLen = 0;
      res.on('data', chunk => dataLen += chunk.length);
      res.on('end', () => {
        resolve({
          path: urlPath,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          bytes: dataLen,
          ok: res.statusCode === 200 && dataLen > 0
        });
      });
    }).on('error', (err) => {
      resolve({ path: urlPath, status: 0, error: err.message, ok: false });
    });
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('STARQ LOGISTICS & CO. — COMPREHENSIVE SITE AUDIT');
  console.log('====================================================');

  const filesToCheck = [
    '/',
    '/index.html',
    '/about.html',
    '/services.html',
    '/contact.html',
    '/assets/css/style.css',
    '/assets/js/main.js',
    '/assets/logo/logo-primary.svg',
    '/assets/logo/logo-white.svg',
    '/assets/logo/logo-icon.svg',
    '/assets/images/hero-air-cargo.jpg',
    '/assets/images/about-operations.jpg',
    '/assets/images/service-domestic.jpg',
    '/assets/images/service-international.jpg',
    '/assets/images/service-ecommerce.jpg',
    '/assets/images/contact-airport.jpg'
  ];

  let passedUrls = 0;
  for (const urlPath of filesToCheck) {
    const res = await checkUrl(urlPath);
    if (res.ok) {
      console.log(`[PASS] ${res.status} | ${res.path} (${res.contentType}, ${res.bytes} bytes)`);
      passedUrls++;
    } else {
      console.error(`[FAIL] ${res.status} | ${res.path} - ${res.error || 'Empty response'}`);
    }
  }

  console.log(`\nURL / Asset Tests: ${passedUrls}/${filesToCheck.length} passed.`);

  // Audit HTML files for links and required content
  const pages = ['index.html', 'about.html', 'services.html', 'contact.html'];
  let totalLinksChecked = 0;
  let brokenLinks = 0;

  for (const page of pages) {
    const content = fs.readFileSync(path.join(__dirname, page), 'utf-8');
    
    // Check images
    const imgMatches = [...content.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
    for (const src of imgMatches) {
      if (src.startsWith('http')) continue;
      const cleanSrc = src.split('?')[0].split('#')[0];
      const fullPath = path.join(__dirname, cleanSrc);
      if (!fs.existsSync(fullPath)) {
        console.error(`[BROKEN IMAGE] in ${page}: ${src}`);
        brokenLinks++;
      } else {
        totalLinksChecked++;
      }
    }

    // Check internal links
    const linkMatches = [...content.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]);
    for (const href of linkMatches) {
      if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href === '#') continue;
      const [filePart, anchor] = href.split('#');
      if (filePart) {
        const fullPath = path.join(__dirname, filePart);
        if (!fs.existsSync(fullPath)) {
          console.error(`[BROKEN LINK] in ${page}: ${href}`);
          brokenLinks++;
        } else {
          totalLinksChecked++;
        }
      }
    }
  }

  console.log(`\nInternal Links & Image References: Checked ${totalLinksChecked}, Broken: ${brokenLinks}`);

  // Audit Contact Form fields
  const contactContent = fs.readFileSync(path.join(__dirname, 'contact.html'), 'utf-8');
  const requiredFormFields = [
    'quoteFullName',
    'quoteBusinessName',
    'quoteEmail',
    'quotePhone',
    'quoteOrigin',
    'quoteDestination',
    'quoteCargoType',
    'quoteWeight',
    'quoteDimensions',
    'quoteShippingDate',
    'quoteNotes'
  ];

  console.log('\n--- Auditing Quote Form Fields in contact.html ---');
  let missingFields = 0;
  requiredFormFields.forEach(fieldId => {
    if (contactContent.includes(`id="${fieldId}"`)) {
      console.log(`[PASS] Field: ${fieldId} is present.`);
    } else {
      console.error(`[FAIL] Field: ${fieldId} is MISSING!`);
      missingFields++;
    }
  });

  // Check for forbidden / unconfirmed claims
  console.log('\n--- Auditing Integrity & Forbidden Claims ---');
  const forbiddenClaims = [
    'sea freight',
    'ocean freight',
    'customs clearance brokerage',
    'warehousing services',
    'door-to-door delivery',
    'real-time shipment tracking',
    'live gps tracking'
  ];

  pages.forEach(p => {
    const text = fs.readFileSync(path.join(__dirname, p), 'utf-8').toLowerCase();
    forbiddenClaims.forEach(claim => {
      // Allow disclaimer context (e.g. "we do not claim or provide sea freight")
      if (text.includes(claim)) {
        const isNegated = text.includes(`not claim`) || text.includes(`do not provide`) || text.includes(`unconfirmed`);
        if (!isNegated) {
          console.warn(`[WARNING] Potential unconfirmed claim "${claim}" in ${p}`);
        } else {
          console.log(`[PASS] Disclaimer properly mentions exclusion of "${claim}" in ${p}`);
        }
      }
    });
  });

  console.log('\n====================================================');
  console.log('AUDIT COMPLETE.');
  console.log('====================================================');
}

runTests();

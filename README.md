# STARQ LOGISTICS & CO. — Website Design & Frontend Platform

Professional, responsive multi-page web platform created for **STARQ LOGISTICS & CO.**, an air cargo shipping and logistics company based in **Ikeja, Lagos, Nigeria**, specializing in air freight solutions for e-commerce enterprises across domestic Nigeria and international destinations.

---

## 1. Project Overview & Pages

The platform comprises four complete pages built with semantic HTML5, modern Vanilla CSS, and JavaScript:

1. **Home (`index.html`)**:
   - Hero banner with suggested headline: *"Your Cargo, Moving Beyond Borders."*
   - Interactive **Quick Quote Estimator** widget pre-filling inquiries.
   - Company introduction highlighting air cargo logistics for e-commerce.
   - Three confirmed service highlights (Domestic Air Cargo, International Air Cargo, E-Commerce Cargo Solutions).
   - Credible, non-guaranteed *Why Choose Us* value cards.
   - Three-step shipping process (*Submit Details &rarr; Receive Quote &rarr; Confirm Shipment*).
   - High-impact CTA banner.

2. **About Us (`about.html`)**:
   - Company background and strategic geographic advantage in **Ikeja, Lagos, Nigeria** (aviation hub near MMIA).
   - Mission statement and four core values: *Reliability & Accountability, Transparent Quotations, Customer-Centric Focus, Operational Clarity*.
   - Photographic showcase of air cargo operations on tarmac.
   - Verified scope with zero unsupported historical or award claims.

3. **Our Services (`services.html`)**:
   - In-depth sections for **Domestic Air Cargo Shipping**, **International Air Cargo Shipping**, and **E-Commerce Cargo Solutions**.
   - Clear customer benefits and individual *Request a Quote* CTAs.
   - Comprehensive **Shipment Preparation & Packing Guidelines** for commercial air freight.
   - Explicit **Confirmed Service Scope & Transparency Notice**.

4. **Contact Us & Quote Form (`contact.html`)**:
   - Prominently marked contact placeholders for phone line, WhatsApp channel, email, address, and business hours.
   - **Comprehensive 11-Field Shipping Quote Request Form**:
     1. Full Name *(Required)*
     2. Business Name *(Optional)*
     3. Email Address *(Required, regex validated)*
     4. Phone or WhatsApp Number *(Required)*
     5. Shipment Origin *(Required)*
     6. Destination Country or City *(Required)*
     7. Cargo Description or Type *(Required)*
     8. Cargo Weight in Kilograms *(Required, numerical validation)*
     9. Package Dimensions *(Optional)*
     10. Preferred Shipping Date *(Optional)*
     11. Additional Shipment Details *(Optional)*
   - Client-side validation with real-time feedback.
   - Transparent submission handling: structured JSON inquiry summary generation and a **"Copy Inquiry Payload"** button for developer testing.

---

## 2. Brand Identity & Design System

- **Primary Teal:** `#29A5AA` (Interactive buttons, call-to-action highlights, badges, icons, active borders)
- **Deep Navy Blue:** `#15385B` (Headings, brand navigation, high-contrast dark sections, footer)
- **White & Light Gray:** `#FFFFFF` & `#F5F6F6` (Spacious, clean, accessible content presentation)
- **Typography:** Modern Google Font `Plus Jakarta Sans` with fluid responsive scaling.
- **Original Vector SVG Logo (`assets/logo/`):**
  - Aerodynamic cargo jet fin intersecting with geometric container ridges and forward velocity chevron in teal and navy.
  - Light variant (`logo-white.svg`) for footer and dark surfaces.
  - Primary variant (`logo-primary.svg`) for light headers and documents.
  - Favicon icon (`logo-icon.svg`) for browser tabs.

---

## 3. High-Resolution Visual Assets

All images are authentic, high-resolution commercial logistics assets stored locally in `assets/images/`:
- `hero-air-cargo.jpg` (1.52 MB): Widebody Boeing 747-8F freighter loading cargo on the tarmac.
- `about-operations.jpg` (1.07 MB): Air cargo terminal staging operations and freight pallets.
- `service-domestic.jpg` (691 KB): Regional air freight loading operations at airport.
- `service-international.jpg` (709 KB): Aviation high-loader positioning standardized ULD cargo containers onto widebody aircraft.
- `service-ecommerce.jpg` (138 KB): E-commerce parcels and shipping cartons organized in freight distribution facility.
- `contact-airport.jpg` (1.45 MB): Airport terminal apron and runway at dusk.

---

## 4. Running Locally

The project includes a built-in, zero-dependency Node.js HTTP server.

```bash
# Start local server
npm start
# or
node server.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Automated Audit
```bash
node test-site.js
```

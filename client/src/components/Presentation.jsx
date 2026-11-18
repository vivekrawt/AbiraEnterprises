// Presentation components reflecting Abira Enterprises' brand messaging and services.

export function Approach() {
  return (
    <section className="feature" id="approach" aria-label="About Abira Enterprises">
      <div className="feature-photo">
        <img
          src="/assets/product-101.jpg"
          alt="Textured corporate gift packaging box finished with ribbon"
          loading="lazy"
        />
        <span className="photo-tag">Every detail reflects your brand.</span>
      </div>
      <div className="feature-copy">
        <p className="eyebrow">ABOUT ABIRA ENTERPRISES</p>
        <h2>
          THOUGHTFUL DETAILS.<br />
          <em>LASTING IMPRESSIONS.</em>
        </h2>
        <h3 className="feature-subheading">Every detail reflects your brand.</h3>
        <p>
          From the first impression of a package to the finishing touch on a corporate gift, every detail matters. The right packaging protects, the right presentation impresses, and the right stationery communicates professionalism.
        </p>
        <p>
          At Abira Enterprises, we bring customized packaging, corporate gifting, printing, and everyday business essentials together to help businesses build and maintain a consistent, professional brand identity.
        </p>
        <a className="text-link light" href="#enquiry">
          Discuss your brand requirements <span>↗</span>
        </a>
        <div className="feature-signoff">
          <span aria-hidden="true">✳</span> Thoughtful details from the outside in.
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section className="faq section" id="faq" aria-label="Frequently Asked Questions">
      <div>
        <p className="eyebrow">GOOD QUESTIONS, ANSWERED</p>
        <h2>A few things<br />you might <em>wonder.</em></h2>
        <a className="text-link" href="#enquiry">Submit a project enquiry <span>↗</span></a>
      </div>
      <div className="faq-items">
        <details>
          <summary>What product categories does Abira Enterprises offer?<span>+</span></summary>
          <p>
            We provide an end-to-end catalogue across six main pillars: Comprehensive Packaging Solutions (corrugated boxes, printed &amp; branded boxes, coloured &amp; luxury rigid boxes, mailer boxes, and industrial packaging), Corporate Gifting (office stationery, corporate branding, commercial printing &amp; paper products, and desk essentials), Safety Wraps (air bubble rolls, honeycomb paper, kraft wrap), Confetti, Packaging Tapes (BOPP, printed logo, kraft, and masking tapes), and Labels &amp; Stickers (thermal, barcode, shipping, and branding decals).
          </p>
        </details>
        <details>
          <summary>Can I request custom sizes, printing, and branded finishes?<span>+</span></summary>
          <p>
            Yes. Customization is core to what we do. You can provide your required box dimensions, flute ply (3-ply, 5-ply, 7-ply), logo artwork, Pantone colours, and surface finishes (matte, gloss, UV, foil stamping) in your enquiry.
          </p>
        </details>
        <details>
          <summary>What are your minimum order quantities (MOQ)?<span>+</span></summary>
          <p>
            Minimum order quantities vary based on the product category and level of customization (e.g. plain stock mailers vs. custom flexo-printed boxes or branded stationery kits). Share your anticipated volume in our enquiry form so we can confirm feasibility and quote accordingly.
          </p>
        </details>
        <details>
          <summary>How can I request samples or physical mockups?<span>+</span></summary>
          <p>
            You can request sample designs and physical material swatches by submitting an enquiry with your project details and the specific product or category name.
          </p>
        </details>
        <details>
          <summary>What is the typical turnaround time for orders?<span>+</span></summary>
          <p>
            Lead times depend on the exact product specifications, printing requirements, and volume. Standard items ship quickly, while bespoke branded packaging and gift sets are scheduled according to your target delivery deadline.
          </p>
        </details>
      </div>
    </section>
  );
}

export function Inspiration({ onOpen, onBrowseCatalogue }) {
  return (
    <section className="inspiration section" aria-label="Curated inspiration">
      <div className="section-top">
        <div>
          <p className="eyebrow">CURATED SOLUTIONS</p>
          <h2>Designed for Every<br /><em>Brand Touchpoint.</em></h2>
        </div>
        <a
          className="text-link"
          href="/?page=products"
          onClick={event => {
            event.preventDefault();
            onBrowseCatalogue();
          }}
        >
          Browse complete catalogue <span>↗</span>
        </a>
      </div>
      <div className="inspiration-grid">
        <button
          className="inspiration-card"
          onClick={() => onOpen('corporate-stationery')}
          aria-label="Explore Corporate Stationery & Gifting"
        >
          <img
            src="/assets/product-16.jpg"
            alt="Corporate gifting sets and branded stationery"
            loading="lazy"
          />
          <span>
            Welcome kits &amp; executive gifts
            <b>Corporate Stationery &amp; Gifting ↗</b>
          </span>
        </button>
        <button
          className="inspiration-card"
          onClick={() => onOpen('packaging-solutions')}
          aria-label="Explore Comprehensive Packaging Solutions"
        >
          <img
            src="/assets/product-67.jpg"
            alt="Custom printed corrugated mailer box"
            loading="lazy"
          />
          <span>
            Distinctive unboxing &amp; transit cartons
            <b>Packaging Solutions ↗</b>
          </span>
        </button>
        <button
          className="inspiration-card"
          onClick={() => onOpen('safety-wraps')}
          aria-label="Explore Safety Wraps and Protective Packaging"
        >
          <img
            src="/assets/product-106.jpg"
            alt="Eco-friendly honeycomb protective paper wrap"
            loading="lazy"
          />
          <span>
            Reliable protective cushioning
            <b>Safety Wraps &amp; Tapes ↗</b>
          </span>
        </button>
      </div>
    </section>
  );
}

export function Footer({ onNavigate }) {
  const phone = window.ABIRA_SETTINGS?.phone;
  const email = window.ABIRA_SETTINGS?.email;

  return (
    <footer>
      <div className="footer-top">
        <a
          className="brand footer-brand"
          href="/?page=home#hero"
          onClick={event => {
            event.preventDefault();
            onNavigate('home', 'hero');
          }}
          aria-label="Abira Enterprises Home"
        >
          <img src="/assets/abira-enterprises-logo.png" alt="" />
        </a>
        <div>
          <a
            href="/?page=products"
            onClick={event => {
              event.preventDefault();
              onNavigate('products');
            }}
          >
            Explore Catalogue ↗
          </a>
          <a
            href="/?page=home#approach"
            onClick={event => {
              event.preventDefault();
              onNavigate('home', 'approach');
            }}
          >
            About Abira ↗
          </a>
          <a
            href="/?page=home#enquiry"
            onClick={event => {
              event.preventDefault();
              onNavigate('home', 'enquiry');
            }}
          >
            Request a Quote ↗
          </a>
        </div>
        <div className="footer-contact">
          <strong>Contact</strong>
          {phone && <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a>}
          {email && <a href={`mailto:${email}`}>{email}</a>}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Abira Enterprises. All rights reserved.</span>
        <span>Packaging · Printing · Corporate Gifting · Business Essentials</span>
        <span>Quality you can trust. Customization that inspires.</span>
        <span className="footer-image-credit">
          Heavy-duty stapler photo by{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Heavy-duty-stapler.jpg" target="_blank" rel="noreferrer">
            Phr~commonswiki
          </a>
          , licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">
            CC BY-SA 3.0
          </a>
          .
        </span>
      </div>
    </footer>
  );
}

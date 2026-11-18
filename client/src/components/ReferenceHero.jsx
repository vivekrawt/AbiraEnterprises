export function ReferenceHero({ onExploreProducts, onContact }) {
  return (
    <section className="reference-hero" id="hero">
      <div className="reference-hero-copy">
        <p className="eyebrow">YOUR TRUSTED B2B PARTNER</p>
        <h1>
          Your Trusted Partner for Packaging, Printing &amp; Business Essentials.
        </h1>
        <p className="hero-lead">
          From corporate events to everyday business needs, we deliver premium packaging, printing, and gifting solutions that elevate your brand. Quality you can trust. Customization that inspires. Service you can rely on.
        </p>
        <div className="hero-actions">
          <a
            className="reference-button"
            href="/?page=products"
            onClick={event => {
              event.preventDefault();
              onExploreProducts();
            }}
          >
            Explore Products <span>→</span>
          </a>
          <a
            className="reference-button secondary"
            href="/?page=home#enquiry"
            onClick={event => {
              event.preventDefault();
              onContact();
            }}
          >
            Request a Quote <span>↗</span>
          </a>
          <a
            className="reference-button secondary"
            href="/abira-enterprises-product-brochure.pdf"
            download="Abira-Enterprises-Product-Brochure.pdf"
            aria-label="Download product categories and subcategories as a PDF"
          >
            Download Categories &amp; Subcategories (PDF) <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <div className="reference-hero-visual-showcase" aria-label="Visual showcase of packaging, printing, corporate gifting, and business essentials">
        <div className="hero-montage">
          <div className="hero-card hero-card-main">
            <img src="/assets/product-67.jpg" alt="Premium custom-printed kraft mailer box" />
            <span className="hero-pill">Packaging Solutions</span>
          </div>
          <div className="hero-card hero-card-secondary">
            <img src="/assets/product-16.jpg" alt="Coordinated corporate gifting and stationery" />
            <span className="hero-pill">Corporate Gifting</span>
          </div>
          <div className="hero-card hero-card-tertiary">
            <img src="/assets/product-85.jpg" alt="Custom printed business collateral and cards" />
            <span className="hero-pill">Printing &amp; Collateral</span>
          </div>
          <div className="hero-card hero-card-accent">
            <img src="/assets/product-101.jpg" alt="Luxury textured gift box with satin ribbon" />
            <span className="hero-pill">Premium Presentation</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const benefits = [
  ['♢', 'Premium Quality', 'Products'],
  ['✎', 'Customizable', 'Solutions'],
  ['⇥', 'Timely', 'Delivery'],
  ['♙', 'Dedicated', 'Support'],
  ['♧', 'Sustainable', 'Options']
];

export function Benefits() {
  return (
    <section className="reference-benefits" id="why-choose-us" aria-label="Why choose Abira Enterprises">
      {benefits.map(([icon, a, b]) => (
        <div key={a}>
          <span className="benefit-icon" aria-hidden="true">{icon}</span>
          <span>{a}<br />{b}</span>
        </div>
      ))}
    </section>
  );
}

const orderingSteps = [
  ['01', 'Explore products', 'Browse the catalogue and choose the products you need.'],
  ['02', 'Set quantities', 'Add each product to your cart, starting from 10 units.'],
  ['03', 'Review your cart', 'Check the products and update quantities to suit your needs.'],
  ['04', 'Send your request', 'Share your contact details and email your order list to us.']
];

export function OrderingSteps() {
  return (
    <section className="ordering-steps" aria-label="How to place an order">
      <div className="ordering-steps-heading">
        <p className="eyebrow">A SIMPLE ORDERING PROCESS</p>
        <h2>From catalogue to <em>order request.</em></h2>
        <p>Four simple steps to share the products and quantities you need.</p>
      </div>
      <ol className="ordering-steps-list">
        {orderingSteps.map(([number, title, description], index) => (
          <li key={number} style={{ '--step-index': index }}>
            <span className="ordering-step-number">{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

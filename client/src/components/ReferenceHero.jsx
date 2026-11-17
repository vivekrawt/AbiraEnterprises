export function ReferenceHero() {
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
          <a className="reference-button" href="#collections">
            Explore Products <span>→</span>
          </a>
          <a className="reference-button secondary" href="#enquiry">
            Request a Quote <span>↗</span>
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

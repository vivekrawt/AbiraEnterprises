import { useState } from 'react';
export default function Header() {
  const [open,setOpen] = useState(false);
  return <><a className="skip" href="#main">Skip to content</a><div className="announcement">From the first impression to the final detail. <span>Thoughtfully packaged.</span> <span aria-hidden="true">↗</span></div><header className="header">
    <a className="brand" href="#" aria-label="Abira Enterprises home"><svg viewBox="0 0 36 40" fill="none" aria-hidden="true"><path d="M18 2 34 11v18L18 38 2 29V11L18 2Z M2 11l16 10 16-10M18 21v17M10 6l16 10v10" stroke="currentColor" strokeWidth="1.7" /></svg><span>abira<span className="brand-sub">ENTERPRISES</span></span></a>
    <nav id="nav" className={open ? 'open' : ''} aria-label="Main navigation" onClick={() => setOpen(false)}><a href="#collections">Our collections <span>⌄</span></a><a href="#approach">Why Abira</a><a href="#process">How it works</a><a href="#faq">FAQs</a></nav>
    <a className="button small header-cta" href="#enquiry">Let’s talk packaging <span>↗</span></a><button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="nav" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? '×' : '☰'}</button>
  </header></>;
}

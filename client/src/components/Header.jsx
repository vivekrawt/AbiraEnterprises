import { useState } from 'react';
export default function Header({ search, onSearch }) {
  const [open,setOpen] = useState(false), [showSearch,setShowSearch] = useState(false);
  const toggleSearch = () => { setShowSearch(!showSearch); if(showSearch) onSearch(''); };
  return <><a className="skip" href="#main">Skip to content</a><header className="reference-header">
    <a className="reference-brand" href="#" aria-label="Abira Enterprises home"><span><b>Abira</b> Enterprises</span><small>PACKAGING&nbsp;&nbsp; | &nbsp;&nbsp;PRINTING&nbsp;&nbsp; | &nbsp;&nbsp;CORPORATE GIFTING</small></a>
    <nav className={open?'open':''} aria-label="Main navigation" onClick={()=>setOpen(false)}><a className="current" href="#">Home</a><a href="#approach">About Us</a><a href="#collections">Products <span aria-hidden="true">⌄</span></a><a href="#why-choose-us">Why Choose Us</a><a href="#enquiry">Contact Us</a></nav>
    <div className="header-tools"><button aria-label={showSearch?'Close product search':'Search products'} aria-expanded={showSearch} onClick={toggleSearch}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.7" cy="10.7" r="7.3"/><path d="m16 16 5.5 5.5"/></svg></button><a href="#enquiry" aria-label="Create a packaging brief"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 4h2l2 12h13l2-9H5M8 20h.01M18 20h.01" strokeLinecap="round" strokeLinejoin="round"/></svg></a><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label={open?'Close menu':'Open menu'} aria-expanded={open}>☰</button></div>
    {showSearch && <div className="header-search"><label>Search products<input autoFocus value={search} onChange={e=>onSearch(e.target.value)} placeholder="Try gifting boxes, confetti, mailers…" /></label><a href="#collections" onClick={()=>setShowSearch(false)}>See results ↗</a></div>}
  </header></>;
}

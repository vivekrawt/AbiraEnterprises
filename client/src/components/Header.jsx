import { useState } from 'react';
import { productNames } from './Collections.jsx';

function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const previous = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = previous;
    }
  }
  return row[b.length];
}

function suggestionsFor(value) {
  const query = value.trim().toLowerCase();
  if (!query) return [];
  if (query.length === 1) return productNames.filter(name => name.toLowerCase().startsWith(query)).sort((a, b) => a.localeCompare(b)).map(name => ({ name, score: 0 }));
  return productNames.map(name => {
    const words = name.toLowerCase().split(/\s+/);
    const score = words.some(word => word.startsWith(query)) ? 0
      : name.toLowerCase().includes(query) ? 1
      : Math.min(...words.map(word => distance(query, word))) <= Math.max(1, Math.floor(query.length / 3)) ? 2 : 3;
    return { name, score };
  }).filter(item => item.score < 3).sort((a, b) => a.score - b.score || a.name.localeCompare(b.name)).slice(0, 6);
}
export default function Header({ search, onSearch }) {
  const [open,setOpen] = useState(false), [showSearch,setShowSearch] = useState(false), [activeSuggestion,setActiveSuggestion] = useState(-1);
  const suggestions = suggestionsFor(search);
  const toggleSearch = () => { setShowSearch(!showSearch); setActiveSuggestion(-1); if(showSearch) onSearch(''); };
  const chooseSuggestion = name => { onSearch(name); setShowSearch(false); setActiveSuggestion(-1); document.querySelector('#collections')?.scrollIntoView({ behavior: 'smooth' }); };
  const handleSearchKey = event => {
    if (event.key === 'Escape') { setShowSearch(false); setActiveSuggestion(-1); onSearch(''); }
    if (event.key === 'ArrowDown' && suggestions.length) { event.preventDefault(); setActiveSuggestion(index => (index + 1) % suggestions.length); }
    if (event.key === 'ArrowUp' && suggestions.length) { event.preventDefault(); setActiveSuggestion(index => (index + suggestions.length - 1) % suggestions.length); }
    if (event.key === 'Enter' && suggestions.length) { event.preventDefault(); chooseSuggestion(suggestions[activeSuggestion < 0 ? 0 : activeSuggestion].name); }
  };
  return <><a className="skip" href="#main">Skip to content</a><header className="reference-header">
    <a className="reference-brand" href="#" aria-label="Abira Enterprises home"><span><b>Abira</b> Enterprises</span><small>PACKAGING&nbsp;&nbsp; | &nbsp;&nbsp;PRINTING&nbsp;&nbsp; | &nbsp;&nbsp;CORPORATE GIFTING</small></a>
    <nav className={open?'open':''} aria-label="Main navigation" onClick={()=>setOpen(false)}><a className="current" href="#">Home</a><a href="#approach">About Us</a><a href="#collections">Products <span aria-hidden="true">⌄</span></a><a href="#why-choose-us">Why Choose Us</a><a href="#enquiry">Contact Us</a></nav>
    <div className="header-tools"><button aria-label={showSearch?'Close product search':'Search products'} aria-expanded={showSearch} onClick={toggleSearch}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.7" cy="10.7" r="7.3"/><path d="m16 16 5.5 5.5"/></svg></button><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label={open?'Close menu':'Open menu'} aria-expanded={open}>☰</button></div>
    {showSearch && <div className="header-search"><label>Search products<input autoFocus role="combobox" aria-autocomplete="list" aria-expanded={suggestions.length > 0} aria-controls="product-suggestions" aria-activedescendant={activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined} value={search} onChange={e=>{onSearch(e.target.value);setActiveSuggestion(-1);}} onKeyDown={handleSearchKey} placeholder="Try gifting boxes, confetti, mailers…" /></label><a href="#collections" onClick={()=>setShowSearch(false)}>See results ↗</a>{suggestions.length > 0 && <div className="search-suggestions" id="product-suggestions" role="listbox" aria-label="Product suggestions">{suggestions.map((item,index)=><button key={item.name} id={`suggestion-${index}`} role="option" aria-selected={activeSuggestion===index} onClick={()=>chooseSuggestion(item.name)}><span>{item.name}</span><span aria-hidden="true">↗</span></button>)}</div>}</div>}
  </header></>;
}

import { useState } from 'react';
import { allProductItems, categories } from '../../../shared/collections.js';

const searchableNames = [...new Set([
  ...allProductItems.map(item => item.name),
  ...categories.flatMap(category => [
    category.title,
    ...category.subcategories.map(subcategory => subcategory.name)
  ])
])];

function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const previous = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      diagonal = previous;
    }
  }
  return row[b.length];
}

function suggestionsFor(value) {
  const query = value.trim().toLowerCase();
  if (!query) return [];
  if (query.length === 1) {
    return searchableNames
      .filter(name => name.toLowerCase().startsWith(query))
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 8)
      .map(name => ({ name, score: 0 }));
  }
  return searchableNames
    .map(name => {
      const words = name.toLowerCase().split(/\s+/);
      const score = words.some(word => word.startsWith(query))
        ? 0
        : name.toLowerCase().includes(query)
        ? 1
        : Math.min(...words.map(word => distance(query, word))) <=
          Math.max(1, Math.floor(query.length / 3))
        ? 2
        : 3;
      return { name, score };
    })
    .filter(item => item.score < 3)
    .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name))
    .slice(0, 8);
}

export default function Header({
  page,
  search,
  onSearch,
  onSearchSubmit,
  onNavigate,
  cartCount,
  onOpenCart
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [searchActive, setSearchActive] = useState(false);

  const suggestions = menuOpen || !searchActive ? [] : suggestionsFor(search);

  const handleNavigate = (event, nextPage, section = '') => {
    event.preventDefault();
    setMenuOpen(false);
    setSearchActive(false);
    setActiveSuggestion(-1);
    onNavigate(nextPage, section);
  };

  const chooseSuggestion = name => {
    onSearch(name);
    setMenuOpen(false);
    setSearchActive(false);
    setActiveSuggestion(-1);
    onSearchSubmit(name);
  };

  const handleSearchKey = event => {
    if (event.key === 'Escape') {
      setActiveSuggestion(-1);
      setSearchActive(false);
      event.currentTarget.blur();
    }
    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setActiveSuggestion(index => (index + 1) % suggestions.length);
    }
    if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setActiveSuggestion(index => (index + suggestions.length - 1) % suggestions.length);
    }
    if (event.key === 'Enter' && activeSuggestion >= 0 && suggestions.length) {
      event.preventDefault();
      chooseSuggestion(suggestions[activeSuggestion].name);
    }
  };

  return (
    <>
      <a className="skip" href="#main">
        Skip to main content
      </a>
      <header className="reference-header">
        <a
          className="reference-brand"
          href="/?page=home#hero"
          onClick={event => handleNavigate(event, 'home', 'hero')}
          aria-label="Abira Enterprises Home"
        >
          <span>
            <b>Abira</b> Enterprises
          </span>
          <small>PACKAGING &nbsp;|&nbsp; PRINTING &nbsp;|&nbsp; CORPORATE GIFTING &nbsp;|&nbsp; BUSINESS ESSENTIALS</small>
        </a>

        <nav
          className={menuOpen ? 'open' : ''}
          aria-label="Main navigation"
        >
          <a
            className={page === 'home' ? 'current' : ''}
            href="/?page=home#hero"
            onClick={event => handleNavigate(event, 'home', 'hero')}
          >
            Home
          </a>
          <a
            href="/?page=home#approach"
            onClick={event => handleNavigate(event, 'home', 'approach')}
          >
            About Us
          </a>
          <a
            className={page === 'products' ? 'current' : ''}
            href="/?page=products"
            onClick={event => handleNavigate(event, 'products')}
          >
            Products &amp; Catalogue
          </a>
          <a
            href="/?page=home#why-choose-us"
            onClick={event => handleNavigate(event, 'home', 'why-choose-us')}
          >
            Why Choose Us
          </a>
          <a
            href="/?page=home#enquiry"
            onClick={event => handleNavigate(event, 'home', 'enquiry')}
          >
            Contact Us
          </a>
        </nav>

        <form
          className="header-search"
          role="search"
          onSubmit={event => {
            event.preventDefault();
            onSearchSubmit(search);
            setMenuOpen(false);
            setSearchActive(false);
            setActiveSuggestion(-1);
          }}
        >
          <label className="visually-hidden" htmlFor="site-product-search">
            Search products and categories
          </label>
          <input
            id="site-product-search"
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={suggestions.length > 0}
            aria-controls="product-suggestions"
            aria-activedescendant={
              activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined
            }
            value={search}
            onFocus={() => setSearchActive(true)}
            onBlur={() => {
              window.setTimeout(() => setSearchActive(false), 150);
            }}
            onChange={event => {
              setSearchActive(true);
              onSearch(event.target.value);
              setActiveSuggestion(-1);
            }}
            onKeyDown={handleSearchKey}
            placeholder="Search products and categories"
          />
          <button type="submit" aria-label="View product search results">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="10.7" cy="10.7" r="7.3" />
              <path d="m16 16 5.5 5.5" />
            </svg>
          </button>
          {suggestions.length > 0 && (
            <div
              className="search-suggestions"
              id="product-suggestions"
              role="listbox"
              aria-label="Product suggestions"
            >
              {suggestions.map((item, index) => (
                <button
                  type="button"
                  key={item.name}
                  id={`suggestion-${index}`}
                  role="option"
                  aria-selected={activeSuggestion === index}
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => chooseSuggestion(item.name)}
                >
                  <span>{item.name}</span>
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          )}
        </form>

        <div className="header-tools">
          <button
            type="button"
            className="header-cart"
            onClick={onOpenCart}
            aria-label={`Open shopping cart with ${cartCount} item${cartCount === 1 ? '' : 's'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span>Cart</span>
            <b>{cartCount}</b>
          </button>
          <button
            className="menu-toggle"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setSearchActive(false);
              setActiveSuggestion(-1);
            }}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>
      </header>
    </>
  );
}

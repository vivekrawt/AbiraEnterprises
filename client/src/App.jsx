import { useEffect, useState } from 'react';
import { categories, allProductItems } from '../../shared/collections.js';
import Header from './components/Header.jsx';
import ProductCatalog from './components/ProductCatalog.jsx';
import CollectionDialog from './components/CollectionDialog.jsx';
import CartDialog from './components/CartDialog.jsx';
import EnquiryForm from './components/EnquiryForm.jsx';
import { Approach, Inspiration, FAQ, Footer } from './components/Presentation.jsx';
import { ReferenceHero, Benefits, OrderingSteps } from './components/ReferenceHero.jsx';

const cartStorageKey = 'abira-cart-v1';

function getCurrentPage() {
  return new URLSearchParams(window.location.search).get('page') === 'products'
    ? 'products'
    : 'home';
}

function getCurrentSearch() {
  return new URLSearchParams(window.location.search).get('q') || '';
}

function restoreCart() {
  try {
    const saved = window.sessionStorage.getItem(cartStorageKey);
    if (!saved) return { items: [], notice: '' };

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new TypeError('Saved cart data is not a list.');

    const items = parsed.filter(item =>
      item &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.categoryTitle === 'string' &&
      typeof item.subcategoryName === 'string' &&
      Number.isSafeInteger(item.quantity) &&
      item.quantity > 0
    );
    const notice = items.length === parsed.length
      ? ''
      : 'Some saved cart items could not be restored.';
    return {
      items: items.map(item => ({ ...item, quantity: Math.max(10, item.quantity) })),
      notice
    };
  } catch (error) {
    console.error('Could not restore the cart from this browser session:', error);
    return { items: [], notice: 'The saved cart could not be restored in this browser session.' };
  }
}

export default function App() {
  const [page, setPage] = useState(getCurrentPage);
  const [active, setActive] = useState(null);
  const [details, setDetails] = useState('');
  const [search, setSearch] = useState(getCurrentSearch);
  const [cartState, setCartState] = useState(restoreCart);
  const [cartOpen, setCartOpen] = useState(false);
  const cart = cartState.items;

  useEffect(() => {
    function handlePopState() {
      const currentPage = getCurrentPage();
      setPage(currentPage);
      setSearch(getCurrentSearch());
      requestAnimationFrame(() => {
        const target = window.location.hash
          ? document.getElementById(window.location.hash.slice(1))
          : null;
        if (target) {
          target.scrollIntoView();
        } else {
          window.scrollTo(0, 0);
        }
      });
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch (error) {
      console.error('Could not save the cart in this browser session:', error);
      setCartState(current => ({
        ...current,
        notice: 'Your cart could not be saved in this browser session.'
      }));
    }
  }, [cart]);

  function addToCart(product, quantity) {
    const id = `${product.categoryId}:${product.name}`;
    setCartState(current => {
      const existing = current.items.find(item => item.id === id);
      const items = existing
        ? current.items.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...current.items, {
            id,
            name: product.name,
            categoryTitle: product.categoryTitle,
            subcategoryName: product.subcategoryName,
            quantity
          }];
      return { items, notice: '' };
    });
  }

  function changeCartQuantity(id, quantity) {
    if (!Number.isSafeInteger(quantity) || quantity < 10) return;
    setCartState(current => ({
      ...current,
      notice: '',
      items: current.items.map(item => item.id === id ? { ...item, quantity } : item)
    }));
  }

  function removeFromCart(id) {
    setCartState(current => ({
      ...current,
      notice: '',
      items: current.items.filter(item => item.id !== id)
    }));
  }

  function clearCart() {
    setCartState({ items: [], notice: '' });
  }

  function navigateTo(nextPage, section = '', searchTerm = search) {
    const query = searchTerm.trim();
    const route = nextPage === 'products' ? 'page=products' : 'page=home';
    const queryString = query ? `&q=${encodeURIComponent(query)}` : '';
    const fragment = section ? `#${section}` : '';
    const destination = nextPage === 'products' || section || query
      ? `/?${route}${queryString}${fragment}`
      : '/';
    window.history.pushState({}, '', destination);
    setPage(nextPage);
    setActive(null);

    requestAnimationFrame(() => {
      if (nextPage === 'home' && section) {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  function submitSearch(value = search) {
    setSearch(value);
    navigateTo('products', '', value);
  }

  function enquire(itemTitle, reference = '') {
    const prodMatch = allProductItems.find(
      p => p.name.toLowerCase() === (itemTitle || '').toLowerCase()
    );
    if (prodMatch) {
      setDetails(
        `I am interested in: ${prodMatch.name}${reference ? ` (${reference})` : ''} under ${prodMatch.subcategoryName}.\nPlease provide available specifications, customization options, MOQ, and quotation.`
      );
    } else {
      if (itemTitle) {
        setDetails(
          `I am interested in: ${itemTitle}${reference ? ` (${reference})` : ''}.\nPlease provide product information, customization options, and timeline details.`
        );
      }
    }

    setActive(null);
    navigateTo('home', 'enquiry');
    requestAnimationFrame(() => {
      document.querySelector('input[name="name"]')?.focus({ preventScroll: true });
    });
  }

  const open = item => {
    if (typeof item === 'string') {
      setActive({ id: item });
    } else {
      setActive(item);
    }
  };

  const activeCategoryObj = active
    ? categories.find(c => c.id === active.id) || categories[0]
    : null;

  return (
    <>
      <Header
        page={page}
        search={search}
        onSearch={setSearch}
        onSearchSubmit={submitSearch}
        onNavigate={navigateTo}
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
      />
      <main id="main">
        {page === 'home' ? (
          <>
            <ReferenceHero
              onExploreProducts={() => navigateTo('products')}
              onContact={() => navigateTo('home', 'enquiry')}
            />
            <Benefits />
            <Approach />
            <Inspiration
              onOpen={open}
              onBrowseCatalogue={() => navigateTo('products')}
            />
            <FAQ />
            <EnquiryForm
              details={details}
              onDetailsChange={setDetails}
            />
          </>
        ) : (
          <>
            <OrderingSteps />
            <ProductCatalog
              search={search}
              onAddToCart={addToCart}
            />
          </>
        )}
      </main>
      <Footer onNavigate={navigateTo} />

      {active && activeCategoryObj && (
        <CollectionDialog
          key={`${activeCategoryObj.id}-${active.type || 'all'}-${active.product || 'none'}`}
          collection={activeCategoryObj}
          initialType={active.type || 'All'}
          targetProduct={active.product}
          onClose={() => setActive(null)}
          onEnquire={enquire}
        />
      )}

      {cartOpen && (
        <CartDialog
          items={cart}
          storageNotice={cartState.notice}
          onClose={() => setCartOpen(false)}
          onQuantityChange={changeCartQuantity}
          onRemove={removeFromCart}
          onClear={clearCart}
        />
      )}
    </>
  );
}

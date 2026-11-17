import { useState } from 'react';
import { categories, allProductItems } from '../../shared/collections.js';
import Header from './components/Header.jsx';
import Collections from './components/Collections.jsx';
import CollectionDialog from './components/CollectionDialog.jsx';
import EnquiryForm from './components/EnquiryForm.jsx';
import { Approach, Process, Inspiration, FAQ, Footer } from './components/Presentation.jsx';
import { ReferenceHero, Benefits } from './components/ReferenceHero.jsx';

export default function App() {
  const [active, setActive] = useState(null);
  const [collection, setCollection] = useState('');
  const [details, setDetails] = useState('');
  const [search, setSearch] = useState('');

  function enquire(itemTitle, reference = '') {
    const prodMatch = allProductItems.find(
      p => p.name.toLowerCase() === (itemTitle || '').toLowerCase()
    );
    const catMatch = categories.find(
      c => c.title.toLowerCase() === (itemTitle || '').toLowerCase() ||
           c.shortTitle.toLowerCase() === (itemTitle || '').toLowerCase()
    );

    if (prodMatch) {
      setCollection(prodMatch.categoryTitle);
      setDetails(
        `I am interested in: ${prodMatch.name}${reference ? ` (${reference})` : ''} under ${prodMatch.subcategoryName}.\nPlease provide available specifications, customization options, MOQ, and quotation.`
      );
    } else if (catMatch) {
      setCollection(catMatch.title);
      setDetails(
        `I am interested in products from your ${catMatch.title} range${reference ? ` (${reference})` : ''}.\nPlease share relevant catalogues, custom printing options, and pricing.`
      );
    } else {
      setCollection(itemTitle || '');
      if (itemTitle) {
        setDetails(
          `I am interested in: ${itemTitle}${reference ? ` (${reference})` : ''}.\nPlease provide quotation and timeline details.`
        );
      }
    }

    setActive(null);

    requestAnimationFrame(() => {
      document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth' });
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
      <Header search={search} onSearch={setSearch} />
      <main id="main">
        <ReferenceHero />
        <Benefits />
        <Collections
          onOpen={open}
          onEnquire={enquire}
          search={search}
        />
        <Approach />
        <Process />
        <Inspiration onOpen={open} />
        <FAQ />
        <EnquiryForm
          collection={collection}
          details={details}
          onCollectionChange={setCollection}
          onDetailsChange={setDetails}
        />
      </main>
      <Footer />

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
    </>
  );
}

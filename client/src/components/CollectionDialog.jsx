import { useEffect, useRef, useState } from 'react';
import catalogue from '../data/catalogue.json';
import PlaceholderThumb from './PlaceholderThumb.jsx';

export default function CollectionDialog({
  collection,
  initialType = 'All',
  targetProduct = null,
  onClose,
  onEnquire
}) {
  const dialog = useRef(null);
  const [activeSubcategory, setActiveSubcategory] = useState(initialType);

  // Map collection.id to the folder names used in catalogue.json
  const folderNames = (collection.id === 'packaging' || collection.id === 'packaging-solutions')
    ? ['Corrugated Boxes']
    : (collection.id === 'corporate-gifting' || collection.id === 'corporate-stationery')
    ? ['Corporate Stationery', 'Custom Cards Envelopes', 'Gifting Boxes']
    : collection.id === 'safety-wraps'
    ? ['Safety Wraps']
    : collection.id === 'confetti'
    ? ['Confetti']
    : [];

  const rawImages = catalogue.filter(p => folderNames.includes(p.category));

  // Determine subcategory filters
  const subcategoryFilters = ['All', ...(collection.subcategories?.map(s => s.name) || [])];

  // Filter images based on selected subcategory if applicable
  const filteredImages = rawImages.filter(item => {
    if (activeSubcategory === 'All') return true;
    const subObj = collection.subcategories?.find(s => s.name === activeSubcategory);
    if (!subObj || !subObj.filterKeyword) return true;
    return item.source.toLowerCase().includes(subObj.filterKeyword.toLowerCase()) ||
           item.category.toLowerCase().includes(subObj.filterKeyword.toLowerCase());
  });

  // Fallback placeholder samples for categories without photo assets (Tapes, Labels)
  const isPlaceholderCategory = collection.placeholderType || rawImages.length === 0;
  const placeholderSamples = isPlaceholderCategory
    ? Array.from({ length: 6 }, (_, i) => ({
        id: `ph-${collection.id}-${i}`,
        title: `Design ${i + 1}`,
        type: collection.placeholderType || 'tape'
      }))
    : [];

  useEffect(() => {
    const previous = document.activeElement;
    if (dialog.current && !dialog.current.open) {
      dialog.current.showModal();
      document.body.classList.add('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
      previous?.focus({ preventScroll: true });
    };
  }, []);

  const handleBackdropClick = e => {
    if (e.target === dialog.current) {
      const r = dialog.current.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        onClose();
      }
    }
  };

  const enquiryTargetTitle = targetProduct
    ? `${targetProduct} (${collection.title})`
    : collection.title;

  return (
    <dialog
      ref={dialog}
      id="collection-dialog"
      aria-labelledby="dialog-title"
      onCancel={onClose}
      onClick={handleBackdropClick}
    >
      <div className="dialog-header">
        <div>
          <p className="eyebrow">DESIGN &amp; SAMPLE CATALOGUE</p>
          <h2 id="dialog-title">{collection.title}</h2>
          {targetProduct && (
            <p className="dialog-target-badge">Selected Product: <strong>{targetProduct}</strong></p>
          )}
        </div>
        <button className="close-dialog" aria-label="Close collection" onClick={onClose}>
          ×
        </button>
      </div>

      <p id="dialog-description">{collection.description}</p>

      {subcategoryFilters.length > 2 && (
        <div className="gallery-filters" role="group" aria-label="Filter subcategories">
          {subcategoryFilters.map(filterName => (
            <button
              key={filterName}
              className={activeSubcategory === filterName ? 'active' : ''}
              aria-pressed={activeSubcategory === filterName}
              onClick={() => setActiveSubcategory(filterName)}
            >
              {filterName}
            </button>
          ))}
        </div>
      )}

      <div className="gallery" id="gallery">
        {isPlaceholderCategory ? (
          placeholderSamples.map((sample, idx) => (
            <figure key={sample.id} className="sample-figure">
              <div className="sample-preview">
                <PlaceholderThumb type={sample.type} label={`Design ${idx + 1}`} />
              </div>
              <figcaption>
                <span className="sample-label">Design {idx + 1}</span>
                <button
                  type="button"
                  className="sample-enquire-btn"
                  onClick={() => onEnquire(enquiryTargetTitle, `Design ${idx + 1} Specification`)}
                >
                  Enquire ↗
                </button>
              </figcaption>
            </figure>
          ))
        ) : filteredImages.length > 0 ? (
          filteredImages.map((p, idx) => (
            <figure key={p.id} className="sample-figure">
              <div className="sample-preview">
                <img
                  src={`/${p.src}`}
                  alt={`${collection.title} Design ${idx + 1}`}
                  loading="lazy"
                />
              </div>
              <figcaption>
                <span className="sample-label">Design {idx + 1}</span>
                <button
                  type="button"
                  className="sample-enquire-btn"
                  onClick={() => onEnquire(enquiryTargetTitle, `Design ${idx + 1} Reference`)}
                >
                  Enquire ↗
                </button>
              </figcaption>
            </figure>
          ))
        ) : (
          <div className="empty-gallery">
            <p>No sample designs found for this specific filter. You can request custom mockups directly.</p>
          </div>
        )}
      </div>

      <div className="dialog-footer">
        <p>
          These images and designs represent sample concepts and finishing references. Exact dimensions, ply, artwork, and specifications are finalized upon enquiry.
        </p>
        <button
          className="button coral"
          onClick={() => onEnquire(enquiryTargetTitle)}
        >
          Enquire About This Collection ↗
        </button>
      </div>
    </dialog>
  );
}

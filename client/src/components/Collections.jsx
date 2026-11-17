import { useState } from 'react';
import { categories, allProductItems, getProductImagePath } from '../../../shared/collections.js';
import PlaceholderThumb from './PlaceholderThumb.jsx';

export const productNames = allProductItems.map(item => item.name);

function CategoryProductPreview({ category }) {
  const allProducts = category.subcategories.flatMap(subcategory =>
    subcategory.products.map(product => ({ subcategory, product }))
  );
  const firstProductPerSubcategory = category.subcategories
    .filter(subcategory => subcategory.products.length > 0)
    .map(subcategory => ({
      subcategory,
      product: subcategory.products[0]
    }));
  const previewProducts = (
    firstProductPerSubcategory.length >= 4 ? firstProductPerSubcategory : allProducts
  ).slice(0, 4);

  return (
    <div className="category-product-preview" role="group" aria-label={`${category.title} product previews`}>
      {previewProducts.map(({ subcategory, product }) => {
        const imageId = product.image ?? subcategory.defaultImage ?? category.image;
        const imagePath =
          getProductImagePath(category.id, product.name) ??
          (imageId == null ? null : `/assets/product-${imageId}.jpg`);

        return (
          <div className="category-product-preview-item" key={product.name}>
            {imagePath ? (
              <img src={imagePath} alt={`${product.name} preview`} loading="lazy" />
            ) : (
              <PlaceholderThumb
                type={category.placeholderType || subcategory.placeholderType || 'tape'}
                subType={product.tapeType || product.labelType}
                label={product.name}
              />
            )}
            <span className="category-product-preview-label">{product.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Collections({ onOpen, onEnquire, search = '' }) {
  // viewMode: 'overview' (6 category brochure cards) or 'category' (in-depth category view)
  const [selectedCategoryId, setSelectedCategoryId] = useState('packaging-solutions');
  const [viewMode, setViewMode] = useState('overview');
  const [activeSubcategoryFilter, setActiveSubcategoryFilter] = useState('All');

  const selectedCategory =
    categories.find(c => c.id === selectedCategoryId) || categories[0];

  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;

  // Search Results
  const searchResults = isSearching
    ? allProductItems.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.categoryTitle.toLowerCase().includes(query) ||
          item.subcategoryName.toLowerCase().includes(query)
      )
    : [];

  const handleOpenCategory = (catId, subcategoryName = 'All') => {
    setSelectedCategoryId(catId);
    setActiveSubcategoryFilter(subcategoryName);
    setViewMode('category');
    document.querySelector('#collections')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackToOverview = () => {
    setViewMode('overview');
    setActiveSubcategoryFilter('All');
    document.querySelector('#collections')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="brochure-section" id="collections" aria-label="Products & Solutions Digital Brochure">
      {/* Search Results Display */}
      {isSearching ? (
        <div className="search-results-container" aria-live="polite">
          <div className="search-results-top">
            <div>
              <p className="eyebrow">SEARCH CATALOGUE</p>
              <h3>
                Results for <em>“{search}”</em>
              </h3>
            </div>
            <span className="results-count">
              {searchResults.length} product{searchResults.length === 1 ? '' : 's'} found
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="no-products-box">
              <p>No products matching “{search}”.</p>
              <p className="hint">
                Try searching for “mailer”, “corrugated”, “tape”, “label”, or “stationery”.
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {searchResults.map(prod => (
                <article key={prod.name} className="product-card">
                  <div className="product-card-visual">
                    {prod.imagePath ? (
                      <img
                        src={prod.imagePath}
                        alt={`${prod.name} sample`}
                        loading="lazy"
                      />
                    ) : prod.placeholderType ? (
                      <PlaceholderThumb
                        type={prod.placeholderType}
                        subType={prod.tapeType || prod.labelType}
                        label={prod.name}
                      />
                    ) : (
                      <img
                        src={`/assets/product-${prod.image}.jpg`}
                        alt={`${prod.name} sample`}
                        loading="lazy"
                      />
                    )}
                    <span className="product-category-tag">{prod.categoryShortTitle}</span>
                  </div>
                  <div className="product-card-body">
                    <h4>{prod.name}</h4>
                    <p className="product-sub-info">{prod.subcategoryName}</p>
                    <p className="product-desc">{prod.desc}</p>
                    <div className="product-card-actions">
                      <button
                        type="button"
                        className="btn-card-design"
                        onClick={() => onOpen({ id: prod.categoryId, product: prod.name })}
                        aria-label={`View sample designs for ${prod.name}`}
                      >
                        Designs
                      </button>
                      <button
                        type="button"
                        className="btn-card-enquire"
                        onClick={() => onEnquire(prod.name)}
                        aria-label={`Enquire about ${prod.name}`}
                      >
                        Enquire ↗
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : viewMode === 'overview' ? (
        /* LEVEL 1: Main Digital Brochure Landing Section */
        <div className="brochure-overview">
          <div className="brochure-header">
            <p className="eyebrow">PRODUCTS &amp; SOLUTIONS</p>
            <h2>Explore Our Products &amp; Solutions</h2>
            <p className="brochure-lead">
              Discover a comprehensive range of packaging, printing, stationery, and business essentials designed to help businesses create a lasting impression. From customized packaging to corporate branding materials, explore solutions tailored to your business needs.
            </p>
            <div className="brochure-top-actions">
              <a
                href="/abira-enterprises-product-brochure.pdf"
                download="Abira-Enterprises-Product-Brochure.pdf"
                className="btn-download-pdf"
                aria-label="Download Abira Enterprises Digital Product Brochure in PDF format"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download Product Brochure (PDF)</span>
              </a>
              <a href="#enquiry" className="btn-request-quote-link">
                Request a Custom Quote <span>→</span>
              </a>
            </div>
          </div>

          {/* 6 Category Brochure Cards Grid */}
          <div className="category-brochure-grid">
            {categories.map((cat, idx) => {
              const totalItems = cat.subcategories.reduce(
                (sum, sub) => sum + sub.products.length,
                0
              );
              return (
                <div key={cat.id} className="category-brochure-card">
                  <div className="cat-card-media">
                    <CategoryProductPreview category={cat} />
                    <span className="cat-index-badge">0{idx + 1}</span>
                    <span className="cat-count-badge">{totalItems} Products</span>
                  </div>

                  <div className="cat-card-body">
                    <h3>{cat.title}</h3>
                    <p className="cat-card-subtitle">{cat.subtitle}</p>

                    <div className="cat-sub-pills">
                      {cat.subcategories.map(sub => (
                        <span key={sub.name} className="cat-sub-pill">
                          {sub.name}
                        </span>
                      ))}
                    </div>

                    <p className="cat-card-desc">{cat.description}</p>

                    <div className="cat-card-actions">
                      <button
                        type="button"
                        className="btn-explore-category"
                        onClick={() => handleOpenCategory(cat.id)}
                      >
                        Explore Category Brochure <span>→</span>
                      </button>
                      <button
                        type="button"
                        className="btn-quick-enquire"
                        onClick={() => onEnquire(cat.title)}
                        aria-label={`Enquire about ${cat.title}`}
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* LEVEL 2: Dedicated Category Brochure View */
        <div className="category-brochure-view">
          {/* Breadcrumbs Navigation */}
          <nav className="brochure-breadcrumbs" aria-label="Brochure Breadcrumbs">
            <button
              type="button"
              className="breadcrumb-back-btn"
              onClick={handleBackToOverview}
            >
              ← Back to All Categories
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{selectedCategory.title}</span>
          </nav>

          {/* Category Banner */}
          <div className="category-hero-banner">
            <div className="category-hero-copy">
              <span className="category-lead-tag">Corporate Digital Brochure</span>
              <h2>{selectedCategory.title}</h2>
              <p className="category-lead-subtitle">{selectedCategory.subtitle}</p>
              <p className="category-lead-desc">{selectedCategory.description}</p>

              <div className="category-hero-actions">
                <a
                  href="/abira-enterprises-product-brochure.pdf"
                  download="Abira-Enterprises-Product-Brochure.pdf"
                  className="btn-download-pdf small"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download PDF Brochure</span>
                </a>
                <button
                  type="button"
                  className="btn-hero-enquire"
                  onClick={() => onEnquire(selectedCategory.title)}
                >
                  Enquire About {selectedCategory.shortTitle} ↗
                </button>
                <button
                  type="button"
                  className="btn-hero-gallery"
                  onClick={() => onOpen({ id: selectedCategory.id })}
                >
                  View Sample Designs ↗
                </button>
              </div>
            </div>

            <div className="category-hero-visual">
              <CategoryProductPreview category={selectedCategory} />
            </div>
          </div>

          {/* Subcategory Filter Bar */}
          {selectedCategory.subcategories.length > 1 && (
            <div className="subcategory-filter-nav" role="tablist" aria-label="Filter by Subcategory">
              <button
                type="button"
                className={`sub-nav-btn ${activeSubcategoryFilter === 'All' ? 'active' : ''}`}
                onClick={() => setActiveSubcategoryFilter('All')}
              >
                All Subcategories ({selectedCategory.subcategories.reduce((a, b) => a + b.products.length, 0)})
              </button>
              {selectedCategory.subcategories.map(sub => (
                <button
                  key={sub.name}
                  type="button"
                  className={`sub-nav-btn ${activeSubcategoryFilter === sub.name ? 'active' : ''}`}
                  onClick={() => setActiveSubcategoryFilter(sub.name)}
                >
                  {sub.name} ({sub.products.length})
                </button>
              ))}
            </div>
          )}

          {/* Subcategories Product Sections */}
          <div className="brochure-sections-list">
            {selectedCategory.subcategories
              .filter(sub => activeSubcategoryFilter === 'All' || activeSubcategoryFilter === sub.name)
              .map(sub => (
                <section key={sub.name} className="brochure-sub-section">
                  <div className="brochure-sub-header">
                    <div>
                      <h3>{sub.name}</h3>
                      <p>{sub.description}</p>
                    </div>
                    <button
                      type="button"
                      className="btn-sub-view-samples"
                      onClick={() => onOpen({ id: selectedCategory.id, type: sub.name })}
                      aria-label={`View sample designs for ${sub.name}`}
                    >
                      View Samples <span>→</span>
                    </button>
                  </div>

                  <div className="products-grid">
                    {sub.products.map(prod => (
                      <article key={prod.name} className="product-card">
                        <div className="product-card-visual">
                          {getProductImagePath(selectedCategory.id, prod.name) ? (
                            <img
                              src={getProductImagePath(selectedCategory.id, prod.name)}
                              alt={`${prod.name} preview`}
                              loading="lazy"
                            />
                          ) : sub.placeholderType || selectedCategory.placeholderType ? (
                            <PlaceholderThumb
                              type={sub.placeholderType || selectedCategory.placeholderType}
                              subType={prod.tapeType || prod.labelType}
                              label={prod.name}
                            />
                          ) : (
                            <img
                              src={`/assets/product-${prod.image ?? sub.defaultImage ?? selectedCategory.image}.jpg`}
                              alt={`${prod.name} preview`}
                              loading="lazy"
                            />
                          )}
                          <span className="product-category-tag">{sub.name}</span>
                        </div>

                        <div className="product-card-body">
                          <h4 className="product-name">{prod.name}</h4>
                          <p className="product-desc">{prod.desc}</p>

                          <div className="product-card-actions">
                            <button
                              type="button"
                              className="btn-card-design"
                              onClick={() =>
                                onOpen({
                                  id: selectedCategory.id,
                                  type: sub.name,
                                  product: prod.name
                                })
                              }
                              aria-label={`View sample designs for ${prod.name}`}
                            >
                              Designs
                            </button>
                            <button
                              type="button"
                              className="btn-card-enquire"
                              onClick={() => onEnquire(prod.name)}
                              aria-label={`Enquire about ${prod.name}`}
                            >
                              Enquire ↗
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
          </div>

          {/* Bottom Navigation */}
          <div className="brochure-bottom-bar">
            <button
              type="button"
              className="btn-back-overview-bottom"
              onClick={handleBackToOverview}
            >
              ← Back to All Products &amp; Solutions
            </button>
            <a href="#enquiry" className="btn-bottom-enquire">
              Submit a Project Enquiry ↗
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

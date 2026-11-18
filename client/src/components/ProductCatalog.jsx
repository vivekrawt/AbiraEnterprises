import { categories, allProductItems, getProductImagePath } from '../../../shared/collections.js';
import PlaceholderThumb from './PlaceholderThumb.jsx';
import ProductPurchase from './ProductPurchase.jsx';

function ProductCard({ product, onAddToCart }) {
  const imagePath =
    getProductImagePath(product.categoryId, product.name) ||
    product.imagePath;

  return (
    <article className="product-card">
      <div className="product-card-visual">
        {imagePath ? (
          <img src={imagePath} alt={`${product.name} preview`} loading="lazy" />
        ) : product.placeholderType ? (
          <PlaceholderThumb
            type={product.placeholderType}
            subType={product.tapeType || product.labelType}
            label={product.name}
          />
        ) : (
          <img
            src={`/assets/product-${product.image}.jpg`}
            alt={`${product.name} preview`}
            loading="lazy"
          />
        )}
        <span className="product-category-tag">{product.categoryShortTitle}</span>
      </div>
      <div className="product-card-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-sub-info">{product.subcategoryName}</p>
        <p className="product-desc">{product.desc}</p>
        <ProductPurchase product={product} onAddToCart={onAddToCart} />
      </div>
    </article>
  );
}

export default function ProductCatalog({ search = '', onAddToCart }) {
  const query = search.trim().toLowerCase();
  const searchResults = query
    ? allProductItems.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.categoryTitle.toLowerCase().includes(query) ||
        product.subcategoryName.toLowerCase().includes(query)
      )
    : [];

  return (
    <section
      className="brochure-section catalog-page"
      id="collections"
      aria-label="Product catalogue"
    >
      <div className="catalog-page-heading">
        <p className="eyebrow">PRODUCTS &amp; CATALOGUE</p>
        <h1>Explore our product range</h1>
        <p>
          Browse categories and their products, or use the search bar above to find something specific.
        </p>
      </div>

      {query ? (
        <div className="catalog-search-results" aria-live="polite">
          <div className="catalog-results-heading">
            <h2>Results for “{search}”</h2>
            <span>
              {searchResults.length} product{searchResults.length === 1 ? '' : 's'}
            </span>
          </div>
          {searchResults.length ? (
            <div className="products-grid">
              {searchResults.map(product => (
                <ProductCard
                  key={`${product.categoryId}:${product.name}`}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="no-products-box">
              <p>No products match “{search}”.</p>
              <p className="hint">Try a product, category, or subcategory name.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <nav className="catalog-category-nav" aria-label="Product categories">
            {categories.map(category => {
              const productCount = allProductItems.filter(
                product => product.categoryId === category.id
              ).length;
              return (
                <a key={category.id} href={`#catalog-${category.id}`}>
                  <strong>{category.title}</strong>
                  <span>{productCount} products ↓</span>
                </a>
              );
            })}
          </nav>

          <div className="catalog-category-list">
            {categories.map(category => (
              <section
                key={category.id}
                id={`catalog-${category.id}`}
                className="catalog-category-section"
                aria-labelledby={`catalog-heading-${category.id}`}
              >
                <header className="catalog-category-heading">
                  <div>
                    <p className="eyebrow">{category.shortTitle}</p>
                    <h2 id={`catalog-heading-${category.id}`}>{category.title}</h2>
                    <p>{category.description}</p>
                  </div>
                </header>

                {category.subcategories.map(subcategory => {
                  const products = allProductItems.filter(
                    product =>
                      product.categoryId === category.id &&
                      product.subcategoryName === subcategory.name
                  );
                  if (products.length === 0) return null;

                  return (
                    <section
                      key={subcategory.name}
                      className="catalog-subcategory-section"
                      aria-label={subcategory.name}
                    >
                      <div className="catalog-subcategory-heading">
                        <div>
                          <h3>{subcategory.name}</h3>
                          <p>{subcategory.description}</p>
                        </div>
                        <span>{products.length} products</span>
                      </div>
                      <div className="products-grid">
                        {products.map(product => (
                          <ProductCard
                            key={product.name}
                            product={product}
                            onAddToCart={onAddToCart}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </section>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

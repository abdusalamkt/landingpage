import './Products.css';

export default function Products({ description, products = [] }) {
  return (
    <section className="products-section">
      <h1 className="products-heading">OUR<span className="Highlight_Header"> PRODUCTS</span></h1>
      {description && (
        <div
          className="products-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      <div className="products-grid">
        {products.map((product, i) => (
          <div key={i} className="product-card">
            <div className="product-image-container">
              <img
                src={product.image.sourceUrl}
                alt={product.image.altText}
                className="product-image grayscale"
              />
              <div className="product-overlay">
                <div className="product-title-container">
                  <h3 className="product-title">{product.title}</h3>
                </div>
                <span className="product-arrow">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { useState } from 'react';

export default function ProductPurchase({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(10);
  const [message, setMessage] = useState('');

  function submit(event) {
    event.preventDefault();
    const requestedQuantity = Number(quantity);
    if (!Number.isSafeInteger(requestedQuantity) || requestedQuantity < 10) {
      setMessage('Enter a quantity of at least 10.');
      return;
    }

    onAddToCart(product, requestedQuantity);
    setMessage(`${requestedQuantity} added to cart.`);
  }

  return (
    <div className="product-purchase">
      <form className="product-cart-controls" onSubmit={submit}>
        <label>
          Qty
          <input
            type="number"
            min="10"
            max="1000000"
            step="1"
            value={quantity}
            onChange={event => {
              setQuantity(event.target.value);
              setMessage('');
            }}
            aria-label={`Quantity for ${product.name}`}
          />
        </label>
        <button type="submit" className="btn-add-to-cart">
          Add to Cart
        </button>
      </form>
      <p className="cart-add-status" aria-live="polite">{message}</p>
    </div>
  );
}

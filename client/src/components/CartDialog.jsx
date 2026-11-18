import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const settings = window.ABIRA_SETTINGS || {};
const emailSettings = settings.emailjs || {};

function getErrorMessage(error) {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function createOrderTableHtml(items) {
  const rows = items.map((item, index) => {
    const background = index % 2 === 0 ? '#ffffff' : '#f3f6fa';
    return `
      <tr style="background-color:${background};">
        <td style="padding:10px 12px;border:1px solid #d5dee8;">${escapeHtml(item.name)}</td>
        <td style="padding:10px 12px;border:1px solid #d5dee8;">${escapeHtml(item.categoryTitle)}</td>
        <td style="padding:10px 12px;border:1px solid #d5dee8;">${escapeHtml(item.subcategoryName)}</td>
        <td style="padding:10px 12px;border:1px solid #d5dee8;text-align:right;white-space:nowrap;">${item.quantity.toLocaleString()}</td>
      </tr>`;
  }).join('');

  return `
    <table role="table" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#18324f;">
      <thead>
        <tr style="background-color:#103057;color:#ffffff;">
          <th scope="col" style="padding:10px 12px;border:1px solid #103057;text-align:left;">Product</th>
          <th scope="col" style="padding:10px 12px;border:1px solid #103057;text-align:left;">Category</th>
          <th scope="col" style="padding:10px 12px;border:1px solid #103057;text-align:left;">Subcategory</th>
          <th scope="col" style="padding:10px 12px;border:1px solid #103057;text-align:right;">Quantity</th>
        </tr>
      </thead>
      <tbody>${rows}
      </tbody>
    </table>`;
}

export default function CartDialog({
  items,
  storageNotice,
  onClose,
  onQuantityChange,
  onRemove,
  onClear
}) {
  const dialog = useRef(null);
  const [emailState, setEmailState] = useState({ status: 'idle', message: '' });
  const isSending = emailState.status === 'sending';
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const previous = document.activeElement;
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
      previous?.focus({ preventScroll: true });
    };
  }, []);

  function handleBackdropClick(event) {
    if (event.target !== dialog.current) return;
    const bounds = dialog.current.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      onClose();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (items.length === 0) return;
    const formData = new FormData(event.currentTarget);
    const contact = {
      name: String(formData.get('name') || '').trim(),
      organization: String(formData.get('organization') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim()
    };
    const orderList = items.map((item, index) => [
      `${index + 1}. ${item.name}`,
      `   Category: ${item.categoryTitle}`,
      `   Subcategory: ${item.subcategoryName}`,
      `   Quantity: ${item.quantity.toLocaleString()}`
    ].join('\n')).join('\n\n');
    const message = [
      'CART ORDER REQUEST — ABIRA ENTERPRISES',
      '',
      `Organization: ${contact.organization}`,
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      `Phone: ${contact.phone}`,
      '',
      `Requested products (${items.length}):`,
      '',
      orderList
    ].join('\n');
    const orderTableHtml = createOrderTableHtml(items);

    if (!settings.email || !emailSettings.serviceId || !emailSettings.templateId || !emailSettings.publicKey) {
      setEmailState({
        status: 'error',
        message: 'Email delivery is not configured. Please contact Abira Enterprises using the details shown on this page.'
      });
      return;
    }

    setEmailState({ status: 'sending', message: 'Sending your order request…' });
    try {
      await emailjs.send(
        emailSettings.serviceId,
        emailSettings.templateId,
        {
          to_email: settings.email,
          name: contact.name,
          business: contact.organization,
          organization: contact.organization,
          email: contact.email,
          reply_to: contact.email,
          phone: contact.phone,
          collection: 'Cart order',
          quantity: itemCount.toLocaleString(),
          order_table: orderList,
          order_table_html: orderTableHtml,
          details: 'Order request submitted from the shopping cart.',
          message
        },
        { publicKey: emailSettings.publicKey }
      );
      setEmailState({ status: 'success', message: 'Your order request was sent to Abira Enterprises.' });
    } catch (error) {
      console.error('EmailJS cart order delivery failed:', error);
      setEmailState({
        status: 'error',
        message: `Your order request could not be emailed: ${getErrorMessage(error)} Please try again or contact Abira Enterprises directly.`
      });
    }
  }

  return (
    <dialog
      ref={dialog}
      className="cart-dialog"
      aria-labelledby="cart-dialog-title"
      onCancel={onClose}
      onClick={handleBackdropClick}
    >
      <div className="cart-dialog-header">
        <div>
          <p className="eyebrow">YOUR ORDER LIST</p>
          <h2 id="cart-dialog-title">Shopping Cart</h2>
        </div>
        <button className="close-dialog" aria-label="Close cart" onClick={onClose}>
          ×
        </button>
      </div>

      <p className="cart-intro">
        Review your products and quantities, then send your order request directly to Abira Enterprises. Pricing will be confirmed by our team.
      </p>

      {storageNotice && <p className="cart-notice" role="status">{storageNotice}</p>}

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <span>Explore the catalogue and add products with your required quantities.</span>
        </div>
      ) : (
        <>
          <div className="cart-items" aria-label={`${itemCount} items in cart`}>
            {items.map(item => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>{item.categoryTitle} · {item.subcategoryName}</p>
                </div>
                <div className="cart-item-actions">
                  <button
                    type="button"
                    aria-label={`Decrease ${item.name} quantity`}
                    disabled={item.quantity <= 10 || isSending}
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${item.name} quantity`}
                    disabled={isSending}
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="cart-remove"
                    disabled={isSending}
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="cart-summary">
            <span>{items.length} product{items.length === 1 ? '' : 's'}</span>
            <strong>{itemCount} total item{itemCount === 1 ? '' : 's'}</strong>
          </div>

          <form className="cart-request-form" onSubmit={handleSubmit}>
            <h3>Contact details</h3>
            <div className="cart-contact-fields">
              <label>
                Organization name
                <input name="organization" autoComplete="organization" required maxLength={100} />
              </label>
              <label>
                Your name
                <input name="name" autoComplete="name" required maxLength={100} />
              </label>
              <label>
                Email address
                <input name="email" type="email" autoComplete="email" required maxLength={150} />
              </label>
              <label>
                Phone
                <input name="phone" type="tel" autoComplete="tel" required maxLength={30} />
              </label>
            </div>
            <div className="cart-request-actions">
              <button
                type="submit"
                className="button dark"
                disabled={isSending}
              >
                {isSending ? 'Sending Order Request…' : 'Send Order Request'}
              </button>
            </div>
            {emailState.message && (
              <p className={`cart-email-status ${emailState.status}`} role="status">
                {emailState.message}
              </p>
            )}
          </form>

          <button
            type="button"
            className="cart-clear"
            disabled={isSending}
            onClick={onClear}
          >
            Clear Cart
          </button>
        </>
      )}
    </dialog>
  );
}

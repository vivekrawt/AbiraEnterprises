import { useRef, useState } from 'react';
import { categories } from '../../../shared/collections.js';

const settings = window.ABIRA_SETTINGS || {};

function makeBrief(data) {
  return `CORPORATE ENQUIRY BRIEF — ABIRA ENTERPRISES\n\nName: ${data.name}\nBusiness / Organization: ${data.business || 'Not specified'}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not specified'}\nCategory / Product of Interest: ${data.collection}\nEstimated Quantity: ${data.quantity ? data.quantity.toLocaleString() : 'To discuss'}\n\nProject Requirements & Specifications:\n${data.details || 'To discuss'}\n`;
}

export default function EnquiryForm({
  collection,
  details = '',
  onCollectionChange,
  onDetailsChange
}) {
  const [state, setState] = useState('idle');
  const [brief, setBrief] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const formRef = useRef(null);

  const whatsapp = (settings.whatsappNumber || '').replace(/\D/g, '');

  function submit(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const payload = {
      name: fields.name.trim(),
      business: fields.business.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      collection: fields.collection,
      quantity: fields.quantity ? Number(fields.quantity) : null,
      details: fields.details.trim()
    };
    setBrief(makeBrief(payload));
    setCopyMessage('');
    setState('sent');
  }

  function download() {
    const url = URL.createObjectURL(
      new Blob([brief], { type: 'text/plain;charset=utf-8' })
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abira-enterprises-enquiry.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="enquiry section" id="enquiry" aria-label="Project Enquiry and Quotation Form">
      <div className="enquiry-intro">
        <p className="eyebrow">START A PROJECT WITH US</p>
        <h2>
          Your Next Project.<br />
          <em>Expertly Delivered.</em>
        </h2>
        <p>
          Tell us about your packaging, printing, corporate gifting, or office essentials needs. We will prepare custom specifications and pricing for your team.
        </p>

        <div className="contact-details">
          {settings.phone && (
            <a href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}>{settings.phone}</a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          )}
          {whatsapp && (
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp ↗
            </a>
          )}
          {settings.city && <p>{settings.city}</p>}
        </div>
        <div className="enquiry-art" aria-hidden="true">✳</div>
      </div>

      <form id="enquiry-form" ref={formRef} onSubmit={submit}>
        <div className="form-heading">
          <h3>Your Requirements Brief</h3>
          <span>Packaging, Printing &amp; Gifting</span>
        </div>

        <fieldset>
          <div className="form-row">
            <label>
              Your name
              <input
                name="name"
                autoComplete="name"
                required
                placeholder="e.g. Priya Sharma"
                maxLength={100}
              />
            </label>
            <label>
              Business name
              <input
                name="business"
                autoComplete="organization"
                placeholder="Your company or brand"
                maxLength={100}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
                maxLength={150}
              />
            </label>
            <label>
              Phone <span className="optional">(optional)</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Your contact number"
                maxLength={30}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Primary category of interest
              <select
                name="collection"
                required
                value={collection}
                onChange={e => onCollectionChange(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
                <option value="A combination of products">A combination of multiple categories</option>
              </select>
            </label>
            <label>
              Estimated quantity
              <input
                name="quantity"
                type="number"
                min={1}
                max={100000000}
                step={1}
                placeholder="e.g. 500 or 1000"
              />
            </label>
          </div>

          <label>
            Project specifications &amp; requirements
            <textarea
              name="details"
              rows={4}
              maxLength={3000}
              value={details}
              onChange={e => onDetailsChange && onDetailsChange(e.target.value)}
              placeholder="Dimensions, ply rating, colours, logo branding, finishes, design reference, or required delivery date…"
            />
          </label>

          <button className="button dark submit-enquiry" type="submit">
            Generate My Custom Brief <span>↗</span>
          </button>
        </fieldset>

        <p className="form-note">
          Fill in your details to create an instant enquiry brief. No information is transmitted to third parties without your review.
        </p>

        {state === 'sent' && (
          <div className="brief-result" role="region" aria-label="Generated brief summary">
            <h4>Your enquiry brief is ready.</h4>
            <p>You can copy or download this summary to share directly with Abira Enterprises.</p>
            <pre>{brief}</pre>
            <div className="result-actions">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(brief);
                    setCopyMessage('Brief copied to clipboard.');
                  } catch {
                    setCopyMessage('Could not copy automatically. Please click Download instead.');
                  }
                }}
              >
                Copy Brief
              </button>
              <button type="button" onClick={download}>
                Download .txt
              </button>
              {whatsapp && (
                <a
                  className="button small"
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(brief)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Send via WhatsApp ↗
                </a>
              )}
            </div>
            {copyMessage && <p role="status" className="copy-status">{copyMessage}</p>}
          </div>
        )}
      </form>
    </section>
  );
}

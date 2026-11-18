import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const settings = window.ABIRA_SETTINGS || {};
const emailSettings = settings.emailjs || {};

function makeBrief(data) {
  return `CORPORATE ENQUIRY BRIEF — ABIRA ENTERPRISES\n\nName: ${data.name}\nBusiness / Organization: ${data.business || 'Not specified'}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not specified'}\n\nProject Requirements & Specifications:\n${data.details || 'To discuss'}\n`;
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

export default function EnquiryForm({
  details = '',
  onDetailsChange
}) {
  const [state, setState] = useState('idle');
  const [brief, setBrief] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [sendError, setSendError] = useState('');
  const formRef = useRef(null);

  const whatsapp = (settings.whatsappNumber || '').replace(/\D/g, '');

  async function submit(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const payload = {
      name: fields.name.trim(),
      business: fields.business.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      details: fields.details.trim()
    };
    const enquiryBrief = makeBrief(payload);
    setBrief(enquiryBrief);
    setCopyMessage('');
    setSendError('');

    if (!settings.email || !emailSettings.serviceId || !emailSettings.templateId || !emailSettings.publicKey) {
      setState('error');
      setSendError('Email delivery is not configured. Please contact Abira Enterprises using the details shown on this page.');
      return;
    }

    setState('sending');
    try {
      await emailjs.send(
        emailSettings.serviceId,
        emailSettings.templateId,
        {
          to_email: settings.email,
          name: payload.name,
          business: payload.business || 'Not specified',
          email: payload.email,
          reply_to: payload.email,
          phone: payload.phone || 'Not specified',
          details: payload.details || 'To discuss',
          message: enquiryBrief
        },
        { publicKey: emailSettings.publicKey }
      );
      setState('sent');
    } catch (error) {
      console.error('EmailJS enquiry delivery failed:', error);
      setState('error');
      setSendError(`Your enquiry brief is ready, but it could not be emailed: ${getErrorMessage(error)}`);
    }
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

          <button className="button dark submit-enquiry" type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending Enquiry…' : 'Send Enquiry & Generate Brief'}
            {state !== 'sending' && <span>↗</span>}
          </button>
        </fieldset>

        <p className="form-note">
          Your enquiry will be emailed directly to Abira Enterprises. You can also copy or download the brief below.
        </p>

        {brief && (
          <div className="brief-result" role="region" aria-label="Generated brief summary">
            <h4>{state === 'sent' ? 'Your enquiry was sent.' : 'Your enquiry brief is ready.'}</h4>
            <p>
              {state === 'sent'
                ? 'Abira Enterprises received your enquiry. Keep a copy of the brief below for your records.'
                : 'You can copy or download this brief. It will be sent when email delivery succeeds.'}
            </p>
            {sendError && <p className="email-error" role="alert">{sendError}</p>}
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

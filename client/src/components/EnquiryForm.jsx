import { useRef, useState } from 'react';
import { collections } from '../../../shared/collections.js';
const settings = window.ABIRA_SETTINGS || {};
function makeBrief(data) {
  return `PACKAGING ENQUIRY — ABIRA ENTERPRISES\n\nName: ${data.name}\nBusiness: ${data.business || 'Not specified'}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not specified'}\nCollection: ${data.collection}\nEstimated quantity: ${data.quantity || 'To discuss'}\n\nProject details:\n${data.details || 'To discuss'}\n`;
}
export default function EnquiryForm({ collection, onCollectionChange }) {
  const [state,setState] = useState('idle'), [brief,setBrief] = useState(''), [copyMessage,setCopyMessage] = useState('');
  const whatsapp = (settings.whatsappNumber || '').replace(/\D/g,'');
  function submit(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const payload = { name: fields.name.trim(), business: fields.business.trim(), email: fields.email.trim(), phone: fields.phone.trim(), collection: fields.collection, quantity: fields.quantity ? Number(fields.quantity) : null, details: fields.details.trim() };
    setBrief(makeBrief(payload)); setCopyMessage(''); setState('sent');
  }
  function download() { const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'})); const a=document.createElement('a'); a.href=url;a.download='abira-packaging-enquiry.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
  return <section className="enquiry section" id="enquiry"><div className="enquiry-intro"><p className="eyebrow">LET'S START SOMETHING GOOD</p><h2>Your next big idea.<br /><em>Beautifully packaged.</em></h2><p>Tell us what you're imagining.<br />We'll start with the details.</p><div className="contact-details">{settings.phone && <a href={`tel:${settings.phone.replace(/[^+\d]/g,'')}`}>{settings.phone}</a>}{settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}{whatsapp && <a href={`https://wa.me/${whatsapp}`}>Chat on WhatsApp ↗</a>}{settings.city && <p>{settings.city}</p>}</div><div className="enquiry-art" aria-hidden="true">✳</div></div>
    <form id="enquiry-form" onSubmit={submit}><div className="form-heading"><h3>Your packaging brief</h3><span>Made for your next project</span></div><fieldset>
      <div className="form-row"><label>Your name<input name="name" autoComplete="name" required placeholder="e.g. Priya Sharma" maxLength={100} /></label><label>Business name<input name="business" autoComplete="organization" placeholder="Your brand or company" maxLength={100} /></label></div>
      <div className="form-row"><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@company.com" maxLength={150} /></label><label>Phone <span className="optional">(optional)</span><input name="phone" type="tel" autoComplete="tel" placeholder="Your contact number" maxLength={30} /></label></div>
      <div className="form-row"><label>I'm interested in<select name="collection" required value={collection} onChange={e=>onCollectionChange(e.target.value)}><option value="">Select a collection</option>{collections.map(c=><option key={c.id}>{c.title}</option>)}<option>A little of everything</option></select></label><label>Estimated quantity<input name="quantity" type="number" min={1} max={100000000} step={1} placeholder="e.g. 500" /></label></div>
      <label>A little about your project<textarea name="details" rows={3} maxLength={3000} placeholder="Dimensions, colours, occasion, preferred date, or an image reference…" /></label>
      <button className="button dark submit-enquiry" type="submit">Generate my brief<span>↗</span></button>
    </fieldset><p className="form-note">Fill in your details to generate a packaging brief you can download or share via WhatsApp.</p>
    {state==='sent' && <div className="brief-result"><h4>Your packaging brief is ready.</h4><p>Download it or share it directly via WhatsApp to start the conversation.</p><pre>{brief}</pre><div className="result-actions"><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(brief);setCopyMessage('Brief copied.');}catch{setCopyMessage('Please use Download instead.');}}}>Copy brief</button><button type="button" onClick={download}>Download .txt</button>{whatsapp && <a className="button small" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(brief)}`} target="_blank" rel="noopener noreferrer">Continue to WhatsApp ↗</a>}</div><p role="status">{copyMessage}</p></div>}
    </form></section>;
}

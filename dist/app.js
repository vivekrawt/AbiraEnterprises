const collections = [
  { id: 'corrugated', title: 'Corrugated Boxes', folder: 'Corrugated Boxes', group: 'pack', image: 67, subtitle: 'Strong foundations. Beautiful first impressions.', description: 'Explore standard mailer boxes, printed and coloured boxes, and industrial packaging. Share your dimensions, quantity and intended use to discuss the right specification.' },
  { id: 'gift', title: 'Gifting Boxes', folder: 'Gifting Boxes', group: 'gift', image: 95, subtitle: 'For the joy of giving. And opening.', description: 'Discover ideas for festive gifting, corporate gifts and special occasions. Use these styles as a starting point for your own gifting project.' },
  { id: 'cards', title: 'Custom Cards & Envelopes', folder: 'Custom Cards Envelopes', group: 'brand', image: 85, subtitle: 'A personal touch, beautifully put on paper.', description: 'From business cards to greeting cards and envelopes, explore ways to make your message feel personal. Include print, colour and size requirements in your enquiry.' },
  { id: 'confetti', title: 'Confetti', folder: 'Confetti', group: 'gift', image: 1, subtitle: 'Little pieces. A whole lot of happiness.', description: 'Colourful paper confetti and celebration inspiration. Tell us your occasion, colour palette and preferred shapes to explore suitable options.' },
  { id: 'wraps', title: 'Safety Wraps', folder: 'Safety Wraps', group: 'pack', image: 106, subtitle: 'A little extra care in every layer.', description: 'Explore bubble wrap, foam sheets, kraft paper and protective wrapping. Let us know what you are packing so materials and specifications can be discussed.' },
  { id: 'stationery', title: 'Corporate Stationery', folder: 'Corporate Stationery', group: 'brand', image: 16, subtitle: 'Everyday essentials, with your identity.', description: 'Notebooks, pens, letterheads and coordinated stationery. Find inspiration for everyday business use, welcome kits and corporate gifting.' }
];
const settings = window.ABIRA_SETTINGS || {};
const grid = document.querySelector('#collection-grid');
const dialog = document.querySelector('#collection-dialog');
let activeCollection, catalogue, brief = '', previousFocus;
const picture = id => `assets/product-${id}.jpg`;
function renderCollections(filter = 'all') {
  grid.replaceChildren();
  collections.filter(c => filter === 'all' || c.group === filter).forEach(c => {
    const button = document.createElement('button');
    button.className = 'collection-card';
    button.setAttribute('aria-label', `Explore ${c.title}`);
    button.innerHTML = `<div class="card-image"><img src="${picture(c.image)}" alt="${c.title} style inspiration" loading="lazy"><span class="card-index">0${collections.indexOf(c) + 1} / COLLECTION</span></div><div class="card-info"><h3>${c.title}</h3><span class="card-arrow" aria-hidden="true">↗</span></div><p>${c.subtitle}</p>`;
    button.addEventListener('click', () => openCollection(c.id));
    grid.append(button);
  });
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  renderCollections(button.dataset.filter);
}));
document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openCollection(b.dataset.open)));
async function openCollection(id) {
  activeCollection = collections.find(c => c.id === id);
  previousFocus = document.activeElement;
  document.querySelector('#dialog-title').textContent = activeCollection.title;
  document.querySelector('#dialog-description').textContent = activeCollection.description;
  const filters = document.querySelector('#gallery-filters');
  filters.replaceChildren();
  document.querySelector('#gallery').textContent = 'Loading collection…';
  dialog.showModal(); document.body.classList.add('modal-open'); dialog.scrollTop = 0;
  try {
    if (!catalogue) { const response = await fetch('catalogue.json'); if (!response.ok) throw new Error('Could not load catalogue'); catalogue = await response.json(); }
    if (!dialog.open) return;
    if (activeCollection.id === 'corrugated') {
      const types = ['All styles', 'Standard Boxes', 'Printed Boxes', 'Coloured Boxes', 'Industrial Packaging'];
      types.forEach((type, index) => {
        const b = document.createElement('button'); b.textContent = type; b.classList.toggle('active', index === 0); b.setAttribute('aria-pressed', String(index === 0));
        b.addEventListener('click', () => { filters.querySelectorAll('button').forEach(x => {x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b));}); renderGallery(type); });
        filters.append(b);
      });
    }
    renderGallery();
  } catch { document.querySelector('#gallery').innerHTML = '<p class="error-message">The collection could not load. Please close this window and try again.</p>'; }
}
function renderGallery(type = 'All styles') {
  const gallery = document.querySelector('#gallery'); gallery.replaceChildren();
  catalogue.filter(p => p.category === activeCollection.folder && (type === 'All styles' || p.source.includes(type))).forEach(p => {
    const figure = document.createElement('figure'), img = document.createElement('img'), caption = document.createElement('figcaption');
    img.src = p.src; img.alt = `${activeCollection.title} reference ${String(p.id + 1).padStart(3, '0')}`; img.loading = 'lazy';
    const ref = `AB-${String(p.id + 1).padStart(3, '0')}`;
    caption.textContent = `Style inspiration · ${ref}`;
    figure.append(img, caption); gallery.append(figure);
  });
}
function closeDialog() { dialog.close(); }
document.querySelector('.close-dialog').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); previousFocus?.focus(); });
document.querySelector('#enquire-collection').addEventListener('click', () => {
  document.querySelector('#enquiry-collection').value = activeCollection.title;
  closeDialog(); document.querySelector('#enquiry').scrollIntoView({ behavior: 'smooth' });
  document.querySelector('input[name="name"]').focus({ preventScroll: true });
});
const menuToggle = document.querySelector('.menu-toggle'), nav = document.querySelector('#nav');
menuToggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); menuToggle.textContent = open ? '×' : '☰'; });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); menuToggle.textContent = '☰'; }));
const whatsapp = (settings.whatsappNumber || '').replace(/\D/g, '');
const contact = document.querySelector('#contact-details');
function contactLink(label, href) { const a = document.createElement('a'); a.textContent = label; a.href = href; contact.append(a); }
if (settings.phone) contactLink(settings.phone, `tel:${settings.phone.replace(/[^+\d]/g, '')}`);
if (settings.email) contactLink(settings.email, `mailto:${settings.email}`);
if (whatsapp) { contactLink('Chat on WhatsApp ↗', `https://wa.me/${whatsapp}`); }
if (settings.city) { const city = document.createElement('p'); city.textContent = settings.city; contact.append(city); }
if (whatsapp || settings.email) document.querySelector('#form-note').textContent = 'Prepare your brief, then send it using your own WhatsApp or email. Nothing is sent automatically.';
document.querySelector('#enquiry-form').addEventListener('submit', event => {
  event.preventDefault(); const data = new FormData(event.currentTarget);
  brief = `PACKAGING ENQUIRY — ABIRA ENTERPRISES\n\nName: ${data.get('name').trim()}\nBusiness: ${data.get('business').trim() || 'Not specified'}\nEmail: ${data.get('email').trim()}\nPhone: ${data.get('phone').trim() || 'Not specified'}\nCollection: ${data.get('collection')}\nEstimated quantity: ${data.get('quantity') || 'To discuss'}\n\nProject details:\n${data.get('details').trim() || 'To discuss'}\n`;
  document.querySelector('#brief-preview').textContent = brief;
  document.querySelector('#brief-result').hidden = false;
  document.querySelector('#brief-status').textContent = 'Your brief is ready to copy or download. It has not been sent.';
  const send = document.querySelector('#send-brief');
  if (whatsapp) { send.hidden = false; send.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(brief)}`; send.textContent = 'Continue to WhatsApp ↗'; send.target = '_blank'; send.rel = 'noopener noreferrer'; }
  else if (settings.email) { send.hidden = false; send.href = `mailto:${settings.email}?subject=${encodeURIComponent('Packaging enquiry — ' + data.get('collection'))}&body=${encodeURIComponent(brief)}`; send.textContent = 'Open email draft ↗'; }
  document.querySelector('#brief-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
document.querySelector('#copy-brief').addEventListener('click', async () => { try { await navigator.clipboard.writeText(brief); document.querySelector('#brief-status').textContent = 'Brief copied. You can paste it into a message.'; } catch { document.querySelector('#brief-status').textContent = 'Copy is unavailable in this browser. Please download your brief instead.'; } });
document.querySelector('#download-brief').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = 'abira-packaging-enquiry.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); document.querySelector('#brief-status').textContent = 'Your download has been prepared. The enquiry has not been sent.'; });
document.querySelector('#year').textContent = new Date().getFullYear();
renderCollections();

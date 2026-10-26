import { useEffect, useRef, useState } from 'react';
import catalogue from '../data/catalogue.json';
const types = ['All styles','Standard Boxes','Printed Boxes','Coloured Boxes','Industrial Packaging'];
export default function CollectionDialog({ collection, onClose, onEnquire }) {
  const dialog = useRef(null);
  const [type,setType] = useState('All styles');
  const products = catalogue.filter(p => p.category === collection.folder);
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current.showModal(); document.body.classList.add('modal-open');
    return () => { document.body.classList.remove('modal-open'); previous?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} id="collection-dialog" aria-labelledby="dialog-title" onCancel={onClose} onClick={e => { if(e.target === dialog.current) { const r=dialog.current.getBoundingClientRect(); if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) onClose(); } }}>
    <div className="dialog-header"><div><p className="eyebrow">EXPLORE THE COLLECTION</p><h2 id="dialog-title">{collection.title}</h2></div><button className="close-dialog" aria-label="Close collection" onClick={onClose}>×</button></div><p id="dialog-description">{collection.description}</p>
    {collection.id === 'corrugated' && <div className="gallery-filters" role="group" aria-label="Filter box styles">{types.map(t => <button key={t} className={type===t?'active':''} aria-pressed={type===t} onClick={() => setType(t)}>{t}</button>)}</div>}
    <div className="gallery" id="gallery">{products.filter(p => type==='All styles' || p.source.includes(type)).map(p => <figure key={p.id}><img src={`/${p.src}`} alt={`${collection.title} reference ${String(p.id+1).padStart(3,'0')}`} loading="lazy" /><figcaption>Style inspiration · AB-{String(p.id+1).padStart(3,'0')}</figcaption></figure>)}</div>
    <div className="dialog-footer"><p>Images are style references. Specifications and availability are confirmed on enquiry.</p><button className="button coral" onClick={() => onEnquire(collection.title)}>Enquire about this collection ↗</button></div>
  </dialog>;
}

import { useState } from 'react';
import { collections } from '../../../shared/collections.js';
const filters = [['all','All collections'],['pack','Pack & protect'],['gift','Gift & celebrate'],['brand','Brand & connect']];
export default function Collections({ onOpen }) {
  const [filter,setFilter] = useState('all');
  return <section className="collections section" id="collections"><div className="section-top"><div><p className="eyebrow">THE ABIRA COLLECTIONS</p><h2>Everything you need.<br /><em>All wrapped up.</em></h2></div><p>From getting it there safely to making it feel special.<br />Find the right fit for what you have in mind.</p></div>
    <div className="filters" role="group" aria-label="Filter collections">{filters.map(([id,label]) => <button key={id} className={filter === id ? 'active' : ''} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}{id === 'all' && <span>06</span>}</button>)}</div>
    <div className="collection-grid" id="collection-grid">{collections.filter(c => filter === 'all' || c.group === filter).map(c => <button key={c.id} className="collection-card" aria-label={`Explore ${c.title}`} onClick={() => onOpen(c.id)}><div className="card-image"><img src={`/assets/product-${c.image}.jpg`} alt={`${c.title} style inspiration`} loading="lazy" /><span className="card-index">0{collections.indexOf(c)+1} / COLLECTION</span></div><div className="card-info"><h3>{c.title}</h3><span className="card-arrow" aria-hidden="true">↗</span></div><p>{c.subtitle}</p></button>)}</div><p className="collection-note">A glimpse of the possibilities. Explore each collection for more styles and inspiration.</p>
  </section>;
}

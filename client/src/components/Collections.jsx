const products = [
  {title:'Confetti',image:1,id:'confetti'}, {title:'Corporate Stationery',image:16,id:'stationery'},
  {title:'Corrugated Boxes',image:49,id:'corrugated'}, {title:'Coloured Boxes',image:29,id:'corrugated',type:'Coloured Boxes'},
  {title:'Industrial Packaging',image:34,id:'corrugated',type:'Industrial Packaging'}, {title:'Mailer Box',image:67,id:'corrugated',type:'Standard Boxes'},
  {title:'Printed Boxes',image:69,id:'corrugated',type:'Printed Boxes'}, {title:'Custom Cards & Envelopes',image:81,id:'cards'},
  {title:'Gifting Boxes',image:89,id:'gift'}, {title:'Safety Wraps',image:103,id:'wraps'}
];
export default function Collections({ onOpen, search='' }) {
  const shown=products.filter(p=>p.title.toLowerCase().includes(search.toLowerCase().trim()));
  return <section className="reference-products" id="collections"><p className="eyebrow">OUR PRODUCTS</p><h2>Explore Our Range</h2><div className="reference-grid" aria-live="polite">
    {shown.map((p,i)=><button key={p.title} className={`reference-product ${i<4?'first-row':''}`} onClick={()=>onOpen({id:p.id,type:p.type})} aria-label={`Explore ${p.title}`}><div className="reference-product-image"><img src={`/assets/product-${p.image}.jpg`} alt={`${p.title} sample`} loading="lazy" /></div><div className="reference-product-label"><span>{p.title}</span><span aria-hidden="true">→</span></div></button>)}
  </div>{shown.length===0 && <p className="no-products">No matching products. Try “boxes”, “cards” or “wraps”.</p>}</section>;
}

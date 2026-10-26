import { useState } from 'react';
import { collections } from '../../shared/collections.js';
import Header from './components/Header.jsx';
import Collections from './components/Collections.jsx';
import CollectionDialog from './components/CollectionDialog.jsx';
import EnquiryForm from './components/EnquiryForm.jsx';
import { Hero, Approach, Process, Inspiration, FAQ, Footer } from './components/Presentation.jsx';
export default function App() {
  const [active,setActive]=useState(null), [collection,setCollection]=useState('');
  function enquire(title) { setCollection(title); setActive(null); requestAnimationFrame(()=>{ document.querySelector('#enquiry').scrollIntoView({behavior:'smooth'}); document.querySelector('input[name="name"]').focus({preventScroll:true}); }); }
  return <><Header /><main id="main"><Hero /><div className="values-strip"><span>Considered details</span><span aria-hidden="true">✳</span><span>Everyday essentials</span><span aria-hidden="true">✳</span><span>Memorable unboxing</span><span aria-hidden="true">✳</span><span>Your brand, your way</span></div><Collections onOpen={setActive} /><Approach /><Process /><Inspiration onOpen={setActive} /><FAQ /><EnquiryForm collection={collection} onCollectionChange={setCollection} /></main><Footer />{active && <CollectionDialog key={active} collection={collections.find(c=>c.id===active)} onClose={()=>setActive(null)} onEnquire={enquire} />}</>;
}

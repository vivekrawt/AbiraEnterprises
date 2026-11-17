import { useState } from 'react';
import { collections } from '../../shared/collections.js';
import Header from './components/Header.jsx';
import Collections from './components/Collections.jsx';
import CollectionDialog from './components/CollectionDialog.jsx';
import EnquiryForm from './components/EnquiryForm.jsx';
import { Approach, Process, Inspiration, FAQ, Footer } from './components/Presentation.jsx';
import { ReferenceHero, Benefits } from './components/ReferenceHero.jsx';
export default function App() {
  const [active,setActive]=useState(null), [collection,setCollection]=useState(''), [search,setSearch]=useState('');
  function enquire(title) { setCollection(title); setActive(null); requestAnimationFrame(()=>{ document.querySelector('#enquiry').scrollIntoView({behavior:'smooth'}); document.querySelector('input[name="name"]').focus({preventScroll:true}); }); }
  const open=item=>setActive(typeof item==='string'?{id:item}:item);
  return <><Header search={search} onSearch={setSearch} /><main id="main"><ReferenceHero /><Benefits /><Collections onOpen={open} search={search} /><Approach /><Process /><Inspiration onOpen={open} /><FAQ /><EnquiryForm collection={collection} onCollectionChange={setCollection} /></main><Footer />{active && <CollectionDialog key={active.id+'-'+(active.type||'all')} collection={collections.find(c=>c.id===active.id)} initialType={active.type} onClose={()=>setActive(null)} onEnquire={enquire} />}</>;
}

export default function PlaceholderThumb({
  type = 'tape',
  subType = '',
  label = 'Sample'
}) {
  if (type === 'tape') {
    // Determine visual colors based on tape subtype
    const isLogo = subType === 'logo' || label.toLowerCase().includes('logo');
    const isBrown = subType === 'brown' || label.toLowerCase().includes('brown');
    const isKraft = subType === 'kraft' || label.toLowerCase().includes('kraft');
    const isTransparent = subType === 'transparent' || label.toLowerCase().includes('transparent');

    const rollFill = isBrown || isKraft ? '#bf8c5c' : isTransparent ? '#e8edf3' : '#d8b28b';
    const stripFill = isBrown ? '#9b6c40' : isKraft ? '#af7e4f' : isTransparent ? '#c9d8ea' : '#c99f74';
    const badgeText = isLogo ? 'LOGO PRINTED TAPE' : isKraft ? 'PAPER KRAFT TAPE' : isTransparent ? 'TRANSPARENT TAPE' : 'PACKAGING TAPE';

    return (
      <div className="placeholder-thumb placeholder-tape" aria-label={`Illustration for ${label}`}>
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="placeholder-svg">
          <rect width="200" height="160" fill="#f6f4ee" rx="6" />
          {/* Main Tape Roll */}
          <circle cx="100" cy="74" r="48" fill={rollFill} stroke="#103057" strokeWidth="2.5" />
          <circle cx="100" cy="74" r="30" fill="#ffffff" stroke="#103057" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="100" cy="74" r="16" fill="#ded7ca" stroke="#103057" strokeWidth="2" />
          {/* Pull strip */}
          <path d="M136 56 L168 116 L144 116 L120 71" fill={stripFill} opacity="0.92" stroke="#103057" strokeWidth="1.5" />
          {isLogo && (
            <text x="148" y="90" fill="#ffffff" fontSize="6" fontWeight="bold" transform="rotate(62 148 90)">
              ★ ABIRA ★
            </text>
          )}
          {/* Badge */}
          <rect x="30" y="130" width="140" height="20" rx="4" fill="#103057" />
          <text x="100" y="143" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="700" letterSpacing="0.8">
            {badgeText}
          </text>
        </svg>
        <span className="placeholder-badge">Sample on Enquiry</span>
      </div>
    );
  }

  // Labels & Stickers
  const isBarcode = subType === 'barcode' || label.toLowerCase().includes('barcode');
  const isQR = subType === 'qr' || label.toLowerCase().includes('qr');
  const isShipping = subType === 'shipping' || label.toLowerCase().includes('shipping');
  const badgeLabel = isQR ? 'QR CODE LABEL' : isBarcode ? 'BARCODE LABEL' : isShipping ? 'SHIPPING LABEL' : 'THERMAL LABEL';

  return (
    <div className="placeholder-thumb placeholder-label" aria-label={`Illustration for ${label}`}>
      <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="placeholder-svg">
        <rect width="200" height="160" fill="#f4f6fa" rx="6" />
        {/* Label background sheet */}
        <rect x="42" y="20" width="116" height="102" rx="5" fill="#ffffff" stroke="#103057" strokeWidth="2" />
        
        {isQR ? (
          // QR Code layout
          <g>
            <rect x="75" y="32" width="50" height="50" rx="3" fill="#eef3f9" stroke="#103057" strokeWidth="1.8" />
            <rect x="81" y="38" width="12" height="12" fill="#103057" />
            <rect x="107" y="38" width="12" height="12" fill="#103057" />
            <rect x="81" y="64" width="12" height="12" fill="#103057" />
            <rect x="101" y="58" width="8" height="8" fill="#103057" />
            <rect x="111" y="68" width="8" height="8" fill="#103057" />
            <line x1="56" y1="94" x2="144" y2="94" stroke="#103057" strokeWidth="2" strokeLinecap="round" />
            <line x1="68" y1="104" x2="132" y2="104" stroke="#8d9ba8" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        ) : (
          // Barcode & Shipping layout
          <g>
            <rect x="54" y="32" width="4" height="30" fill="#103057" />
            <rect x="62" y="32" width="2" height="30" fill="#103057" />
            <rect x="68" y="32" width="6" height="30" fill="#103057" />
            <rect x="78" y="32" width="3" height="30" fill="#103057" />
            <rect x="85" y="32" width="2" height="30" fill="#103057" />
            <rect x="91" y="32" width="5" height="30" fill="#103057" />
            <rect x="100" y="32" width="2" height="30" fill="#103057" />
            <rect x="106" y="32" width="4" height="30" fill="#103057" />
            
            <rect x="118" y="32" width="26" height="30" rx="2" fill="#eef3f9" stroke="#103057" strokeWidth="1.2" />
            <path d="M125 40 L137 40 M125 47 L137 47 M125 54 L133 54" stroke="#103057" strokeWidth="1.5" strokeLinecap="round" />

            <line x1="54" y1="74" x2="146" y2="74" stroke="#103057" strokeWidth="2" strokeLinecap="round" />
            <line x1="54" y1="84" x2="120" y2="84" stroke="#8d9ba8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="54" y1="94" x2="138" y2="94" stroke="#8d9ba8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="54" y1="104" x2="108" y2="104" stroke="#8d9ba8" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}

        {/* Badge */}
        <rect x="30" y="130" width="140" height="20" rx="4" fill="#103057" />
        <text x="100" y="143" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="700" letterSpacing="0.8">
          {badgeLabel}
        </text>
      </svg>
      <span className="placeholder-badge">Sample on Enquiry</span>
    </div>
  );
}

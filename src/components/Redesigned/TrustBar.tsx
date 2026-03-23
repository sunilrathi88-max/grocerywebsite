import React from 'react';

export default function TrustBar() {
  const badges = [
    { icon: '❄️', text: 'Cold-ground <10°C' },
    { icon: '✅', text: 'FSSAI 12225025000253' },
    { icon: '🌿', text: 'No fillers ever' },
    { icon: '🔒', text: 'SSL secure checkout' },
    { icon: '📦', text: 'Free ship ₹1000+' },
    { icon: '↩️', text: 'Easy returns' },
  ];

  return (
    <div className="bg-white border-b border-border overflow-x-auto whitespace-nowrap py-2">
      <div className="inline-flex gap-0">
        {badges.map((b, i) => (
          <div
            key={i}
            className={`inline-flex items-center gap-1.5 px-4.5 text-[12px] text-muted whitespace-nowrap ${
              i < badges.length - 1 ? 'border-r border-border' : ''
            }`}
          >
            <span className="text-[14px]">{b.icon}</span>
            {b.text}
          </div>
        ))}
      </div>
    </div>
  );
}

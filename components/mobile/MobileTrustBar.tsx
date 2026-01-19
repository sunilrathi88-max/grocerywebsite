import React from 'react';

interface TrustItem {
  icon: string;
  title: string;
  subtitle: string;
}

const defaultItems: TrustItem[] = [
  {
    icon: 'verified_user',
    title: 'FSSAI Certified',
    subtitle: '100% Compliant',
  },
  {
    icon: 'eco',
    title: 'Organic Origin',
    subtitle: 'Pesticide Free',
  },
  {
    icon: 'factory',
    title: 'ISO 9001:2015',
    subtitle: 'Quality Assured',
  },
  {
    icon: 'location_on',
    title: 'Single Source',
    subtitle: 'Farm Traceable',
  },
];

interface MobileTrustBarProps {
  items?: TrustItem[];
}

const MobileTrustBar: React.FC<MobileTrustBarProps> = ({ items = defaultItems }) => {
  return (
    <section className="bg-stone-900 text-stone-100 py-6 px-4">
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="size-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg text-white">{item.icon}</span>
            </div>
            <div>
              <p className="font-serif text-sm text-white">{item.title}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MobileTrustBar;

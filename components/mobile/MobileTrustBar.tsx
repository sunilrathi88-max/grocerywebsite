import React from 'react';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { BeakerIcon } from '../icons/BeakerIcon';
import { UsersIcon } from '../icons/UsersIcon';

interface TrustItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const defaultItems: TrustItem[] = [
  {
    icon: <ShieldCheckIcon className="w-5 h-5" />,
    title: 'Quality',
    subtitle: 'Uncompromised',
  },
  {
    icon: <BeakerIcon className="w-5 h-5" />,
    title: 'Pure',
    subtitle: 'Lab Tested',
  },
  {
    icon: <UsersIcon className="w-5 h-5" />,
    title: 'Direct',
    subtitle: 'Farmer First',
  },
];

interface MobileTrustBarProps {
  items?: TrustItem[];
}

const MobileTrustBar: React.FC<MobileTrustBarProps> = ({ items = defaultItems }) => {
  return (
    <section className="px-4 py-2">
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex items-center gap-2 bg-amber-50 dark:bg-stone-800/50 px-3 py-2 rounded-full border border-amber-100 dark:border-stone-700 whitespace-nowrap"
          >
            <div className="text-amber-600 dark:text-amber-500">
              {item.icon}
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] uppercase font-bold text-stone-900 dark:text-stone-100 mb-0.5">
                {item.title}
              </span>
              <span className="text-[9px] text-stone-500 dark:text-stone-400">
                {item.subtitle}
              </span>
            </div>
          </div>
        ))}
        {/* Spacer for right padding in scroll */}
        <div className="w-1 flex-shrink-0" />
      </div>
    </section>
  );
};

export default MobileTrustBar;

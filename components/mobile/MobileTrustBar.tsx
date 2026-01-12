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
      <div className="flex justify-between items-start text-center bg-white dark:bg-stone-800 p-4 rounded-xl shadow-sm border border-amber-50 dark:border-stone-700">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-1 w-1/3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full text-amber-600 mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                {item.title}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                {item.subtitle}
              </span>
            </div>
            {index < items.length - 1 && (
              <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 self-center" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default MobileTrustBar;

import React, { useState } from 'react';
import clsx from 'clsx';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ProductTabsProps {
  tabs: Tab[];
  defaultTabId?: string;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ tabs, defaultTabId }) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs?.[0]?.id);

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="border-b-2 border-[#E5E7EB] flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-6 py-4 font-semibold text-base border-b-4 transition-all whitespace-nowrap',
              activeTab === tab.id
                ? 'text-[#1F2121] border-b-[#D4A017]'
                : 'text-[#6F7577] border-b-transparent hover:text-[#D4A017]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-8 animate-fadeIn">{tabs.find((tab) => tab.id === activeTab)?.content}</div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductTabs;

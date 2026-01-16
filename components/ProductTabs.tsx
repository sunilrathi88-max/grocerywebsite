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
      {/* Tab Headers - Enhanced */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-1.5 mb-6">
        <div className="flex overflow-x-auto gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'px-5 py-3 font-semibold text-sm rounded-lg transition-all whitespace-nowrap flex-1 min-w-fit',
                activeTab === tab.id
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content - Enhanced */}
      <div
        key={activeTab}
        className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 animate-fadeIn"
      >
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

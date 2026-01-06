import React, { useState } from 'react';
import clsx from 'clsx';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    const newOpenItems = new Set(openItems);

    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      if (!allowMultiple) {
        newOpenItems.clear();
      }
      newOpenItems.add(id);
    }

    setOpenItems(newOpenItems);
  };

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const isOpen = openItems.has(item.id);

        return (
          <div key={item.id} className="border-b border-[#E5E7EB]">
            <button
              onClick={() => handleToggle(item.id)}
              className="w-full flex justify-between items-center py-4 px-0 hover:text-[#D4A017] transition-colors"
            >
              <span className="font-semibold text-[#1F2121] text-left">{item.title}</span>
              <span
                className={clsx(
                  'text-2xl text-[#D4A017] transition-transform duration-300',
                  isOpen && 'rotate-45'
                )}
              >
                +
              </span>
            </button>

            {isOpen && (
              <div className="pb-4 px-0 text-[#6F7577] text-sm leading-relaxed animate-slideDown">
                {item.content}
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Accordion;

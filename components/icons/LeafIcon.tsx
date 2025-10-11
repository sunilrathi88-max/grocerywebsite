
import React from 'react';

export const LeafIcon: React.FC<{className?: string}> = ({ className = "h-8 w-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66c.47-1.32.96-2.67 1.49-4 .48-1.22 1.05-2.52 1.68-3.87 1.15-2.48 2.5-4.63 4.51-5.91.4-.25.9-.4 1.42-.4h.01c.61 0 1.18.22 1.63.6l.08.06c.45.32 1.35 1.05 2.43 2.13.82.82 1.49 1.66 2.06 2.52.56.83 1 1.68 1.33 2.53l1.88-.68C20.48 13.31 19.31 10.15 17 8z" />
    </svg>
);
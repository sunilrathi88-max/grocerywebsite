
import React from 'react';

export const CurrencyDollarIcon: React.FC<{className?: string}> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4a2 2 0 00-2-2h-4a2 2 0 00-2 2v1h4a2 2 0 002-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18V9M12 18a9 9 0 110-18 9 9 0 010 18z" />
    </svg>
);
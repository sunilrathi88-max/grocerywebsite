import React from 'react';

export const ChefHatIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.032l-2.162-4.324a1.125 1.125 0 00-1.022-.672H9.375a1.125 1.125 0 00-1.022.672L6.187 15.99M21.75 17.25h-4.875a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h4.875c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 21v-5.25a1.5 1.5 0 00-3 0V21" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21v-5.25a1.5 1.5 0 00-3 0V21" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.375 15.997v2.02c0 .621.504 1.125 1.125 1.125h1.125c.621 0 1.125-.504 1.125-1.125v-2.02M3.375 15.997l1.875-3.75a1.125 1.125 0 011.022-.672h6.75c.42 0 .813.233 1.022.672l1.875 3.75M3.375 15.997h14.25"
    />
  </svg>
);

import React from 'react';

export const GlobeIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.053.053a.5.5 0 010 .707l-.053.053L6.053 7.01a.5.5 0 01-.707 0l-.053-.053a.5.5 0 010-.707l.053-.053L6.95 4.5a.5.5 0 01.707 0zM16.5 4.5l.053.053a.5.5 0 010 .707l-.053.053L14.853 7.01a.5.5 0 01-.707 0l-.053-.053a.5.5 0 010-.707l.053-.053L15.793 4.5a.5.5 0 01.707 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 21a9 9 0 100-18 9 9 0 000 18z"
    />
  </svg>
);

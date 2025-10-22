import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  // Check if user has a saved preference, otherwise use system preference
  const [darkMode, setDarkMode] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return false;

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return [darkMode, setDarkMode] as const;
};

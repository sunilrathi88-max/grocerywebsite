import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect if the current viewport is mobile-sized.
 * Uses media query listener for responsive reactivity.
 * @param breakpoint - Width in pixels to consider as mobile. Default 768 (md breakpoint)
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  // Initialize with current media query match
  const getMatches = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
  }, [breakpoint]);

  const [isMobile, setIsMobile] = useState<boolean>(getMatches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    // Handler called on media query change - uses callback syntax
    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;

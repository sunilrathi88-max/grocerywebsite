import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current viewport is mobile-sized.
 * Uses media query listener for responsive reactivity.
 * @param breakpoint - Width in pixels to consider as mobile. Default 768 (md breakpoint)
 */
export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState(() => {
        // Check window on initial render (SSR-safe)
        if (typeof window === 'undefined') return false;
        return window.innerWidth < breakpoint;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

        const handleChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        // Set initial value
        setIsMobile(mediaQuery.matches);

        // Listen for changes
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [breakpoint]);

    return isMobile;
}

export default useIsMobile;
